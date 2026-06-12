import { Module } from '@nestjs/common';
import { CoursesController } from './courses.controller';
import { CoursesService } from './courses.service';

/**
 * CoursesModule
 *
 * Nhiệm vụ:
 * - Gom controller và service của domain courses.
 * - Export không cần thiết ở Phase 02 vì module khác chưa dùng CoursesService.
 */
@Module({
  controllers: [CoursesController],
  providers: [CoursesService],
})
export class CoursesModule {}
