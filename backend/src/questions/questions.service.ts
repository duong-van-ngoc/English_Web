import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  ContentStatus,
  QuestionType,
  type Answer,
  type Question,
} from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateQuestionDto } from './dto/create-question.dto';
import { QuestionAnswerDto } from './dto/question-answer.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';

type QuestionWithAnswers = Question & {
  answers: Answer[];
};

@Injectable()
export class QuestionsService {
  private readonly questionInclude = {
    answers: {
      orderBy: {
        createdAt: 'asc' as const,
      },
    },
  };

  constructor(private readonly prisma: PrismaService) {}

  async findByLesson(lessonId: string): Promise<QuestionWithAnswers[]> {
    await this.ensurePublishedLessonExists(lessonId);

    return this.prisma.question.findMany({
      where: {
        lessonId,
        status: ContentStatus.PUBLISHED,
      },
      include: this.questionInclude,
      orderBy: {
        order: 'asc',
      },
    });
  }

  async findOne(id: string): Promise<QuestionWithAnswers> {
    const question = await this.prisma.question.findFirst({
      where: {
        id,
        status: ContentStatus.PUBLISHED,
        lesson: {
          status: ContentStatus.PUBLISHED,
          course: {
            status: ContentStatus.PUBLISHED,
          },
        },
      },
      include: this.questionInclude,
    });

    if (!question) {
      throw new NotFoundException(`Question with id "${id}" not found`);
    }

    return question;
  }

  async create(
    lessonId: string,
    createQuestionDto: CreateQuestionDto,
  ): Promise<QuestionWithAnswers> {
    await this.ensureLessonExists(lessonId);

    return this.prisma.question.create({
      data: {
        lessonId,
        title: createQuestionDto.title,
        type: createQuestionDto.type,
        explanation: createQuestionDto.explanation,
        order: createQuestionDto.order,
        ...(createQuestionDto.answers !== undefined
          ? {
              answers: {
                create: this.mapAnswerDtos(createQuestionDto.answers),
              },
            }
          : {}),
      },
      include: this.questionInclude,
    });
  }

  async update(
    id: string,
    updateQuestionDto: UpdateQuestionDto,
  ): Promise<QuestionWithAnswers> {
    try {
      return await this.prisma.question.update({
        where: {
          id,
        },
        data: {
          title: updateQuestionDto.title,
          type: updateQuestionDto.type,
          explanation: updateQuestionDto.explanation,
          order: updateQuestionDto.order,
          ...(updateQuestionDto.answers !== undefined
            ? {
                answers: {
                  deleteMany: {},
                  create: this.mapAnswerDtos(updateQuestionDto.answers),
                },
              }
            : {}),
        },
        include: this.questionInclude,
      });
    } catch (error) {
      this.handleQuestionWriteError(error);
    }
  }

  async remove(id: string): Promise<Question> {
    try {
      return await this.prisma.question.delete({
        where: {
          id,
        },
      });
    } catch (error) {
      this.handleQuestionWriteError(error);
    }
  }

  async updateStatus(
    id: string,
    status: ContentStatus,
  ): Promise<QuestionWithAnswers> {
    const question = await this.prisma.question.findUnique({
      where: {
        id,
      },
      include: this.questionInclude,
    });

    if (!question) {
      throw new NotFoundException('Question not found');
    }

    if (status === ContentStatus.PUBLISHED) {
      this.validateQuestionCanPublish(question);
    }

    return this.prisma.question.update({
      where: {
        id,
      },
      data: {
        status,
        publishedAt: status === ContentStatus.PUBLISHED ? new Date() : null,
      },
      include: this.questionInclude,
    });
  }

  private mapAnswerDtos(answers: QuestionAnswerDto[]) {
    return answers.map((answer) => ({
      content: answer.content,
      isCorrect: answer.isCorrect ?? false,
    }));
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

  private validateQuestionCanPublish(question: QuestionWithAnswers): void {
    const correctAnswerCount = question.answers.filter(
      (answer) => answer.isCorrect,
    ).length;

    if (question.answers.length < 2) {
      throw new BadRequestException(
        'Question must have at least 2 answers before publishing',
      );
    }

    if (correctAnswerCount < 1) {
      throw new BadRequestException(
        'Question must have at least one correct answer before publishing',
      );
    }

    if (
      question.type === QuestionType.SINGLE_CHOICE &&
      correctAnswerCount !== 1
    ) {
      throw new BadRequestException(
        'SINGLE_CHOICE question must have exactly one correct answer',
      );
    }
  }

  private handleQuestionWriteError(error: unknown): never {
    if (this.isPrismaKnownRequestError(error) && error.code === 'P2025') {
      throw new NotFoundException('Question not found');
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
