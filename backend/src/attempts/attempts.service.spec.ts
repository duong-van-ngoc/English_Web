import { BadRequestException, ForbiddenException } from '@nestjs/common';
import { AttemptsService } from './attempts.service';

describe('AttemptsService', () => {
  const prisma = {
    $transaction: jest.fn(),
  };
  let service: AttemptsService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new AttemptsService(prisma as never);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('rejects duplicated TOEIC question ids before transaction starts', async () => {
    await expect(
      service.submitToeicAttempt('user-1', 'attempt-1', {
        answers: [
          { questionId: 'question-1', selectedChoiceId: 'choice-1' },
          { questionId: 'question-1', selectedChoiceId: 'choice-2' },
        ],
      }),
    ).rejects.toBeInstanceOf(BadRequestException);

    expect(prisma.$transaction).not.toHaveBeenCalled();
  });

  it('rejects submission from a different user', async () => {
    const tx = {
      toeicAttempt: {
        findUnique: jest.fn().mockResolvedValue({
          id: 'attempt-1',
          userId: 'owner-1',
          status: 'IN_PROGRESS',
          startedAt: new Date('2026-01-01T00:00:00.000Z'),
          questionSet: {
            duration: 600,
            groups: [],
          },
        }),
      },
    };

    prisma.$transaction.mockImplementation(
      (callback: (client: typeof tx) => Promise<unknown>) => callback(tx),
    );

    await expect(
      service.submitToeicAttempt('user-1', 'attempt-1', {
        answers: [{ questionId: 'question-1', selectedChoiceId: 'choice-1' }],
      }),
    ).rejects.toBeInstanceOf(ForbiddenException);
  });

  it('calculates score, wrong answers, and expired status correctly', async () => {
    const startedAt = new Date('2026-01-01T00:00:00.000Z');
    const createMany = jest.fn();
    const upsert = jest.fn();
    const update = jest.fn().mockResolvedValue({
      id: 'attempt-1',
      status: 'EXPIRED',
      totalQuestions: 2,
      correctAnswers: 1,
      wrongAnswers: 1,
      score: 50,
      submittedAt: new Date('2026-01-01T00:01:05.000Z'),
    });

    const tx = {
      toeicAttempt: {
        findUnique: jest.fn().mockResolvedValue({
          id: 'attempt-1',
          userId: 'user-1',
          status: 'IN_PROGRESS',
          startedAt,
          questionSet: {
            duration: 60,
            groups: [
              {
                questions: [
                  {
                    id: 'question-1',
                    choices: [
                      { id: 'choice-1', isCorrect: true },
                      { id: 'choice-2', isCorrect: false },
                    ],
                  },
                  {
                    id: 'question-2',
                    choices: [
                      { id: 'choice-3', isCorrect: false },
                      { id: 'choice-4', isCorrect: true },
                    ],
                  },
                ],
              },
            ],
          },
        }),
        update,
      },
      toeicAttemptAnswer: {
        createMany,
      },
      toeicUserWrongQuestion: {
        upsert,
      },
    };

    prisma.$transaction.mockImplementation(
      (callback: (client: typeof tx) => Promise<unknown>) => callback(tx),
    );
    jest
      .spyOn(Date, 'now')
      .mockReturnValue(new Date('2026-01-01T00:01:01.000Z').getTime());

    const result = await service.submitToeicAttempt('user-1', 'attempt-1', {
      answers: [
        { questionId: 'question-1', selectedChoiceId: 'choice-1' },
        { questionId: 'question-2', selectedChoiceId: 'choice-3' },
      ],
    });

    expect(createMany).toHaveBeenCalledWith({
      data: [
        {
          attemptId: 'attempt-1',
          questionId: 'question-1',
          selectedChoiceId: 'choice-1',
          isCorrect: true,
        },
        {
          attemptId: 'attempt-1',
          questionId: 'question-2',
          selectedChoiceId: 'choice-3',
          isCorrect: false,
        },
      ],
    });
    expect(upsert).toHaveBeenCalledTimes(1);
    expect(update).toHaveBeenCalledTimes(1);
    const [firstUpdateCall] = update.mock.calls as [
      [
        {
          where: { id: string };
          data: {
            status: string;
            totalQuestions: number;
            correctAnswers: number;
            wrongAnswers: number;
            score: number;
            submittedAt: Date;
          };
          select: Record<string, boolean>;
        },
      ],
    ];

    expect(firstUpdateCall[0].where).toEqual({
      id: 'attempt-1',
    });
    expect(firstUpdateCall[0].data).toMatchObject({
      status: 'EXPIRED',
      totalQuestions: 2,
      correctAnswers: 1,
      wrongAnswers: 1,
      score: 50,
    });
    expect(firstUpdateCall[0].data.submittedAt).toBeInstanceOf(Date);
    expect(firstUpdateCall[0].select).toEqual({
      id: true,
      status: true,
      totalQuestions: true,
      correctAnswers: true,
      wrongAnswers: true,
      score: true,
      submittedAt: true,
    });
    expect(result.score).toBe(50);
  });
});
