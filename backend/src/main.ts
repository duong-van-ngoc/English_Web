import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: process.env.FRONTEND_ORIGIN ?? 'http://localhost:3000',
    credentials: true,
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

  await app.listen(process.env.PORT ?? 3001);
}
void bootstrap();
