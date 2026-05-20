import Link from "next/link";
import { notFound } from "next/navigation";

import { LessonContent } from "@/components/lesson-content";
import { api, isApiError } from "@/lib/api";
import type { Lesson } from "@/types";

interface LessonDetailPageProps {
  params: Promise<{
    lessonId: string;
  }>;
}

export default async function LessonDetailPage({ params }: LessonDetailPageProps) {
  const { lessonId } = await params;
  let lesson: Lesson;

  try {
    lesson = await api.getLessonById(lessonId);
  } catch (error) {
    if (isApiError(error) && error.status === 404) {
      notFound();
    }

    throw error;
  }

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <Link
        className="text-sm font-semibold text-primary hover:text-hover"
        href={`/courses/${lesson.courseId}`}
      >
        ← Quay lại khóa học
      </Link>

      <div className="mt-6">
        <LessonContent lesson={lesson} />
      </div>
    </div>
  );
}
