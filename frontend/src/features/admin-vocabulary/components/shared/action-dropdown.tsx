import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";

interface DropdownItem {
  label: string;
  onClick: () => void;
  icon?: string;
  variant?: "default" | "danger";
}

interface ActionDropdownProps {
  items: DropdownItem[];
  triggerLabel?: string;
}

export function ActionDropdown({ items, triggerLabel = "Hành động" }: ActionDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative inline-block text-left" ref={containerRef}>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 border border-border"
        type="button"
      >
        <span>{triggerLabel}</span>
        <span className="material-symbols-outlined text-sm">
          keyboard_arrow_down
        </span>
      </Button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 rounded-xl bg-white border border-border/80 shadow-lg ring-1 ring-black/5 z-50 overflow-hidden">
          <div className="py-1">
            {items.map((item, idx) => (
              <button
                key={idx}
                onClick={() => {
                  item.onClick();
                  setIsOpen(false);
                }}
                className={`flex items-center gap-2.5 w-full text-left px-4 py-2.5 text-sm hover:bg-primary/5 transition-colors ${
                  item.variant === "danger"
                    ? "text-error hover:bg-error/5"
                    : "text-text-primary"
                }`}
                type="button"
              >
                {item.icon && (
                  <span className={`material-symbols-outlined text-lg ${
                    item.variant === "danger" ? "text-error" : "text-text-secondary"
                  }`}>
                    {item.icon}
                  </span>
                )}
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
export default ActionDropdown;
