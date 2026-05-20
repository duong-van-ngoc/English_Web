import Link from "next/link";
import { notFound } from "next/navigation";

import { LessonList } from "@/components/lesson-list";
import { PrimaryButton } from "@/components/primary-button";
import { api, isApiError } from "@/lib/api";
import type { Course } from "@/types";

interface CourseDetailPageProps {
  params: Promise<{
    courseId: string;
  }>;
}

export default async function CourseDetailPage({ params }: CourseDetailPageProps) {
  const { courseId } = await params;
  let course: Course;

  try {
    course = await api.getCourseById(courseId);
  } catch (error) {
    if (isApiError(error) && error.status === 404) {
      notFound();
    }

    throw error;
  }

  const lessons = [...(course.lessons ?? [])].sort(
    (firstLesson, secondLesson) => firstLesson.order - secondLesson.order,
  );

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <Link
        className="text-sm font-semibold text-primary hover:text-hover"
        href="/courses"
      >
        ← Quay lại khóa học
      </Link>

      <section className="mt-6 grid gap-6 lg:grid-cols-[1fr_340px]">
        <div className="glass-panel floating-card rounded-lg p-6 sm:p-8">
          <p className="text-sm font-semibold uppercase tracking-normal text-primary">
            {course.level}
          </p>
          <h1 className="mt-3 text-3xl font-bold tracking-normal text-text-primary sm:text-4xl">
            {course.title}
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-text-secondary">
            {course.description || "Khóa học này chưa có mô tả chi tiết."}
          </p>

          <div className="mt-8">
            <PrimaryButton href={lessons[0] ? `/lessons/${lessons[0].id}` : "/courses"}>
              Bắt đầu bài đầu tiên
            </PrimaryButton>
          </div>
        </div>

        <aside className="glass-panel-strong rounded-lg p-6">
          <h2 className="text-base font-bold text-text-primary">Tổng quan khóa học</h2>
          <dl className="mt-4 grid grid-cols-2 gap-3 border-t border-border pt-5">
            <div>
              <dt className="text-xs text-text-secondary">Cấp độ</dt>
              <dd className="mt-1 font-semibold text-text-primary">{course.level}</dd>
            </div>
            <div>
              <dt className="text-xs text-text-secondary">Bài học</dt>
              <dd className="mt-1 font-semibold text-text-primary">{lessons.length}</dd>
            </div>
            <div>
              <dt className="text-xs text-text-secondary">Slug</dt>
              <dd className="mt-1 font-semibold text-text-primary">{course.slug}</dd>
            </div>
            <div>
              <dt className="text-xs text-text-secondary">Nguồn dữ liệu</dt>
              <dd className="mt-1 font-semibold text-text-primary">PostgreSQL</dd>
            </div>
          </dl>
        </aside>
      </section>

      <section className="mt-8">
        <div className="mb-4">
          <h2 className="text-2xl font-bold tracking-normal text-text-primary">
            Danh sách bài học
          </h2>
          <p className="mt-2 text-sm leading-6 text-text-secondary">
            Học theo thứ tự từ trên xuống để giữ mạch kiến thức ổn định.
          </p>
        </div>
        {lessons.length > 0 ? (
          <LessonList lessons={lessons} />
        ) : (
          <div className="glass-panel rounded-lg p-5 text-sm text-text-secondary">
            Khóa học này chưa có bài học nào.
          </div>
        )}
      </section>
    </div>
  );
}
