import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = "", label, error, type = "text", ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <span className="text-sm font-semibold text-text-primary">
            {label}
          </span>
        )}
        <input
          ref={ref}
          type={type}
          className={`input-glass min-h-11 rounded-xl px-4 py-2 text-sm font-medium text-text-primary placeholder:text-text-secondary/50 focus:outline-none w-full ${
            error ? "border-error focus:box-shadow-error" : ""
          } ${className}`}
          {...props}
        />
        {error && (
          <span className="text-xs text-error font-medium">
            {error}
          </span>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
