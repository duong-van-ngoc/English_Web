import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ContentStatus, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

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

  private parseStatus(status?: string): ContentStatus | undefined {
    if (!status) {
      return undefined;
    }

    if (status !== ContentStatus.DRAFT && status !== ContentStatus.PUBLISHED) {
      throw new BadRequestException('Invalid content status');
    }

    return status;
  }
}
