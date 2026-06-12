import React from "react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({
  title,
  description,
  icon = "folder_open",
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center border border-dashed border-border/60 rounded-2xl bg-surface/30">
      <span className="material-symbols-outlined text-5xl text-text-secondary/50 mb-3">
        {icon}
      </span>
      <h3 className="text-base font-bold text-text-primary mb-1">
        {title}
      </h3>
      <p className="text-xs text-text-secondary/70 max-w-sm mb-6">
        {description}
      </p>
      {actionLabel && onAction && (
        <Button variant="primary" size="sm" onClick={onAction} type="button">
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
export default EmptyState;
