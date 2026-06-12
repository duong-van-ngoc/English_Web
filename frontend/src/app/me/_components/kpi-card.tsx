import type { ReactNode } from "react";

export function KpiCard({
  title,
  value,
  icon,
  className = "",
}: {
  title: string;
  value: string | number;
  icon?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`glass-card flex items-center gap-4 rounded-xl p-5 ${className}`}
    >
      {icon ? (
        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
          {icon}
        </div>
      ) : null}
      <div>
        <p className="text-sm font-medium text-text-secondary">{title}</p>
        <p className="mt-1 text-2xl font-bold text-text-primary">{value}</p>
      </div>
    </div>
  );
}
