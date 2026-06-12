import React, { useRef } from "react";

interface UploadProps {
  label?: string;
  accept?: string;
  onChange?: (file: File | null) => void;
  error?: string;
  placeholder?: string;
}

export function Upload({
  label,
  accept,
  onChange,
  error,
  placeholder = "Drag and drop your file here, or click to browse",
}: UploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    onChange?.(file);
  };

  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <span className="text-sm font-semibold text-text-primary">
          {label}
        </span>
      )}
      <div
        onClick={handleClick}
        className={`flex flex-col items-center justify-center border-2 border-dashed border-border/60 rounded-2xl p-6 bg-surface/30 cursor-pointer hover:border-primary/50 hover:bg-surface-strong/40 transition-all duration-200 text-center ${
          error ? "border-error bg-error/5" : ""
        }`}
      >
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept={accept}
          onChange={handleFileChange}
        />
        <span className="material-symbols-outlined text-4xl text-primary mb-2">
          cloud_upload
        </span>
        <p className="text-sm font-semibold text-text-primary mb-1">
          {placeholder}
        </p>
        <p className="text-xs text-text-secondary/70">
          Supports: CSV, XLSX, PNG, JPG, MP3 (depending on field)
        </p>
      </div>
      {error && (
        <span className="text-xs text-error font-medium">
          {error}
        </span>
      )}
    </div>
  );
}
