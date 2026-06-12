import { Injectable, NotFoundException } from '@nestjs/common';
import {
  ContentStatus,
  type Course,
  type Lesson,
  type Progress,
} from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProgressDto } from './dto/create-progress.dto';
import { UpdateProgressDto } from './dto/update-progress.dto';

type ProgressWithRelations = Progress & {
  course: Course;
  lesson: Lesson | null;
};

@Injectable()
export class ProgressService {
  private readonly progressInclude = {
    course: true,
    lesson: true,
  };

  constructor(private readonly prisma: PrismaService) {}

  async completeLesson(
    userId: string,
    lessonId: string,
    score?: number,
  ): Promise<ProgressWithRelations> {
    await this.ensureUserExists(userId);

    const lesson = await this.prisma.lesson.findFirst({
      where: {
        id: lessonId,
        status: ContentStatus.PUBLISHED,
        course: {
          status: ContentStatus.PUBLISHED,
        },
      },
      select: {
        id: true,
        courseId: true,
      },
    });

    if (!lesson) {
      throw new NotFoundException(`Lesson with id "${lessonId}" not found`);
    }

    const existingProgress = await this.prisma.progress.findFirst({
      where: {
        userId,
        courseId: lesson.courseId,
        lessonId: lesson.id,
      },
      select: {
        id: true,
      },
    });

    if (existingProgress) {
      return this.prisma.progress.update({
        where: {
          id: existingProgress.id,
        },
        data: {
          completed: true,
          score,
        },
        include: this.progressInclude,
      });
    }

    return this.prisma.progress.create({
      data: {
        userId,
        courseId: lesson.courseId,
        lessonId: lesson.id,
        completed: true,
        score,
      },
      include: this.progressInclude,
    });
  }

  async findByUser(userId: string): Promise<ProgressWithRelations[]> {
    await this.ensureUserExists(userId);

    return this.prisma.progress.findMany({
      where: {
        userId,
      },
      include: this.progressInclude,
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string): Promise<ProgressWithRelations> {
    const progress = await this.prisma.progress.findUnique({
      where: {
        id,
      },
      include: this.progressInclude,
    });

    if (!progress) {
      throw new NotFoundException(`Progress with id "${id}" not found`);
    }

    return progress;
  }

  async create(
    userId: string,
    createProgressDto: CreateProgressDto,
  ): Promise<ProgressWithRelations> {
    await this.ensureUserExists(userId);
    await this.ensureCourseExists(createProgressDto.courseId);

    if (createProgressDto.lessonId) {
      await this.ensureLessonBelongsToCourse(
        createProgressDto.lessonId,
        createProgressDto.courseId,
      );
    }

    return this.prisma.progress.create({
      data: {
        userId,
        courseId: createProgressDto.courseId,
        lessonId: createProgressDto.lessonId,
        completed: createProgressDto.completed,
        score: createProgressDto.score,
      },
      include: this.progressInclude,
    });
  }

  async update(
    id: string,
    updateProgressDto: UpdateProgressDto,
  ): Promise<ProgressWithRelations> {
    const currentProgress = await this.findOne(id);
    const courseId = updateProgressDto.courseId ?? currentProgress.courseId;

    if (updateProgressDto.courseId) {
      await this.ensureCourseExists(updateProgressDto.courseId);
    }

    if (updateProgressDto.lessonId) {
      await this.ensureLessonBelongsToCourse(
        updateProgressDto.lessonId,
        courseId,
      );
    }

    return this.prisma.progress.update({
      where: {
        id,
      },
      data: {
        courseId: updateProgressDto.courseId,
        lessonId: updateProgressDto.lessonId,
        completed: updateProgressDto.completed,
        score: updateProgressDto.score,
      },
      include: this.progressInclude,
    });
  }

  async remove(id: string): Promise<ProgressWithRelations> {
    await this.findOne(id);

    return this.prisma.progress.delete({
      where: {
        id,
      },
      include: this.progressInclude,
    });
  }

  private async ensureUserExists(userId: string): Promise<void> {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
      },
    });

    if (!user) {
      throw new NotFoundException(`User with id "${userId}" not found`);
    }
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

  private async ensureLessonBelongsToCourse(
    lessonId: string,
    courseId: string,
  ): Promise<void> {
    const lesson = await this.prisma.lesson.findUnique({
      where: {
        id: lessonId,
      },
      select: {
        courseId: true,
      },
    });

    if (!lesson) {
      throw new NotFoundException(`Lesson with id "${lessonId}" not found`);
    }

    if (lesson.courseId !== courseId) {
      throw new NotFoundException(
        `Lesson with id "${lessonId}" was not found in course "${courseId}"`,
      );
    }
  }
}
