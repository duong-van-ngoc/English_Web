"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useTopics } from "../hooks/use-topics";
import { useTopicDetail } from "../hooks/use-topic-detail";
import { TopicTable } from "../components/topics/topic-table";
import { TopicFilterBar } from "../components/topics/topic-filter-bar";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { VOCABULARY_ROUTES } from "../constants/vocabulary-routes";
import { Dialog } from "@/components/ui/dialog";

export function TopicsListPage() {
  const { topics, isLoading, refetch } = useTopics();
  
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [sortBy, setSortBy] = useState("updatedAt_desc");

  // Lock/Unlock/Delete state
  const [activeTopicId, setActiveTopicId] = useState<string>("");
  const { updateTopic, deleteTopic } = useTopicDetail(activeTopicId);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleLockTopic = async (id: string) => {
    setActiveTopicId(id);
    await updateTopic({ status: "LOCKED" });
    refetch();
  };

  const handleUnlockTopic = async (id: string) => {
    setActiveTopicId(id);
    await updateTopic({ status: "DRAFT" });
    refetch();
  };

  const handleDeleteTrigger = (id: string) => {
    setActiveTopicId(id);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    await deleteTopic();
    setIsDeleteDialogOpen(false);
    setActiveTopicId("");
    refetch();
  };

  // Filter and sort client-side for mock data
  const filteredTopics = topics
    .filter((t) => {
      const matchSearch =
        t.name.toLowerCase().includes(search.toLowerCase()) ||
        (t.description && t.description.toLowerCase().includes(search.toLowerCase()));
      const matchStatus = statusFilter ? t.status === statusFilter : true;
      return matchSearch && matchStatus;
    })
    .sort((a, b) => {
      if (sortBy === "name_asc") return a.name.localeCompare(b.name);
      if (sortBy === "name_desc") return b.name.localeCompare(a.name);
      if (sortBy === "wordCount_desc") return b.wordCount - a.wordCount;
      if (sortBy === "updatedAt_asc") return new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(); // updatedAt_desc
    });

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-extrabold text-text-primary tracking-tight">
            Chủ đề từ vựng
          </h2>
          <p className="text-sm text-text-secondary mt-1">
            Quản lý các bộ sưu tập từ vựng, tổ chức từ học tập cho học viên VSTEP.
          </p>
        </div>
        <Link href={VOCABULARY_ROUTES.ADD_TOPIC} passHref legacyBehavior>
          <Button variant="primary" className="gap-2">
            <span className="material-symbols-outlined">add_circle</span>
            Tạo chủ đề mới
          </Button>
        </Link>
      </div>

      {/* Filter and Table Container */}
      <Card>
        <CardHeader className="pb-6">
          <TopicFilterBar
            search={search}
            onSearchChange={setSearch}
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
            sortBy={sortBy}
            onSortByChange={setSortBy}
          />
        </CardHeader>
        <CardContent className="p-0 border-t border-border/40">
          {isLoading ? (
            <div className="py-12 text-center text-text-secondary">Đang tải danh sách chủ đề...</div>
          ) : (
            <TopicTable
              topics={filteredTopics}
              onLock={handleLockTopic}
              onUnlock={handleUnlockTopic}
              onDelete={handleDeleteTrigger}
            />
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Modal */}
      <Dialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        title="Xác nhận xóa chủ đề"
      >
        <div className="space-y-4">
          <p className="text-sm leading-relaxed text-text-secondary">
            Bạn có chắc chắn muốn xóa chủ đề từ vựng này? Hành động này sẽ xóa toàn bộ từ vựng nằm trong chủ đề và không thể khôi phục lại.
          </p>
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-border/40">
            <Button variant="secondary" onClick={() => setIsDeleteDialogOpen(false)}>
              Hủy bỏ
            </Button>
            <Button variant="danger" onClick={handleDeleteConfirm}>
              Xác nhận xóa
            </Button>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
export default TopicsListPage;
