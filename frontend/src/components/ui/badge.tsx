import React from "react";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "success" | "warning" | "danger" | "info" | "primary";
}

export function Badge({
  children,
  className = "",
  variant = "info",
  ...props
}: BadgeProps) {
  const baseStyles = "px-2.5 py-1 text-[10px] font-bold rounded-full uppercase tracking-wider border";

  const variants = {
    primary: "bg-primary/10 border-primary/20 text-primary",
    success: "bg-green-100 border-green-200 text-green-700",
    warning: "bg-amber-100 border-amber-200 text-amber-700",
    danger: "bg-error/10 border-error/20 text-error",
    info: "bg-secondary-container/10 border-secondary-container/20 text-secondary-container",
  };

  return (
    <span
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
}
