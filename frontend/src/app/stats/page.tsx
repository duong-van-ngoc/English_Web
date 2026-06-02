"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { EmptyState } from "@/components/empty-state";
import { useAuth } from "@/hooks/use-auth";
import { api, isApiError } from "@/lib/api";
import type { StatsSummary } from "@/types";

export default function StatsPage() {
  const { status } = useAuth({ redirectToLogin: true });
  const [stats, setStats] = useState<StatsSummary | null>(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadStats() {
      try {
        const data = await api.getStats();

        if (!isMounted) {
          return;
        }

        setStats(data);
        setError("");
      } catch (fetchError) {
        if (!isMounted) {
          return;
        }

        setError(
          isApiError(fetchError) ? fetchError.message : "Khong the tai stats.",
        );
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    if (status === "authenticated") {
      void loadStats();
    }

    return () => {
      isMounted = false;
    };
  }, [status]);

  if (status === "loading" || isLoading) {
    return (
      <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="glass-panel-strong rounded-lg p-6 text-text-secondary">
          Dang tai thong ke...
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-normal text-primary">
            TOEIC Stats
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-normal text-text-primary">
            Thong ke luyen tap
          </h1>
        </div>
        <Link
          className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-hover"
          href="/dashboard"
        >
          Dashboard
        </Link>
      </div>

      {error ? (
        <div className="mt-6 rounded-lg border border-error/30 bg-red-50 px-4 py-3 text-sm text-error">
          {error}
        </div>
      ) : null}

      {!stats || stats.byPart.length === 0 ? (
        <div className="mt-8">
          <EmptyState
            title="Chua co thong ke"
            description="Hay nop mot bai TOEIC de xem accuracy theo part."
          />
        </div>
      ) : (
        <>
          <section className="mt-8 overflow-hidden rounded-lg border border-border bg-surface-strong">
            <div className="grid grid-cols-6 gap-3 border-b border-border px-4 py-3 text-xs font-bold uppercase tracking-normal text-text-secondary">
              <span className="col-span-2">Part</span>
              <span>Attempts</span>
              <span>Questions</span>
              <span>Accuracy</span>
              <span>Last</span>
            </div>
            {stats.byPart.map((part) => (
              <div
                className="grid grid-cols-1 gap-3 border-b border-border px-4 py-4 text-sm last:border-b-0 sm:grid-cols-6 sm:items-center"
                key={part.part}
              >
                <div className="sm:col-span-2">
                  <p className="font-semibold text-text-primary">
                    Part {part.part}
                  </p>
                  <p className="mt-1 text-xs text-text-secondary">
                    {part.title}
                  </p>
                </div>
                <span>{part.attempts}</span>
                <span>{part.answeredQuestions}</span>
                <div>
                  <div className="h-2 overflow-hidden rounded-full bg-border">
                    <div
                      className="h-full rounded-full bg-primary"
                      style={{ width: `${part.accuracyRate}%` }}
                    />
                  </div>
                  <span className="mt-1 block text-xs font-semibold text-text-primary">
                    {part.accuracyRate}%
                  </span>
                </div>
                <span className="text-xs text-text-secondary">
                  {part.lastSubmittedAt
                    ? new Date(part.lastSubmittedAt).toLocaleDateString("vi-VN")
                    : "-"}
                </span>
              </div>
            ))}
          </section>

          <section className="mt-8">
            <h2 className="text-xl font-bold text-text-primary">
              Recent attempts
            </h2>
            <div className="mt-4 grid gap-3">
              {stats.recentAttempts.map((attempt) => (
                <Link
                  className="rounded-lg border border-border bg-surface-strong p-4 text-sm hover:border-primary/40"
                  href={`/attempts/${attempt.attemptId}/result`}
                  key={attempt.attemptId}
                >
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="font-bold text-text-primary">
                        {attempt.questionSetTitle}
                      </p>
                      <p className="mt-1 text-xs text-text-secondary">
                        Part {attempt.part} - {attempt.correctAnswers}/
                        {attempt.correctAnswers + attempt.wrongAnswers} correct
                      </p>
                    </div>
                    <span className="text-lg font-bold text-primary">
                      {attempt.score}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  );
}
