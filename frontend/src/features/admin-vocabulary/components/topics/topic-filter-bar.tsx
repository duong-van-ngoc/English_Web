import React from "react";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";

interface TopicFilterBarProps {
  search: string;
  onSearchChange: (val: string) => void;
  statusFilter: string;
  onStatusFilterChange: (val: string) => void;
  sortBy: string;
  onSortByChange: (val: string) => void;
}

export function TopicFilterBar({
  search,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  sortBy,
  onSortByChange,
}: TopicFilterBarProps) {
  return (
    <div className="grid gap-4 md:grid-cols-[1fr_200px_200px] items-end">
      <Input
        label="Tìm kiếm chủ đề"
        placeholder="Nhập tên chủ đề hoặc mô tả..."
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        type="search"
      />

      <Select
        label="Trạng thái"
        value={statusFilter}
        onChange={(e) => onStatusFilterChange(e.target.value)}
      >
        <option value="">Tất cả</option>
        <option value="DRAFT">Bản nháp</option>
        <option value="PUBLISHED">Đã xuất bản</option>
        <option value="LOCKED">Đã khóa</option>
      </Select>

      <Select
        label="Sắp xếp theo"
        value={sortBy}
        onChange={(e) => onSortByChange(e.target.value)}
      >
        <option value="updatedAt_desc">Mới cập nhật</option>
        <option value="updatedAt_asc">Cũ nhất</option>
        <option value="name_asc">Tên A-Z</option>
        <option value="name_desc">Tên Z-A</option>
        <option value="wordCount_desc">Nhiều từ nhất</option>
      </Select>
    </div>
  );
}
export default TopicFilterBar;
