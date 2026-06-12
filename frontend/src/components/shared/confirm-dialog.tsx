"use client";

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  description: string;
  onConfirm: () => void;
  onCancel: () => void;
}

/**
 * ConfirmDialog component placeholder.
 * Displays a popup panel asking users to confirm risky operations.
 */
export function ConfirmDialog({
  isOpen,
  title,
  description,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="glass-panel p-6 max-w-sm rounded-2xl space-y-4">
        <h4 className="text-lg font-bold text-text-primary">{title}</h4>
        <p className="text-sm text-text-secondary">{description}</p>
        <div className="flex justify-end gap-3">
          <button onClick={onCancel} className="px-4 py-2 border rounded-xl text-sm font-semibold">
            Cancel
          </button>
          <button onClick={onConfirm} className="px-4 py-2 bg-error text-white rounded-xl text-sm font-semibold">
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}
