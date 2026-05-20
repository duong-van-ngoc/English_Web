"use client";

import { useParams } from "next/navigation";

import { LessonForm } from "@/components/admin/lesson-form";

export default function EditLessonPage() {
  const params = useParams<{ lessonId: string }>();

  return <LessonForm lessonId={params.lessonId} />;
}
