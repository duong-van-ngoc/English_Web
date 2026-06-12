import React from "react";
import { Button } from "@/components/ui/button";

interface ImportResultPanelProps {
  totalImported: number;
  onFinish: () => void;
}

export function ImportResultPanel({ totalImported, onFinish }: ImportResultPanelProps) {
  return (
    <div className="text-center py-10 px-6 max-w-md mx-auto space-y-6">
      <div className="w-16 h-16 bg-green-100 border border-green-200 text-green-700 rounded-full flex items-center justify-center mx-auto shadow-md">
        <span className="material-symbols-outlined text-3xl font-extrabold">check_circle</span>
      </div>

      <div className="space-y-2">
        <h3 className="text-xl font-bold text-text-primary">
          Nhập từ vựng thành công!
        </h3>
        <p className="text-sm text-text-secondary leading-relaxed">
          Đã nhập thành công **{totalImported}** từ vựng mới vào hệ thống. Các học viên sẽ thấy những cập nhật này trong khóa học của họ.
        </p>
      </div>

      <Button variant="primary" onClick={onFinish} className="w-full">
        Quay lại trang quản lý từ vựng
      </Button>
    </div>
  );
}
export default ImportResultPanel;
