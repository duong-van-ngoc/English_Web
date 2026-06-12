"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

import {
  AdminButton,
  AdminInput,
  AdminPageTitle,
  AdminSelect,
  ConfirmPanel,
  InlineMessage,
} from "@/features/admin/components/admin-ui";
import { api, isApiError } from "@/lib/api";
import { resolveMediaUrl } from "@/lib/media";
import type { FileAsset, FileAssetListResult, FileKind } from "@/types";

const pageSize = 24;

function formatBytes(bytes: number) {
  if (bytes < 1024) {
    return `${bytes} B`;
  }

  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function KindBadge({ kind }: { kind: FileKind }) {
  const classes =
    kind === "AUDIO"
      ? "border-primary/30 bg-primary/10 text-primary"
      : "border-secondary/40 bg-secondary/20 text-text-primary";

  return <span className={`rounded-md border px-2 py-1 text-xs font-semibold ${classes}`}>{kind}</span>;
}

export default function AdminFilesPage() {
  const [deleteTarget, setDeleteTarget] = useState<FileAsset | null>(null);
  const [error, setError] = useState("");
  const [filesResult, setFilesResult] = useState<FileAssetListResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isMutating, setIsMutating] = useState(false);
  const [kindFilter, setKindFilter] = useState<FileKind | "">("");
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState("");
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadKind, setUploadKind] = useState<FileKind>("AUDIO");

  const loadFiles = useCallback(async () => {
    setIsLoading(true);

    try {
      const data = await api.getAdminFileAssets({
        kind: kindFilter || undefined,
        page,
        pageSize,
        search: search.trim() || undefined,
      });

      setFilesResult(data);
      setError("");
    } catch (loadError) {
      setError(isApiError(loadError) ? loadError.message : "Khong tai duoc files.");
    } finally {
      setIsLoading(false);
    }
  }, [kindFilter, page, search]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadFiles();
    }, 0);

    return () => window.clearTimeout(timer);
  }, [loadFiles]);

  async function handleUpload() {
    if (!uploadFile) {
      setError("Chon file truoc khi upload.");
      return;
    }

    setIsMutating(true);
    setToast("");
    setError("");

    try {
      const asset = await api.uploadFile(uploadKind, uploadFile);
      setUploadFile(null);
      setPage(1);
      await loadFiles();
      setToast(`${asset.originalName} da duoc upload.`);
    } catch (uploadError) {
      setError(isApiError(uploadError) ? uploadError.message : "Khong upload duoc file.");
    } finally {
      setIsMutating(false);
    }
  }

  async function handleDelete() {
    if (!deleteTarget) {
      return;
    }

    setIsMutating(true);
    setToast("");
    setError("");

    try {
      await api.deleteAdminFileAsset(deleteTarget.id);
      setDeleteTarget(null);
      await loadFiles();
      setToast("File da duoc xoa.");
    } catch (deleteError) {
      setError(isApiError(deleteError) ? deleteError.message : "Khong xoa duoc file.");
    } finally {
      setIsMutating(false);
    }
  }

  async function copyUrl(asset: FileAsset) {
    const resolvedUrl = resolveMediaUrl(asset.url) ?? asset.url;

    try {
      await navigator.clipboard.writeText(resolvedUrl);
      setToast("Da copy URL.");
      setError("");
    } catch {
      setError("Khong copy duoc URL.");
    }
  }

  const items = filesResult?.items ?? [];
  const total = filesResult?.total ?? 0;
  const hasPreviousPage = page > 1;
  const hasNextPage = page * pageSize < total;

  return (
    <div>
      <AdminPageTitle
        action={
          <Link
            className="inline-flex min-h-10 items-center justify-center rounded-md border border-border bg-surface-strong px-3 py-2 text-sm font-semibold text-text-primary transition hover:border-primary/40 hover:text-primary"
            href="/admin/toeic/groups"
          >
            Open TOEIC media
          </Link>
        }
        description="Upload audio va image, copy URL, preview media, va xoa file khi khong con tham chieu."
        title="Files"
      />

      <div className="grid gap-3">
        {toast ? <InlineMessage message={toast} tone="success" /> : null}
        {error ? <InlineMessage message={error} tone="error" /> : null}

        <section className="glass-panel rounded-lg p-4">
          <div className="grid gap-3 xl:grid-cols-[1fr_220px_auto] xl:items-end">
            <AdminInput
              label="Search"
              onChange={(event) => {
                setPage(1);
                setSearch(event.target.value);
              }}
              placeholder="Original name or storage key"
              type="search"
              value={search}
            />
            <AdminSelect
              label="Kind"
              onChange={(event) => {
                setPage(1);
                setKindFilter(event.target.value as FileKind | "");
              }}
              value={kindFilter}
            >
              <option value="">All</option>
              <option value="AUDIO">Audio</option>
              <option value="IMAGE">Image</option>
            </AdminSelect>
            <AdminButton onClick={() => void loadFiles()} type="button">
              Refresh
            </AdminButton>
          </div>
        </section>

        <section className="glass-panel rounded-lg p-4">
          <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-text-primary">Upload media</h2>
              <p className="text-sm text-text-secondary">
                Audio toi da 10 MB. Image toi da 5 MB.
              </p>
            </div>
          </div>

          <div className="grid gap-3 xl:grid-cols-[220px_1fr_auto] xl:items-end">
            <AdminSelect
              label="Upload kind"
              onChange={(event) => setUploadKind(event.target.value as FileKind)}
              value={uploadKind}
            >
              <option value="AUDIO">Audio</option>
              <option value="IMAGE">Image</option>
            </AdminSelect>

            <label className="grid gap-1.5 text-sm font-semibold text-text-primary">
              <span>File</span>
              <input
                accept={
                  uploadKind === "AUDIO"
                    ? "audio/mpeg,audio/wav,audio/mp4,audio/ogg"
                    : "image/jpeg,image/png,image/webp"
                }
                className="min-h-11 rounded-md border border-border bg-surface-strong px-3 py-2 text-sm font-medium text-text-primary outline-none transition file:mr-3 file:rounded-md file:border-0 file:bg-primary file:px-3 file:py-2 file:text-sm file:font-semibold file:text-white focus:border-primary"
                onChange={(event) => setUploadFile(event.target.files?.[0] ?? null)}
                type="file"
              />
            </label>

            <AdminButton
              disabled={isMutating}
              onClick={() => void handleUpload()}
              type="button"
            >
              {isMutating ? "Uploading..." : "Upload"}
            </AdminButton>
          </div>
        </section>

        {deleteTarget ? (
          <ConfirmPanel
            message={`Ban co chac muon xoa file "${deleteTarget.originalName}"?`}
            onCancel={() => setDeleteTarget(null)}
            onConfirm={() => void handleDelete()}
            pending={isMutating}
          />
        ) : null}

        <section className="glass-panel rounded-lg p-4">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-text-primary">Library</h2>
              <p className="text-sm text-text-secondary">
                {total} file trong thu vien.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <AdminButton
                disabled={!hasPreviousPage || isLoading}
                onClick={() => setPage((current) => Math.max(current - 1, 1))}
                tone="ghost"
                type="button"
              >
                Prev
              </AdminButton>
              <span className="text-sm font-semibold text-text-secondary">
                Page {page}
              </span>
              <AdminButton
                disabled={!hasNextPage || isLoading}
                onClick={() => setPage((current) => current + 1)}
                tone="ghost"
                type="button"
              >
                Next
              </AdminButton>
            </div>
          </div>

          {isLoading ? <InlineMessage message="Dang tai file library..." /> : null}
          {!isLoading && items.length === 0 ? (
            <InlineMessage message="Chua co file nao." />
          ) : null}

          {items.length > 0 ? (
            <div className="grid gap-4 xl:grid-cols-2">
              {items.map((asset) => {
                const resolvedUrl = resolveMediaUrl(asset.url);

                return (
                  <article className="rounded-lg border border-border bg-surface-strong p-4" key={asset.id}>
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="truncate text-base font-bold text-text-primary">
                          {asset.originalName}
                        </p>
                        <p className="mt-1 text-xs text-text-secondary">{asset.storageKey}</p>
                      </div>
                      <KindBadge kind={asset.kind} />
                    </div>

                    <div className="mt-4 grid gap-2 text-sm text-text-secondary sm:grid-cols-2">
                      <p>MIME: {asset.mimeType}</p>
                      <p>Size: {formatBytes(asset.size)}</p>
                      <p>Created: {new Date(asset.createdAt).toLocaleString()}</p>
                      <p>URL: {asset.url}</p>
                    </div>

                    {resolvedUrl ? (
                      <div className="mt-4 rounded-lg border border-border bg-white/70 p-3">
                        {asset.kind === "AUDIO" ? (
                          <audio className="w-full" controls src={resolvedUrl}>
                            <track kind="captions" />
                          </audio>
                        ) : (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            alt={asset.originalName}
                            className="max-h-64 w-full rounded-md object-contain"
                            src={resolvedUrl}
                          />
                        )}
                      </div>
                    ) : null}

                    <div className="mt-4 flex flex-wrap gap-2">
                      <AdminButton
                        onClick={() => void copyUrl(asset)}
                        tone="ghost"
                        type="button"
                      >
                        Copy URL
                      </AdminButton>
                      <Link
                        className="inline-flex min-h-10 items-center justify-center rounded-md border border-border bg-surface px-3 py-2 text-sm font-semibold text-text-primary transition hover:border-primary/40 hover:text-primary"
                        href="/admin/toeic/groups"
                      >
                        Use in TOEIC
                      </Link>
                      <AdminButton
                        disabled={isMutating}
                        onClick={() => setDeleteTarget(asset)}
                        tone="danger"
                        type="button"
                      >
                        Delete
                      </AdminButton>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : null}
        </section>
      </div>
    </div>
  );
}
