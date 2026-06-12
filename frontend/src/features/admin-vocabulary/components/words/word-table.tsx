import React from "react";
import Link from "next/link";
import { VOCABULARY_ROUTES } from "../../constants/vocabulary-routes";
import type { VocabularyWord } from "../../types/vocabulary-word.type";

interface WordTableProps {
  words: VocabularyWord[];
  topicId: string;
  onPublish: (id: string) => void;
  onArchive: (id: string) => void;
}

const STATUS_CONFIG: Record<string, { label: string; className: string }> = {
  PUBLISHED: {
    label: "Đã xuất bản",
    className: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  },
  DRAFT: {
    label: "Bản nháp",
    className: "bg-amber-50 text-amber-700 border border-amber-200",
  },
  ARCHIVED: {
    label: "Lưu trữ",
    className: "bg-slate-50 text-slate-500 border border-slate-200",
  },
};

const POS_COLOR: Record<string, string> = {
  noun: "text-blue-600 bg-blue-50",
  verb: "text-purple-600 bg-purple-50",
  adjective: "text-rose-600 bg-rose-50",
  adverb: "text-teal-600 bg-teal-50",
  phrase: "text-orange-600 bg-orange-50",
  "noun phrase": "text-indigo-600 bg-indigo-50",
  "verb phrase": "text-violet-600 bg-violet-50",
  "phrasal verb": "text-fuchsia-600 bg-fuchsia-50",
};

export function WordTable({ words, topicId, onPublish, onArchive }: WordTableProps) {
  if (words.length === 0) {
    return (
      <div className="py-16 text-center">
        <span className="material-symbols-outlined text-5xl text-text-secondary/30 mb-3 block">
          library_books
        </span>
        <p className="text-sm font-medium text-text-secondary/60">
          Chưa có từ vựng nào trong chủ đề này.
        </p>
        <p className="text-xs text-text-secondary/40 mt-1">
          Thêm từ mới hoặc nhập từ file Excel/CSV để bắt đầu.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        {/* Header */}
        <thead>
          <tr className="border-b border-border/60 bg-primary/[0.03]">
            <th className="px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-text-secondary w-[38%]">
              Từ vựng
            </th>
            <th className="px-3 py-3 text-[11px] font-bold uppercase tracking-wider text-text-secondary w-[10%]">
              Từ loại
            </th>
            <th className="px-3 py-3 text-[11px] font-bold uppercase tracking-wider text-text-secondary">
              Nghĩa tiếng Việt
            </th>
            <th className="px-3 py-3 text-[11px] font-bold uppercase tracking-wider text-text-secondary w-[14%]">
              Trạng thái
            </th>
            <th className="px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-text-secondary text-right w-[18%]">
              Thao tác
            </th>
          </tr>
        </thead>

        {/* Body */}
        <tbody className="divide-y divide-border/50">
          {words.map((word) => {
            const statusCfg = STATUS_CONFIG[word.status] ?? STATUS_CONFIG.DRAFT;
            const posClass = POS_COLOR[word.partOfSpeech?.toLowerCase() ?? ""] ?? "text-gray-600 bg-gray-50";

            return (
              <tr
                key={word.id}
                className="hover:bg-primary/[0.025] transition-colors group"
              >
                {/* Từ vựng + phiên âm */}
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    {/* Thumbnail */}
                    {word.imageUrl ? (
                      <img
                        src={word.imageUrl}
                        alt={word.word}
                        className="w-9 h-9 rounded-lg object-cover border border-border/50 shrink-0"
                      />
                    ) : (
                      <div className="w-9 h-9 rounded-lg bg-primary/8 flex items-center justify-center border border-primary/15 shrink-0">
                        <span className="material-symbols-outlined text-[16px] text-primary/50">
                          abc
                        </span>
                      </div>
                    )}

                    {/* Word + phonetic */}
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-text-primary leading-tight truncate">
                        {word.word}
                      </p>
                      {word.phonetic && (
                        <p className="text-[11px] text-text-secondary/70 font-mono mt-0.5 truncate">
                          {word.phonetic}
                        </p>
                      )}
                    </div>
                  </div>
                </td>

                {/* Từ loại */}
                <td className="px-3 py-3">
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-bold capitalize ${posClass}`}
                  >
                    {word.partOfSpeech}
                  </span>
                </td>

                {/* Nghĩa */}
                <td className="px-3 py-3">
                  <p className="text-sm text-text-primary font-medium leading-snug line-clamp-2">
                    {word.meaning}
                  </p>
                </td>

                {/* Trạng thái */}
                <td className="px-3 py-3">
                  <span
                    className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold whitespace-nowrap ${statusCfg.className}`}
                  >
                    {statusCfg.label}
                  </span>
                </td>

                {/* Thao tác */}
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-1">
                    {/* Preview */}
                    <Link
                      href={VOCABULARY_ROUTES.PREVIEW_WORD(topicId, word.id)}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold text-text-secondary hover:text-primary hover:bg-primary/8 transition-all"
                      title="Xem trước"
                    >
                      <span className="material-symbols-outlined text-[14px]">visibility</span>
                      <span className="hidden xl:inline">Xem</span>
                    </Link>

                    {/* Edit */}
                    <Link
                      href={VOCABULARY_ROUTES.EDIT_WORD(topicId, word.id)}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold text-text-secondary hover:text-primary hover:bg-primary/8 transition-all"
                      title="Chỉnh sửa"
                    >
                      <span className="material-symbols-outlined text-[14px]">edit</span>
                      <span className="hidden xl:inline">Sửa</span>
                    </Link>

                    {/* Publish / Unpublish */}
                    {word.status !== "PUBLISHED" ? (
                      <button
                        onClick={() => onPublish(word.id)}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold text-emerald-600 hover:bg-emerald-50 transition-all"
                        title="Xuất bản"
                      >
                        <span className="material-symbols-outlined text-[14px]">publish</span>
                        <span className="hidden xl:inline">Xuất bản</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => onArchive(word.id)}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold text-slate-500 hover:bg-slate-50 transition-all"
                        title="Lưu trữ"
                      >
                        <span className="material-symbols-outlined text-[14px]">archive</span>
                        <span className="hidden xl:inline">Lưu trữ</span>
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default WordTable;
