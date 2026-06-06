import React from "react";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ children, className = "", label, error, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <span className="text-sm font-semibold text-text-primary">
            {label}
          </span>
        )}
        <div className="relative w-full">
          <select
            ref={ref}
            className={`input-glass min-h-11 rounded-xl px-4 py-2 text-sm font-medium text-text-primary focus:outline-none w-full appearance-none ${
              error ? "border-error focus:box-shadow-error" : ""
            } ${className}`}
            {...props}
          >
            {children}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-text-secondary">
            <span className="material-symbols-outlined text-lg">
              keyboard_arrow_down
            </span>
          </div>
        </div>
        {error && (
          <span className="text-xs text-error font-medium">
            {error}
          </span>
        )}
      </div>
    );
  }
);

Select.displayName = "Select";
