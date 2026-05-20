import type { ReactNode } from "react";

import type { ContentStatus } from "@/types";

export function StatusBadge({ status }: { status?: ContentStatus }) {
  if (!status) {
    return (
      <span className="rounded-md border border-border bg-surface px-2 py-1 text-xs font-semibold text-text-secondary">
        NONE
      </span>
    );
  }

  const classes =
    status === "PUBLISHED"
      ? "border-success/30 bg-success/10 text-success"
      : "border-warning/30 bg-warning/10 text-warning";

  return (
    <span className={`rounded-md border px-2 py-1 text-xs font-semibold ${classes}`}>
      {status}
    </span>
  );
}

export function AdminPageTitle({
  action,
  description,
  title,
}: {
  action?: ReactNode;
  description?: string;
  title: string;
}) {
  return (
    <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="text-sm font-semibold uppercase tracking-normal text-primary">
          Admin
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-normal text-text-primary">
          {title}
        </h1>
        {description ? (
          <p className="mt-2 max-w-2xl text-sm leading-6 text-text-secondary">
            {description}
          </p>
        ) : null}
      </div>
      {action}
    </div>
  );
}

export function InlineMessage({
  message,
  tone = "info",
}: {
  message: string;
  tone?: "error" | "info" | "success";
}) {
  const classes = {
    error: "border-error/30 bg-error/10 text-error",
    info: "border-border bg-surface text-text-secondary",
    success: "border-success/30 bg-success/10 text-success",
  }[tone];

  return (
    <div className={`rounded-md border px-4 py-3 text-sm font-medium ${classes}`}>
      {message}
    </div>
  );
}

export function AdminButton({
  children,
  className = "",
  tone = "primary",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  tone?: "danger" | "ghost" | "primary" | "secondary";
}) {
  const classes = {
    danger: "border-error/30 bg-error text-white hover:bg-red-600",
    ghost:
      "border-border bg-surface-strong text-text-primary hover:border-primary/40 hover:text-primary",
    primary: "border-primary bg-primary text-white hover:bg-hover",
    secondary:
      "border-secondary/30 bg-secondary/15 text-primary hover:border-primary/40",
  }[tone];

  return (
    <button
      className={`inline-flex min-h-10 items-center justify-center rounded-md border px-3 py-2 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 ${classes} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export function AdminInput({
  label,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return (
    <label className="grid gap-1.5 text-sm font-semibold text-text-primary">
      <span>{label}</span>
      <input
        className="min-h-11 rounded-md border border-border bg-surface-strong px-3 py-2 text-sm font-medium text-text-primary outline-none transition placeholder:text-text-secondary/70 focus:border-primary"
        {...props}
      />
    </label>
  );
}

export function AdminTextarea({
  label,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string }) {
  return (
    <label className="grid gap-1.5 text-sm font-semibold text-text-primary">
      <span>{label}</span>
      <textarea
        className="min-h-28 rounded-md border border-border bg-surface-strong px-3 py-2 text-sm font-medium leading-6 text-text-primary outline-none transition placeholder:text-text-secondary/70 focus:border-primary"
        {...props}
      />
    </label>
  );
}

export function AdminSelect({
  label,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement> & { label: string }) {
  return (
    <label className="grid gap-1.5 text-sm font-semibold text-text-primary">
      <span>{label}</span>
      <select
        className="min-h-11 rounded-md border border-border bg-surface-strong px-3 py-2 text-sm font-medium text-text-primary outline-none transition focus:border-primary"
        {...props}
      />
    </label>
  );
}

export function ConfirmPanel({
  message,
  onCancel,
  onConfirm,
  pending,
}: {
  message: string;
  onCancel: () => void;
  onConfirm: () => void;
  pending?: boolean;
}) {
  return (
    <div className="rounded-lg border border-error/30 bg-error/10 p-4">
      <p className="text-sm font-semibold text-error">{message}</p>
      <p className="mt-1 text-sm text-text-secondary">
        Hanh dong nay khong the hoan tac.
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        <AdminButton disabled={pending} onClick={onConfirm} tone="danger" type="button">
          Xoa
        </AdminButton>
        <AdminButton disabled={pending} onClick={onCancel} tone="ghost" type="button">
          Huy
        </AdminButton>
      </div>
    </div>
  );
}
