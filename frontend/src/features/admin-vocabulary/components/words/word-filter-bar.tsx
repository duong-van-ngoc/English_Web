import React from "react";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { PART_OF_SPEECH_OPTIONS } from "../../constants/part-of-speech-options";

interface WordFilterBarProps {
  search: string;
  onSearchChange: (val: string) => void;
  partOfSpeechFilter: string;
  onPartOfSpeechFilterChange: (val: string) => void;
  statusFilter: string;
  onStatusFilterChange: (val: string) => void;
}

export function WordFilterBar({
  search,
  onSearchChange,
  partOfSpeechFilter,
  onPartOfSpeechFilterChange,
  statusFilter,
  onStatusFilterChange,
}: WordFilterBarProps) {
  return (
    <div className="grid gap-4 md:grid-cols-[1fr_200px_200px] items-end">
      <Input
        label="Tìm kiếm từ vựng"
        placeholder="Nhập từ, phiên âm hoặc nghĩa..."
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        type="search"
      />

      <Select
        label="Từ loại"
        value={partOfSpeechFilter}
        onChange={(e) => onPartOfSpeechFilterChange(e.target.value)}
      >
        <option value="">Tất cả từ loại</option>
        {PART_OF_SPEECH_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </Select>

      <Select
        label="Trạng thái"
        value={statusFilter}
        onChange={(e) => onStatusFilterChange(e.target.value)}
      >
        <option value="">Tất cả trạng thái</option>
        <option value="DRAFT">Bản nháp</option>
        <option value="PUBLISHED">Đã xuất bản</option>
        <option value="ARCHIVED">Đã lưu trữ</option>
      </Select>
    </div>
  );
}
export default WordFilterBar;
