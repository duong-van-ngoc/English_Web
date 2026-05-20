import { Module } from '@nestjs/common';
import { HealthController } from './health.controller';

/**
 * HealthModule
 *
 * Nhiệm vụ:
 * - Gom các thành phần liên quan tới health check.
 * - Đăng ký HealthController với NestJS.
 */
@Module({
  controllers: [HealthController],
})
export class HealthModule {}
