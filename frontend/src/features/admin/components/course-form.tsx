"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";

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
import type { Course, CoursePayload } from "@/types";

const courseLevels = ["beginner", "elementary", "toeic-foundation"];

type CourseFormState = CoursePayload;

const emptyForm: CourseFormState = {
  title: "",
  slug: "",
  level: "beginner",
  description: "",
};

export function CourseForm({ courseId }: { courseId?: string }) {
  const router = useRouter();
  const [course, setCourse] = useState<Course | null>(null);
  const [error, setError] = useState("");
  const [fieldError, setFieldError] = useState("");
  const [form, setForm] = useState<CourseFormState>(emptyForm);
  const [isLoading, setIsLoading] = useState(Boolean(courseId));
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState("");
  const [view, setView] = useState<"edit" | "preview">("edit");

  useEffect(() => {
    const targetCourseId = courseId;

    if (!targetCourseId) {
      return;
    }

    let isMounted = true;

    async function loadCourse(id: string) {
      try {
        const data = await api.getAdminCourse(id);

        if (!isMounted) {
          return;
        }

        setCourse(data);
        setForm({
          title: data.title,
          slug: data.slug,
          level: data.level,
          description: data.description ?? "",
        });
      } catch (loadError) {
        if (isMounted) {
          setError(
            isApiError(loadError) ? loadError.message : "Khong tai duoc course.",
          );
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    void loadCourse(targetCourseId);

    return () => {
      isMounted = false;
    };
  }, [courseId]);

  function updateField(field: keyof CourseFormState, value: string) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function validate() {
    if (!form.title.trim()) {
      return "Title bat buoc.";
    }

    if (!form.level.trim()) {
      return "Level bat buoc.";
    }

    return "";
  }

  function payload(): CoursePayload {
    return {
      title: form.title.trim(),
      slug: form.slug?.trim() || undefined,
      level: form.level,
      description: form.description?.trim() || undefined,
    };
  }

  async function saveCourse(nextStatus?: "DRAFT" | "PUBLISHED") {
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
      const savedCourse = courseId
        ? await api.updateCourse(courseId, payload())
        : await api.createCourse(payload());

      let finalCourse = savedCourse;

      if (nextStatus) {
        finalCourse = await api.updateCourseStatus(savedCourse.id, nextStatus);
      }

      setCourse(finalCourse);
      setToast(
        nextStatus
          ? `Course da luu va cap nhat sang ${nextStatus}.`
          : "Course da duoc luu.",
      );

      if (!courseId) {
        router.replace(`/admin/courses/${savedCourse.id}/edit`);
      }
    } catch (saveError) {
      setError(isApiError(saveError) ? saveError.message : "Khong luu duoc course.");
    } finally {
      setIsSaving(false);
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void saveCourse();
  }

  return (
    <div>
      <AdminPageTitle
        action={
          <div className="flex gap-2">
            {courseId ? (
              <Link
                className="inline-flex min-h-10 items-center justify-center rounded-md border border-primary bg-primary text-white px-3.5 py-2 text-sm font-semibold transition hover:bg-hover"
                href={`/admin/courses/${courseId}/modules`}
              >
                Quản lý Modules
              </Link>
            ) : null}
            <Link
              className="inline-flex min-h-10 items-center justify-center rounded-md border border-border bg-surface-strong px-3 py-2 text-sm font-semibold text-text-primary transition hover:border-primary/40 hover:text-primary"
              href="/admin/courses"
            >
              Back
            </Link>
          </div>
        }
        description="Luu draft, publish va preview course truoc khi hoc vien thay."
        title={courseId ? "Edit course" : "New course"}
      />

      <div className="grid gap-3">
        {toast ? <InlineMessage message={toast} tone="success" /> : null}
        {error ? <InlineMessage message={error} tone="error" /> : null}
        {fieldError ? <InlineMessage message={fieldError} tone="error" /> : null}
        {isLoading ? <InlineMessage message="Dang tai course..." /> : null}

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
            <AdminInput
              label="Title"
              onChange={(event) => updateField("title", event.target.value)}
              value={form.title}
            />
            <AdminInput
              label="Slug"
              onChange={(event) => updateField("slug", event.target.value)}
              placeholder="Auto generate neu de trong"
              value={form.slug}
            />
            <AdminSelect
              label="Level"
              onChange={(event) => updateField("level", event.target.value)}
              value={form.level}
            >
              {courseLevels.map((level) => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </AdminSelect>
            <AdminTextarea
              label="Description"
              onChange={(event) => updateField("description", event.target.value)}
              value={form.description}
            />

            <div className="flex flex-wrap gap-2">
              <AdminButton disabled={isSaving} type="submit">
                Save
              </AdminButton>
              <AdminButton
                disabled={isSaving}
                onClick={() => void saveCourse("DRAFT")}
                tone="secondary"
                type="button"
              >
                Save draft
              </AdminButton>
              <AdminButton
                disabled={isSaving}
                onClick={() => void saveCourse("PUBLISHED")}
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
              <StatusBadge status={course?.status ?? "DRAFT"} />
              <span className="text-sm font-semibold text-text-secondary">
                {form.level}
              </span>
            </div>
            <h2 className="mt-4 text-3xl font-bold text-text-primary">
              {form.title || "Untitled course"}
            </h2>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-text-secondary">
              {form.description || "Chua co description."}
            </p>
            <div className="mt-5 rounded-lg border border-border bg-surface-strong p-4">
              <p className="text-sm font-semibold text-text-primary">
                Lessons
              </p>
              <p className="mt-1 text-sm text-text-secondary">
                {course?.lessons?.length ?? 0} lessons trong course nay.
              </p>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
