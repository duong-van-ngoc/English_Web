import React from "react";
import { Button } from "@/components/ui/button";

interface TopicActionMenuProps {
  onBulkPublish?: () => void;
  onBulkLock?: () => void;
  selectedCount: number;
}

export function TopicActionMenu({ onBulkPublish, onBulkLock, selectedCount }: TopicActionMenuProps) {
  if (selectedCount === 0) return null;

  return (
    <div className="flex items-center gap-3 p-4 bg-primary/5 border border-primary/20 rounded-xl mb-4 animate-in slide-in-from-top-2 duration-200">
      <span className="text-sm font-semibold text-primary">
        Đã chọn {selectedCount} chủ đề:
      </span>
      <div className="flex items-center gap-2">
        {onBulkPublish && (
          <Button variant="secondary" size="sm" onClick={onBulkPublish} className="gap-1">
            <span className="material-symbols-outlined text-xs">publish</span>
            Xuất bản hàng loạt
          </Button>
        )}
        {onBulkLock && (
          <Button variant="danger" size="sm" onClick={onBulkLock} className="gap-1">
            <span className="material-symbols-outlined text-xs">lock</span>
            Khóa hàng loạt
          </Button>
        )}
      </div>
    </div>
  );
}
export default TopicActionMenu;
