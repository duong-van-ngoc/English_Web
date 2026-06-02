"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

import { EmptyState } from "@/components/empty-state";
import { useAuth } from "@/hooks/use-auth";
import { api, isApiError } from "@/lib/api";
import type { ReviewQueue } from "@/types";

type ReviewTab = "vocabulary" | "toeic";

export default function ReviewPage() {
  const { status } = useAuth({ redirectToLogin: true });
  const [queue, setQueue] = useState<ReviewQueue | null>(null);
  const [activeTab, setActiveTab] = useState<ReviewTab>("vocabulary");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [pendingId, setPendingId] = useState("");

  const loadQueue = useCallback(async () => {
    try {
      const data = await api.getReviewQueue();

      setQueue(data);
      setError("");
    } catch (fetchError) {
      setError(
        isApiError(fetchError)
          ? fetchError.message
          : "Khong the tai review queue.",
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (status === "authenticated") {
      const loadTimerId = window.setTimeout(() => {
        void loadQueue();
      }, 0);

      return () => window.clearTimeout(loadTimerId);
    }
  }, [loadQueue, status]);

  async function markVocabulary(
    vocabularyId: string,
    result: "AGAIN" | "GOOD" | "EASY",
  ) {
    setPendingId(vocabularyId);
    setError("");

    try {
      await api.markVocabularyReview(vocabularyId, result);
      await loadQueue();
    } catch (markError) {
      setError(
        isApiError(markError)
          ? markError.message
          : "Khong the cap nhat review tu vung.",
      );
    } finally {
      setPendingId("");
    }
  }

  async function resolveQuestion(questionId: string) {
    setPendingId(questionId);
    setError("");

    try {
      await api.resolveToeicWrongQuestion(questionId);
      await loadQueue();
    } catch (resolveError) {
      setError(
        isApiError(resolveError)
          ? resolveError.message
          : "Khong the resolve cau sai.",
      );
    } finally {
      setPendingId("");
    }
  }

  if (status === "loading" || isLoading) {
    return (
      <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="glass-panel-strong rounded-lg p-6 text-text-secondary">
          Dang tai review queue...
        </div>
      </div>
    );
  }

  const vocabularyItems = queue?.vocabulary ?? [];
  const wrongQuestions = queue?.toeicWrongQuestions ?? [];

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-normal text-primary">
            Review Queue
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-normal text-text-primary">
            On tap ca nhan
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-text-secondary">
            On lai tu vung den han va cac cau TOEIC da lam sai.
          </p>
        </div>
        <Link
          className="rounded-md border border-border bg-surface-strong px-4 py-2 text-sm font-semibold text-text-primary hover:border-primary/40 hover:text-primary"
          href="/dashboard"
        >
          Dashboard
        </Link>
      </div>

      <div className="mt-6 flex w-fit rounded-lg border border-border bg-surface-strong p-1">
        <button
          className={`rounded-md px-4 py-2 text-sm font-semibold ${
            activeTab === "vocabulary"
              ? "bg-primary text-white"
              : "text-text-secondary hover:text-text-primary"
          }`}
          onClick={() => setActiveTab("vocabulary")}
          type="button"
        >
          Vocabulary ({vocabularyItems.length})
        </button>
        <button
          className={`rounded-md px-4 py-2 text-sm font-semibold ${
            activeTab === "toeic"
              ? "bg-primary text-white"
              : "text-text-secondary hover:text-text-primary"
          }`}
          onClick={() => setActiveTab("toeic")}
          type="button"
        >
          TOEIC wrong ({wrongQuestions.length})
        </button>
      </div>

      {error ? (
        <div className="mt-6 rounded-lg border border-error/30 bg-red-50 px-4 py-3 text-sm text-error">
          {error}
        </div>
      ) : null}

      <div className="mt-8">
        {activeTab === "vocabulary" ? (
          vocabularyItems.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2">
              {vocabularyItems.map((item) => (
                <article
                  className="glass-panel-strong rounded-lg p-5"
                  key={item.id}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h2 className="text-2xl font-bold text-text-primary">
                        {item.word}
                      </h2>
                      <p className="mt-2 text-sm text-text-secondary">
                        {item.meaning}
                      </p>
                    </div>
                    <span className="rounded-md bg-surface px-3 py-1 text-xs font-semibold text-text-secondary">
                      {item.reviewCount} reviews
                    </span>
                  </div>
                  {item.example ? (
                    <p className="mt-4 rounded-md border border-border bg-white/70 p-3 text-sm leading-6 text-text-secondary">
                      {item.example}
                    </p>
                  ) : null}
                  <div className="mt-5 flex flex-wrap gap-2">
                    {(["AGAIN", "GOOD", "EASY"] as const).map((result) => (
                      <button
                        className="rounded-md border border-border px-3 py-2 text-sm font-semibold text-text-primary hover:border-primary/40 hover:text-primary disabled:cursor-not-allowed disabled:opacity-60"
                        disabled={pendingId === item.vocabularyId}
                        key={result}
                        onClick={() => void markVocabulary(item.vocabularyId, result)}
                        type="button"
                      >
                        {result}
                      </button>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <EmptyState
              title="Khong co tu vung den han"
              description="Tu vung can on se xuat hien tai day khi den lich."
            />
          )
        ) : wrongQuestions.length > 0 ? (
          <div className="space-y-5">
            {wrongQuestions.map((question) => (
              <article
                className="glass-panel-strong rounded-lg p-5"
                key={question.id}
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-sm font-semibold text-primary">
                      Part {question.part} - {question.questionSetTitle}
                    </p>
                    <h2 className="mt-2 text-lg font-bold text-text-primary">
                      {question.content}
                    </h2>
                    <p className="mt-2 text-xs text-text-secondary">
                      Wrong {question.wrongCount} times - last{" "}
                      {new Date(question.lastWrongAt).toLocaleDateString("vi-VN")}
                    </p>
                  </div>
                  <Link
                    className="w-fit rounded-md border border-border px-3 py-2 text-sm font-semibold text-primary hover:border-primary/40"
                    href={`/practice/part/${question.part}`}
                  >
                    Practice part
                  </Link>
                </div>

                <div className="mt-4 grid gap-2">
                  {question.choices.map((choice) => (
                    <div
                      className={`rounded-md border px-4 py-3 text-sm ${
                        choice.isCorrect
                          ? "border-success/40 bg-emerald-50"
                          : "border-border bg-surface"
                      }`}
                      key={choice.id}
                    >
                      <span className="font-semibold text-text-primary">
                        {choice.label}.
                      </span>{" "}
                      {choice.content}
                    </div>
                  ))}
                </div>

                {question.explanation ? (
                  <div className="mt-4 rounded-md border border-border bg-surface-strong p-4 text-sm leading-6 text-text-secondary">
                    <span className="font-semibold text-text-primary">
                      Explanation:
                    </span>{" "}
                    {question.explanation}
                  </div>
                ) : null}

                <button
                  className="mt-5 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-hover disabled:cursor-not-allowed disabled:opacity-60"
                  disabled={pendingId === question.questionId}
                  onClick={() => void resolveQuestion(question.questionId)}
                  type="button"
                >
                  Mark as resolved
                </button>
              </article>
            ))}
          </div>
        ) : (
          <EmptyState
            title="Khong co cau sai can on"
            description="Cau TOEIC lam sai se xuat hien sau khi ban nop bai."
          />
        )}
      </div>
    </div>
  );
}
