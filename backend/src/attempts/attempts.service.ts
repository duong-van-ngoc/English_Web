import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import {
  ContentStatus,
  type Attempt,
  type AttemptAnswer,
  type Question,
} from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { AttemptAnswerDto } from './dto/attempt-answer.dto';
import { CreateAttemptDto } from './dto/create-attempt.dto';
import { StartToeicAttemptDto } from './dto/start-toeic-attempt.dto';
import { SubmitToeicAttemptDto } from './dto/submit-toeic-attempt.dto';

type AttemptWithAnswers = Attempt & {
  answers: Array<
    AttemptAnswer & {
      question: Question;
    }
  >;
};

@Injectable()
export class AttemptsService {
  private readonly logger = new Logger(AttemptsService.name);
  private readonly attemptInclude = {
    answers: {
      include: {
        question: true,
      },
      orderBy: {
        createdAt: 'asc' as const,
      },
    },
  };

  constructor(private readonly prisma: PrismaService) {}

  async startToeicAttempt(userId: string, dto: StartToeicAttemptDto) {
    await this.ensureUserExists(userId);

    const questionSet = await this.prisma.toeicQuestionSet.findUnique({
      where: {
        id: dto.questionSetId,
      },
      select: {
        id: true,
        version: true,
        groups: {
          select: {
            questions: {
              select: {
                id: true,
              },
            },
          },
        },
      },
    });

    if (!questionSet) {
      throw new NotFoundException(
        `TOEIC question set "${dto.questionSetId}" not found`,
      );
    }

    const totalQuestions = questionSet.groups.reduce(
      (total, group) => total + group.questions.length,
      0,
    );

    if (totalQuestions === 0) {
      throw new BadRequestException('TOEIC question set has no questions');
    }

    return this.prisma.toeicAttempt.create({
      data: {
        userId,
        questionSetId: questionSet.id,
        questionSetVersion: questionSet.version,
        totalQuestions,
      },
      select: {
        id: true,
        questionSetId: true,
        status: true,
        totalQuestions: true,
        startedAt: true,
      },
    });
  }

