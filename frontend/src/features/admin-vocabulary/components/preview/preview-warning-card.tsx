import React from "react";

export function PreviewWarningCard() {
  return (
    <div className="flex items-center gap-3 p-4 bg-amber-50 border border-amber-200/50 rounded-2xl">
      <span className="material-symbols-outlined text-amber-600 text-2xl">visibility</span>
      <div className="text-left">
        <h4 className="text-sm font-bold text-amber-800">Chế độ Xem trước nội dung</h4>
        <p className="text-xs text-amber-700/90 leading-relaxed mt-0.5">
          Giao diện đang giả lập góc nhìn thực tế của học viên trên ứng dụng di động/web. Mọi thay đổi về từ vựng sẽ chỉ có hiệu lực với học viên sau khi bạn nhấn nút **Xuất bản (Publish)**.
        </p>
      </div>
    </div>
  );
}
export default PreviewWarningCard;
