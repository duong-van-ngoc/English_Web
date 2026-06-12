import React from "react";
import Link from "next/link";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "../shared/status-badge";
import { ActionDropdown } from "../shared/action-dropdown";
import { VOCABULARY_ROUTES } from "../../constants/vocabulary-routes";
import type { VocabularyTopic } from "../../types/vocabulary-topic.type";

interface TopicTableProps {
  topics: VocabularyTopic[];
  onLock: (id: string) => void;
  onUnlock: (id: string) => void;
  onPublish: (id: string) => void;
  onUnpublish: (id: string) => void;
  onDelete: (id: string) => void;
}

export function TopicTable({ topics, onLock, onUnlock, onPublish, onUnpublish, onDelete }: TopicTableProps) {
  if (topics.length === 0) {
    return (
      <div className="py-8 text-center text-text-secondary/70">
        Không có chủ đề nào trùng khớp với bộ lọc.
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Chủ đề</TableHead>
          <TableHead>Mô tả</TableHead>
          <TableHead className="whitespace-nowrap">Số lượng từ</TableHead>
          <TableHead className="whitespace-nowrap">Trạng thái</TableHead>
          <TableHead className="text-right whitespace-nowrap">Thao tác</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {topics.map((topic) => (
          <TableRow key={topic.id}>
            <TableCell className="font-bold min-w-[200px]">
              <div className="flex items-center gap-3">
                {topic.imageUrl ? (
                  <img
                    src={topic.imageUrl}
                    alt={topic.name}
                    className="w-10 h-10 rounded-lg object-cover border border-border/50 shrink-0"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
                    <span className="material-symbols-outlined">menu_book</span>
                  </div>
                )}
                <span>{topic.name}</span>
              </div>
            </TableCell>
            <TableCell className="max-w-[300px] truncate text-xs text-text-secondary">
              {topic.description || "Chưa có mô tả"}
            </TableCell>
            <TableCell className="font-semibold text-sm whitespace-nowrap">
              {topic.wordCount} từ
            </TableCell>
            <TableCell className="whitespace-nowrap">
              <StatusBadge status={topic.status} />
            </TableCell>
            <TableCell className="text-right whitespace-nowrap">
              <div className="flex justify-end items-center gap-2">
                <Link href={VOCABULARY_ROUTES.TOPIC_WORDS(topic.id)} passHref legacyBehavior>
                  <Button variant="ghost" size="sm" className="whitespace-nowrap">
                    Quản lý từ
                  </Button>
                </Link>

                <ActionDropdown
                  items={[
                    {
                      label: "Xem chi tiết",
                      icon: "visibility",
                      onClick: () => {
                        window.location.href = VOCABULARY_ROUTES.TOPIC_DETAIL(topic.id);
                      },
                    },
                    {
                      label: "Xem góc học viên",
                      icon: "school",
                      onClick: () => {
                        window.location.href = VOCABULARY_ROUTES.PREVIEW_STUDENT(topic.id);
                      },
                    },
                    ...(topic.status === "DRAFT"
                      ? [
                          {
                            label: "Xuất bản chủ đề",
                            icon: "publish",
                            onClick: () => onPublish(topic.id),
                          },
                        ]
                      : []),
                    ...(topic.status === "PUBLISHED"
                      ? [
                          {
                            label: "Hủy xuất bản",
                            icon: "unpublished",
                            onClick: () => onUnpublish(topic.id),
                          },
                        ]
                      : []),
                    ...(topic.status === "LOCKED"
                      ? [
                          {
                            label: "Mở khóa",
                            icon: "lock_open",
                            onClick: () => onUnlock(topic.id),
                          },
                        ]
                      : [
                          {
                            label: "Khóa chủ đề",
                            icon: "lock",
                            onClick: () => onLock(topic.id),
                          },
                        ]),
                    {
                      label: "Xóa chủ đề",
                      icon: "delete",
                      variant: "danger",
                      onClick: () => onDelete(topic.id),
                    },
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
export default TopicTable;