  async submitToeicAttempt(
    userId: string,
    attemptId: string,
    dto: SubmitToeicAttemptDto,
  ) {
    this.ensureUniqueToeicQuestions(dto.answers);

    return this.prisma.$transaction(async (tx) => {
      const attempt = await tx.toeicAttempt.findUnique({
        where: {
          id: attemptId,
        },
        include: {
          questionSet: {
            include: {
              groups: {
                include: {
                  questions: {
                    include: {
                      choices: true,
                    },
                  },
                },
              },
            },
          },
        },
      });

      if (!attempt) {
        this.logger.warn(`TOEIC attempt not found: attemptId=${attemptId}`);
        throw new NotFoundException(`TOEIC attempt "${attemptId}" not found`);
      }

      if (attempt.userId !== userId) {
        this.logger.warn(
          `TOEIC attempt submit forbidden: attemptId=${attemptId}, actorUserId=${userId}, ownerUserId=${attempt.userId}`,
        );
        throw new ForbiddenException('You cannot submit this TOEIC attempt');
      }

      if (attempt.status !== 'IN_PROGRESS') {
        this.logger.warn(
          `TOEIC attempt already finished: attemptId=${attemptId}, status=${attempt.status}`,
        );
        throw new BadRequestException(
          'TOEIC attempt has already been finished',
        );
      }

      const questionMap = new Map(
        attempt.questionSet.groups
          .flatMap((group) => group.questions)
          .map((question) => [question.id, question]),
      );
      const submittedAnswerMap = new Map(
        dto.answers.map((answer) => [
          answer.questionId,
          answer.selectedChoiceId,
        ]),
      );

      for (const answer of dto.answers) {
        const question = questionMap.get(answer.questionId);

        if (!question) {
          this.logger.warn(
            `TOEIC submit includes unrelated question: attemptId=${attemptId}, questionId=${answer.questionId}`,
          );
          throw new BadRequestException(
            `Question "${answer.questionId}" does not belong to this attempt`,
          );
        }

        if (
          answer.selectedChoiceId &&
          !question.choices.some(
            (choice) => choice.id === answer.selectedChoiceId,
          )
        ) {
          this.logger.warn(
            `TOEIC submit includes invalid choice: attemptId=${attemptId}, questionId=${answer.questionId}, selectedChoiceId=${answer.selectedChoiceId}`,
          );
          throw new BadRequestException(
            `Choice "${answer.selectedChoiceId}" does not belong to question "${answer.questionId}"`,
          );
        }
      }

      const attemptAnswers = Array.from(questionMap.values()).map(
        (question) => {
          const selectedChoiceId = submittedAnswerMap.get(question.id) ?? null;
          const selectedChoice = selectedChoiceId
            ? question.choices.find((choice) => choice.id === selectedChoiceId)
            : undefined;

          return {
            questionId: question.id,
            selectedChoiceId,
            isCorrect: selectedChoice?.isCorrect ?? false,
          };
        },
      );
      const correctAnswers = attemptAnswers.filter(
        (answer) => answer.isCorrect,
      ).length;
      const totalQuestions = attemptAnswers.length;
      const wrongAnswers = totalQuestions - correctAnswers;
      const score =
        totalQuestions > 0
          ? Math.round((correctAnswers / totalQuestions) * 100)
          : 0;
      const expired =
        typeof attempt.questionSet.duration === 'number' &&
        Date.now() >
          attempt.startedAt.getTime() + attempt.questionSet.duration * 1000;

      await tx.toeicAttemptAnswer.createMany({
        data: attemptAnswers.map((answer) => ({
          attemptId: attempt.id,
          ...answer,
        })),
      });

      for (const answer of attemptAnswers.filter((item) => !item.isCorrect)) {
        await tx.toeicUserWrongQuestion.upsert({
          where: {
            userId_questionId: {
              userId,
              questionId: answer.questionId,
            },
          },
          update: {
            lastAttemptId: attempt.id,
            wrongCount: {
              increment: 1,
            },
            lastWrongAt: new Date(),
            resolvedAt: null,
          },
          create: {
            userId,
            questionId: answer.questionId,
            lastAttemptId: attempt.id,
          },
        });
      }

      return tx.toeicAttempt.update({
        where: {
          id: attempt.id,
        },
        data: {
          status: expired ? 'EXPIRED' : 'SUBMITTED',
          totalQuestions,
          correctAnswers,
          wrongAnswers,
          score,
          submittedAt: new Date(),
        },
        select: {
          id: true,
          status: true,
          totalQuestions: true,
          correctAnswers: true,
          wrongAnswers: true,
          score: true,
          submittedAt: true,
        },
      });
    });
  }

  async getToeicResult(userId: string, attemptId: string) {
    const attempt = await this.prisma.toeicAttempt.findUnique({
      where: {
        id: attemptId,
      },
      include: {
        answers: true,
        questionSet: {
          include: {
            groups: {
              include: {
                questions: {
                  include: {
                    choices: {
                      orderBy: {
                        label: 'asc',
                      },
                    },
                  },
                  orderBy: {
                    order: 'asc',
                  },
                },
              },
              orderBy: {
                order: 'asc',
              },
            },
          },
        },
      },
    });

    if (!attempt) {
      throw new NotFoundException(`TOEIC attempt "${attemptId}" not found`);
    }

    if (attempt.userId !== userId) {
      throw new ForbiddenException('You cannot view this TOEIC attempt');
    }

    const answersByQuestionId = new Map(
      attempt.answers.map((answer) => [answer.questionId, answer]),
    );

    return {
      attemptId: attempt.id,
      questionSetTitle: attempt.questionSet.title,
      part: attempt.questionSet.part,
      status: attempt.status,
      score: attempt.score,
      totalQuestions: attempt.totalQuestions,
      correctAnswers: attempt.correctAnswers,
      wrongAnswers: attempt.wrongAnswers,
      submittedAt: attempt.submittedAt,
      groups: attempt.questionSet.groups.map((group) => ({
        id: group.id,
        title: group.title,
        audioUrl: group.audioUrl,
        imageUrl: group.imageUrl,
        passageContent: group.passageContent,
        transcript: group.transcript,
        questions: group.questions.map((question) => {
          const answer = answersByQuestionId.get(question.id);

          return {
            id: question.id,
            content: question.content,
            explanation: question.explanation,
            choices: question.choices.map((choice) => ({
              id: choice.id,
              label: choice.label,
              content: choice.content,
              isCorrect: choice.isCorrect,
            })),
            userAnswer: {
              selectedChoiceId: answer?.selectedChoiceId ?? null,
              isCorrect: answer?.isCorrect ?? false,
            },
          };
        }),
      })),
    };
  }

