import Link from "next/link";

import type { Lesson } from "@/types";

interface LessonListProps {
  lessons: Lesson[];
}

function getLessonExcerpt(content: string): string {
  const compactContent = content.replace(/\s+/g, " ").trim();

  if (compactContent.length <= 120) {
    return compactContent;
  }

  return `${compactContent.slice(0, 117)}...`;
}

export function LessonList({ lessons }: LessonListProps) {
  return (
    <ol className="space-y-3">
      {lessons.map((lesson) => (
        <li key={lesson.id}>
          <Link
            className="glass-panel-strong grid gap-4 rounded-lg p-4 transition hover:border-primary/40 hover:shadow-[var(--soft-shadow)] sm:grid-cols-[auto_1fr_auto]"
            href={`/lessons/${lesson.id}`}
          >
            <span className="flex size-10 items-center justify-center rounded-md bg-primary/10 text-sm font-bold text-primary">
              {lesson.order}
            </span>
            <span>
              <span className="block text-base font-semibold text-text-primary">
                {lesson.title}
              </span>
              <span className="mt-1 block text-sm leading-6 text-text-secondary">
                {getLessonExcerpt(lesson.content)}
              </span>
            </span>
            <span className="flex items-center gap-2 text-sm text-text-secondary sm:justify-end">
              <span>Bài {lesson.order}</span>
            </span>
          </Link>
        </li>
      ))}
    </ol>
  );
}
