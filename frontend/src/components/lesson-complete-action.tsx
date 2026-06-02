"use client";

import { useState } from "react";

import { useAuth } from "@/hooks/use-auth";
import { api, isApiError } from "@/lib/api";

export function LessonCompleteAction({ lessonId }: { lessonId: string }) {
  const { status } = useAuth();
  const [isCompleted, setIsCompleted] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleComplete() {
    setIsSaving(true);
    setError("");

    try {
      await api.completeLesson(lessonId);
      setIsCompleted(true);
    } catch (completeError) {
      setError(
        isApiError(completeError)
          ? completeError.message
          : "Khong the danh dau lesson da hoan thanh.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  if (status !== "authenticated") {
    return null;
  }

  return (
    <div className="mt-6 rounded-lg border border-border bg-surface-strong p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-bold text-text-primary">
            {isCompleted ? "Lesson completed" : "Track your progress"}
          </p>
          <p className="mt-1 text-xs text-text-secondary">
            Mark this lesson complete to update your dashboard.
          </p>
        </div>
        <button
          className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-hover disabled:cursor-not-allowed disabled:opacity-60"
          disabled={isSaving || isCompleted}
          onClick={() => void handleComplete()}
          type="button"
        >
          {isSaving
            ? "Saving..."
            : isCompleted
              ? "Completed"
              : "Mark complete"}
        </button>
      </div>
      {error ? <p className="mt-3 text-sm text-error">{error}</p> : null}
    </div>
  );
}
