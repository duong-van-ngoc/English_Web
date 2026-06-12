import type { Course } from '../interfaces/course.interface';

/**
 * coursesData
 *
 * Nhiệm vụ:
 * - Lưu fake data cho Phase 02.
 * - Thay thế database tạm thời để intern hiểu CRUD flow trước.
 */
export const coursesData: Course[] = [
  {
    id: 'starter-foundation',
    slug: 'starter-foundation',
    title: 'English Starter',
    level: 'beginner',
    description: 'Lộ trình cho người mới bắt đầu học tiếng Anh từ nền tảng.',
  },
  {
    id: 'toeic-vocabulary-core',
    slug: 'toeic-vocabulary-core',
    title: 'TOEIC Vocabulary Core',
    level: 'elementary',
    description: 'Xây vốn từ vựng TOEIC cơ bản theo ngữ cảnh công việc.',
  },
  {
    id: 'toeic-reading-basic',
    slug: 'toeic-reading-basic',
    title: 'TOEIC Reading Basic',
    level: 'toeic-foundation',
    description: 'Luyện đọc hiểu và ngữ pháp nền tảng cho TOEIC Reading.',
  },
];
