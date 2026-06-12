"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";

import {
  AdminButton,
  AdminInput,
  AdminPageTitle,
  AdminSelect,
  ConfirmPanel,
  InlineMessage,
  StatusBadge,
} from "@/features/admin/components/admin-ui";
import { api, isApiError } from "@/lib/api";
import type { ContentStatus, Course, Lesson } from "@/types";

export default function AdminLessonsPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [courseId, setCourseId] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<Lesson | null>(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isMutating, setIsMutating] = useState(false);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<ContentStatus | "">("");
  const [toast, setToast] = useState("");

  const filters = useMemo(
    () => ({ courseId, search, status }),
    [courseId, search, status],
  );

  const loadLessons = useCallback(async () => {
    await Promise.resolve();
    setIsLoading(true);

    try {
      const [lessonData, courseData] = await Promise.all([
        api.getAdminLessons(filters),
        api.getAdminCourses(),
      ]);

      setLessons(lessonData);
      setCourses(courseData);
      setError("");
    } catch (loadError) {
      setError(
        isApiError(loadError) ? loadError.message : "Khong tai duoc lessons.",
      );
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadLessons();
    }, 0);

    return () => window.clearTimeout(timer);
  }, [loadLessons]);

  async function updateStatus(lesson: Lesson) {
    const nextStatus = lesson.status === "PUBLISHED" ? "DRAFT" : "PUBLISHED";

    setIsMutating(true);
    setToast("");

    try {
      await api.updateLessonStatus(lesson.id, nextStatus);
      await loadLessons();
      setToast(`${lesson.title} da cap nhat sang ${nextStatus}.`);
    } catch (statusError) {
      setError(
        isApiError(statusError)
          ? statusError.message
          : "Khong cap nhat duoc status.",
      );
    } finally {
      setIsMutating(false);
    }
  }

  async function deleteLesson() {
    if (!deleteTarget) {
      return;
    }

    setIsMutating(true);
    setToast("");

    try {
      await api.deleteLesson(deleteTarget.id);
      setDeleteTarget(null);
      await loadLessons();
      setToast(`${deleteTarget.title} da duoc xoa.`);
    } catch (deleteError) {
      setError(
        isApiError(deleteError) ? deleteError.message : "Khong xoa duoc lesson.",
      );
    } finally {
      setIsMutating(false);
    }
  }

  return (
    <div>
      <AdminPageTitle
        action={
          <Link
            className="inline-flex min-h-10 items-center justify-center rounded-md border border-primary bg-primary px-3 py-2 text-sm font-semibold text-white transition hover:bg-hover"
            href="/admin/lessons/new"
          >
            New lesson
          </Link>
        }
        description="Quan ly lesson va status publish cho hoc vien."
        title="Lessons"
      />

      <div className="grid gap-3">
        {toast ? <InlineMessage message={toast} tone="success" /> : null}
        {error ? <InlineMessage message={error} tone="error" /> : null}

        <section className="glass-panel rounded-lg p-4">
          <div className="grid gap-3 md:grid-cols-[1fr_220px_220px_auto] md:items-end">
            <AdminInput
              label="Search"
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Title or content"
              type="search"
              value={search}
            />
            <AdminSelect
              label="Course"
              onChange={(event) => setCourseId(event.target.value)}
              value={courseId}
            >
              <option value="">All</option>
              {courses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.title}
                </option>
              ))}
            </AdminSelect>
            <AdminSelect
              label="Status"
              onChange={(event) =>
                setStatus(event.target.value as ContentStatus | "")
              }
              value={status}
            >
              <option value="">All</option>
              <option value="DRAFT">DRAFT</option>
              <option value="PUBLISHED">PUBLISHED</option>
            </AdminSelect>
            <AdminButton onClick={loadLessons} type="button">
              Refresh
            </AdminButton>
          </div>
        </section>

        {deleteTarget ? (
          <ConfirmPanel
            message={`Ban co chac muon xoa lesson "${deleteTarget.title}" nay?`}
            onCancel={() => setDeleteTarget(null)}
            onConfirm={deleteLesson}
            pending={isMutating}
          />
        ) : null}

        <section className="glass-panel rounded-lg p-4">
          {isLoading ? <InlineMessage message="Dang tai lessons..." /> : null}
          {!isLoading && lessons.length === 0 ? (
            <InlineMessage message="Chua co lesson phu hop." />
          ) : null}

          {lessons.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[860px] border-separate border-spacing-y-2 text-left text-sm">
                <thead className="text-xs uppercase tracking-normal text-text-secondary">
                  <tr>
                    <th className="px-3 py-2">Lesson</th>
                    <th className="px-3 py-2">Course</th>
                    <th className="px-3 py-2">Order</th>
                    <th className="px-3 py-2">Status</th>
                    <th className="px-3 py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {lessons.map((lesson) => (
                    <tr className="bg-surface-strong" key={lesson.id}>
                      <td className="rounded-l-md px-3 py-3 font-semibold text-text-primary">
                        {lesson.title}
                      </td>
                      <td className="px-3 py-3 text-text-secondary">
                        {lesson.course?.title ?? lesson.courseId}
                      </td>
                      <td className="px-3 py-3 text-text-secondary">
                        {lesson.order}
                      </td>
                      <td className="px-3 py-3">
                        <StatusBadge status={lesson.status} />
                      </td>
                      <td className="rounded-r-md px-3 py-3">
                        <div className="flex flex-wrap gap-2">
                          <Link
                            className="rounded-md border border-border bg-surface px-3 py-2 text-xs font-semibold text-text-primary hover:border-primary/40 hover:text-primary"
                            href={`/admin/lessons/${lesson.id}`}
                          >
                            Edit
                          </Link>
                          <AdminButton
                            disabled={isMutating}
                            onClick={() => void updateStatus(lesson)}
                            tone="secondary"
                            type="button"
                          >
                            {lesson.status === "PUBLISHED" ? "Unpublish" : "Publish"}
                          </AdminButton>
                          <AdminButton
                            disabled={isMutating}
                            onClick={() => setDeleteTarget(lesson)}
                            tone="danger"
                            type="button"
                          >
                            Delete
                          </AdminButton>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : null}
        </section>
      </div>
    </div>
  );
}
