"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import {
  AdminButton,
  AdminInput,
  AdminPageTitle,
  AdminSelect,
  AdminTextarea,
  ConfirmPanel,
  InlineMessage,
  StatusBadge,
} from "@/features/admin/components/admin-ui";
import { api, isApiError } from "@/lib/api";
import type {
  AnswerPayload,
  ContentStatus,
  Lesson,
  Question,
  QuestionPayload,
  QuestionType,
} from "@/types";

const questionTypes: QuestionType[] = [
  "SINGLE_CHOICE",
  "MULTIPLE_CHOICE",
  "FILL_BLANK",
  "TRUE_FALSE",
];

type QuestionFormState = {
  answers: AnswerPayload[];
  explanation: string;
  lessonId: string;
  order: number;
  title: string;
  type: QuestionType;
};

const emptyForm: QuestionFormState = {
  answers: [
    { content: "", isCorrect: true },
    { content: "", isCorrect: false },
  ],
  explanation: "",
  lessonId: "",
  order: 0,
  title: "",
  type: "SINGLE_CHOICE",
};

export default function AdminQuestionsPage() {
  const [deleteTarget, setDeleteTarget] = useState<Question | null>(null);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [error, setError] = useState("");
  const [fieldError, setFieldError] = useState("");
  const [form, setForm] = useState<QuestionFormState>(emptyForm);
  const [isLoading, setIsLoading] = useState(true);
  const [isMutating, setIsMutating] = useState(false);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [lessonId, setLessonId] = useState("");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<ContentStatus | "">("");
  const [toast, setToast] = useState("");
  const [view, setView] = useState<"edit" | "preview">("edit");

  const filters = useMemo(
    () => ({ lessonId, search, status }),
    [lessonId, search, status],
  );

  const loadQuestions = useCallback(async () => {
    await Promise.resolve();
    setIsLoading(true);

    try {
      const [questionData, lessonData] = await Promise.all([
        api.getAdminQuestions(filters),
        api.getAdminLessons(),
      ]);

      setQuestions(questionData);
      setLessons(lessonData);
      setError("");
      setForm((current) => ({
        ...current,
        lessonId: current.lessonId || lessonData[0]?.id || "",
      }));
    } catch (loadError) {
      setError(
        isApiError(loadError) ? loadError.message : "Khong tai duoc questions.",
      );
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadQuestions();
    }, 0);

    return () => window.clearTimeout(timer);
  }, [loadQuestions]);

  function resetForm() {
    setEditingQuestion(null);
    setFieldError("");
    setForm({
      ...emptyForm,
      lessonId: lessons[0]?.id ?? "",
    });
    setView("edit");
  }

  function editQuestion(question: Question) {
    setEditingQuestion(question);
    setFieldError("");
    setForm({
      answers:
        question.answers && question.answers.length > 0
          ? question.answers.map((answer) => ({
              content: answer.content,
              isCorrect: answer.isCorrect,
            }))
          : emptyForm.answers,
      explanation: question.explanation ?? "",
      lessonId: question.lessonId,
      order: question.order,
      title: question.title,
      type: question.type,
    });
    setView("edit");
  }

  function updateAnswer(index: number, value: Partial<AnswerPayload>) {
    setForm((current) => {
      const answers = current.answers.map((answer, answerIndex) => {
        if (answerIndex !== index) {
          if (
            current.type === "SINGLE_CHOICE" &&
            value.isCorrect === true
          ) {
            return { ...answer, isCorrect: false };
          }

          return answer;
        }

        return { ...answer, ...value };
      });

      return {
        ...current,
        answers,
      };
    });
  }

  function updateType(type: QuestionType) {
    setForm((current) => ({
      ...current,
      type,
      answers:
        type === "SINGLE_CHOICE"
          ? current.answers.map((answer, index) => ({
              ...answer,
              isCorrect: index === 0,
            }))
          : current.answers,
    }));
  }

  function validate(publishing: boolean) {
    if (!form.lessonId) {
      return "Lesson bat buoc.";
    }

    if (!form.title.trim()) {
      return "Title bat buoc.";
    }

    const answers = form.answers.filter((answer) => answer.content.trim());

    if (publishing && answers.length < 2) {
      return "Publish can it nhat 2 answers.";
    }

    if (publishing && !answers.some((answer) => answer.isCorrect)) {
      return "Publish can it nhat 1 answer dung.";
    }

    if (
      publishing &&
      form.type === "SINGLE_CHOICE" &&
      answers.filter((answer) => answer.isCorrect).length !== 1
    ) {
      return "SINGLE_CHOICE chi duoc 1 answer dung.";
    }

    return "";
  }

  function payload(): QuestionPayload {
    return {
      answers: form.answers
        .filter((answer) => answer.content.trim())
        .map((answer) => ({
          content: answer.content.trim(),
          isCorrect: Boolean(answer.isCorrect),
        })),
      explanation: form.explanation.trim() || undefined,
      order: form.order,
      title: form.title.trim(),
      type: form.type,
    };
  }

  async function saveQuestion(nextStatus?: ContentStatus) {
    const validationMessage = validate(nextStatus === "PUBLISHED");

    if (validationMessage) {
      setFieldError(validationMessage);
      return;
    }

    setFieldError("");
    setError("");
    setToast("");
    setIsMutating(true);

    try {
      const savedQuestion = editingQuestion
        ? await api.updateQuestion(editingQuestion.id, payload())
        : await api.createQuestion(form.lessonId, payload());

      if (nextStatus) {
        await api.updateQuestionStatus(savedQuestion.id, nextStatus);
      }

      await loadQuestions();
      setToast(
        nextStatus
          ? `Question da luu va cap nhat sang ${nextStatus}.`
          : "Question da duoc luu.",
      );
      resetForm();
    } catch (saveError) {
      setError(
        isApiError(saveError) ? saveError.message : "Khong luu duoc question.",
      );
    } finally {
      setIsMutating(false);
    }
  }

  async function updateStatus(question: Question) {
    const nextStatus = question.status === "PUBLISHED" ? "DRAFT" : "PUBLISHED";

    setIsMutating(true);
    setToast("");

    try {
      await api.updateQuestionStatus(question.id, nextStatus);
      await loadQuestions();
      setToast(`${question.title} da cap nhat sang ${nextStatus}.`);
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

  async function deleteQuestion() {
    if (!deleteTarget) {
      return;
    }

    setIsMutating(true);
    setToast("");

    try {
      await api.deleteQuestion(deleteTarget.id);
      setDeleteTarget(null);
      await loadQuestions();
      setToast(`${deleteTarget.title} da duoc xoa.`);
    } catch (deleteError) {
      setError(
        isApiError(deleteError)
          ? deleteError.message
          : "Khong xoa duoc question.",
      );
    } finally {
      setIsMutating(false);
    }
  }

  return (
    <div>
      <AdminPageTitle
        description="Quan ly question va answers, kem validate khi publish."
        title="Questions"
      />

      <div className="grid gap-3">
        {toast ? <InlineMessage message={toast} tone="success" /> : null}
        {error ? <InlineMessage message={error} tone="error" /> : null}
        {fieldError ? <InlineMessage message={fieldError} tone="error" /> : null}

        <section className="glass-panel rounded-lg p-4">
          <div className="grid gap-3 lg:grid-cols-[1fr_220px_220px_auto] lg:items-end">
            <AdminInput
              label="Search"
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Title or explanation"
              type="search"
              value={search}
            />
            <AdminSelect
              label="Lesson"
              onChange={(event) => setLessonId(event.target.value)}
              value={lessonId}
            >
              <option value="">All</option>
              {lessons.map((lesson) => (
                <option key={lesson.id} value={lesson.id}>
                  {lesson.title}
                </option>
              ))}
            </AdminSelect>
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
            <AdminButton onClick={loadQuestions} type="button">
              Refresh
            </AdminButton>
          </div>
        </section>

        {deleteTarget ? (
          <ConfirmPanel
            message={`Ban co chac muon xoa question "${deleteTarget.title}" nay?`}
            onCancel={() => setDeleteTarget(null)}
            onConfirm={deleteQuestion}
            pending={isMutating}
          />
        ) : null}

        <section className="grid gap-4 xl:grid-cols-[1fr_320px]">
          <div className="glass-panel rounded-lg p-4">
            {isLoading ? <InlineMessage message="Dang tai questions..." /> : null}
            {!isLoading && questions.length === 0 ? (
              <InlineMessage message="Chua co question phu hop." />
            ) : null}

            {questions.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[860px] border-separate border-spacing-y-2 text-left text-sm">
                  <thead className="text-xs uppercase tracking-normal text-text-secondary">
                    <tr>
                      <th className="px-3 py-2">Question</th>
                      <th className="px-3 py-2">Lesson</th>
                      <th className="px-3 py-2">Answers</th>
                      <th className="px-3 py-2">Status</th>
                      <th className="px-3 py-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {questions.map((question) => (
                      <tr className="bg-surface-strong" key={question.id}>
                        <td className="rounded-l-md px-3 py-3">
                          <p className="font-semibold text-text-primary">
                            {question.title}
                          </p>
                          <p className="text-xs text-text-secondary">
                            {question.type}
                          </p>
                        </td>
                        <td className="px-3 py-3 text-text-secondary">
                          {question.lesson?.title ?? question.lessonId}
                        </td>
                        <td className="px-3 py-3 text-text-secondary">
                          {question.answers?.length ?? 0}
                        </td>
                        <td className="px-3 py-3">
                          <StatusBadge status={question.status} />
                        </td>
                        <td className="rounded-r-md px-3 py-3">
                          <div className="flex flex-wrap gap-2">
                            <AdminButton
                              disabled={isMutating}
                              onClick={() => editQuestion(question)}
                              tone="ghost"
                              type="button"
                            >
                              Edit
                            </AdminButton>
                            <AdminButton
                              disabled={isMutating}
                              onClick={() => void updateStatus(question)}
                              tone="secondary"
                              type="button"
                            >
                              {question.status === "PUBLISHED"
                                ? "Unpublish"
                                : "Publish"}
                            </AdminButton>
                            <AdminButton
                              disabled={isMutating}
                              onClick={() => setDeleteTarget(question)}
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
          </div>

          <div className="glass-panel h-fit rounded-lg p-4">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-bold text-text-primary">
                  {editingQuestion ? "Edit question" : "New question"}
                </h2>
                <p className="text-sm text-text-secondary">
                  {editingQuestion?.title ?? "Create draft by default"}
                </p>
              </div>
              <AdminButton onClick={resetForm} tone="ghost" type="button">
                New
              </AdminButton>
            </div>

            <div className="mb-4 flex w-fit rounded-md border border-border bg-surface-strong p-1">
              <button
                className={`rounded px-3 py-2 text-sm font-semibold ${
                  view === "edit" ? "bg-primary text-white" : "text-text-secondary"
                }`}
                onClick={() => setView("edit")}
                type="button"
              >
                Edit
              </button>
              <button
                className={`rounded px-3 py-2 text-sm font-semibold ${
                  view === "preview"
                    ? "bg-primary text-white"
                    : "text-text-secondary"
                }`}
                onClick={() => setView("preview")}
                type="button"
              >
                Preview
              </button>
            </div>

            {view === "edit" ? (
              <div className="grid gap-4">
                <AdminSelect
                  label="Lesson"
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      lessonId: event.target.value,
                    }))
                  }
                  value={form.lessonId}
                >
                  {lessons.length === 0 ? <option value="">No lessons</option> : null}
                  {lessons.map((lesson) => (
                    <option key={lesson.id} value={lesson.id}>
                      {lesson.title}
                    </option>
                  ))}
                </AdminSelect>
                <AdminInput
                  label="Title"
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      title: event.target.value,
                    }))
                  }
                  value={form.title}
                />
                <AdminSelect
                  label="Type"
                  onChange={(event) => updateType(event.target.value as QuestionType)}
                  value={form.type}
                >
                  {questionTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </AdminSelect>
                <AdminInput
                  label="Order"
                  min={0}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      order: Number(event.target.value),
                    }))
                  }
                  type="number"
                  value={form.order}
                />
                <AdminTextarea
                  label="Explanation"
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      explanation: event.target.value,
                    }))
                  }
                  value={form.explanation}
                />

                <div className="grid gap-3">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-text-primary">
                      Answers
                    </p>
                    <AdminButton
                      onClick={() =>
                        setForm((current) => ({
                          ...current,
                          answers: [
                            ...current.answers,
                            { content: "", isCorrect: false },
                          ],
                        }))
                      }
                      tone="ghost"
                      type="button"
                    >
                      Add
                    </AdminButton>
                  </div>
                  {form.answers.map((answer, index) => (
                    <div
                      className="grid gap-2 rounded-lg border border-border bg-surface-strong p-3"
                      key={index}
                    >
                      <AdminInput
                        label={`Answer ${index + 1}`}
                        onChange={(event) =>
                          updateAnswer(index, { content: event.target.value })
                        }
                        value={answer.content}
                      />
                      <label className="flex items-center gap-2 text-sm font-semibold text-text-secondary">
                        <input
                          checked={Boolean(answer.isCorrect)}
                          onChange={(event) =>
                            updateAnswer(index, {
                              isCorrect: event.target.checked,
                            })
                          }
                          type="checkbox"
                        />
                        Correct answer
                      </label>
                      {form.answers.length > 2 ? (
                        <AdminButton
                          onClick={() =>
                            setForm((current) => ({
                              ...current,
                              answers: current.answers.filter(
                                (_, answerIndex) => answerIndex !== index,
                              ),
                            }))
                          }
                          tone="danger"
                          type="button"
                        >
                          Remove
                        </AdminButton>
                      ) : null}
                    </div>
                  ))}
                </div>

                <div className="flex flex-wrap gap-2">
                  <AdminButton
                    disabled={isMutating}
                    onClick={() => void saveQuestion()}
                    type="button"
                  >
                    Save
                  </AdminButton>
                  <AdminButton
                    disabled={isMutating}
                    onClick={() => void saveQuestion("DRAFT")}
                    tone="secondary"
                    type="button"
                  >
                    Save draft
                  </AdminButton>
                  <AdminButton
                    disabled={isMutating}
                    onClick={() => void saveQuestion("PUBLISHED")}
                    type="button"
                  >
                    Publish
                  </AdminButton>
                </div>
              </div>
            ) : (
              <div className="rounded-lg border border-border bg-surface-strong p-4">
                <div className="flex flex-wrap items-center gap-2">
                  <StatusBadge status={editingQuestion?.status ?? "DRAFT"} />
                  <span className="text-xs font-semibold text-text-secondary">
                    {form.type}
                  </span>
                </div>
                <h3 className="mt-3 text-xl font-bold text-text-primary">
                  {form.title || "Untitled question"}
                </h3>
                <div className="mt-4 grid gap-2">
                  {form.answers.map((answer, index) => (
                    <div
                      className="rounded-md border border-border bg-white/60 px-3 py-2 text-sm text-text-secondary"
                      key={index}
                    >
                      <span className="font-semibold text-text-primary">
                        {answer.isCorrect ? "[Correct] " : ""}
                      </span>
                      {answer.content || `Answer ${index + 1}`}
                    </div>
                  ))}
                </div>
                {form.explanation ? (
                  <p className="mt-4 text-sm leading-6 text-text-secondary">
                    {form.explanation}
                  </p>
                ) : null}
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
