import { Injectable } from '@nestjs/common';
import { ContentStatus } from '@prisma/client';
import type { AuthenticatedUser } from '../auth/interfaces/authenticated-user.interface';
import { PrismaService } from '../prisma/prisma.service';

const TOEIC_PART_TITLES: Record<number, string> = {
  1: 'Photographs',
  2: 'Question Response',
  3: 'Conversations',
  4: 'Talks',
  5: 'Incomplete Sentences',
  6: 'Text Completion',
  7: 'Reading Comprehension',
};

type PartStats = {
  part: number;
  title: string;
  attempts: number;
  answeredQuestions: number;
  correctAnswers: number;
  wrongAnswers: number;
  accuracyRate: number;
  lastSubmittedAt: Date | null;
};

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async getDashboard(user: AuthenticatedUser) {
    const [
      totalCourses,
      totalLessons,
      completedLessons,
      latestProgress,
      attempts,
      dueVocabularyCount,
      wrongQuestionCount,
      nextLesson,
    ] = await Promise.all([
      this.prisma.course.count({
        where: {
          status: ContentStatus.PUBLISHED,
        },
      }),
      this.prisma.lesson.count({
        where: {
          status: ContentStatus.PUBLISHED,
          course: {
            status: ContentStatus.PUBLISHED,
          },
        },
      }),
      this.prisma.progress.count({
        where: {
          userId: user.id,
          completed: true,
          lessonId: {
            not: null,
          },
        },
      }),
      this.prisma.progress.findFirst({
        where: {
          userId: user.id,
        },
        orderBy: {
          updatedAt: 'desc',
        },
        select: {
          updatedAt: true,
        },
      }),
      this.getSubmittedAttempts(user.id),
      this.prisma.vocabularyReview.count({
        where: {
          userId: user.id,
          status: {
            in: ['DUE', 'LEARNING'],
          },
          nextReviewAt: {
            lte: new Date(),
          },
        },
      }),
      this.prisma.toeicUserWrongQuestion.count({
        where: {
          userId: user.id,
          resolvedAt: null,
        },
      }),
      this.findNextLesson(user.id),
    ]);

    const toeic = this.summarizeToeic(attempts);
    const weakestPart = this.getWeakestPart(this.getPartStats(attempts));
    const lastAttemptAt = attempts[0]?.submittedAt ?? null;
    const lastStudiedAt = this.maxDate(
      latestProgress?.updatedAt,
      lastAttemptAt,
    );

    return {
      profile: {
        userId: user.id,
        name: user.name,
        email: user.email,
      },
      learning: {
        totalCourses,
        totalLessons,
        completedLessons,
        completionRate: this.getRate(completedLessons, totalLessons),
        lastStudiedAt,
      },
      toeic: {
        ...toeic,
        weakestPart,
      },
      review: {
        dueVocabularyCount,
        wrongQuestionCount,
      },
      recommendation: this.getRecommendation({
        wrongQuestionCount,
        dueVocabularyCount,
        weakestPart,
        nextLesson,
      }),
    };
  }

  async getStats(userId: string) {
    const attempts = await this.getSubmittedAttempts(userId);

    return {
      byPart: this.getPartStats(attempts),
      recentAttempts: attempts.slice(0, 10).map((attempt) => ({
        attemptId: attempt.id,
        questionSetTitle: attempt.questionSet.title,
        part: attempt.questionSet.part,
        score: attempt.score,
        correctAnswers: attempt.correctAnswers,
        wrongAnswers: attempt.wrongAnswers,
        submittedAt: attempt.submittedAt,
      })),
    };
  }

  private getSubmittedAttempts(userId: string) {
    return this.prisma.toeicAttempt.findMany({
      where: {
        userId,
        status: {
          in: ['SUBMITTED', 'EXPIRED'],
        },
      },
      include: {
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

  private async findNextLesson(userId: string) {
    const completedProgress = await this.prisma.progress.findMany({
      where: {
        userId,
        completed: true,
        lessonId: {
          not: null,
        },
      },
      select: {
        lessonId: true,
      },
    });
    const completedLessonIds = completedProgress
      .map((progress) => progress.lessonId)
      .filter((lessonId): lessonId is string => Boolean(lessonId));

    return this.prisma.lesson.findFirst({
      where: {
        status: ContentStatus.PUBLISHED,
        course: {
          status: ContentStatus.PUBLISHED,
        },
        ...(completedLessonIds.length > 0
          ? {
              id: {
                notIn: completedLessonIds,
              },
            }
          : {}),
      },
      select: {
        id: true,
        title: true,
        course: {
          select: {
            title: true,
          },
        },
      },
      orderBy: [{ course: { createdAt: 'asc' } }, { order: 'asc' }],
    });
  }

  private summarizeToeic(
    attempts: Awaited<ReturnType<typeof this.getSubmittedAttempts>>,
  ) {
    const totalQuestionsAnswered = attempts.reduce(
      (total, attempt) => total + attempt.totalQuestions,
      0,
    );
    const totalCorrectAnswers = attempts.reduce(
      (total, attempt) => total + attempt.correctAnswers,
      0,
    );
    const totalWrongAnswers = attempts.reduce(
      (total, attempt) => total + attempt.wrongAnswers,
      0,
    );

    return {
      totalAttempts: attempts.length,
      totalQuestionsAnswered,
      totalCorrectAnswers,
      totalWrongAnswers,
      accuracyRate: this.getRate(totalCorrectAnswers, totalQuestionsAnswered),
    };
  }

  private getPartStats(
    attempts: Awaited<ReturnType<typeof this.getSubmittedAttempts>>,
  ): PartStats[] {
    const statsByPart = new Map<number, PartStats>();

    for (const attempt of attempts) {
      const part = attempt.questionSet.part;
      const current =
        statsByPart.get(part) ??
        ({
          part,
          title: TOEIC_PART_TITLES[part] ?? `Part ${part}`,
          attempts: 0,
          answeredQuestions: 0,
          correctAnswers: 0,
          wrongAnswers: 0,
          accuracyRate: 0,
          lastSubmittedAt: null,
        } satisfies PartStats);

      current.attempts += 1;
      current.answeredQuestions += attempt.totalQuestions;
      current.correctAnswers += attempt.correctAnswers;
      current.wrongAnswers += attempt.wrongAnswers;
      current.lastSubmittedAt =
        this.maxDate(current.lastSubmittedAt, attempt.submittedAt) ?? null;
      statsByPart.set(part, current);
    }

    return Array.from(statsByPart.values())
      .map((stats) => ({
        ...stats,
        accuracyRate: this.getRate(
          stats.correctAnswers,
          stats.answeredQuestions,
        ),
      }))
      .sort((a, b) => a.part - b.part);
  }

  private getWeakestPart(stats: PartStats[]) {
    const eligibleStats = stats.filter((item) => item.answeredQuestions >= 5);

    if (eligibleStats.length === 0) {
      return null;
    }

    const weakest = eligibleStats.reduce((currentWeakest, item) => {
      const currentWrongRate =
        currentWeakest.wrongAnswers / currentWeakest.answeredQuestions;
      const itemWrongRate = item.wrongAnswers / item.answeredQuestions;

      return itemWrongRate > currentWrongRate ? item : currentWeakest;
    });

    return {
      part: weakest.part,
      title: weakest.title,
      wrongRate: this.getRate(weakest.wrongAnswers, weakest.answeredQuestions),
      answeredQuestions: weakest.answeredQuestions,
    };
  }

  private getRecommendation({
    wrongQuestionCount,
    dueVocabularyCount,
    weakestPart,
    nextLesson,
  }: {
    wrongQuestionCount: number;
    dueVocabularyCount: number;
    weakestPart: ReturnType<DashboardService['getWeakestPart']>;
    nextLesson: Awaited<ReturnType<DashboardService['findNextLesson']>>;
  }) {
    if (wrongQuestionCount > 0) {
      return {
        type: 'WRONG_QUESTION_REVIEW' as const,
        title: 'On lai cau TOEIC da sai',
        href: '/review',
        reason: `Ban co ${wrongQuestionCount} cau sai can xem lai.`,
      };
    }

    if (dueVocabularyCount > 0) {
      return {
        type: 'VOCABULARY_REVIEW' as const,
        title: 'On lai tu vung den han',
        href: '/review',
        reason: `Ban co ${dueVocabularyCount} tu vung can on.`,
      };
    }

    if (weakestPart) {
      return {
        type: 'TOEIC_PART' as const,
        title: `Luyen TOEIC Part ${weakestPart.part}`,
        href: `/practice/part/${weakestPart.part}`,
        reason: `Part nay dang co ty le sai ${weakestPart.wrongRate}%.`,
      };
    }

    if (nextLesson) {
      return {
        type: 'LESSON' as const,
        title: nextLesson.title,
        href: `/lessons/${nextLesson.id}`,
        reason: `Tiep tuc khoa ${nextLesson.course.title}.`,
      };
    }

    return {
      type: 'TOEIC_PART' as const,
      title: 'Bat dau TOEIC Part 5',
      href: '/practice/part/5',
      reason: 'Part 5 la noi phu hop de bat dau luyen ngu phap TOEIC.',
    };
  }

  private getRate(value: number, total: number): number {
    return total > 0 ? Math.round((value / total) * 100) : 0;
  }

  private maxDate(first?: Date | null, second?: Date | null): Date | null {
    if (!first) {
      return second ?? null;
    }

    if (!second) {
      return first;
    }

    return first > second ? first : second;
  }
}
