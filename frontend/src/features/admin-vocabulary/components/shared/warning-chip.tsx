import React from "react";

interface WarningChipProps {
  message: string;
  type?: "warning" | "error" | "info";
}

export function WarningChip({ message, type = "warning" }: WarningChipProps) {
  const styles = {
    warning: "bg-amber-50 text-amber-700 border-amber-200/50",
    error: "bg-error/5 text-error border-error/20",
    info: "bg-primary/5 text-primary border-primary/20",
  }[type];

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${styles}`}
    >
      <span className="material-symbols-outlined text-[14px]">warning</span>
      {message}
    </span>
  );
}
export default WarningChip;
