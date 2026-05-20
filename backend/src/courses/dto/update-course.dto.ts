import { PartialType } from '@nestjs/mapped-types';
import { CreateCourseDto } from './create-course.dto';

/**
 * UpdateCourseDto
 *
 * Nhiệm vụ:
 * - Tái sử dụng validation của CreateCourseDto.
 * - Biến toàn bộ field thành optional cho PATCH.
 */
export class UpdateCourseDto extends PartialType(CreateCourseDto) {}
