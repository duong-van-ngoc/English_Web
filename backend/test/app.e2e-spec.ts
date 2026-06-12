import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';
import { ApiExceptionFilter } from './../src/common/filters/api-exception.filter';
import { PrismaService } from './../src/prisma/prisma.service';

type ApiResponse<TData> = {
  success: boolean;
  message: string;
  data: TData;
};

type ApiErrorResponse = {
  success: false;
  error: {
    code: string;
    message: string;
    details?: string[];
  };
};

type AuthUserResponse = {
  id: string;
  email: string;
  name: string | null;
  role: string;
  password?: unknown;
};

type LoginResponse = {
  accessToken: string;
  user: AuthUserResponse;
};

describe('Phase 03 API smoke test', () => {
  let app: INestApplication<App>;
  let prisma: PrismaService;
  let accessToken: string;
  let outsiderAccessToken: string;
  let toeicQuestionSetId: string;
  let toeicQuestionIds: string[] = [];
  let toeicChoiceIds: string[] = [];
  let ownerAttemptId: string;
  const authTestEmail = 'auth.e2e@example.com';
  const outsiderEmail = 'auth.outsider.e2e@example.com';
  const authTestPassword = '123456';

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api');
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    app.useGlobalFilters(new ApiExceptionFilter());
    await app.init();

    prisma = app.get(PrismaService);
    await prisma.toeicAttempt.deleteMany({
      where: {
        OR: [
          {
            user: {
              is: {
                email: {
                  in: [authTestEmail, outsiderEmail],
                },
              },
            },
          },
          {
            questionSet: {
              is: {
                title: 'Phase 10 E2E TOEIC Set',
              },
            },
          },
        ],
      },
    });
    await prisma.toeicQuestionSet.deleteMany({
      where: {
        title: 'Phase 10 E2E TOEIC Set',
      },
    });
    await prisma.user.deleteMany({
      where: {
        email: {
          in: [authTestEmail, outsiderEmail],
        },
      },
    });
  });

  it('/api/health (GET)', () => {
    return request(app.getHttpServer())
      .get('/api/health')
      .expect(200)
      .expect(({ body }) => {
        expect(body).toMatchObject({
          success: true,
          message: 'Backend is healthy',
          data: {
            status: 'ok',
            service: 'English Learning Explorer Backend',
          },
        });
      });
  });

  it('/api/courses (GET)', () => {
    return request(app.getHttpServer())
      .get('/api/courses')
      .expect(200)
      .expect(({ body }) => {
        const responseBody = body as ApiResponse<unknown[]>;

        expect(responseBody.success).toBe(true);
        expect(responseBody.message).toBe('Courses fetched successfully');
        expect(Array.isArray(responseBody.data)).toBe(true);
      });
  });

  it('/api/auth/register (POST)', () => {
    return request(app.getHttpServer())
      .post('/api/auth/register')
      .send({
        name: 'Auth E2E',
        email: authTestEmail,
        password: authTestPassword,
      })
      .expect(201)
      .expect(({ body }) => {
        const responseBody = body as ApiResponse<AuthUserResponse>;

        expect(body).toMatchObject({
          success: true,
          message: 'Registered successfully',
          data: {
            email: authTestEmail,
            name: 'Auth E2E',
            role: 'USER',
          },
        });
        expect(responseBody.data.password).toBeUndefined();
      });
  });

  it('/api/auth/register (POST) rejects duplicate email', () => {
    return request(app.getHttpServer())
      .post('/api/auth/register')
      .send({
        name: 'Auth E2E Duplicate',
        email: authTestEmail,
        password: authTestPassword,
      })
      .expect(409);
  });

  it('/api/auth/login (POST)', () => {
    return request(app.getHttpServer())
      .post('/api/auth/login')
      .send({
        email: authTestEmail,
        password: authTestPassword,
      })
      .expect(201)
      .expect(({ body }) => {
        const responseBody = body as ApiResponse<LoginResponse>;

        expect(body).toMatchObject({
          success: true,
          message: 'Logged in successfully',
          data: {
            user: {
              email: authTestEmail,
              name: 'Auth E2E',
              role: 'USER',
            },
          },
        });
        expect(typeof responseBody.data.accessToken).toBe('string');
        accessToken = responseBody.data.accessToken;
      });
  });

  it('/api/auth/register (POST) registers outsider user', () => {
    return request(app.getHttpServer())
      .post('/api/auth/register')
      .send({
        name: 'Auth E2E Outsider',
        email: outsiderEmail,
        password: authTestPassword,
      })
      .expect(201);
  });

  it('/api/auth/login (POST) logs in outsider user', () => {
    return request(app.getHttpServer())
      .post('/api/auth/login')
      .send({
        email: outsiderEmail,
        password: authTestPassword,
      })
      .expect(201)
      .expect(({ body }) => {
        const responseBody = body as ApiResponse<LoginResponse>;

        expect(typeof responseBody.data.accessToken).toBe('string');
        outsiderAccessToken = responseBody.data.accessToken;
      });
  });

  it('/api/auth/login (POST) rejects invalid password', () => {
    return request(app.getHttpServer())
      .post('/api/auth/login')
      .send({
        email: authTestEmail,
        password: 'wrong-password',
      })
      .expect(401);
  });

  it('/api/auth/me (GET) rejects missing token', () => {
    return request(app.getHttpServer()).get('/api/auth/me').expect(401);
  });

  it('/api/auth/me (GET)', () => {
    return request(app.getHttpServer())
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200)
      .expect(({ body }) => {
        expect(body).toMatchObject({
          success: true,
          data: {
            email: authTestEmail,
            name: 'Auth E2E',
            role: 'USER',
          },
        });
      });
  });

  it('/api/courses (POST) rejects USER role', () => {
    return request(app.getHttpServer())
      .post('/api/courses')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        title: 'Forbidden Course',
        level: 'beginner',
        description: 'This should not be created',
      })
      .expect(403);
  });

  it('creates a TOEIC practice set for submit attempt e2e', async () => {
    const questionSet = await prisma.toeicQuestionSet.create({
      data: {
        title: 'Phase 10 E2E TOEIC Set',
        description: 'E2E test set',
        part: 5,
        type: 'PRACTICE',
        duration: 60,
        version: 1,
        groups: {
          create: {
            title: 'E2E Group',
            order: 1,
            questions: {
              create: [
                {
                  content: 'Question 1',
                  explanation: 'Explanation 1',
                  order: 1,
                  choices: {
                    create: [
                      { label: 'A', content: 'Correct 1', isCorrect: true },
                      { label: 'B', content: 'Wrong 1', isCorrect: false },
                    ],
                  },
                },
                {
                  content: 'Question 2',
                  explanation: 'Explanation 2',
                  order: 2,
                  choices: {
                    create: [
                      { label: 'A', content: 'Wrong 2', isCorrect: false },
                      { label: 'B', content: 'Correct 2', isCorrect: true },
                    ],
                  },
                },
              ],
            },
          },
        },
      },
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
        },
      },
    });

    toeicQuestionSetId = questionSet.id;
    toeicQuestionIds = questionSet.groups[0].questions.map(
      (question) => question.id,
    );
    toeicChoiceIds = questionSet.groups[0].questions.flatMap((question) =>
      question.choices.map((choice) => choice.id),
    );

    expect(questionSet.groups[0].questions).toHaveLength(2);
  });

  it('/api/attempts (POST) starts TOEIC attempt', () => {
    return request(app.getHttpServer())
      .post('/api/attempts')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        questionSetId: toeicQuestionSetId,
      })
      .expect(201)
      .expect(({ body }) => {
        const responseBody = body as ApiResponse<{
          id: string;
          status: string;
        }>;

        expect(responseBody.data.status).toBe('IN_PROGRESS');
        ownerAttemptId = responseBody.data.id;
      });
  });

  it('/api/attempts/:id/submit (POST) rejects missing token', () => {
    return request(app.getHttpServer())
      .post(`/api/attempts/${ownerAttemptId}/submit`)
      .send({
        answers: [],
      })
      .expect(401)
      .expect(({ body }) => {
        const responseBody = body as ApiErrorResponse;

        expect(responseBody).toMatchObject({
          success: false,
          error: {
            code: 'UNAUTHORIZED',
          },
        });
      });
  });

  it('/api/attempts/:id/submit (POST) rejects duplicate answers', () => {
    return request(app.getHttpServer())
      .post(`/api/attempts/${ownerAttemptId}/submit`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        answers: [
          {
            questionId: toeicQuestionIds[0],
            selectedChoiceId: toeicChoiceIds[0],
          },
          {
            questionId: toeicQuestionIds[0],
            selectedChoiceId: toeicChoiceIds[1],
          },
        ],
      })
      .expect(400)
      .expect(({ body }) => {
        const responseBody = body as ApiErrorResponse;

        expect(responseBody).toMatchObject({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Each TOEIC question can only be answered once',
          },
        });
      });
  });

  it('/api/attempts/:id/submit (POST) rejects outsider user', () => {
    return request(app.getHttpServer())
      .post(`/api/attempts/${ownerAttemptId}/submit`)
      .set('Authorization', `Bearer ${outsiderAccessToken}`)
      .send({
        answers: [
          {
            questionId: toeicQuestionIds[0],
            selectedChoiceId: toeicChoiceIds[0],
          },
        ],
      })
      .expect(403)
      .expect(({ body }) => {
        const responseBody = body as ApiErrorResponse;

        expect(responseBody).toMatchObject({
          success: false,
          error: {
            code: 'FORBIDDEN',
            message: 'You cannot submit this TOEIC attempt',
          },
        });
      });
  });

  it('/api/attempts/:id/submit (POST) submits TOEIC attempt successfully', () => {
    return request(app.getHttpServer())
      .post(`/api/attempts/${ownerAttemptId}/submit`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        answers: [
          {
            questionId: toeicQuestionIds[0],
            selectedChoiceId: toeicChoiceIds[0],
          },
          {
            questionId: toeicQuestionIds[1],
            selectedChoiceId: toeicChoiceIds[2],
          },
        ],
      })
      .expect(201)
      .expect(({ body }) => {
        const responseBody = body as ApiResponse<{
          status: string;
          totalQuestions: number;
          correctAnswers: number;
          wrongAnswers: number;
          score: number;
        }>;

        expect(responseBody).toMatchObject({
          success: true,
          message: 'TOEIC attempt submitted successfully',
          data: {
            status: 'SUBMITTED',
            totalQuestions: 2,
            correctAnswers: 1,
            wrongAnswers: 1,
            score: 50,
          },
        });
      });
  });

  afterAll(async () => {
    await prisma.toeicAttempt.deleteMany({
      where: {
        OR: [
          {
            user: {
              is: {
                email: {
                  in: [authTestEmail, outsiderEmail],
                },
              },
            },
          },
          {
            questionSet: {
              is: {
                title: 'Phase 10 E2E TOEIC Set',
              },
            },
          },
        ],
      },
    });
    await prisma.toeicQuestionSet.deleteMany({
      where: {
        title: 'Phase 10 E2E TOEIC Set',
      },
    });
    await prisma.user.deleteMany({
      where: {
        email: {
          in: [authTestEmail, outsiderEmail],
        },
      },
    });
    await prisma.$disconnect();
    await app.close();
  });
});
