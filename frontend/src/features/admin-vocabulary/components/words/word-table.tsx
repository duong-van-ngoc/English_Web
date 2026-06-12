import React from "react";
import Link from "next/link";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "../shared/status-badge";
import { ActionDropdown } from "../shared/action-dropdown";
import { VOCABULARY_ROUTES } from "../../constants/vocabulary-routes";
import type { VocabularyWord } from "../../types/vocabulary-word.type";

interface WordTableProps {
  words: VocabularyWord[];
  topicId: string;
  onPublish: (id: string) => void;
  onArchive: (id: string) => void;
}

export function WordTable({ words, topicId, onPublish, onArchive }: WordTableProps) {
  const playAudio = (url?: string) => {
    if (!url) return;
    const audio = new Audio(url);
    audio.play().catch((err) => console.log("Audio play failed:", err));
  };

  if (words.length === 0) {
    return (
      <div className="py-8 text-center text-text-secondary/70">
        Chưa có từ vựng nào trong chủ đề này.
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Từ vựng</TableHead>
          <TableHead>Từ loại</TableHead>
          <TableHead>Nghĩa tiếng Việt</TableHead>
          <TableHead>Trạng thái</TableHead>
          <TableHead className="text-right">Thao tác</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {words.map((word) => (
          <TableRow key={word.id}>
            <TableCell className="font-bold min-w-[200px]">
              <div className="flex items-center gap-3">
                {word.imageUrl ? (
                  <img
                    src={word.imageUrl}
                    alt={word.word}
                    className="w-10 h-10 rounded-lg object-cover border border-border/50"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-lg bg-surface flex items-center justify-center border border-border/50 text-text-secondary">
                    <span className="material-symbols-outlined text-base">image</span>
                  </div>
                )}
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-bold text-text-primary">{word.word}</span>
                    {word.audioUrl && (
                      <button
                        onClick={() => playAudio(word.audioUrl)}
                        className="w-6 h-6 rounded-full hover:bg-primary/10 text-primary flex items-center justify-center transition-colors"
                        title="Nghe phát âm"
                        type="button"
                      >
                        <span className="material-symbols-outlined text-sm">volume_up</span>
                      </button>
                    )}
                  </div>
                  {word.phonetic && (
                    <span className="text-xs text-text-secondary/80 font-mono font-medium block">
                      {word.phonetic}
                    </span>
                  )}
                </div>
              </div>
            </TableCell>
            <TableCell className="capitalize text-xs text-text-secondary font-semibold">
              {word.partOfSpeech}
            </TableCell>
            <TableCell className="text-sm text-text-primary font-medium">
              {word.meaning}
            </TableCell>
            <TableCell>
              <StatusBadge status={word.status} />
            </TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end items-center gap-2">
                <Link href={VOCABULARY_ROUTES.PREVIEW_WORD(topicId, word.id)} passHref legacyBehavior>
                  <Button variant="ghost" size="sm">
                    Xem trước
                  </Button>
                </Link>

                <ActionDropdown
                  items={[
                    {
                      label: "Chỉnh sửa từ",
                      icon: "edit",
                      onClick: () => {
                        window.location.href = VOCABULARY_ROUTES.EDIT_WORD(topicId, word.id);
                      },
                    },
                    ...(word.status !== "PUBLISHED"
                      ? [
                          {
                            label: "Xuất bản (Publish)",
                            icon: "publish",
                            onClick: () => onPublish(word.id),
                          },
                        ]
                      : []),
                    ...(word.status !== "ARCHIVED"
                      ? [
                          {
                            label: "Lưu trữ (Archive)",
                            icon: "archive",
                            onClick: () => onArchive(word.id),
                          },
                        ]
                      : []),
                  ]}
                />
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
export default WordTable;
