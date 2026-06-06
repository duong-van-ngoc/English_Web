"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

import {
  AdminButton,
  AdminInput,
  AdminPageTitle,
  AdminSelect,
  AdminTextarea,
  InlineMessage,
} from "@/features/admin/components/admin-ui";
import { api, isApiError } from "@/lib/api";
import { resolveMediaUrl } from "@/lib/media";
import type { AdminToeicQuestionGroup, AdminToeicQuestionSet, FileKind } from "@/types";

type GroupMediaFormState = {
  audioUrl: string;
  imageUrl: string;
  transcript: string;
};

const emptyForm: GroupMediaFormState = {
  audioUrl: "",
  imageUrl: "",
  transcript: "",
};

const partOptions = [
  { value: "", label: "All parts" },
  { value: "1", label: "Part 1" },
  { value: "2", label: "Part 2" },
  { value: "3", label: "Part 3" },
  { value: "4", label: "Part 4" },
  { value: "5", label: "Part 5" },
  { value: "6", label: "Part 6" },
  { value: "7", label: "Part 7" },
];

function trimToNull(value: string) {
  const normalized = value.trim();
  return normalized.length > 0 ? normalized : null;
}

function fillForm(group: AdminToeicQuestionGroup | null): GroupMediaFormState {
  if (!group) {
    return emptyForm;
  }

  return {
    audioUrl: group.audioUrl ?? "",
    imageUrl: group.imageUrl ?? "",
    transcript: group.transcript ?? "",
  };
}

function MediaState({ active, label }: { active: boolean; label: string }) {
  const classes = active
    ? "border-success/30 bg-success/10 text-success"
    : "border-border bg-surface text-text-secondary";

  return <span className={`rounded-md border px-2 py-1 text-xs font-semibold ${classes}`}>{label}</span>;
}

