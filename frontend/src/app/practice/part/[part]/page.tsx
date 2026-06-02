"use client";

import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { useAuth } from "@/hooks/use-auth";
import { api, isApiError } from "@/lib/api";
import { resolveMediaUrl } from "@/lib/media";
import type { ToeicAttemptStartResult, ToeicQuestionSet } from "@/types";

function formatTime(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60)
    .toString()
    .padStart(2, "0");
  const seconds = (totalSeconds % 60).toString().padStart(2, "0");

  return `${minutes}:${seconds}`;
}

export default function ToeicPartPracticePage() {
  const router = useRouter();
  const params = useParams<{ part: string }>();
  const { status } = useAuth({ redirectToLogin: true });
  const [questionSet, setQuestionSet] = useState<ToeicQuestionSet | null>(null);
  const [attempt, setAttempt] = useState<ToeicAttemptStartResult | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState<number | null>(null);
  const startedQuestionSetId = useRef<string | null>(null);

  const questions = useMemo(
    () => questionSet?.groups.flatMap((group) => group.questions) ?? [],
    [questionSet],
  );
  const questionNumberById = useMemo(
    () => new Map(questions.map((question, index) => [question.id, index + 1])),
    [questions],
  );

  useEffect(() => {
    let isMounted = true;

    async function loadPractice() {
      try {
        const data = await api.getToeicQuestionsByPart(params.part);

        if (!isMounted) {
          return;
        }

        setQuestionSet(data);
        setSecondsLeft(data.duration ?? null);

        if (startedQuestionSetId.current !== data.id) {
          startedQuestionSetId.current = data.id;
          const startedAttempt = await api.startToeicAttempt(data.id);

          if (isMounted) {
            setAttempt(startedAttempt);
          }
        }
      } catch (fetchError) {
        if (!isMounted) {
          return;
        }

        setError(
          isApiError(fetchError)
            ? fetchError.message
            : "Không thể tải bài luyện TOEIC.",
        );
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    if (status === "authenticated") {
      void loadPractice();
    }

    return () => {
      isMounted = false;
    };
  }, [params.part, status]);

  useEffect(() => {
    if (secondsLeft === null || secondsLeft <= 0 || isSubmitting) {
      return;
    }

    const timerId = window.setInterval(() => {
      setSecondsLeft((current) =>
        current === null ? current : Math.max(current - 1, 0),
      );
    }, 1000);

    return () => window.clearInterval(timerId);
  }, [isSubmitting, secondsLeft]);

  const handleSubmit = useCallback(async () => {
    if (!attempt || !questionSet || isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      await api.submitToeicAttempt(
        attempt.id,
        questions.map((question) => ({
          questionId: question.id,
          selectedChoiceId: answers[question.id] ?? null,
        })),
      );
      router.replace(`/attempts/${attempt.id}/result`);
    } catch (submitError) {
      setError(
        isApiError(submitError)
          ? submitError.message
          : "Không thể nộp bài TOEIC.",
      );
      setIsSubmitting(false);
    }
  }, [answers, attempt, isSubmitting, questionSet, questions, router]);

  useEffect(() => {
    if (secondsLeft === 0 && attempt && questionSet && !isSubmitting) {
      const submitTimerId = window.setTimeout(() => {
        void handleSubmit();
      }, 0);

      return () => window.clearTimeout(submitTimerId);
    }
  }, [secondsLeft, attempt, questionSet, isSubmitting, handleSubmit]);

  if (status === "loading" || isLoading) {
    return (
      <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="glass-panel-strong rounded-lg p-6 text-text-secondary">
          Đang chuẩn bị bài luyện...
        </div>
      </div>
    );
  }

  if (!questionSet) {
    return (
      <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="rounded-lg border border-error/30 bg-red-50 px-4 py-3 text-sm text-error">
          {error || "Không tìm thấy bài luyện."}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-4 border-b border-border pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-normal text-primary">
            TOEIC Part {questionSet.part}
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-normal text-text-primary">
            {questionSet.title}
          </h1>
          {questionSet.description ? (
            <p className="mt-3 max-w-2xl text-sm leading-6 text-text-secondary">
              {questionSet.description}
            </p>
          ) : null}
        </div>

        <div className="flex items-center gap-3">
          <div className="rounded-md border border-border bg-surface-strong px-4 py-2 text-sm font-semibold text-text-primary">
            {answersCount(answers)} / {questions.length} câu
          </div>
          {secondsLeft !== null ? (
            <div className="rounded-md bg-text-primary px-4 py-2 text-sm font-semibold text-white">
              {formatTime(secondsLeft)}
            </div>
          ) : null}
        </div>
      </div>

      {error ? (
        <div className="mt-6 rounded-lg border border-error/30 bg-red-50 px-4 py-3 text-sm text-error">
          {error}
        </div>
      ) : null}

      <div className="mt-6 space-y-6">
        {questionSet.groups.map((group) => {
          const audioUrl = resolveMediaUrl(group.audioUrl);
          const imageUrl = resolveMediaUrl(group.imageUrl);

          return (
          <section className="glass-panel-strong rounded-lg p-5" key={group.id}>
            {group.title ? (
              <h2 className="text-lg font-bold text-text-primary">
                {group.title}
              </h2>
            ) : null}
            {audioUrl ? (
              <audio className="mt-4 w-full" controls src={audioUrl}>
                <track kind="captions" />
              </audio>
            ) : null}
            {imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                alt={group.title ?? "TOEIC question image"}
                className="mt-4 max-h-[420px] w-full rounded-lg object-contain"
                src={imageUrl}
              />
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
                  <h3 className="text-base font-semibold text-text-primary">
                    {questionNumberById.get(question.id)}. {question.content}
                  </h3>
                  <div className="mt-4 grid gap-3">
                    {question.choices.map((choice) => (
                      <label
                        className="flex cursor-pointer items-start gap-3 rounded-md border border-border bg-surface px-4 py-3 text-sm hover:border-primary/50"
                        key={choice.id}
                      >
                        <input
                          checked={answers[question.id] === choice.id}
                          className="mt-1 size-4 accent-primary"
                          name={question.id}
                          onChange={() =>
                            setAnswers((current) => ({
                              ...current,
                              [question.id]: choice.id,
                            }))
                          }
                          type="radio"
                        />
                        <span>
                          <span className="font-semibold text-text-primary">
                            {choice.label}.
                          </span>{" "}
                          {choice.content}
                        </span>
                      </label>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </section>
          );
        })}
      </div>

      <div className="sticky bottom-0 mt-8 border-t border-border bg-background/95 py-4 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl justify-end">
          <button
            className="rounded-md bg-primary px-5 py-3 text-sm font-bold text-white hover:bg-hover disabled:cursor-not-allowed disabled:opacity-60"
            disabled={!attempt || isSubmitting}
            onClick={() => void handleSubmit()}
            type="button"
          >
            {isSubmitting ? "Đang nộp bài..." : "Submit"}
          </button>
        </div>
      </div>
    </div>
  );
}

function answersCount(answers: Record<string, string>) {
  return Object.keys(answers).length;
}
