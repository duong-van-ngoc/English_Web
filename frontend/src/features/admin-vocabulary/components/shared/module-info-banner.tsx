import React from "react";

interface ModuleInfoBannerProps {
  title?: string;
  description: string;
  type?: "info" | "warning" | "success";
}

export function ModuleInfoBanner({
  title = "Quy tắc nghiệp vụ",
  description,
  type = "info",
}: ModuleInfoBannerProps) {
  const styles = {
    info: "border-primary/20 bg-primary/5 text-text-primary",
    warning: "border-amber-200/50 bg-amber-50 text-amber-800",
    success: "border-green-200 bg-green-50 text-green-800",
  }[type];

  const icons = {
    info: "info",
    warning: "warning",
    success: "check_circle",
  }[type];

  return (
    <div className={`flex items-start gap-4 p-4 border rounded-2xl ${styles}`}>
      <span className="material-symbols-outlined text-xl mt-0.5">
        {icons}
      </span>
      <div className="flex-1">
        <h4 className="text-sm font-bold mb-1">{title}</h4>
        <p className="text-xs leading-normal opacity-90">{description}</p>
      </div>
    </div>
  );
}
export default ModuleInfoBanner;