export default function AdminToeicGroupsPage() {
  const [audioUpload, setAudioUpload] = useState<File | null>(null);
  const [editingGroup, setEditingGroup] = useState<AdminToeicQuestionGroup | null>(null);
  const [error, setError] = useState("");
  const [form, setForm] = useState<GroupMediaFormState>(emptyForm);
  const [groups, setGroups] = useState<AdminToeicQuestionGroup[]>([]);
  const [imageUpload, setImageUpload] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [partFilter, setPartFilter] = useState<number | "">("");
  const [questionSetIdFilter, setQuestionSetIdFilter] = useState("");
  const [questionSets, setQuestionSets] = useState<AdminToeicQuestionSet[]>([]);
  const [toast, setToast] = useState("");
  const [uploadingKind, setUploadingKind] = useState<FileKind | null>(null);

  const loadToeicMedia = useCallback(
    async (preferredGroupId?: string | null) => {
      setIsLoading(true);

      try {
        const [questionSetData, groupData] = await Promise.all([
          api.getAdminToeicQuestionSets({
            part: partFilter || undefined,
          }),
          api.getAdminToeicQuestionGroups({
            part: partFilter || undefined,
            questionSetId: questionSetIdFilter || undefined,
          }),
        ]);

        setQuestionSets(questionSetData);
        setGroups(groupData);

        const nextGroup =
          groupData.find((group) => group.id === preferredGroupId) ??
          groupData.find((group) => group.id === editingGroup?.id) ??
          groupData[0] ??
          null;

        setEditingGroup(nextGroup);
        setForm(fillForm(nextGroup));
        setError("");
      } catch (loadError) {
        setError(
          isApiError(loadError)
            ? loadError.message
            : "Khong tai duoc TOEIC media groups.",
        );
      } finally {
        setIsLoading(false);
      }
    },
    [editingGroup?.id, partFilter, questionSetIdFilter],
  );

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadToeicMedia();
    }, 0);

    return () => window.clearTimeout(timer);
  }, [loadToeicMedia]);

  function selectGroup(group: AdminToeicQuestionGroup) {
    setEditingGroup(group);
    setForm(fillForm(group));
    setToast("");
    setError("");
  }

  function updateField(field: keyof GroupMediaFormState, value: string) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  async function saveMedia() {
    if (!editingGroup) {
      setError("Chon TOEIC group truoc khi luu.");
      return;
    }

    setIsSaving(true);
    setToast("");
    setError("");

    try {
      const savedGroup = await api.updateAdminToeicQuestionGroupMedia(editingGroup.id, {
        audioUrl: trimToNull(form.audioUrl),
        imageUrl: trimToNull(form.imageUrl),
        transcript: trimToNull(form.transcript),
      });

      setGroups((current) =>
        current.map((group) => (group.id === savedGroup.id ? savedGroup : group)),
      );
      setEditingGroup(savedGroup);
      setForm(fillForm(savedGroup));
      setToast("TOEIC group media da duoc cap nhat.");
    } catch (saveError) {
      setError(
        isApiError(saveError)
          ? saveError.message
          : "Khong cap nhat duoc TOEIC group media.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  async function uploadAndAttach(kind: FileKind) {
    const selectedFile = kind === "AUDIO" ? audioUpload : imageUpload;

    if (!selectedFile) {
      setError(`Chon ${kind.toLowerCase()} file truoc khi upload.`);
      return;
    }

    setUploadingKind(kind);
    setToast("");
    setError("");

    try {
      const asset = await api.uploadFile(kind, selectedFile);

      if (kind === "AUDIO") {
        setAudioUpload(null);
        updateField("audioUrl", asset.url);
      } else {
        setImageUpload(null);
        updateField("imageUrl", asset.url);
      }

      setToast(`${asset.originalName} da duoc upload. Nho Save de gan vao group.`);
    } catch (uploadError) {
      setError(
        isApiError(uploadError)
          ? uploadError.message
          : `Khong upload duoc ${kind.toLowerCase()} file.`,
      );
    } finally {
      setUploadingKind(null);
    }
  }

  async function copyFieldValue(value: string) {
    if (!value.trim()) {
      return;
    }

    try {
      await navigator.clipboard.writeText(value.trim());
      setToast("Da copy URL.");
      setError("");
    } catch {
      setError("Khong copy duoc URL.");
    }
  }

  const resolvedAudioUrl = resolveMediaUrl(form.audioUrl);
  const resolvedImageUrl = resolveMediaUrl(form.imageUrl);

  return (
    <div>
      <AdminPageTitle
        action={
          <Link
            className="inline-flex min-h-10 items-center justify-center rounded-md border border-border bg-surface-strong px-3 py-2 text-sm font-semibold text-text-primary transition hover:border-primary/40 hover:text-primary"
            href="/admin/files"
          >
            Open file library
          </Link>
        }
        description="Gan audio, image, va transcript vao TOEIC question groups dang duoc dung o practice flow."
        title="TOEIC Media"
      />

      <div className="grid gap-3">
        {toast ? <InlineMessage message={toast} tone="success" /> : null}
        {error ? <InlineMessage message={error} tone="error" /> : null}

        <section className="glass-panel rounded-lg p-4">
          <div className="grid gap-3 xl:grid-cols-[220px_1fr_auto] xl:items-end">
            <AdminSelect
              label="Part"
              onChange={(event) => {
                setPartFilter(event.target.value ? Number(event.target.value) : "");
                setQuestionSetIdFilter("");
              }}
              value={partFilter ? String(partFilter) : ""}
            >
              {partOptions.map((option) => (
                <option key={option.label} value={option.value}>
                  {option.label}
                </option>
              ))}
            </AdminSelect>

            <AdminSelect
              label="Question set"
              onChange={(event) => setQuestionSetIdFilter(event.target.value)}
              value={questionSetIdFilter}
            >
              <option value="">All sets</option>
              {questionSets.map((questionSet) => (
                <option key={questionSet.id} value={questionSet.id}>
                  Part {questionSet.part} - {questionSet.title}
                </option>
              ))}
            </AdminSelect>

            <AdminButton onClick={() => void loadToeicMedia()} type="button">
              Refresh
            </AdminButton>
          </div>
        </section>

        <section className="grid gap-4 xl:grid-cols-[1.2fr_1fr]">
          <div className="glass-panel rounded-lg p-4">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-bold text-text-primary">Groups</h2>
                <p className="text-sm text-text-secondary">
                  {groups.length} group phu hop voi filter hien tai.
                </p>
              </div>
            </div>

            {isLoading ? <InlineMessage message="Dang tai TOEIC groups..." /> : null}
            {!isLoading && groups.length === 0 ? (
              <InlineMessage message="Khong co TOEIC group nao." />
            ) : null}

            {groups.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[760px] border-separate border-spacing-y-2 text-left text-sm">
                  <thead className="text-xs uppercase tracking-normal text-text-secondary">
                    <tr>
                      <th className="px-3 py-2">Group</th>
                      <th className="px-3 py-2">Question set</th>
                      <th className="px-3 py-2">Questions</th>
                      <th className="px-3 py-2">Media</th>
                      <th className="px-3 py-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {groups.map((group) => {
                      const isActive = editingGroup?.id === group.id;

                      return (
                        <tr
                          className={isActive ? "bg-primary/10" : "bg-surface-strong"}
                          key={group.id}
                        >
                          <td className="rounded-l-md px-3 py-3">
                            <p className="font-semibold text-text-primary">
                              #{group.order} {group.title || "Untitled group"}
                            </p>
                            <p className="mt-1 text-xs text-text-secondary">
                              Updated {new Date(group.updatedAt).toLocaleString()}
                            </p>
                          </td>
                          <td className="px-3 py-3 text-text-secondary">
                            <p>Part {group.questionSet.part}</p>
                            <p className="font-semibold text-text-primary">
                              {group.questionSet.title}
                            </p>
                          </td>
                          <td className="px-3 py-3 text-text-secondary">
                            {group._count.questions}
                          </td>
                          <td className="px-3 py-3">
                            <div className="flex flex-wrap gap-2">
                              <MediaState active={Boolean(group.audioUrl)} label="Audio" />
                              <MediaState active={Boolean(group.imageUrl)} label="Image" />
                              <MediaState active={Boolean(group.transcript)} label="Transcript" />
                            </div>
                          </td>
                          <td className="rounded-r-md px-3 py-3">
                            <AdminButton
                              onClick={() => selectGroup(group)}
                              tone={isActive ? "primary" : "ghost"}
                              type="button"
                            >
                              {isActive ? "Editing" : "Edit"}
                            </AdminButton>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : null}
          </div>

          <div className="glass-panel h-fit rounded-lg p-4">
            <div className="mb-4">
              <h2 className="text-lg font-bold text-text-primary">
                {editingGroup ? "Edit selected group" : "Select a group"}
              </h2>
              <p className="text-sm text-text-secondary">
                {editingGroup
                  ? `Part ${editingGroup.questionSet.part} - ${editingGroup.questionSet.title}`
                  : "Chon TOEIC group tu danh sach ben trai."}
              </p>
            </div>

            {editingGroup ? (
              <div className="grid gap-4">
                <AdminInput
                  disabled
                  label="Group title"
                  value={editingGroup.title ?? ""}
                />

                <div className="grid gap-3 md:grid-cols-[1fr_auto] md:items-end">
                  <AdminInput
                    label="Audio URL"
                    onChange={(event) => updateField("audioUrl", event.target.value)}
                    value={form.audioUrl}
                  />
                  <AdminButton
                    disabled={!form.audioUrl.trim()}
                    onClick={() => void copyFieldValue(form.audioUrl)}
                    tone="ghost"
                    type="button"
                  >
                    Copy
                  </AdminButton>
                </div>

                <div className="grid gap-3 md:grid-cols-[1fr_auto] md:items-end">
                  <label className="grid gap-1.5 text-sm font-semibold text-text-primary">
                    <span>Upload audio</span>
                    <input
                      accept="audio/mpeg,audio/wav,audio/mp4,audio/ogg"
                      className="min-h-11 rounded-md border border-border bg-surface-strong px-3 py-2 text-sm font-medium text-text-primary outline-none transition file:mr-3 file:rounded-md file:border-0 file:bg-primary file:px-3 file:py-2 file:text-sm file:font-semibold file:text-white focus:border-primary"
                      onChange={(event) => setAudioUpload(event.target.files?.[0] ?? null)}
                      type="file"
                    />
                  </label>
                  <AdminButton
                    disabled={uploadingKind !== null}
                    onClick={() => void uploadAndAttach("AUDIO")}
                    type="button"
                  >
                    {uploadingKind === "AUDIO" ? "Uploading..." : "Upload audio"}
                  </AdminButton>
                </div>

                <div className="grid gap-3 md:grid-cols-[1fr_auto] md:items-end">
                  <AdminInput
                    label="Image URL"
                    onChange={(event) => updateField("imageUrl", event.target.value)}
                    value={form.imageUrl}
                  />
                  <AdminButton
                    disabled={!form.imageUrl.trim()}
                    onClick={() => void copyFieldValue(form.imageUrl)}
                    tone="ghost"
                    type="button"
                  >
                    Copy
                  </AdminButton>
                </div>

                <div className="grid gap-3 md:grid-cols-[1fr_auto] md:items-end">
                  <label className="grid gap-1.5 text-sm font-semibold text-text-primary">
                    <span>Upload image</span>
                    <input
                      accept="image/jpeg,image/png,image/webp"
                      className="min-h-11 rounded-md border border-border bg-surface-strong px-3 py-2 text-sm font-medium text-text-primary outline-none transition file:mr-3 file:rounded-md file:border-0 file:bg-primary file:px-3 file:py-2 file:text-sm file:font-semibold file:text-white focus:border-primary"
                      onChange={(event) => setImageUpload(event.target.files?.[0] ?? null)}
                      type="file"
                    />
                  </label>
                  <AdminButton
                    disabled={uploadingKind !== null}
                    onClick={() => void uploadAndAttach("IMAGE")}
                    type="button"
                  >
                    {uploadingKind === "IMAGE" ? "Uploading..." : "Upload image"}
                  </AdminButton>
                </div>

                <AdminTextarea
                  label="Transcript"
                  onChange={(event) => updateField("transcript", event.target.value)}
                  value={form.transcript}
                />

                <AdminButton
                  disabled={isSaving}
                  onClick={() => void saveMedia()}
                  type="button"
                >
                  {isSaving ? "Saving..." : "Save media"}
                </AdminButton>

                <div className="rounded-lg border border-border bg-surface-strong p-4">
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <h3 className="text-base font-bold text-text-primary">Preview</h3>
                    <Link
                      className="text-sm font-semibold text-primary hover:text-hover"
                      href="/admin/files"
                    >
                      Open file library
                    </Link>
                  </div>

                  {resolvedAudioUrl ? (
                    <audio className="w-full" controls src={resolvedAudioUrl}>
                      <track kind="captions" />
                    </audio>
                  ) : (
                    <p className="text-sm text-text-secondary">Chua co audio.</p>
                  )}

                  {resolvedImageUrl ? (
                    <div className="mt-4">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        alt={editingGroup.title ?? "TOEIC group image"}
                        className="max-h-64 w-full rounded-md object-contain"
                        src={resolvedImageUrl}
                      />
                    </div>
                  ) : null}

                  {form.transcript.trim() ? (
                    <div className="mt-4 whitespace-pre-line rounded-md border border-border bg-white/70 p-4 text-sm leading-6 text-text-secondary">
                      {form.transcript}
                    </div>
                  ) : null}
                </div>

                {editingGroup.questions.length > 0 ? (
                  <div className="rounded-lg border border-border bg-surface-strong p-4">
                    <h3 className="text-base font-bold text-text-primary">Questions</h3>
                    <div className="mt-3 grid gap-2">
                      {editingGroup.questions.map((question) => (
                        <div
                          className="rounded-md border border-border bg-white/70 px-3 py-2 text-sm text-text-secondary"
                          key={question.id}
                        >
                          <span className="font-semibold text-text-primary">
                            {question.order + 1}.
                          </span>{" "}
                          {question.content}
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>
            ) : (
              <InlineMessage message="Chon TOEIC group de bat dau cap nhat media." />
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
