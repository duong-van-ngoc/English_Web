"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { EmptyState } from "@/components/ui/empty-state";
import { useAuth } from "@/features/auth/hooks/use-auth";
import { api, isApiError } from "@/lib/api";
import type { DashboardSummary } from "@/types";

export default function DashboardPage() {
  const { status, user } = useAuth({ redirectToLogin: true });
  const [dashboard, setDashboard] = useState<DashboardSummary | null>(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadDashboard() {
      try {
        const data = await api.getDashboard();

        if (!isMounted) {
          return;
        }

        setDashboard(data);
        setError("");
      } catch (fetchError) {
        if (!isMounted) {
          return;
        }

        setError(
          isApiError(fetchError)
            ? fetchError.message
            : "Khong the tai dashboard.",
        );
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    if (status === "authenticated") {
      void loadDashboard();
    }

    return () => {
      isMounted = false;
    };
  }, [status]);

  if (status === "loading" || isLoading) {
    return (
      <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="glass-panel-strong rounded-lg p-6 text-text-secondary">
          Dang tai dashboard...
        </div>
      </div>
    );
  }

  if (status === "authenticated" && user?.role !== "ADMIN") {
    return (
      <div className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="glass-panel rounded-lg border-error/40 p-6">
          <p className="text-sm font-semibold uppercase tracking-normal text-error">
            403
          </p>
          <h1 className="mt-3 text-2xl font-bold text-text-primary">
            Ban khong co quyen truy cap trang Dashboard.
          </h1>
        </div>
      </div>
    );
  }

  if (!dashboard) {
    return (
      <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <EmptyState
          title="Chua co dashboard"
          description={error || "Hay dang nhap lai de xem tien do hoc tap."}
        />
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-normal text-primary">
            Learning Dashboard
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-normal text-text-primary sm:text-4xl">
            Xin chao {dashboard.profile.name || dashboard.profile.email}
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-text-secondary">
            Theo doi tien do hoc, TOEIC accuracy va cac muc can on tap.
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            className="rounded-md border border-border bg-surface-strong px-4 py-2 text-sm font-semibold text-text-primary hover:border-primary/40 hover:text-primary"
            href="/stats"
          >
            Stats
          </Link>
          <Link
            className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-hover"
            href="/review"
          >
            Review
          </Link>
        </div>
      </div>

      {error ? (
        <div className="mt-6 rounded-lg border border-error/30 bg-red-50 px-4 py-3 text-sm text-error">
          {error}
        </div>
      ) : null}

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Lessons completed"
          value={`${dashboard.learning.completedLessons}/${dashboard.learning.totalLessons}`}
          helper={`${dashboard.learning.completionRate}% complete`}
        />
        <StatCard
          label="TOEIC accuracy"
          value={`${dashboard.toeic.accuracyRate}%`}
          helper={`${dashboard.toeic.totalQuestionsAnswered} questions answered`}
        />
        <StatCard
          label="Attempts"
          value={dashboard.toeic.totalAttempts}
          helper={`${dashboard.toeic.totalCorrectAnswers} correct answers`}
        />
        <StatCard
          label="Review due"
          value={
            dashboard.review.dueVocabularyCount +
            dashboard.review.wrongQuestionCount
          }
          helper={`${dashboard.review.wrongQuestionCount} wrong questions`}
        />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <section className="glass-panel-strong rounded-lg p-6">
          <h2 className="text-xl font-bold text-text-primary">Weakest part</h2>
          {dashboard.toeic.weakestPart ? (
            <div className="mt-4">
              <p className="text-3xl font-bold text-text-primary">
                Part {dashboard.toeic.weakestPart.part}
              </p>
              <p className="mt-2 text-sm text-text-secondary">
                {dashboard.toeic.weakestPart.title}
              </p>
              <p className="mt-4 text-sm text-text-secondary">
                Wrong rate {dashboard.toeic.weakestPart.wrongRate}% across{" "}
                {dashboard.toeic.weakestPart.answeredQuestions} questions.
              </p>
              <Link
                className="mt-5 inline-flex rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-hover"
                href={`/practice/part/${dashboard.toeic.weakestPart.part}`}
              >
                Practice this part
              </Link>
            </div>
          ) : (
            <p className="mt-4 text-sm leading-6 text-text-secondary">
              Chua du du lieu de xac dinh part yeu. Hay lam it nhat 5 cau TOEIC.
            </p>
          )}
        </section>

        <section className="glass-panel-strong rounded-lg p-6">
          <h2 className="text-xl font-bold text-text-primary">
            Recommended next
          </h2>
          {dashboard.recommendation ? (
            <div className="mt-4">
              <p className="text-2xl font-bold text-text-primary">
                {dashboard.recommendation.title}
              </p>
              <p className="mt-3 text-sm leading-6 text-text-secondary">
                {dashboard.recommendation.reason}
              </p>
              <Link
                className="mt-5 inline-flex rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-hover"
                href={dashboard.recommendation.href}
              >
                Continue
              </Link>
            </div>
          ) : (
            <p className="mt-4 text-sm text-text-secondary">
              Khong co goi y moi luc nay.
            </p>
          )}
        </section>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <QuickLink href="/practice" label="Practice TOEIC" />
        <QuickLink href="/review" label="Review queue" />
        <QuickLink href="/stats" label="Detailed stats" />
      </div>
    </div>
  );
}

function StatCard({
  helper,
  label,
  value,
}: {
  helper: string;
  label: string;
  value: number | string;
}) {
  return (
    <div className="glass-panel-strong rounded-lg p-5">
      <p className="text-sm font-semibold text-text-secondary">{label}</p>
      <p className="mt-2 text-3xl font-bold text-text-primary">{value}</p>
      <p className="mt-2 text-xs text-text-secondary">{helper}</p>
    </div>
  );
}

function QuickLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      className="rounded-lg border border-border bg-surface-strong p-4 text-sm font-bold text-text-primary hover:border-primary/40 hover:text-primary"
      href={href}
    >
      {label}
    </Link>
  );
}
