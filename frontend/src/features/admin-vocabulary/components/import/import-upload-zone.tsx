import React, { useState } from "react";
import { Upload } from "@/components/ui/upload";
import { Button } from "@/components/ui/button";

interface ImportUploadZoneProps {
  onFileSelected: (file: File) => void;
  isLoading?: boolean;
}

export function ImportUploadZone({ onFileSelected, isLoading = false }: ImportUploadZoneProps) {
  const [mode, setMode] = useState<"csv" | "zip">("csv");

  // Download CSV-only template
  const handleDownloadCsvTemplate = () => {
    const csvContent =
      "\uFEFF" +
      [
        "Từ vựng (Word)*,Phiên âm (Phonetic),Nghĩa tiếng Việt (Meaning)*,Từ loại (Part of Speech)*,Ví dụ (Example),Dịch nghĩa ví dụ (Example Translation)",
        "sustainable,/səˈsteɪnəbl/,bền vững,adjective,This is a sustainable project.,Đây là một dự án bền vững.",
        "pollute,/pəˈluːt/,làm ô nhiễm,verb,Factories pollute the air.,Các nhà máy làm ô nhiễm không khí.",
        "biodiversity,/ˌbaɪəʊdaɪˈvɜːsəti/,đa dạng sinh học,noun,We must preserve the biodiversity of the forest.,Chúng ta phải bảo tồn sự đa dạng sinh học của rừng.",
      ].join("\r\n");

    triggerDownload(csvContent, "vocabulary_import_template.csv", "text/csv;charset=utf-8;");
  };

  // Download ZIP instructions (text file guide inside a simulated blob)
  const handleDownloadZipGuide = () => {
    const guide =
      "HƯỚNG DẪN IMPORT ZIP + ẢNH\r\n" +
      "===========================\r\n\r\n" +
      "Cấu trúc file ZIP:\r\n" +
      "  my_import.zip\r\n" +
      "  ├── vocabulary.csv      ← file CSV từ vựng\r\n" +
      "  └── images/\r\n" +
      "      ├── document.jpg   ← tên file = từ vựng (không phân biệt hoa thường)\r\n" +
      "      ├── printer.png\r\n" +
      "      └── schedule.webp\r\n\r\n" +
      "Quy tắc đặt tên ảnh:\r\n" +
      "  - Tên file ảnh = từ vựng (cột Word trong CSV)\r\n" +
      "  - Không cần khớp hoa/thường (document.jpg = DOCUMENT.jpg)\r\n" +
      "  - Định dạng chấp nhận: .jpg, .jpeg, .png, .webp\r\n" +
      "  - Dung lượng tối đa mỗi ảnh: 5 MB\r\n\r\n" +
      "Từ không có ảnh vẫn được nhập bình thường.\r\n";

    triggerDownload(guide, "zip_import_guide.txt", "text/plain;charset=utf-8;");
  };

  function triggerDownload(content: string, fileName: string, mimeType: string) {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", fileName);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  const acceptAttr = mode === "zip" ? ".zip" : ".csv,.xlsx,.xls";
  const placeholder = isLoading
    ? "Đang xử lý, vui lòng chờ..."
    : mode === "zip"
    ? "Kéo thả file .zip vào đây hoặc click để chọn"
    : "Kéo thả file Excel hoặc CSV vào đây hoặc click để chọn";

  return (
    <div className="space-y-6 max-w-2xl mx-auto py-4">
      <div className="text-center">
        <h3 className="text-lg font-bold text-text-primary mb-1">Tải tài liệu từ vựng lên</h3>
        <p className="text-xs text-text-secondary/80">
          Nhập hàng loạt từ vựng từ file Excel/CSV hoặc ZIP kèm ảnh minh họa.
        </p>
      </div>

      {/* Mode toggle */}
      <div className="flex rounded-xl border border-border overflow-hidden bg-surface/50 p-1 gap-1">
        <button
          type="button"
          onClick={() => setMode("csv")}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all ${
            mode === "csv"
              ? "bg-primary text-white shadow-sm"
              : "text-text-secondary hover:bg-surface"
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">table_view</span>
          Chỉ CSV / Excel
        </button>
        <button
          type="button"
          onClick={() => setMode("zip")}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all ${
            mode === "zip"
              ? "bg-primary text-white shadow-sm"
              : "text-text-secondary hover:bg-surface"
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">photo_library</span>
          ZIP kèm ảnh
        </button>
      </div>

      {/* Info banner for ZIP mode */}
      {mode === "zip" && (
        <div className="rounded-xl bg-blue-50 border border-blue-200 p-4 space-y-2">
          <p className="text-xs font-bold text-blue-800 flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[16px]">info</span>
            Cấu trúc file ZIP chuẩn
          </p>
          <div className="font-mono text-[11px] text-blue-700 bg-blue-100 rounded-lg p-3 leading-relaxed">
            my_import.zip<br />
            {"├── vocabulary.csv"}<br />
            {"└── images/"}<br />
            {"    ├── document.jpg"}&nbsp;<span className="text-blue-400">← tên = từ vựng</span><br />
            {"    ├── printer.png"}<br />
            {"    └── schedule.webp"}
          </div>
          <p className="text-[11px] text-blue-600">
            • Tên ảnh phải trùng với từ vựng (không phân biệt hoa/thường)<br />
            • Định dạng: .jpg, .png, .webp · Tối đa 5 MB/ảnh<br />
            • Từ không có ảnh vẫn được nhập bình thường
          </p>
        </div>
      )}

      <Upload
        accept={acceptAttr}
        onChange={(file) => file && onFileSelected(file)}
        placeholder={placeholder}
      />

      {/* Download helpers */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 flex items-center justify-between gap-3 p-3.5 border border-border bg-surface/30 rounded-xl">
          <div className="flex items-center gap-2.5">
            <span className="material-symbols-outlined text-primary text-2xl">download_file</span>
            <div>
              <p className="text-xs font-bold text-text-primary">File mẫu CSV</p>
              <p className="text-[10px] text-text-secondary">Cấu trúc cột chuẩn EnglishTobi</p>
            </div>
          </div>
          <Button variant="secondary" size="sm" onClick={handleDownloadCsvTemplate}>
            Tải CSV
          </Button>
        </div>

        {mode === "zip" && (
          <div className="flex-1 flex items-center justify-between gap-3 p-3.5 border border-blue-200 bg-blue-50/50 rounded-xl">
            <div className="flex items-center gap-2.5">
              <span className="material-symbols-outlined text-blue-600 text-2xl">folder_zip</span>
              <div>
                <p className="text-xs font-bold text-blue-800">Hướng dẫn ZIP</p>
                <p className="text-[10px] text-blue-600">Chi tiết cách đóng gói file</p>
              </div>
            </div>
            <Button variant="secondary" size="sm" onClick={handleDownloadZipGuide}>
              Tải guide
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
export default ImportUploadZone;
