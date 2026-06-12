import React from "react";
import { ModuleInfoBanner } from "../shared/module-info-banner";

interface StudentImpactPanelProps {
  newWordsCount: number;
  totalActiveStudents?: number;
}

export function StudentImpactPanel({ newWordsCount, totalActiveStudents = 120 }: StudentImpactPanelProps) {
  if (newWordsCount <= 0) return null;

  return (
    <div className="space-y-4">
      <ModuleInfoBanner
        title="Đánh giá tác động đến học viên"
        description={`Bạn chuẩn bị thêm/xuất bản ${newWordsCount} từ vựng mới vào chủ đề đã tồn tại. Điều này sẽ tác động đến khoảng ${totalActiveStudents} học viên đang hoặc đã hoàn thành chủ đề này.`}
        type="warning"
      />

      <div className="p-5 bg-white/40 border border-border/80 rounded-2xl text-xs text-text-secondary leading-relaxed space-y-2">
        <p className="font-bold text-text-primary mb-1">
          Luật nghiệp vụ hệ thống (VSTEP B1-B2):
        </p>
        <ul className="list-disc list-inside space-y-1">
          <li>
            Trạng thái <strong className="text-success uppercase">Completed (Đã hoàn thành)</strong> của học viên cũ sẽ được **GIỮ NGUYÊN** để tránh cảm giác bị mất thành tích học tập.
          </li>
          <li>
            Học viên sẽ nhận được thông báo: <strong className="text-primary font-bold">+{newWordsCount} từ vựng mới được thêm vào</strong>.
          </li>
          <li>
            Nút <strong className="text-primary font-bold">Learn New Words (Học từ mới)</strong> sẽ xuất hiện bên cạnh chủ đề để học viên bổ sung kiến thức.
          </li>
        </ul>
      </div>
    </div>
  );
}
export default StudentImpactPanel;
