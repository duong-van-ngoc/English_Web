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
import type { ContentStatus, Course } from "@/types";

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [deleteTarget, setDeleteTarget] = useState<Course | null>(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isMutating, setIsMutating] = useState(false);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<ContentStatus | "">("");
  const [toast, setToast] = useState("");

  const filters = useMemo(() => ({ search, status }), [search, status]);

  const loadCourses = useCallback(async () => {
    await Promise.resolve();
    setIsLoading(true);

    try {
      const data = await api.getAdminCourses(filters);

      setCourses(data);
      setError("");
    } catch (loadError) {
      setError(
        isApiError(loadError) ? loadError.message : "Khong tai duoc courses.",
      );
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadCourses();
    }, 0);

    return () => window.clearTimeout(timer);
  }, [loadCourses]);

  async function updateStatus(course: Course) {
    const nextStatus = course.status === "PUBLISHED" ? "DRAFT" : "PUBLISHED";

    setIsMutating(true);
    setToast("");

    try {
      await api.updateCourseStatus(course.id, nextStatus);
      await loadCourses();
      setToast(`${course.title} da cap nhat sang ${nextStatus}.`);
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

  async function deleteCourse() {
    if (!deleteTarget) {
      return;
    }

    setIsMutating(true);
    setToast("");

    try {
      await api.deleteCourse(deleteTarget.id);
      setDeleteTarget(null);
      await loadCourses();
      setToast(`${deleteTarget.title} da duoc xoa.`);
    } catch (deleteError) {
      setError(
        isApiError(deleteError) ? deleteError.message : "Khong xoa duoc course.",
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
            href="/admin/courses/new"
          >
            New course
          </Link>
        }
        description="Quan ly course, publish va an course khoi public API."
        title="Courses"
      />

      <div className="grid gap-3">
        {toast ? <InlineMessage message={toast} tone="success" /> : null}
        {error ? <InlineMessage message={error} tone="error" /> : null}

        <section className="glass-panel rounded-lg p-4">
          <div className="grid gap-3 md:grid-cols-[1fr_220px_auto] md:items-end">
            <AdminInput
              label="Search"
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Title, slug, description"
              type="search"
              value={search}
            />
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
            <AdminButton onClick={loadCourses} type="button">
              Refresh
            </AdminButton>
          </div>
        </section>

        {deleteTarget ? (
          <ConfirmPanel
            message={`Ban co chac muon xoa course "${deleteTarget.title}" nay?`}
            onCancel={() => setDeleteTarget(null)}
            onConfirm={deleteCourse}
            pending={isMutating}
          />
        ) : null}

        <section className="glass-panel rounded-lg p-4">
          {isLoading ? <InlineMessage message="Dang tai courses..." /> : null}
          {!isLoading && courses.length === 0 ? (
            <InlineMessage message="Chua co course phu hop." />
          ) : null}

          {courses.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] border-separate border-spacing-y-2 text-left text-sm">
                <thead className="text-xs uppercase tracking-normal text-text-secondary">
                  <tr>
                    <th className="px-3 py-2">Course</th>
                    <th className="px-3 py-2">Level</th>
                    <th className="px-3 py-2">Lessons</th>
                    <th className="px-3 py-2">Status</th>
                    <th className="px-3 py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {courses.map((course) => (
                    <tr className="bg-surface-strong" key={course.id}>
                      <td className="rounded-l-md px-3 py-3">
                        <p className="font-semibold text-text-primary">
                          {course.title}
                        </p>
                        <p className="text-xs text-text-secondary">
                          {course.slug}
                        </p>
                      </td>
                      <td className="px-3 py-3 text-text-secondary">
                        {course.level}
                      </td>
                      <td className="px-3 py-3 text-text-secondary">
                        {course.lessons?.length ?? 0}
                      </td>
                      <td className="px-3 py-3">
                        <StatusBadge status={course.status} />
                      </td>
                      <td className="rounded-r-md px-3 py-3">
                        <div className="flex flex-wrap gap-2">
                          <Link
                            className="rounded-md border border-border bg-surface px-3 py-2 text-xs font-semibold text-text-primary hover:border-primary/40 hover:text-primary"
                            href={`/admin/courses/${course.id}/edit`}
                          >
                            Edit
                          </Link>
                          <AdminButton
                            disabled={isMutating}
                            onClick={() => void updateStatus(course)}
                            tone="secondary"
                            type="button"
                          >
                            {course.status === "PUBLISHED" ? "Unpublish" : "Publish"}
                          </AdminButton>
                          <AdminButton
                            disabled={isMutating}
                            onClick={() => setDeleteTarget(course)}
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
