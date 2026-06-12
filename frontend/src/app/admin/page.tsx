"use client";

import { useEffect, useState } from "react";

import {
  AdminPageTitle,
  InlineMessage,
  StatusBadge,
} from "@/features/admin/components/admin-ui";
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
    <div className="space-y-6">
      <AdminPageTitle
        description="Theo dõi nhanh các nội dung và trạng thái xuất bản."
        title="Dashboard"
      />

      {isLoading ? <InlineMessage message="Đang tải dữ liệu dashboard..." /> : null}
      {error ? <InlineMessage message={error} tone="error" /> : null}

      {summary ? (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Cột trái (Main Content): chiếm 9 cột */}
          <div className="space-y-6 lg:col-span-9">
            {/* Info Banner */}
            <section className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary to-secondary p-6 text-white shadow-md group">
              <div className="relative z-10 flex items-start gap-4">
                <div className="rounded-xl bg-white/20 p-3 backdrop-blur-sm">
                  <span className="material-symbols-outlined text-3xl">info</span>
                </div>
                <div>
                  <h2 className="text-xl font-bold tracking-tight font-sans">
                    Học tập liên tục, không gián đoạn
                  </h2>
                  <p className="mt-1 text-sm text-white/90 leading-relaxed max-w-2xl">
                    Việc thêm từ vựng mới vào các chủ đề hiện tại sẽ không thiết lập lại hoặc ảnh hưởng đến tiến trình học tập của học viên. Người học sẽ thấy các bổ sung mới một cách liền mạch trong chu kỳ ôn tập tiếp theo.
                  </p>
                </div>
              </div>
              <div className="absolute -right-10 -bottom-10 h-48 w-48 rounded-full bg-white/10 blur-3xl group-hover:scale-110 transition-transform duration-700"></div>
            </section>

            {/* Bento Grid Stats */}
            <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
              {/* Stat 1: Total Courses */}
              <div className="glass-card flex flex-col items-center p-6 text-center rounded-2xl transition-all hover:-translate-y-1 hover:border-primary/50">
                <span className="material-symbols-outlined text-primary text-3xl mb-2">school</span>
                <span className="text-3xl font-bold text-primary">{summary.totalCourses}</span>
                <span className="mt-1 text-sm font-semibold text-text-secondary">Khóa học</span>
              </div>

              {/* Stat 2: Total Lessons */}
              <div className="glass-card flex flex-col items-center p-6 text-center rounded-2xl transition-all hover:-translate-y-1 hover:border-primary/50">
                <span className="material-symbols-outlined text-primary text-3xl mb-2">menu_book</span>
                <span className="text-3xl font-bold text-primary">{summary.totalLessons}</span>
                <span className="mt-1 text-sm font-semibold text-text-secondary">Bài học</span>
              </div>

              {/* Stat 3: Total Vocabulary */}
              <div className="glass-card flex flex-col items-center p-6 text-center rounded-2xl transition-all hover:-translate-y-1 hover:border-primary/50">
                <span className="material-symbols-outlined text-primary text-3xl mb-2">translate</span>
                <span className="text-3xl font-bold text-primary">{summary.totalVocabulary}</span>
                <span className="mt-1 text-sm font-semibold text-text-secondary">Từ vựng</span>
              </div>

              {/* Stat 4: Total Questions */}
              <div className="glass-card flex flex-col items-center p-6 text-center rounded-2xl transition-all hover:-translate-y-1 hover:border-primary/50">
                <span className="material-symbols-outlined text-primary text-3xl mb-2">quiz</span>
                <span className="text-3xl font-bold text-primary">{summary.totalQuestions}</span>
                <span className="mt-1 text-sm font-semibold text-text-secondary">Câu hỏi</span>
              </div>

              {/* Stat 5: Draft Count */}
              <div className="glass-card flex flex-col items-center p-6 text-center rounded-2xl transition-all hover:-translate-y-1 hover:border-warning/50">
                <span className="material-symbols-outlined text-warning text-3xl mb-2">edit_note</span>
                <span className="text-3xl font-bold text-warning">{summary.draftCount}</span>
                <span className="mt-1 text-sm font-semibold text-text-secondary">Bản nháp</span>
              </div>

              {/* Stat 6: Published Count */}
              <div className="glass-card flex flex-col items-center p-6 text-center rounded-2xl border-l-4 border-l-success transition-all hover:-translate-y-1 hover:border-success/50">
                <span className="material-symbols-outlined text-success text-3xl mb-2">verified</span>
                <span className="text-3xl font-bold text-success">{summary.publishedCount}</span>
                <span className="mt-1 text-sm font-semibold text-text-secondary">Đã xuất bản</span>
              </div>
            </section>

            {/* Recently Updated Table */}
            <section className="glass-card rounded-2xl overflow-hidden">
              <div className="flex justify-between items-center border-b border-border p-5">
                <h3 className="text-lg font-bold text-text-primary">Nội dung cập nhật gần đây</h3>
                <span className="text-xs text-text-secondary font-semibold">Tự động cập nhật</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[600px] border-collapse text-left text-sm">
                  <thead>
                    <tr className="bg-surface-strong/50 border-b border-border">
                      <th className="px-5 py-3 font-semibold text-text-secondary">Tiêu đề</th>
                      <th className="px-5 py-3 font-semibold text-text-secondary">Loại</th>
                      <th className="px-5 py-3 font-semibold text-text-secondary">Trạng thái</th>
                      <th className="px-5 py-3 font-semibold text-text-secondary">Thời gian cập nhật</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/40">
                    {summary.recentUpdatedContent.length > 0 ? (
                      summary.recentUpdatedContent.map((item) => (
                        <tr className="hover:bg-surface-strong/30 transition-colors" key={`${item.type}-${item.id}`}>
                          <td className="px-5 py-4 font-bold text-text-primary">
                            {item.title}
                          </td>
                          <td className="px-5 py-4 text-text-secondary font-medium">
                            <span className="rounded bg-surface-strong px-2 py-0.5 text-xs text-text-secondary font-semibold uppercase">
                              {item.type}
                            </span>
                          </td>
                          <td className="px-5 py-4">
                            <StatusBadge status={item.status} />
                          </td>
                          <td className="px-5 py-4 text-text-secondary font-medium">
                            {new Date(item.updatedAt).toLocaleString("vi-VN")}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td className="px-5 py-10 text-center text-text-secondary" colSpan={4}>
                          Chưa có nội dung cập nhật.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          </div>

          {/* Cột phải (Sidebar: Insights & Actions): chiếm 3 cột */}
          <aside className="space-y-6 lg:col-span-3">
            {/* Quick Actions */}
            <section className="glass-card rounded-2xl p-5">
              <h3 className="text-base font-bold text-text-primary mb-4 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-primary">bolt</span> Thao tác nhanh
              </h3>
              <div className="flex flex-col gap-2.5">
                <a
                  className="flex items-center gap-3 p-3 bg-primary text-white rounded-xl text-sm font-semibold hover:opacity-95 transition-all hover:translate-x-1"
                  href="/admin/courses"
                >
                  <span className="material-symbols-outlined text-lg">add_circle</span>
                  Quản lý Khóa học
                </a>
                <a
                  className="flex items-center gap-3 p-3 bg-surface border border-primary text-primary rounded-xl text-sm font-semibold hover:bg-primary/5 transition-all hover:translate-x-1"
                  href="/admin/lessons"
                >
                  <span className="material-symbols-outlined text-lg">add_circle</span>
                  Quản lý Bài học
                </a>
                <a
                  className="flex items-center gap-3 p-3 bg-surface border border-primary text-primary rounded-xl text-sm font-semibold hover:bg-primary/5 transition-all hover:translate-x-1"
                  href="/admin/questions"
                >
                  <span className="material-symbols-outlined text-lg">add_circle</span>
                  Quản lý Câu hỏi
                </a>
                <a
                  className="flex items-center gap-3 p-3 bg-surface border border-primary text-primary rounded-xl text-sm font-semibold hover:bg-primary/5 transition-all hover:translate-x-1"
                  href="/admin/vocabulary"
                >
                  <span className="material-symbols-outlined text-lg">translate</span>
                  Quản lý Từ vựng
                </a>
              </div>
            </section>

            {/* Content Insights */}
            <section className="glass-card rounded-2xl p-5 bg-gradient-to-br from-white/70 to-surface-strong/20">
              <h3 className="text-base font-bold text-text-primary mb-4 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-primary">analytics</span> Chỉ số nội dung
              </h3>
              <div className="space-y-4">
                {/* Media Completion indicator */}
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-xs font-bold text-text-secondary">Mức độ xuất bản</span>
                    <span className="text-sm font-bold text-primary">
                      {summary.totalVocabulary > 0
                        ? Math.round((summary.publishedCount / (summary.draftCount + summary.publishedCount || 1)) * 100)
                        : 0}%
                    </span>
                  </div>
                  <div className="w-full h-2.5 bg-surface-strong rounded-full overflow-hidden border border-border">
                    <div
                      className="h-full bg-primary rounded-full transition-all duration-500"
                      style={{
                        width: `${
                          summary.totalVocabulary > 0
                            ? Math.round((summary.publishedCount / (summary.draftCount + summary.publishedCount || 1)) * 100)
                            : 0
                        }%`,
                      }}
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3.5 p-1">
                  <div className="w-10 h-10 rounded-full bg-warning/10 flex items-center justify-center text-warning border border-warning/20">
                    <span className="material-symbols-outlined">pending_actions</span>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-text-primary leading-none">
                      {summary.draftCount}
                    </p>
                    <p className="text-[10px] font-bold text-text-secondary uppercase tracking-wider mt-1">
                      Chờ xuất bản
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3.5 p-1">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                    <span className="material-symbols-outlined">verified</span>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-text-primary leading-none">
                      {summary.publishedCount}
                    </p>
                    <p className="text-[10px] font-bold text-text-secondary uppercase tracking-wider mt-1">
                      Đã công khai
                    </p>
                  </div>
                </div>
              </div>
            </section>
          </aside>
        </div>
      ) : null}
    </div>
  );
}
