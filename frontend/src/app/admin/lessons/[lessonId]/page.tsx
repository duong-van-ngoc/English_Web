"use client";

import { useParams } from "next/navigation";

import { LessonForm } from "@/features/admin/components/lesson-form";

export default function EditLessonPage() {
  const params = useParams<{ lessonId: string }>();

  return <LessonForm lessonId={params.lessonId} />;
}
