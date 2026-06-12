"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { FormEvent } from "react";
import { useEffect, useState } from "react";

import {
  AdminButton,
  AdminInput,
  AdminPageTitle,
  AdminSelect,
  AdminTextarea,
  InlineMessage,
  StatusBadge,
} from "./admin-ui";
import { api, isApiError } from "@/lib/api";
import type { Course, Lesson, LessonPayload } from "@/types";

type LessonFormState = LessonPayload & {
  courseId: string;
};

const emptyForm: LessonFormState = {
  courseId: "",
  title: "",
  content: "",
  order: 1,
};

export function LessonForm({ lessonId }: { lessonId?: string }) {
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>([]);
  const [error, setError] = useState("");
  const [fieldError, setFieldError] = useState("");
  const [form, setForm] = useState<LessonFormState>(emptyForm);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [toast, setToast] = useState("");
  const [view, setView] = useState<"edit" | "preview">("edit");

  useEffect(() => {
    const targetLessonId = lessonId;
    let isMounted = true;

    async function loadInitialData(id?: string) {
      try {
        const [courseData, lessonData] = await Promise.all([
          api.getAdminCourses(),
          id ? api.getAdminLesson(id) : Promise.resolve(null),
        ]);

        if (!isMounted) {
          return;
        }

        setCourses(courseData);

        if (lessonData) {
          setLesson(lessonData);
          setForm({
            courseId: lessonData.courseId,
            title: lessonData.title,
            content: lessonData.content,
            order: lessonData.order,
          });
        } else {
          setForm((current) => ({
            ...current,
            courseId: courseData[0]?.id ?? "",
          }));
        }
      } catch (loadError) {
        if (isMounted) {
          setError(
            isApiError(loadError) ? loadError.message : "Khong tai duoc lesson.",
          );
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    void loadInitialData(targetLessonId);

    return () => {
      isMounted = false;
    };
  }, [lessonId]);

  function updateField(field: keyof LessonFormState, value: string | number) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function validate() {
    if (!lessonId && !form.courseId) {
      return "Course bat buoc.";
    }

    if (!form.title.trim()) {
      return "Title bat buoc.";
    }

    if (!form.content.trim()) {
      return "Content bat buoc.";
    }

    if (!Number.isInteger(form.order) || form.order < 1) {
      return "Order phai lon hon 0.";
    }

    return "";
  }

  function payload(): LessonPayload {
    return {
      title: form.title.trim(),
      content: form.content.trim(),
      order: form.order,
    };
  }

  async function saveLesson(nextStatus?: "DRAFT" | "PUBLISHED") {
    const validationMessage = validate();

    if (validationMessage) {
      setFieldError(validationMessage);
      return;
    }

    setFieldError("");
    setError("");
    setToast("");
    setIsSaving(true);

    try {
      const savedLesson = lessonId
        ? await api.updateLesson(lessonId, payload())
        : await api.createLesson(form.courseId, payload());

      let finalLesson = savedLesson;

      if (nextStatus) {
        finalLesson = await api.updateLessonStatus(savedLesson.id, nextStatus);
      }

      setLesson(finalLesson);
      setToast(
        nextStatus
          ? `Lesson da luu va cap nhat sang ${nextStatus}.`
          : "Lesson da duoc luu.",
      );

      if (!lessonId) {
        router.replace(`/admin/lessons/${savedLesson.id}`);
      }
    } catch (saveError) {
      setError(isApiError(saveError) ? saveError.message : "Khong luu duoc lesson.");
    } finally {
      setIsSaving(false);
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void saveLesson();
  }

  return (
    <div>
      <AdminPageTitle
        action={
          <Link
            className="inline-flex min-h-10 items-center justify-center rounded-md border border-border bg-surface-strong px-3 py-2 text-sm font-semibold text-text-primary transition hover:border-primary/40 hover:text-primary"
            href="/admin/lessons"
          >
            Back
          </Link>
        }
        description="Quan ly noi dung lesson va preview truoc khi publish."
        title={lessonId ? "Edit lesson" : "New lesson"}
      />

      <div className="grid gap-3">
        {toast ? <InlineMessage message={toast} tone="success" /> : null}
        {error ? <InlineMessage message={error} tone="error" /> : null}
        {fieldError ? <InlineMessage message={fieldError} tone="error" /> : null}
        {isLoading ? <InlineMessage message="Dang tai lesson..." /> : null}

        <div className="flex w-fit rounded-md border border-border bg-surface-strong p-1">
          <button
            className={`rounded px-3 py-2 text-sm font-semibold ${
              view === "edit" ? "bg-primary text-white" : "text-text-secondary"
            }`}
            onClick={() => setView("edit")}
            type="button"
          >
            Edit
          </button>
          <button
            className={`rounded px-3 py-2 text-sm font-semibold ${
              view === "preview" ? "bg-primary text-white" : "text-text-secondary"
            }`}
            onClick={() => setView("preview")}
            type="button"
          >
            Preview
          </button>
        </div>

        {view === "edit" ? (
          <form className="glass-panel grid gap-4 rounded-lg p-5" onSubmit={handleSubmit}>
            <AdminSelect
              disabled={Boolean(lessonId)}
              label="Course"
              onChange={(event) => updateField("courseId", event.target.value)}
              value={form.courseId}
            >
              {courses.length === 0 ? <option value="">No courses</option> : null}
              {courses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.title}
                </option>
              ))}
            </AdminSelect>
            <AdminInput
              label="Title"
              onChange={(event) => updateField("title", event.target.value)}
              value={form.title}
            />
            <AdminInput
              label="Order"
              min={1}
              onChange={(event) =>
                updateField("order", Number(event.target.value))
              }
              type="number"
              value={form.order}
            />
            <AdminTextarea
              label="Content"
              onChange={(event) => updateField("content", event.target.value)}
              value={form.content}
            />

            <div className="flex flex-wrap gap-2">
              <AdminButton disabled={isSaving} type="submit">
                Save
              </AdminButton>
              <AdminButton
                disabled={isSaving}
                onClick={() => void saveLesson("DRAFT")}
                tone="secondary"
                type="button"
              >
                Save draft
              </AdminButton>
              <AdminButton
                disabled={isSaving}
                onClick={() => void saveLesson("PUBLISHED")}
                tone="primary"
                type="button"
              >
                Publish
              </AdminButton>
            </div>
          </form>
        ) : (
          <section className="glass-panel rounded-lg p-5">
            <div className="flex flex-wrap items-center gap-3">
              <StatusBadge status={lesson?.status ?? "DRAFT"} />
              <span className="text-sm font-semibold text-text-secondary">
                Order {form.order}
              </span>
            </div>
            <h2 className="mt-4 text-3xl font-bold text-text-primary">
              {form.title || "Untitled lesson"}
            </h2>
            <div className="mt-4 whitespace-pre-wrap rounded-lg border border-border bg-surface-strong p-4 text-sm leading-6 text-text-secondary">
              {form.content || "Chua co content."}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
