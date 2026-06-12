import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ContentStatus, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { QueryAdminToeicGroupsDto } from './dto/query-admin-toeic-groups.dto';
import { UpdateToeicQuestionGroupMediaDto } from './dto/update-toeic-question-group-media.dto';

type ContentType = 'COURSE' | 'LESSON' | 'VOCABULARY' | 'QUESTION';

type RecentContent = {
  id: string;
  title: string;
  type: ContentType;
  status?: ContentStatus;
  updatedAt: Date;
};

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  async getSummary() {
    const [
      totalCourses,
      totalLessons,
      totalVocabulary,
      totalQuestions,
      draftCourses,
      draftLessons,
      draftQuestions,
      publishedCourses,
      publishedLessons,
      publishedQuestions,
      recentCourses,
      recentLessons,
      recentVocabulary,
      recentQuestions,
    ] = await Promise.all([
      this.prisma.course.count(),
      this.prisma.lesson.count(),
      this.prisma.vocabulary.count(),
      this.prisma.question.count(),
      this.prisma.course.count({ where: { status: ContentStatus.DRAFT } }),
      this.prisma.lesson.count({ where: { status: ContentStatus.DRAFT } }),
      this.prisma.question.count({ where: { status: ContentStatus.DRAFT } }),
      this.prisma.course.count({ where: { status: ContentStatus.PUBLISHED } }),
      this.prisma.lesson.count({ where: { status: ContentStatus.PUBLISHED } }),
      this.prisma.question.count({
        where: { status: ContentStatus.PUBLISHED },
      }),
      this.prisma.course.findMany({
        orderBy: { updatedAt: 'desc' },
        take: 5,
      }),
      this.prisma.lesson.findMany({
        orderBy: { updatedAt: 'desc' },
        take: 5,
      }),
      this.prisma.vocabulary.findMany({
        orderBy: { updatedAt: 'desc' },
        take: 5,
      }),
      this.prisma.question.findMany({
        orderBy: { updatedAt: 'desc' },
        take: 5,
      }),
    ]);

    const recentUpdatedContent: RecentContent[] = [
      ...recentCourses.map((course) => ({
        id: course.id,
        title: course.title,
        type: 'COURSE' as const,
        status: course.status,
        updatedAt: course.updatedAt,
      })),
      ...recentLessons.map((lesson) => ({
        id: lesson.id,
        title: lesson.title,
        type: 'LESSON' as const,
        status: lesson.status,
        updatedAt: lesson.updatedAt,
      })),
      ...recentVocabulary.map((vocabulary) => ({
        id: vocabulary.id,
        title: vocabulary.word,
        type: 'VOCABULARY' as const,
        updatedAt: vocabulary.updatedAt,
      })),
      ...recentQuestions.map((question) => ({
        id: question.id,
        title: question.title,
        type: 'QUESTION' as const,
        status: question.status,
        updatedAt: question.updatedAt,
      })),
    ]
      .sort(
        (first, second) =>
          second.updatedAt.getTime() - first.updatedAt.getTime(),
      )
      .slice(0, 10);

    return {
      totalCourses,
      totalLessons,
      totalVocabulary,
      totalQuestions,
      draftCount: draftCourses + draftLessons + draftQuestions,
      publishedCount: publishedCourses + publishedLessons + publishedQuestions,
      recentUpdatedContent,
    };
  }

  async getVocabularyDashboard() {
    // 1. Stats
    const [totalTopics, totalWords, draftWords, needsAttentionCount] =
      await Promise.all([
        this.prisma.vocabularyTopic.count({ where: { deletedAt: null } }),
        this.prisma.vocabulary.count({ where: { deletedAt: null } }),
        this.prisma.vocabulary.count({
          where: { status: ContentStatus.DRAFT, deletedAt: null },
        }),
        this.prisma.vocabulary.count({
          where: {
            OR: [
              { meaning: '' },
              { partOfSpeech: null },
              { partOfSpeech: '' },
              { imageUrl: null },
              { imageUrl: '' },
              { audioUrl: null },
              { audioUrl: '' },
            ],
            deletedAt: null,
          },
        }),
      ]);

    // 2. Growth (Cumulative count by week for the last 4 weeks)
    const now = new Date();
    const msInDay = 24 * 60 * 60 * 1000;
    const dateW1 = new Date(now.getTime() - 28 * msInDay);
    const dateW2 = new Date(now.getTime() - 21 * msInDay);
    const dateW3 = new Date(now.getTime() - 14 * msInDay);
    const dateW4 = new Date(now.getTime() - 7 * msInDay);

    const [countW1, countW2, countW3, countW4] = await Promise.all([
      this.prisma.vocabulary.count({
        where: { createdAt: { lte: dateW1 }, deletedAt: null },
      }),
      this.prisma.vocabulary.count({
        where: { createdAt: { lte: dateW2 }, deletedAt: null },
      }),
      this.prisma.vocabulary.count({
        where: { createdAt: { lte: dateW3 }, deletedAt: null },
      }),
      this.prisma.vocabulary.count({
        where: { createdAt: { lte: dateW4 }, deletedAt: null },
      }),
    ]);

    const growth = [
      { date: 'Tuần 1', count: countW1 },
      { date: 'Tuần 2', count: countW2 },
      { date: 'Tuần 3', count: countW3 },
      { date: 'Tuần 4', count: countW4 },
      { date: 'Hiện tại', count: totalWords },
    ];

    // 3. Health Alerts (Content missing issues)
    const topics = await this.prisma.vocabularyTopic.findMany({
      where: { deletedAt: null },
      select: {
        id: true,
        name: true,
        vocabularies: {
          where: { deletedAt: null },
          select: {
            imageUrl: true,
            audioUrl: true,
            meaning: true,
          },
        },
      },
    });

    const healthAlerts: any[] = [];
    topics.forEach((topic) => {
      let missingImage = 0;
      let missingAudio = 0;
      let missingTranslation = 0;

      topic.vocabularies.forEach((v) => {
        if (!v.imageUrl || v.imageUrl.trim() === '') missingImage++;
        if (!v.audioUrl || v.audioUrl.trim() === '') missingAudio++;
        if (!v.meaning || v.meaning.trim() === '') missingTranslation++;
      });

      if (missingImage > 0) {
        healthAlerts.push({
          topicId: topic.id,
          topicName: topic.name,
          type: 'image',
          missingCount: missingImage,
        });
      }
      if (missingAudio > 0) {
        healthAlerts.push({
          topicId: topic.id,
          topicName: topic.name,
          type: 'audio',
          missingCount: missingAudio,
        });
      }
      if (missingTranslation > 0) {
        healthAlerts.push({
          topicId: topic.id,
          topicName: topic.name,
          type: 'translation',
          missingCount: missingTranslation,
        });
      }
    });

    healthAlerts.sort((a, b) => b.missingCount - a.missingCount);
    const topHealthAlerts = healthAlerts.slice(0, 10);

    // 4. Recent Topics (5 most recently updated topics)
    const recentTopicsRaw = await this.prisma.vocabularyTopic.findMany({
      where: { deletedAt: null },
      orderBy: { updatedAt: 'desc' },
      take: 5,
      include: {
        vocabularies: {
          where: { deletedAt: null },
          select: { id: true },
        },
      },
    });

    const formatRelativeTime = (date: Date): string => {
      const diffMs = now.getTime() - date.getTime();
      const diffMins = Math.floor(diffMs / (60 * 1000));
      const diffHours = Math.floor(diffMs / (60 * 60 * 1000));
      const diffDays = Math.floor(diffMs / (24 * 60 * 60 * 1000));

      if (diffMins < 1) return 'Vừa xong';
      if (diffMins < 60) return `${diffMins} phút trước`;
      if (diffHours < 24) return `${diffHours} giờ trước`;
      return `${diffDays} ngày trước`;
    };

    const recentTopics = recentTopicsRaw.map((t) => ({
      id: t.id,
      name: t.name,
      wordCount: t.vocabularies.length,
      status: t.status,
      updatedAt: formatRelativeTime(t.updatedAt),
    }));

    return {
      stats: {
        totalTopics,
        totalWords,
        draftWords,
        needsAttentionCount,
      },
      growth,
      healthAlerts: topHealthAlerts,
      recentTopics,
    };
  }

  async findCourses(search?: string, status?: string) {
    const parsedStatus = this.parseStatus(status);
    const where: Prisma.CourseWhereInput = {
      ...(parsedStatus ? { status: parsedStatus } : {}),
      ...(search
        ? {
            OR: [
              { title: { contains: search, mode: 'insensitive' } },
              { slug: { contains: search, mode: 'insensitive' } },
              { description: { contains: search, mode: 'insensitive' } },
            ],
          }
        : {}),
    };

    return this.prisma.course.findMany({
      where,
      include: {
        lessons: {
          orderBy: {
            order: 'asc',
          },
        },
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });
  }

  async findCourse(id: string) {
    const course = await this.prisma.course.findUnique({
      where: { id },
      include: {
        lessons: {
          orderBy: {
            order: 'asc',
          },
        },
      },
    });

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    return course;
  }

  async findLessons(
    search?: string,
    status?: string,
    courseId?: string,
    moduleId?: string,
  ) {
    const parsedStatus = this.parseStatus(status);
    const where: Prisma.LessonWhereInput = {
      ...(parsedStatus ? { status: parsedStatus } : {}),
      ...(courseId ? { courseId } : {}),
      ...(moduleId ? { moduleId } : {}),
      ...(search
        ? {
            OR: [
              { title: { contains: search, mode: 'insensitive' } },
              { content: { contains: search, mode: 'insensitive' } },
            ],
          }
        : {}),
    };

    return this.prisma.lesson.findMany({
      where,
      include: {
        course: true,
      },
      orderBy: [
        {
          courseId: 'asc',
        },
        {
          order: 'asc',
        },
      ],
    });
  }

  async findLesson(id: string) {
    const lesson = await this.prisma.lesson.findUnique({
      where: { id },
      include: {
        course: true,
        vocabulary: {
          orderBy: {
            createdAt: 'asc',
          },
        },
        questions: {
          include: {
            answers: {
              orderBy: {
                createdAt: 'asc',
              },
            },
          },
          orderBy: {
            order: 'asc',
          },
        },
      },
    });

    if (!lesson) {
      throw new NotFoundException('Lesson not found');
    }

    return lesson;
  }

  async findQuestions(search?: string, status?: string, lessonId?: string) {
    const parsedStatus = this.parseStatus(status);
    const where: Prisma.QuestionWhereInput = {
      ...(parsedStatus ? { status: parsedStatus } : {}),
      ...(lessonId ? { lessonId } : {}),
      ...(search
        ? {
            OR: [
              { title: { contains: search, mode: 'insensitive' } },
              { explanation: { contains: search, mode: 'insensitive' } },
            ],
          }
        : {}),
    };

    return this.prisma.question.findMany({
      where,
      include: {
        answers: {
          orderBy: {
            createdAt: 'asc',
          },
        },
        lesson: {
          include: {
            course: true,
          },
        },
      },
      orderBy: [
        {
          lessonId: 'asc',
        },
        {
          order: 'asc',
        },
      ],
    });
  }

  async findQuestion(id: string) {
    const question = await this.prisma.question.findUnique({
      where: { id },
      include: {
        answers: {
          orderBy: {
            createdAt: 'asc',
          },
        },
        lesson: {
          include: {
            course: true,
          },
        },
      },
    });

    if (!question) {
      throw new NotFoundException('Question not found');
    }

    return question;
  }

  async findVocabulary(search?: string, lessonId?: string) {
    const where: Prisma.VocabularyWhereInput = {
      ...(lessonId ? { lessonId } : {}),
      ...(search
        ? {
            OR: [
              { word: { contains: search, mode: 'insensitive' } },
              { meaning: { contains: search, mode: 'insensitive' } },
              { example: { contains: search, mode: 'insensitive' } },
            ],
          }
        : {}),
    };

    return this.prisma.vocabulary.findMany({
      where,
      include: {
        lesson: {
          include: {
            course: true,
          },
        },
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });
  }

  async findVocabularyItem(id: string) {
    const vocabulary = await this.prisma.vocabulary.findUnique({
      where: { id },
      include: {
        lesson: {
          include: {
            course: true,
          },
        },
      },
    });

    if (!vocabulary) {
      throw new NotFoundException('Vocabulary not found');
    }

    return vocabulary;
  }

  async findToeicQuestionSets(part?: number) {
    if (part !== undefined) {
      this.ensureValidToeicPart(part);
    }

    return this.prisma.toeicQuestionSet.findMany({
      where: {
        ...(part ? { part } : {}),
      },
      select: {
        id: true,
        title: true,
        description: true,
        part: true,
        type: true,
        duration: true,
        version: true,
        _count: {
          select: {
            groups: true,
          },
        },
      },
      orderBy: [{ part: 'asc' }, { createdAt: 'asc' }],
    });
  }

  async findToeicQuestionGroups(query: QueryAdminToeicGroupsDto) {
    if (query.part !== undefined) {
      this.ensureValidToeicPart(query.part);
    }

    return this.prisma.toeicQuestionGroup.findMany({
      where: {
        ...(query.questionSetId ? { questionSetId: query.questionSetId } : {}),
        ...(query.part ? { questionSet: { part: query.part } } : {}),
      },
      select: {
        id: true,
        questionSetId: true,
        title: true,
        audioUrl: true,
        imageUrl: true,
        passageContent: true,
        transcript: true,
        order: true,
        createdAt: true,
        updatedAt: true,
        questionSet: {
          select: {
            id: true,
            title: true,
            part: true,
            type: true,
          },
        },
        questions: {
          select: {
            id: true,
            content: true,
            order: true,
          },
          orderBy: {
            order: 'asc',
          },
        },
        _count: {
          select: {
            questions: true,
          },
        },
      },
      orderBy: [{ questionSetId: 'asc' }, { order: 'asc' }],
    });
  }

  async updateToeicQuestionGroupMedia(
    id: string,
    dto: UpdateToeicQuestionGroupMediaDto,
  ) {
    await this.ensureToeicQuestionGroupExists(id);

    return this.prisma.toeicQuestionGroup.update({
      where: {
        id,
      },
      data: {
        audioUrl: this.normalizeOptionalText(dto.audioUrl),
        imageUrl: this.normalizeOptionalText(dto.imageUrl),
        transcript: this.normalizeOptionalText(dto.transcript),
      },
      select: {
        id: true,
        questionSetId: true,
        title: true,
        audioUrl: true,
        imageUrl: true,
        passageContent: true,
        transcript: true,
        order: true,
        createdAt: true,
        updatedAt: true,
        questionSet: {
          select: {
            id: true,
            title: true,
            part: true,
            type: true,
          },
        },
        questions: {
          select: {
            id: true,
            content: true,
            order: true,
          },
          orderBy: {
            order: 'asc',
          },
        },
        _count: {
          select: {
            questions: true,
          },
        },
      },
    });
  }

  private parseStatus(status?: string): ContentStatus | undefined {
    if (!status) {
      return undefined;
    }

    if (status !== ContentStatus.DRAFT && status !== ContentStatus.PUBLISHED) {
      throw new BadRequestException('Invalid content status');
    }

    return status;
  }

  private normalizeOptionalText(
    value?: string | null,
  ): string | null | undefined {
    if (value === undefined) {
      return undefined;
    }

    if (value === null) {
      return null;
    }

    const normalized = value.trim();

    return normalized.length > 0 ? normalized : null;
  }

  private async ensureToeicQuestionGroupExists(id: string) {
    const group = await this.prisma.toeicQuestionGroup.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!group) {
      throw new NotFoundException('TOEIC question group not found');
    }
  }

  private ensureValidToeicPart(part: number): void {
    if (!Number.isInteger(part) || part < 1 || part > 7) {
      throw new BadRequestException('TOEIC part must be a number from 1 to 7');
    }
  }
}
