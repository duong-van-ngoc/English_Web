import React from "react";
import { Button } from "./button";

interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export function Dialog({ isOpen, onClose, title, children }: DialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-text-primary/30 backdrop-blur-[4px] transition-opacity"
        onClick={onClose}
      />
      
      {/* Content */}
      <div className="relative glass-card w-full max-w-lg p-6 rounded-2xl shadow-xl z-10 border border-border animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-text-primary">
            {title}
          </h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="p-1 rounded-full text-text-secondary hover:text-primary"
            type="button"
          >
            <span className="material-symbols-outlined">close</span>
          </Button>
        </div>
        <div className="text-sm text-text-secondary">
          {children}
        </div>
      </div>
    </div>
  );
}
