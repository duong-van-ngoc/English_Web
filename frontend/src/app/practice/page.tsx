"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { EmptyState } from "@/components/ui/empty-state";
import { useAuth } from "@/features/auth/hooks/use-auth";
import { api, isApiError } from "@/lib/api";
import type { ToeicPart } from "@/types";

export default function PracticePage() {
  const { status } = useAuth({ redirectToLogin: true });
  const [parts, setParts] = useState<ToeicPart[]>([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadParts() {
      try {
        const data = await api.getToeicParts();

        if (!isMounted) {
          return;
        }

        setParts(data);
        setError("");
      } catch (fetchError) {
        if (!isMounted) {
          return;
        }

        setError(
          isApiError(fetchError)
            ? fetchError.message
            : "Không thể tải danh sách TOEIC parts.",
        );
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    if (status === "authenticated") {
      void loadParts();
    }

    return () => {
      isMounted = false;
    };
  }, [status]);

  if (status === "loading" || isLoading) {
    return (
      <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="glass-panel-strong rounded-lg p-6 text-text-secondary">
          Đang tải TOEIC Practice Engine...
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-normal text-primary">
            TOEIC Practice
          </p>
          <h1 className="mt-3 text-3xl font-bold tracking-normal text-text-primary sm:text-4xl">
            Chọn part để luyện tập
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-text-secondary">
            Làm bài luyện theo từng part, nộp bài để xem điểm, đáp án đúng và
            giải thích.
          </p>
        </div>

        <Link
          className="inline-flex items-center justify-center rounded-md border border-border bg-surface-strong px-4 py-2 text-sm font-semibold text-text-primary hover:border-primary/40 hover:text-primary"
          href="/attempts/history"
        >
          Lịch sử luyện tập
        </Link>
      </div>

      {error ? (
        <div className="mt-8 rounded-lg border border-error/30 bg-red-50 px-4 py-3 text-sm text-error">
          {error}
        </div>
      ) : null}

      <div className="mt-8">
        {parts.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {parts.map((part) => (
              <Link
                className="glass-panel-strong rounded-lg p-5 transition hover:-translate-y-0.5 hover:border-primary/40"
                href={`/practice/part/${part.part}`}
                key={part.part}
              >
                <span className="text-sm font-semibold text-primary">
                  Part {part.part}
                </span>
                <h2 className="mt-3 text-xl font-bold text-text-primary">
                  {part.title}
                </h2>
                <p className="mt-3 text-sm leading-6 text-text-secondary">
                  {part.description}
                </p>
                <span className="mt-5 inline-flex rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white">
                  Start Practice
                </span>
              </Link>
            ))}
          </div>
        ) : (
          <EmptyState
            title="Chưa có part luyện tập"
            description="Backend chưa trả về dữ liệu TOEIC parts."
          />
        )}
      </div>
    </div>
  );
}