  async getToeicHistory(userId: string) {
    return this.prisma.toeicAttempt.findMany({
      where: {
        userId,
        status: {
          in: ['SUBMITTED', 'EXPIRED'],
        },
      },
      select: {
        id: true,
        status: true,
        score: true,
        totalQuestions: true,
        correctAnswers: true,
        wrongAnswers: true,
        submittedAt: true,
        questionSet: {
          select: {
            title: true,
            part: true,
          },
        },
      },
      orderBy: {
        submittedAt: 'desc',
      },
    });
  }

  async findByUser(userId: string): Promise<AttemptWithAnswers[]> {
    await this.ensureUserExists(userId);

    return this.prisma.attempt.findMany({
      where: {
        userId,
      },
      include: this.attemptInclude,
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string): Promise<AttemptWithAnswers> {
    const attempt = await this.prisma.attempt.findUnique({
      where: {
        id,
      },
      include: this.attemptInclude,
    });

    if (!attempt) {
      throw new NotFoundException(`Attempt with id "${id}" not found`);
    }

    return attempt;
  }

  async create(
    userId: string,
    createAttemptDto: CreateAttemptDto,
  ): Promise<AttemptWithAnswers> {
    await this.ensureUserExists(userId);
    this.ensureUniqueQuestions(createAttemptDto.answers);

    const questionIds = createAttemptDto.answers.map(
      (answer) => answer.questionId,
    );
    const questions = await this.prisma.question.findMany({
      where: {
        id: {
          in: questionIds,
        },
        status: ContentStatus.PUBLISHED,
        lesson: {
          status: ContentStatus.PUBLISHED,
          course: {
            status: ContentStatus.PUBLISHED,
          },
        },
      },
      include: {
        answers: true,
      },
    });
    const questionsById = new Map(
      questions.map((question) => [question.id, question]),
    );
    const attemptAnswers = createAttemptDto.answers.map((answer) => {
      const question = questionsById.get(answer.questionId);

      if (!question) {
        throw new NotFoundException(
          `Question with id "${answer.questionId}" not found`,
        );
      }

      const selectedAnswer = answer.answerId
        ? question.answers.find((item) => item.id === answer.answerId)
        : undefined;

      if (answer.answerId && !selectedAnswer) {
        throw new BadRequestException(
          `Answer with id "${answer.answerId}" does not belong to question "${answer.questionId}"`,
        );
      }

      return {
        questionId: answer.questionId,
        answerId: answer.answerId,
        isCorrect: selectedAnswer?.isCorrect ?? false,
      };
    });
    const score = attemptAnswers.filter((answer) => answer.isCorrect).length;

    return this.prisma.attempt.create({
      data: {
        userId,
        score,
        total: attemptAnswers.length,
        answers: {
          create: attemptAnswers,
        },
      },
      include: this.attemptInclude,
    });
  }

  async remove(id: string): Promise<AttemptWithAnswers> {
    await this.findOne(id);

    return this.prisma.attempt.delete({
      where: {
        id,
      },
      include: this.attemptInclude,
    });
  }

  private ensureUniqueQuestions(answers: AttemptAnswerDto[]): void {
    const questionIds = answers.map((answer) => answer.questionId);
    const uniqueQuestionIds = new Set(questionIds);

    if (uniqueQuestionIds.size !== questionIds.length) {
      this.logger.warn(
        'Classic attempt rejected because of duplicated question ids',
      );
      throw new BadRequestException('Each question can only be answered once');
    }
  }

  private ensureUniqueToeicQuestions(
    answers: SubmitToeicAttemptDto['answers'],
  ): void {
    const questionIds = answers.map((answer) => answer.questionId);
    const uniqueQuestionIds = new Set(questionIds);

    if (uniqueQuestionIds.size !== questionIds.length) {
      this.logger.warn(
        'TOEIC attempt rejected because of duplicated question ids',
      );
      throw new BadRequestException(
        'Each TOEIC question can only be answered once',
      );
    }
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
}
