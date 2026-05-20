"use client";

import { useEffect, useState } from "react";

import {
  AdminPageTitle,
  InlineMessage,
  StatusBadge,
} from "@/components/admin/admin-ui";
import { api, isApiError } from "@/lib/api";
import type { AdminSummary } from "@/types";

const statLabels = [
  ["totalCourses", "Courses"],
  ["totalLessons", "Lessons"],
  ["totalVocabulary", "Vocabulary"],
  ["totalQuestions", "Questions"],
  ["draftCount", "Draft"],
  ["publishedCount", "Published"],
] as const;

export default function AdminDashboardPage() {
  const [summary, setSummary] = useState<AdminSummary | null>(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadSummary() {
      try {
        const data = await api.getAdminSummary();

        if (isMounted) {
          setSummary(data);
          setError("");
        }
      } catch (loadError) {
        if (isMounted) {
          setError(
            isApiError(loadError)
              ? loadError.message
              : "Khong tai duoc admin summary.",
          );
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    void loadSummary();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div>
      <AdminPageTitle
        description="Theo doi nhanh content va trang thai publish."
        title="Dashboard"
      />

      {isLoading ? <InlineMessage message="Dang tai dashboard..." /> : null}
      {error ? <InlineMessage message={error} tone="error" /> : null}

      {summary ? (
        <div className="grid gap-4">
          <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {statLabels.map(([key, label]) => (
              <div className="glass-panel rounded-lg p-5" key={key}>
                <p className="text-sm font-semibold text-text-secondary">
                  {label}
                </p>
                <p className="mt-3 text-3xl font-bold text-text-primary">
                  {summary[key]}
                </p>
              </div>
            ))}
          </section>

          <section className="glass-panel rounded-lg p-5">
            <h2 className="text-lg font-bold text-text-primary">
              Recent updated content
            </h2>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full min-w-[640px] border-separate border-spacing-y-2 text-left text-sm">
                <thead className="text-xs uppercase tracking-normal text-text-secondary">
                  <tr>
                    <th className="px-3 py-2">Title</th>
                    <th className="px-3 py-2">Type</th>
                    <th className="px-3 py-2">Status</th>
                    <th className="px-3 py-2">Updated</th>
                  </tr>
                </thead>
                <tbody>
                  {summary.recentUpdatedContent.length > 0 ? (
                    summary.recentUpdatedContent.map((item) => (
                      <tr className="bg-surface-strong" key={`${item.type}-${item.id}`}>
                        <td className="rounded-l-md px-3 py-3 font-semibold text-text-primary">
                          {item.title}
                        </td>
                        <td className="px-3 py-3 text-text-secondary">
                          {item.type}
                        </td>
                        <td className="px-3 py-3">
                          <StatusBadge status={item.status} />
                        </td>
                        <td className="rounded-r-md px-3 py-3 text-text-secondary">
                          {new Date(item.updatedAt).toLocaleString()}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        className="rounded-md bg-surface-strong px-3 py-5 text-center text-text-secondary"
                        colSpan={4}
                      >
                        Chua co content.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      ) : null}
    </div>
  );
}
