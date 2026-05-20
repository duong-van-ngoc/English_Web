import { IsIn, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import {
  COURSE_LEVELS,
  type CourseLevel,
} from '../interfaces/course.interface';

/**
 * CreateCourseDto
 *
 * Nhiệm vụ:
 * - Định nghĩa dữ liệu client được phép gửi khi tạo course.
 * - Validate body trước khi request đi vào service.
 */
export class CreateCourseDto {
  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  slug?: string;

  @IsString()
  @IsNotEmpty()
  @IsIn(COURSE_LEVELS)
  level!: CourseLevel;

  @IsOptional()
  @IsString()
  description?: string;
}
