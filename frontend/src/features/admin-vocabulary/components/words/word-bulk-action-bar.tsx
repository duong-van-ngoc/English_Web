import React from "react";
import { Button } from "@/components/ui/button";

interface WordBulkActionBarProps {
  selectedCount: number;
  onBulkPublish: () => void;
  onBulkArchive: () => void;
}

export function WordBulkActionBar({
  selectedCount,
  onBulkPublish,
  onBulkArchive,
}: WordBulkActionBarProps) {
  if (selectedCount === 0) return null;

  return (
    <div className="flex items-center justify-between p-4 bg-primary/5 border border-primary/20 rounded-xl mb-4 animate-in slide-in-from-top-2 duration-200">
      <span className="text-sm font-semibold text-primary">
        Đã chọn {selectedCount} từ vựng
      </span>
      <div className="flex gap-2">
        <Button variant="secondary" size="sm" onClick={onBulkPublish} className="gap-1">
          <span className="material-symbols-outlined text-xs">publish</span>
          Xuất bản tất cả
        </Button>
        <Button variant="danger" size="sm" onClick={onBulkArchive} className="gap-1">
          <span className="material-symbols-outlined text-xs">archive</span>
          Lưu trữ tất cả
        </Button>
      </div>
    </div>
  );
}
export default WordBulkActionBar;
