import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'node:path';
import { AppModule } from './app.module';
import { ApiExceptionFilter } from './common/filters/api-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.enableCors({
    origin: process.env.FRONTEND_ORIGIN ?? 'http://localhost:3000',
    credentials: true,
  });

  app.useStaticAssets(join(process.cwd(), 'uploads'), {
    prefix: '/uploads',
  });

  /**
   * Prefix API toàn cục.
   *
   * Ví dụ:
   * - HealthController @Controller('health') => /api/health
   * - CoursesController @Controller('courses') => /api/courses
   */
  app.setGlobalPrefix('api');

  /**
   * ValidationPipe toàn cục.
   *
   * Nhiệm vụ:
   * - Validate DTO cho toàn bộ request body.
   * - Tự transform plain object thành DTO instance.
   * - Loại field thừa.
   * - Báo lỗi nếu client gửi field không được khai báo trong DTO.
   */
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  app.useGlobalFilters(new ApiExceptionFilter());

  await app.listen(process.env.PORT ?? 3001);
}
void bootstrap();
