import type { Lesson } from "@/types";

interface LessonContentProps {
  lesson: Lesson;
}

export function LessonContent({ lesson }: LessonContentProps) {
  return (
    <article className="glass-panel floating-card rounded-lg p-5 sm:p-8">
      <div className="flex flex-wrap items-center gap-2 text-sm text-text-secondary">
        <span className="rounded-md border border-primary/20 bg-primary/10 px-2.5 py-1 font-semibold text-primary">
          Bài {lesson.order}
        </span>
        <span>Lesson detail</span>
      </div>

      <h1 className="mt-5 text-3xl font-bold tracking-normal text-text-primary">
        {lesson.title}
      </h1>

      <div className="mt-6 rounded-md border border-border bg-surface-strong p-5">
        <p className="text-sm font-semibold uppercase tracking-normal text-primary">
          Nội dung bài học
        </p>
        <div className="mt-4 whitespace-pre-line text-base leading-7 text-text-secondary">
          {lesson.content}
        </div>
      </div>
    </article>
  );
}
