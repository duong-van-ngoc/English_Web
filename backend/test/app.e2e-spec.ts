import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';
import { PrismaService } from './../src/prisma/prisma.service';

type ApiResponse<TData> = {
  success: boolean;
  message: string;
  data: TData;
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
  const authTestEmail = 'auth.e2e@example.com';
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
    await app.init();

    prisma = app.get(PrismaService);
    await prisma.user.deleteMany({
      where: {
        email: authTestEmail,
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

  afterAll(async () => {
    await prisma.user.deleteMany({
      where: {
        email: authTestEmail,
      },
    });
    await prisma.$disconnect();
    await app.close();
  });
});
