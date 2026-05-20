"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { useAuth } from "@/hooks/use-auth";
import { api, isApiError } from "@/lib/api";
import type { ToeicAttemptResult } from "@/types";

export default function ToeicAttemptResultPage() {
  const params = useParams<{ attemptId: string }>();
  const { status } = useAuth({ redirectToLogin: true });
  const [result, setResult] = useState<ToeicAttemptResult | null>(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const questionNumberById = useMemo(() => {
    if (!result) {
      return new Map<string, number>();
    }

    return new Map(
      result.groups
        .flatMap((group) => group.questions)
        .map((question, index) => [question.id, index + 1]),
    );
  }, [result]);

  useEffect(() => {
    let isMounted = true;

    async function loadResult() {
      try {
        const data = await api.getToeicAttemptResult(params.attemptId);

        if (!isMounted) {
          return;
        }

        setResult(data);
        setError("");
      } catch (fetchError) {
        if (!isMounted) {
          return;
        }

        setError(
          isApiError(fetchError)
            ? fetchError.message
            : "Không thể tải kết quả TOEIC.",
        );
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    if (status === "authenticated") {
      void loadResult();
    }

    return () => {
      isMounted = false;
    };
  }, [params.attemptId, status]);

  if (status === "loading" || isLoading) {
    return (
      <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="glass-panel-strong rounded-lg p-6 text-text-secondary">
          Đang tải kết quả...
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="rounded-lg border border-error/30 bg-red-50 px-4 py-3 text-sm text-error">
          {error || "Không tìm thấy kết quả."}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-normal text-primary">
            TOEIC Part {result.part}
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-normal text-text-primary">
            {result.questionSetTitle}
          </h1>
        </div>
        <div className="flex gap-2">
          <Link
            className="rounded-md border border-border bg-surface-strong px-4 py-2 text-sm font-semibold text-text-primary hover:border-primary/40 hover:text-primary"
            href="/attempts/history"
          >
            Lịch sử
          </Link>
          <Link
            className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-hover"
            href="/practice"
          >
            Luyện tiếp
          </Link>
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-4">
        <StatCard label="Điểm" value={result.score} />
        <StatCard label="Đúng" value={result.correctAnswers} />
        <StatCard label="Sai" value={result.wrongAnswers} />
        <StatCard label="Tổng câu" value={result.totalQuestions} />
      </div>

      <div className="mt-8 space-y-6">
        {result.groups.map((group) => (
          <section className="glass-panel-strong rounded-lg p-5" key={group.id}>
            {group.title ? (
              <h2 className="text-lg font-bold text-text-primary">
                {group.title}
              </h2>
            ) : null}
            {group.transcript ? (
              <div className="mt-4 whitespace-pre-line rounded-lg border border-border bg-white/70 p-4 text-sm leading-7 text-text-secondary">
                {group.transcript}
              </div>
            ) : null}
            {group.passageContent ? (
              <div className="mt-4 whitespace-pre-line rounded-lg border border-border bg-white/70 p-4 text-sm leading-7 text-text-primary">
                {group.passageContent}
              </div>
            ) : null}

            <div className="mt-5 space-y-5">
              {group.questions.map((question) => (
                <article
                  className="rounded-lg border border-border bg-white/70 p-4"
                  key={question.id}
                >
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <h3 className="text-base font-semibold text-text-primary">
                      {questionNumberById.get(question.id)}. {question.content}
                    </h3>
                    <span
                      className={`w-fit rounded-md px-3 py-1 text-xs font-bold ${
                        question.userAnswer?.isCorrect
                          ? "bg-emerald-100 text-success"
                          : "bg-red-100 text-error"
                      }`}
                    >
                      {question.userAnswer?.isCorrect ? "Đúng" : "Sai"}
                    </span>
                  </div>

                  <div className="mt-4 grid gap-3">
                    {question.choices.map((choice) => {
                      const selected =
                        question.userAnswer?.selectedChoiceId === choice.id;

                      return (
                        <div
                          className={`rounded-md border px-4 py-3 text-sm ${
                            choice.isCorrect
                              ? "border-success/40 bg-emerald-50"
                              : selected
                                ? "border-error/40 bg-red-50"
                                : "border-border bg-surface"
                          }`}
                          key={choice.id}
                        >
                          <span className="font-semibold text-text-primary">
                            {choice.label}.
                          </span>{" "}
                          {choice.content}
                          {selected ? (
                            <span className="ml-2 text-xs font-semibold text-text-secondary">
                              Bạn chọn
                            </span>
                          ) : null}
                        </div>
                      );
                    })}
                  </div>

                  {question.explanation ? (
                    <div className="mt-4 rounded-md border border-border bg-surface-strong p-4 text-sm leading-6 text-text-secondary">
                      <span className="font-semibold text-text-primary">
                        Giải thích:
                      </span>{" "}
                      {question.explanation}
                    </div>
                  ) : null}
                </article>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="glass-panel-strong rounded-lg p-5">
      <p className="text-sm font-semibold text-text-secondary">{label}</p>
      <p className="mt-2 text-3xl font-bold text-text-primary">{value}</p>
    </div>
  );
}
