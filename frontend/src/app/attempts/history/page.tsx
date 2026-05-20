"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { EmptyState } from "@/components/empty-state";
import { useAuth } from "@/hooks/use-auth";
import { api, isApiError } from "@/lib/api";
import type { ToeicAttemptHistoryItem } from "@/types";

export default function ToeicAttemptHistoryPage() {
  const { status } = useAuth({ redirectToLogin: true });
  const [history, setHistory] = useState<ToeicAttemptHistoryItem[]>([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadHistory() {
      try {
        const data = await api.getToeicAttemptHistory();

        if (!isMounted) {
          return;
        }

        setHistory(data);
        setError("");
      } catch (fetchError) {
        if (!isMounted) {
          return;
        }

        setError(
          isApiError(fetchError)
            ? fetchError.message
            : "Không thể tải lịch sử luyện tập.",
        );
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    if (status === "authenticated") {
      void loadHistory();
    }

    return () => {
      isMounted = false;
    };
  }, [status]);

  if (status === "loading" || isLoading) {
    return (
      <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="glass-panel-strong rounded-lg p-6 text-text-secondary">
          Đang tải lịch sử...
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-normal text-primary">
            TOEIC History
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-normal text-text-primary">
            Lịch sử luyện tập
          </h1>
        </div>
        <Link
          className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-hover"
          href="/practice"
        >
          Luyện TOEIC
        </Link>
      </div>

      {error ? (
        <div className="mt-6 rounded-lg border border-error/30 bg-red-50 px-4 py-3 text-sm text-error">
          {error}
        </div>
      ) : null}

      <div className="mt-8">
        {history.length > 0 ? (
          <div className="overflow-hidden rounded-lg border border-border bg-surface-strong">
            <div className="grid grid-cols-6 gap-3 border-b border-border px-4 py-3 text-xs font-bold uppercase tracking-normal text-text-secondary">
              <span className="col-span-2">Bài luyện</span>
              <span>Part</span>
              <span>Điểm</span>
              <span>Kết quả</span>
              <span></span>
            </div>
            {history.map((item) => (
              <div
                className="grid grid-cols-1 gap-3 border-b border-border px-4 py-4 text-sm last:border-b-0 sm:grid-cols-6 sm:items-center"
                key={item.id}
              >
                <div className="sm:col-span-2">
                  <p className="font-semibold text-text-primary">
                    {item.questionSet.title}
                  </p>
                  <p className="mt-1 text-xs text-text-secondary">
                    {item.submittedAt
                      ? new Date(item.submittedAt).toLocaleString("vi-VN")
                      : "Chưa có thời gian nộp"}
                  </p>
                </div>
                <span>Part {item.questionSet.part}</span>
                <span className="font-bold text-text-primary">{item.score}</span>
                <span>
                  {item.correctAnswers}/{item.totalQuestions} đúng
                </span>
                <Link
                  className="w-fit rounded-md border border-border px-3 py-2 text-sm font-semibold text-primary hover:border-primary/40"
                  href={`/attempts/${item.id}/result`}
                >
                  Xem lại
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            title="Chưa có lịch sử"
            description="Sau khi nộp bài TOEIC, kết quả sẽ xuất hiện ở đây."
          />
        )}
      </div>
    </div>
  );
}
