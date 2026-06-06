import React from "react";
import { Button } from "@/components/ui/button";

interface ImportConfirmPanelProps {
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
  isValid: boolean;
}

export function ImportConfirmPanel({ onConfirm, onCancel, isLoading = false, isValid }: ImportConfirmPanelProps) {
  return (
    <div className="flex items-center justify-between gap-4 p-5 bg-white/40 border border-border/80 rounded-2xl">
      <div className="text-left max-w-md">
        <h4 className="text-sm font-bold text-text-primary mb-1">Xác nhận nhập dữ liệu</h4>
        <p className="text-xs text-text-secondary leading-relaxed">
          {isValid
            ? "Tất cả các dòng dữ liệu đều hợp lệ. Bạn có thể tiến hành lưu vào cơ sở dữ liệu."
            : "Có dòng dữ liệu không hợp lệ. Vui lòng sửa lại file hoặc chỉ nhập các dòng hợp lệ."}
        </p>
      </div>
      <div className="flex items-center gap-3 shrink-0">
        <Button variant="secondary" onClick={onCancel} disabled={isLoading}>
          Hủy bỏ
        </Button>
        <Button variant="primary" onClick={onConfirm} disabled={isLoading || !isValid}>
          {isLoading ? "Đang lưu..." : "Nhập dữ liệu"}
        </Button>
      </div>
    </div>
  );
}
export default ImportConfirmPanel;
