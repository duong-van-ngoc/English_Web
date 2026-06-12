import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ContentStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { MarkVocabularyReviewDto } from './dto/mark-vocabulary-review.dto';

@Injectable()
export class ReviewService {
  constructor(private readonly prisma: PrismaService) {}

  async getReviewQueue(userId: string, type = 'all') {
    if (!['all', 'vocabulary', 'toeic-wrong-question'].includes(type)) {
      throw new BadRequestException(
        'Review type must be all, vocabulary, or toeic-wrong-question',
      );
    }

    const [vocabulary, toeicWrongQuestions] = await Promise.all([
      type === 'all' || type === 'vocabulary'
        ? this.getDueVocabulary(userId)
        : Promise.resolve([]),
      type === 'all' || type === 'toeic-wrong-question'
        ? this.getToeicWrongQuestions(userId)
        : Promise.resolve([]),
    ]);

    return {
      vocabulary,
      toeicWrongQuestions,
    };
  }

  async markVocabularyReview(
    userId: string,
    vocabularyId: string,
    dto: MarkVocabularyReviewDto,
  ) {
    await this.ensureVocabularyIsReviewable(vocabularyId);

    const existingReview = await this.prisma.vocabularyReview.findUnique({
      where: {
        userId_vocabularyId: {
          userId,
          vocabularyId,
        },
      },
    });
    const now = new Date();
    const currentEaseLevel = existingReview?.easeLevel ?? 2;
    const currentReviewCount = existingReview?.reviewCount ?? 0;
    const easeLevel = this.getNextEaseLevel(currentEaseLevel, dto.result);
    const reviewCount = currentReviewCount + 1;
    const nextReviewAt = this.getNextReviewAt(now, dto.result);
    const status =
      reviewCount >= 5 && dto.result === 'EASY' ? 'MASTERED' : 'LEARNING';

    return this.prisma.vocabularyReview.upsert({
      where: {
        userId_vocabularyId: {
          userId,
          vocabularyId,
        },
      },
      update: {
        status,
        easeLevel,
        reviewCount,
        lastReviewedAt: now,
        nextReviewAt,
      },
      create: {
        userId,
        vocabularyId,
        status,
        easeLevel,
        reviewCount,
        lastReviewedAt: now,
        nextReviewAt,
      },
      select: {
        id: true,
        vocabularyId: true,
        status: true,
        easeLevel: true,
        reviewCount: true,
        lastReviewedAt: true,
        nextReviewAt: true,
      },
    });
  }

  async resolveToeicWrongQuestion(userId: string, questionId: string) {
    const wrongQuestion = await this.prisma.toeicUserWrongQuestion.findUnique({
      where: {
        userId_questionId: {
          userId,
          questionId,
        },
      },
      select: {
        id: true,
      },
    });

    if (!wrongQuestion) {
      throw new NotFoundException('TOEIC wrong question not found');
    }

    const resolvedAt = new Date();

    await this.prisma.toeicUserWrongQuestion.update({
      where: {
        id: wrongQuestion.id,
      },
      data: {
        resolvedAt,
      },
    });

    return {
      questionId,
      resolvedAt,
    };
  }

  private async getDueVocabulary(userId: string) {
    const reviews = await this.prisma.vocabularyReview.findMany({
      where: {
        userId,
        status: {
          in: ['DUE', 'LEARNING'],
        },
        nextReviewAt: {
          lte: new Date(),
        },
        vocabulary: {
          lesson: {
            status: ContentStatus.PUBLISHED,
            course: {
              status: ContentStatus.PUBLISHED,
            },
          },
        },
      },
      include: {
        vocabulary: {
          select: {
            id: true,
            word: true,
            meaning: true,
            example: true,
          },
        },
      },
      orderBy: {
        nextReviewAt: 'asc',
      },
      take: 20,
    });

    return reviews.map((review) => ({
      id: review.id,
      vocabularyId: review.vocabularyId,
      word: review.vocabulary.word,
      meaning: review.vocabulary.meaning,
      example: review.vocabulary.example,
      reviewCount: review.reviewCount,
      nextReviewAt: review.nextReviewAt,
    }));
  }

  private async getToeicWrongQuestions(userId: string) {
    const wrongQuestions = await this.prisma.toeicUserWrongQuestion.findMany({
      where: {
        userId,
        resolvedAt: null,
      },
      include: {
        question: {
          include: {
            choices: {
              orderBy: {
                label: 'asc',
              },
            },
            questionGroup: {
              include: {
                questionSet: {
                  select: {
                    title: true,
                    part: true,
                  },
                },
              },
            },
          },
        },
      },
      orderBy: {
        lastWrongAt: 'desc',
      },
      take: 20,
    });

    return wrongQuestions.map((item) => ({
      id: item.id,
      questionId: item.questionId,
      part: item.question.questionGroup.questionSet.part,
      questionSetTitle: item.question.questionGroup.questionSet.title,
      content: item.question.content,
      wrongCount: item.wrongCount,
      lastWrongAt: item.lastWrongAt,
      choices: item.question.choices.map((choice) => ({
        id: choice.id,
        label: choice.label,
        content: choice.content,
        isCorrect: choice.isCorrect,
      })),
      explanation: item.question.explanation,
    }));
  }

  private async ensureVocabularyIsReviewable(vocabularyId: string) {
    const vocabulary = await this.prisma.vocabulary.findFirst({
      where: {
        id: vocabularyId,
        lesson: {
          status: ContentStatus.PUBLISHED,
          course: {
            status: ContentStatus.PUBLISHED,
          },
        },
      },
      select: {
        id: true,
      },
    });

    if (!vocabulary) {
      throw new NotFoundException(`Vocabulary "${vocabularyId}" not found`);
    }
  }

  private getNextEaseLevel(
    currentEaseLevel: number,
    result: MarkVocabularyReviewDto['result'],
  ) {
    if (result === 'AGAIN') {
      return Math.max(1, currentEaseLevel - 1);
    }

    if (result === 'EASY') {
      return Math.min(5, currentEaseLevel + 1);
    }

    return currentEaseLevel;
  }

  private getNextReviewAt(
    now: Date,
    result: MarkVocabularyReviewDto['result'],
  ) {
    const days = result === 'AGAIN' ? 1 : result === 'GOOD' ? 3 : 7;
    const nextReviewAt = new Date(now);

    nextReviewAt.setDate(nextReviewAt.getDate() + days);

    return nextReviewAt;
  }
}
