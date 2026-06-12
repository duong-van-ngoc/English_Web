import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

interface WordDetailsPanelProps {
  word: string;
  partOfSpeech: string;
  meaning: string;
  phonetic?: string;
  example?: string;
}

export function WordDetailsPanel({
  word,
  partOfSpeech,
  meaning,
  phonetic,
  example,
}: WordDetailsPanelProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Chi tiết dữ liệu văn bản</CardTitle>
        <CardDescription>Thông tin thô được lưu trữ trong cơ sở dữ liệu.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div>
          <span className="text-xs font-semibold text-text-secondary/70 uppercase tracking-wider block mb-1">
            Từ vựng & Từ loại
          </span>
          <p className="text-sm font-bold text-text-primary">
            {word} <span className="text-xs font-semibold text-primary font-mono capitalize">({partOfSpeech})</span>
          </p>
        </div>

        {phonetic && (
          <div>
            <span className="text-xs font-semibold text-text-secondary/70 uppercase tracking-wider block mb-1">
              Phiên âm
            </span>
            <p className="text-sm text-text-primary font-mono font-semibold">
              {phonetic}
            </p>
          </div>
        )}

        <div>
          <span className="text-xs font-semibold text-text-secondary/70 uppercase tracking-wider block mb-1">
            Định nghĩa nghĩa tiếng Việt
          </span>
          <p className="text-sm text-text-primary font-medium">
            {meaning}
          </p>
        </div>

        {example && (
          <div>
            <span className="text-xs font-semibold text-text-secondary/70 uppercase tracking-wider block mb-1">
              Ví dụ sử dụng tiếng Anh
            </span>
            <p className="text-sm text-text-primary italic leading-relaxed">
              "{example}"
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
export default WordDetailsPanel;
