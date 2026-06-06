import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface PublishReadinessPanelProps {
  hasPhonetic: boolean;
  hasAudio: boolean;
  hasImage: boolean;
  hasExample: boolean;
}

export function PublishReadinessPanel({
  hasPhonetic,
  hasAudio,
  hasImage,
  hasExample,
}: PublishReadinessPanelProps) {
  const checks = [
    { label: "Phiên âm tiếng Anh (Phonetic)", status: hasPhonetic },
    { label: "File phát âm chuẩn (Audio URL)", status: hasAudio },
    { label: "Ảnh minh họa trực quan (Image)", status: hasImage },
    { label: "Câu ví dụ thực hành (Example)", status: hasExample },
  ];

  const isReady = checks.every((c) => c.status);

  return (
    <Card className={isReady ? "border-green-200" : "border-amber-200/50"}>
      <CardHeader className="pb-3 border-b border-border/40 flex flex-row items-center justify-between">
        <div>
          <CardTitle>Kiểm tra độ sẵn sàng xuất bản</CardTitle>
          <CardDescription>Đảm bảo nội dung từ vựng đạt chuẩn trước khi phát hành.</CardDescription>
        </div>
        <Badge variant={isReady ? "success" : "warning"}>
          {isReady ? "Đạt chuẩn" : "Chưa hoàn thiện"}
        </Badge>
      </CardHeader>
      <CardContent className="pt-4 grid gap-3">
        {checks.map((c, idx) => (
          <div key={idx} className="flex items-center justify-between text-sm">
            <span className="text-text-secondary">{c.label}</span>
            <div className="flex items-center gap-1.5 font-bold">
              {c.status ? (
                <span className="text-success flex items-center gap-0.5">
                  <span className="material-symbols-outlined text-base">check_circle</span>
                  Sẵn sàng
                </span>
              ) : (
                <span className="text-amber-600 flex items-center gap-0.5">
                  <span className="material-symbols-outlined text-base">info</span>
                  Còn thiếu
                </span>
              )}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
export default PublishReadinessPanel;
