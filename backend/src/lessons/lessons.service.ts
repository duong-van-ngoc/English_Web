import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ContentStatus, type Lesson } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';

@Injectable()
export class LessonsService {
  private readonly adminLessonInclude = {
    vocabulary: {
      orderBy: {
        createdAt: 'asc' as const,
      },
    },
    questions: {
      include: {
        answers: {
          orderBy: {
            createdAt: 'asc' as const,
          },
        },
      },
      orderBy: {
        order: 'asc' as const,
      },
    },
  };
  private readonly publicLessonInclude = {
    vocabulary: {
      orderBy: {
        createdAt: 'asc' as const,
      },
    },
    questions: {
      where: {
        status: ContentStatus.PUBLISHED,
      },
      include: {
        answers: {
          orderBy: {
            createdAt: 'asc' as const,
          },
        },
      },
      orderBy: {
        order: 'asc' as const,
      },
    },
  };

  constructor(private readonly prisma: PrismaService) {}

  async findByCourse(courseId: string): Promise<Lesson[]> {
    await this.ensurePublishedCourseExists(courseId);

    return this.prisma.lesson.findMany({
      where: {
        courseId,
        status: ContentStatus.PUBLISHED,
      },
      orderBy: {
        order: 'asc',
      },
    });
  }

  async findOne(id: string): Promise<Lesson> {
    const lesson = await this.prisma.lesson.findFirst({
      where: {
        id,
        status: ContentStatus.PUBLISHED,
        course: {
          status: ContentStatus.PUBLISHED,
        },
      },
      include: this.publicLessonInclude,
    });

    if (!lesson) {
      throw new NotFoundException(`Lesson with id "${id}" not found`);
    }

    return lesson;
  }

  async create(
    courseId: string,
    createLessonDto: CreateLessonDto,
  ): Promise<Lesson> {
    await this.ensureCourseExists(courseId);

    try {
      return await this.prisma.lesson.create({
        data: {
          courseId,
          title: createLessonDto.title,
          content: createLessonDto.content,
          order: createLessonDto.order,
        },
        include: this.adminLessonInclude,
      });
    } catch (error) {
      this.handleLessonWriteError(error);
    }
  }

  async update(id: string, updateLessonDto: UpdateLessonDto): Promise<Lesson> {
    try {
      return await this.prisma.lesson.update({
        where: {
          id,
        },
        data: {
          title: updateLessonDto.title,
          content: updateLessonDto.content,
          order: updateLessonDto.order,
        },
        include: this.adminLessonInclude,
      });
    } catch (error) {
      this.handleLessonWriteError(error);
    }
  }

  async remove(id: string): Promise<Lesson> {
    try {
      return await this.prisma.lesson.delete({
        where: {
          id,
        },
        include: this.adminLessonInclude,
      });
    } catch (error) {
      this.handleLessonWriteError(error);
    }
  }

  async updateStatus(id: string, status: ContentStatus): Promise<Lesson> {
    const lesson = await this.prisma.lesson.findUnique({
      where: {
        id,
      },
      include: this.adminLessonInclude,
    });

    if (!lesson) {
      throw new NotFoundException('Lesson not found');
    }

    if (status === ContentStatus.PUBLISHED && !lesson.content.trim()) {
      throw new BadRequestException(
        'Lesson content is required before publishing',
      );
    }

    return this.prisma.lesson.update({
      where: {
        id,
      },
      data: {
        status,
        publishedAt: status === ContentStatus.PUBLISHED ? new Date() : null,
      },
      include: this.adminLessonInclude,
    });
  }

  private async ensureCourseExists(courseId: string): Promise<void> {
    const course = await this.prisma.course.findUnique({
      where: {
        id: courseId,
      },
      select: {
        id: true,
      },
    });

    if (!course) {
      throw new NotFoundException(`Course with id "${courseId}" not found`);
    }
  }

  private async ensurePublishedCourseExists(courseId: string): Promise<void> {
    const course = await this.prisma.course.findFirst({
      where: {
        id: courseId,
        status: ContentStatus.PUBLISHED,
      },
      select: {
        id: true,
      },
    });

    if (!course) {
      throw new NotFoundException(`Course with id "${courseId}" not found`);
    }
  }

  private handleLessonWriteError(error: unknown): never {
    if (this.isPrismaKnownRequestError(error)) {
      if (error.code === 'P2025') {
        throw new NotFoundException('Lesson not found');
      }

      if (error.code === 'P2002') {
        throw new ConflictException(
          'Lesson order already exists in this course',
        );
      }
    }

    throw error;
  }

  private isPrismaKnownRequestError(error: unknown): error is { code: string } {
    return (
      typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      typeof error.code === 'string'
    );
  }
}
