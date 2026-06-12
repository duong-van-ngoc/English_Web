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

  async findLessons(search?: string, status?: string, courseId?: string) {
    const parsedStatus = this.parseStatus(status);
    const where: Prisma.LessonWhereInput = {
      ...(parsedStatus ? { status: parsedStatus } : {}),
      ...(courseId ? { courseId } : {}),
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
