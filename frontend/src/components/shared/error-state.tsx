"use client";

interface ErrorStateProps {
  message?: string;
}

/**
 * ErrorState component placeholder.
 * Displays error messages and action triggers.
 */
export function ErrorState({ message = "An error occurred." }: ErrorStateProps) {
  return (
    <div className="p-8 text-center bg-error/10 border border-error/20 rounded-xl">
      <p className="text-sm font-semibold text-error">{message}</p>
    </div>
  );
}
