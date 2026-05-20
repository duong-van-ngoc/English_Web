import Link from "next/link";

import type { Course } from "@/types";

interface CourseCardProps {
  course: Course;
}

const levelClasses: Record<string, string> = {
  beginner: "border-primary/25 bg-primary/10 text-primary",
  elementary: "border-secondary/25 bg-secondary/10 text-primary",
  "toeic-foundation": "border-accent/25 bg-accent/10 text-accent",
};

export function CourseCard({ course }: CourseCardProps) {
  const lessonCount = course.lessons?.length ?? 0;
  const levelClass =
    levelClasses[course.level] ?? "border-border bg-surface-strong text-text-primary";

  return (
    <Link
      className="glass-panel group flex h-full flex-col rounded-lg p-5 transition hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-[var(--glass-shadow)]"
      href={`/courses/${course.id}`}
    >
      <div className="flex items-start justify-between gap-4">
        <span className={`rounded-md border px-2.5 py-1 text-xs font-semibold ${levelClass}`}>
          {course.level}
        </span>
        <span className="text-xs font-medium text-text-secondary">
          {lessonCount} bài học
        </span>
      </div>

      <div className="mt-5 flex-1">
        <h2 className="text-xl font-bold tracking-normal text-text-primary group-hover:text-primary">
          {course.title}
        </h2>
        <p className="mt-3 text-sm leading-6 text-text-secondary">
          {course.description || "Khóa học này đang chờ bổ sung mô tả chi tiết."}
        </p>
      </div>

      <dl className="mt-6 grid grid-cols-2 gap-3 border-t border-border pt-4 text-sm">
        <div>
          <dt className="text-xs text-text-secondary">Slug</dt>
          <dd className="mt-1 font-semibold text-text-primary">{course.slug}</dd>
        </div>
        <div>
          <dt className="text-xs text-text-secondary">Bài học</dt>
          <dd className="mt-1 font-semibold text-text-primary">{lessonCount}</dd>
        </div>
      </dl>
    </Link>
  );
}
