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
} from "@/components/admin/admin-ui";
import { api, isApiError } from "@/lib/api";
import type { Lesson, Vocabulary, VocabularyPayload } from "@/types";

type VocabularyFormState = VocabularyPayload & {
  lessonId: string;
};

const emptyForm: VocabularyFormState = {
  audioUrl: "",
  example: "",
  lessonId: "",
  meaning: "",
  phonetic: "",
  word: "",
};

export default function AdminVocabularyPage() {
  const [deleteTarget, setDeleteTarget] = useState<Vocabulary | null>(null);
  const [editingVocabulary, setEditingVocabulary] = useState<Vocabulary | null>(null);
  const [error, setError] = useState("");
  const [fieldError, setFieldError] = useState("");
  const [form, setForm] = useState<VocabularyFormState>(emptyForm);
  const [isLoading, setIsLoading] = useState(true);
  const [isMutating, setIsMutating] = useState(false);
  const [lessonId, setLessonId] = useState("");
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState("");
  const [view, setView] = useState<"edit" | "preview">("edit");
  const [vocabulary, setVocabulary] = useState<Vocabulary[]>([]);

  const filters = useMemo(() => ({ lessonId, search }), [lessonId, search]);

  const loadVocabulary = useCallback(async () => {
    await Promise.resolve();
    setIsLoading(true);

    try {
      const [vocabularyData, lessonData] = await Promise.all([
        api.getAdminVocabulary(filters),
        api.getAdminLessons(),
      ]);

      setVocabulary(vocabularyData);
      setLessons(lessonData);
      setError("");
      setForm((current) => ({
        ...current,
        lessonId: current.lessonId || lessonData[0]?.id || "",
      }));
    } catch (loadError) {
      setError(
        isApiError(loadError)
          ? loadError.message
          : "Khong tai duoc vocabulary.",
      );
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadVocabulary();
    }, 0);

    return () => window.clearTimeout(timer);
  }, [loadVocabulary]);

  function resetForm() {
    setEditingVocabulary(null);
    setFieldError("");
    setForm({
      ...emptyForm,
      lessonId: lessons[0]?.id ?? "",
    });
    setView("edit");
  }

  function editVocabulary(item: Vocabulary) {
    setEditingVocabulary(item);
    setFieldError("");
    setForm({
      audioUrl: item.audioUrl ?? "",
      example: item.example ?? "",
      lessonId: item.lessonId,
      meaning: item.meaning,
      phonetic: item.phonetic ?? "",
      word: item.word,
    });
    setView("edit");
  }

  function updateField(field: keyof VocabularyFormState, value: string) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function validate() {
    if (!form.lessonId) {
      return "Lesson bat buoc.";
    }

    if (!form.word.trim()) {
      return "Word bat buoc.";
    }

    if (!form.meaning.trim()) {
      return "Meaning bat buoc.";
    }

    return "";
  }

  function payload(): VocabularyPayload {
    return {
      audioUrl: form.audioUrl?.trim() || undefined,
      example: form.example?.trim() || undefined,
      meaning: form.meaning.trim(),
      phonetic: form.phonetic?.trim() || undefined,
      word: form.word.trim(),
    };
  }

  async function saveVocabulary() {
    const validationMessage = validate();

    if (validationMessage) {
      setFieldError(validationMessage);
      return;
    }

    setFieldError("");
    setError("");
    setToast("");
    setIsMutating(true);

    try {
      if (editingVocabulary) {
        await api.updateVocabulary(editingVocabulary.id, payload());
      } else {
        await api.createVocabulary(form.lessonId, payload());
      }

      await loadVocabulary();
      setToast("Vocabulary da duoc luu.");
      resetForm();
    } catch (saveError) {
      setError(
        isApiError(saveError)
          ? saveError.message
          : "Khong luu duoc vocabulary.",
      );
    } finally {
      setIsMutating(false);
    }
  }

  async function deleteVocabulary() {
    if (!deleteTarget) {
      return;
    }

    setIsMutating(true);
    setToast("");

    try {
      await api.deleteVocabulary(deleteTarget.id);
      setDeleteTarget(null);
      await loadVocabulary();
      setToast(`${deleteTarget.word} da duoc xoa.`);
    } catch (deleteError) {
      setError(
        isApiError(deleteError)
          ? deleteError.message
          : "Khong xoa duoc vocabulary.",
      );
    } finally {
      setIsMutating(false);
    }
  }

  return (
    <div>
      <AdminPageTitle
        description="Quan ly word, meaning va vi du theo lesson."
        title="Vocabulary"
      />

      <div className="grid gap-3">
        {toast ? <InlineMessage message={toast} tone="success" /> : null}
        {error ? <InlineMessage message={error} tone="error" /> : null}
        {fieldError ? <InlineMessage message={fieldError} tone="error" /> : null}

        <section className="glass-panel rounded-lg p-4">
          <div className="grid gap-3 md:grid-cols-[1fr_260px_auto] md:items-end">
            <AdminInput
              label="Search"
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Word, meaning, example"
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
            <AdminButton onClick={loadVocabulary} type="button">
              Refresh
            </AdminButton>
          </div>
        </section>

        {deleteTarget ? (
          <ConfirmPanel
            message={`Ban co chac muon xoa vocabulary "${deleteTarget.word}" nay?`}
            onCancel={() => setDeleteTarget(null)}
            onConfirm={deleteVocabulary}
            pending={isMutating}
          />
        ) : null}

        <section className="grid gap-4 xl:grid-cols-[1fr_420px]">
          <div className="glass-panel rounded-lg p-4">
            {isLoading ? <InlineMessage message="Dang tai vocabulary..." /> : null}
            {!isLoading && vocabulary.length === 0 ? (
              <InlineMessage message="Chua co vocabulary phu hop." />
            ) : null}

            {vocabulary.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[760px] border-separate border-spacing-y-2 text-left text-sm">
                  <thead className="text-xs uppercase tracking-normal text-text-secondary">
                    <tr>
                      <th className="px-3 py-2">Word</th>
                      <th className="px-3 py-2">Meaning</th>
                      <th className="px-3 py-2">Lesson</th>
                      <th className="px-3 py-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {vocabulary.map((item) => (
                      <tr className="bg-surface-strong" key={item.id}>
                        <td className="rounded-l-md px-3 py-3">
                          <p className="font-semibold text-text-primary">
                            {item.word}
                          </p>
                          {item.phonetic ? (
                            <p className="text-xs text-text-secondary">
                              {item.phonetic}
                            </p>
                          ) : null}
                        </td>
                        <td className="px-3 py-3 text-text-secondary">
                          {item.meaning}
                        </td>
                        <td className="px-3 py-3 text-text-secondary">
                          {item.lesson?.title ?? item.lessonId}
                        </td>
                        <td className="rounded-r-md px-3 py-3">
                          <div className="flex flex-wrap gap-2">
                            <AdminButton
                              disabled={isMutating}
                              onClick={() => editVocabulary(item)}
                              tone="ghost"
                              type="button"
                            >
                              Edit
                            </AdminButton>
                            <AdminButton
                              disabled={isMutating}
                              onClick={() => setDeleteTarget(item)}
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
                  {editingVocabulary ? "Edit vocabulary" : "New vocabulary"}
                </h2>
                <p className="text-sm text-text-secondary">
                  {editingVocabulary?.word ?? "Create word for a lesson"}
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
                  disabled={Boolean(editingVocabulary)}
                  label="Lesson"
                  onChange={(event) => updateField("lessonId", event.target.value)}
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
                  label="Word"
                  onChange={(event) => updateField("word", event.target.value)}
                  value={form.word}
                />
                <AdminInput
                  label="Meaning"
                  onChange={(event) => updateField("meaning", event.target.value)}
                  value={form.meaning}
                />
                <AdminInput
                  label="Phonetic"
                  onChange={(event) => updateField("phonetic", event.target.value)}
                  value={form.phonetic}
                />
                <AdminTextarea
                  label="Example"
                  onChange={(event) => updateField("example", event.target.value)}
                  value={form.example}
                />
                <AdminInput
                  label="Audio URL"
                  onChange={(event) => updateField("audioUrl", event.target.value)}
                  value={form.audioUrl}
                />
                <AdminButton
                  disabled={isMutating}
                  onClick={() => void saveVocabulary()}
                  type="button"
                >
                  Save
                </AdminButton>
              </div>
            ) : (
              <div className="rounded-lg border border-border bg-surface-strong p-4">
                <p className="text-3xl font-bold text-text-primary">
                  {form.word || "word"}
                </p>
                {form.phonetic ? (
                  <p className="mt-2 text-sm font-semibold text-primary">
                    {form.phonetic}
                  </p>
                ) : null}
                <p className="mt-3 text-sm leading-6 text-text-secondary">
                  {form.meaning || "meaning"}
                </p>
                {form.example ? (
                  <p className="mt-4 rounded-md border border-border bg-white/60 px-3 py-2 text-sm text-text-secondary">
                    {form.example}
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
