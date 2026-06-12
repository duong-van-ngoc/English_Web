export const COURSE_LEVELS = [
  'beginner',
  'elementary',
  'toeic-foundation',
  'vstep',
] as const;

export type CourseLevel = (typeof COURSE_LEVELS)[number];

export interface CourseLesson {
  id: string;
  courseId: string;
  title: string;
  content: string;
  order: number;
  status?: string;
  publishedAt?: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * Course
 *
 * Nhiệm vụ:
 * - Định nghĩa shape dữ liệu của một khóa học trong Phase 02.
 * - Giúp service/controller biết course có các field nào.
 */
export interface Course {
  id: string;
  title: string;
  slug: string;
  level: string;
  description?: string | null;
  status?: string;
  publishedAt?: Date | null;
  lessons?: CourseLesson[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ApiResponse<TData> {
  success: true;
  message: string;
  data: TData;
}
