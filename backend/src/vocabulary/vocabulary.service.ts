import { Injectable, NotFoundException } from '@nestjs/common';
import { ContentStatus, type Vocabulary } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateVocabularyDto } from './dto/create-vocabulary.dto';
import { UpdateVocabularyDto } from './dto/update-vocabulary.dto';

@Injectable()
export class VocabularyService {
  constructor(private readonly prisma: PrismaService) {}

  async findByLesson(lessonId: string): Promise<Vocabulary[]> {
    await this.ensurePublishedLessonExists(lessonId);

    return this.prisma.vocabulary.findMany({
      where: {
        lessonId,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });
  }

  async create(
    lessonId: string,
    createVocabularyDto: CreateVocabularyDto,
  ): Promise<Vocabulary> {
    await this.ensureLessonExists(lessonId);

    return this.prisma.vocabulary.create({
      data: {
        lessonId,
        word: createVocabularyDto.word,
        meaning: createVocabularyDto.meaning,
        phonetic: createVocabularyDto.phonetic,
        example: createVocabularyDto.example,
        audioUrl: createVocabularyDto.audioUrl,
      },
    });
  }

  async update(
    id: string,
    updateVocabularyDto: UpdateVocabularyDto,
  ): Promise<Vocabulary> {
    try {
      return await this.prisma.vocabulary.update({
        where: {
          id,
        },
        data: {
          word: updateVocabularyDto.word,
          meaning: updateVocabularyDto.meaning,
          phonetic: updateVocabularyDto.phonetic,
          example: updateVocabularyDto.example,
          audioUrl: updateVocabularyDto.audioUrl,
        },
      });
    } catch (error) {
      this.handleVocabularyWriteError(error);
    }
  }

  async remove(id: string): Promise<Vocabulary> {
    try {
      return await this.prisma.vocabulary.delete({
        where: {
          id,
        },
      });
    } catch (error) {
      this.handleVocabularyWriteError(error);
    }
  }

  private async ensureLessonExists(lessonId: string): Promise<void> {
    const lesson = await this.prisma.lesson.findUnique({
      where: {
        id: lessonId,
      },
      select: {
        id: true,
      },
    });

    if (!lesson) {
      throw new NotFoundException(`Lesson with id "${lessonId}" not found`);
    }
  }

  private async ensurePublishedLessonExists(lessonId: string): Promise<void> {
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
      },
    });

    if (!lesson) {
      throw new NotFoundException(`Lesson with id "${lessonId}" not found`);
    }
  }

  private handleVocabularyWriteError(error: unknown): never {
    if (this.isPrismaKnownRequestError(error) && error.code === 'P2025') {
      throw new NotFoundException('Vocabulary not found');
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
