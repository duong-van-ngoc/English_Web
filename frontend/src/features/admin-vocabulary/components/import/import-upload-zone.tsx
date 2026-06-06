import React from "react";
import { Upload } from "@/components/ui/upload";
import { Button } from "@/components/ui/button";

interface ImportUploadZoneProps {
  onFileSelected: (file: File) => void;
  isLoading?: boolean;
}

export function ImportUploadZone({ onFileSelected, isLoading = false }: ImportUploadZoneProps) {
  const handleDownloadTemplate = () => {
    // Mock template download trigger
    alert("Đang tải file mẫu import_template.xlsx");
  };

  return (
    <div className="space-y-6 max-w-xl mx-auto py-6">
      <div className="text-center">
        <h3 className="text-lg font-bold text-text-primary mb-2">
          Tải tài liệu từ vựng của bạn lên
        </h3>
        <p className="text-xs text-text-secondary/80 max-w-sm mx-auto">
          Chọn file Excel (.xlsx, .xls) hoặc CSV để nhập hàng loạt từ vựng cùng lúc vào hệ thống.
        </p>
      </div>

      <Upload
        accept=".csv, .xlsx, .xls"
        onChange={(file) => file && onFileSelected(file)}
        placeholder={isLoading ? "Đang xử lý đọc file..." : "Kéo thả file Excel hoặc CSV vào đây, hoặc click để tìm kiếm"}
      />

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border border-border bg-surface-strong/20 rounded-2xl">
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-primary text-3xl">download_file</span>
          <div className="text-left">
            <h4 className="text-xs font-bold text-text-primary">File mẫu chuẩn EnglishTobi</h4>
            <p className="text-[10px] text-text-secondary">Chứa đầy đủ cột mẫu định dạng hợp lệ</p>
          </div>
        </div>
        <Button variant="secondary" size="sm" onClick={handleDownloadTemplate} className="w-full sm:w-auto">
          Tải file mẫu
        </Button>
      </div>
    </div>
  );
}
export default ImportUploadZone;
