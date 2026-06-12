"use client";

import React, { use, useState } from "react";
import Link from "next/link";
import { useTopicDetail } from "../hooks/use-topic-detail";
import { useTopicWords } from "../hooks/use-topic-words";
import { TopicForm } from "../components/topics/topic-form";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { calculateTopicStats } from "../utils/calculate-topic-stats";
import { detectMissingAssets } from "../utils/detect-missing-assets";
import { VOCABULARY_ROUTES } from "../constants/vocabulary-routes";

interface TopicDetailPageProps {
  params: Promise<{ topicId: string }>;
}

export function TopicDetailPage({ params }: TopicDetailPageProps) {
  const { topicId } = use(params);
  const {
    topic,
    updateTopic,
    publishTopic,
    unpublishTopic,
    isPublishing,
    isUnpublishing,
    isLoading: isTopicLoading
  } = useTopicDetail(topicId);
  const { words, isLoading: isWordsLoading } = useTopicWords(topicId);
  const [isEditing, setIsEditing] = useState(false);

  const handleUpdateTopic = async (values: any) => {
    try {
      await updateTopic(values);
      setIsEditing(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handlePublish = async () => {
    try {
      await publishTopic();
    } catch (err: any) {
      alert(err.message || "Không thể xuất bản chủ đề. Vui lòng kiểm tra lại số lượng từ vựng đã xuất bản.");
    }
  };

  const handleUnpublish = async () => {
    try {
      await unpublishTopic();
    } catch (err: any) {
      alert(err.message || "Không thể hủy xuất bản chủ đề.");
    }
  };

  if (isTopicLoading || isWordsLoading) {
    return (
      <div className="py-12 text-center text-text-secondary font-medium">
        Đang tải thông tin chi tiết chủ đề...
      </div>
    );
  }

  if (!topic) {
    return (
      <div className="py-12 text-center text-text-secondary font-medium">
        Không tìm thấy chủ đề yêu cầu.
      </div>
    );
  }

  const stats = calculateTopicStats(words);

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Header breadcrumb */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-text-secondary mb-2">
            <Link href={VOCABULARY_ROUTES.TOPICS_LIST} className="hover:text-primary">
              Chủ đề từ vựng
            </Link>
            <span className="material-symbols-outlined text-[10px]">arrow_forward_ios</span>
            <span>Chi tiết chủ đề</span>
          </div>
          <h2 className="text-3xl font-extrabold text-text-primary tracking-tight">
            {topic.name}
          </h2>
        </div>
        <div className="flex items-center gap-3">
          {topic.status === "DRAFT" && (
            <Button
              variant="secondary"
              className="gap-2 border-emerald-600 text-emerald-600 hover:bg-emerald-50 bg-white/50"
              disabled={isPublishing}
              onClick={handlePublish}
            >
              <span className="material-symbols-outlined text-emerald-600">publish</span>
              Xuất bản chủ đề
            </Button>
          )}
          {topic.status === "PUBLISHED" && (
            <Button
              variant="secondary"
              className="gap-2 border-amber-600 text-amber-600 hover:bg-amber-50 bg-white/50"
              disabled={isUnpublishing}
              onClick={handleUnpublish}
            >
              <span className="material-symbols-outlined text-amber-600">unpublished</span>
              Hủy xuất bản
            </Button>
          )}
          <Link href={VOCABULARY_ROUTES.PREVIEW_STUDENT(topicId)} passHref legacyBehavior>
            <Button variant="secondary" className="gap-2">
              <span className="material-symbols-outlined">school</span>
              Xem góc học viên
            </Button>
          </Link>
          <Link href={VOCABULARY_ROUTES.TOPIC_WORDS(topicId)} passHref legacyBehavior>
            <Button variant="primary" className="gap-2">
              <span className="material-symbols-outlined">settings</span>
              Quản lý từ vựng
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Toggle Form / Details view */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between border-b border-border/40 pb-4">
              <div>
                <CardTitle>Thông tin chủ đề</CardTitle>
                <CardDescription>Cấu hình chung, ảnh đại diện và mô tả nội dung.</CardDescription>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setIsEditing(!isEditing)} className="gap-1.5">
                <span className="material-symbols-outlined text-sm">{isEditing ? "close" : "edit"}</span>
                {isEditing ? "Hủy bỏ" : "Chỉnh sửa"}
              </Button>
            </CardHeader>
            <CardContent className="pt-6">
              {isEditing ? (
                <TopicForm initialValues={topic} onSubmit={handleUpdateTopic} />
              ) : (
                <div className="grid gap-6 md:grid-cols-3 items-start">
                  <div className="w-full h-40 rounded-2xl overflow-hidden border border-border/50 bg-black/5">
                    {topic.imageUrl ? (
                      <img src={topic.imageUrl} alt={topic.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-text-secondary/50 font-semibold text-xs">
                        Chưa có ảnh bìa
                      </div>
                    )}
                  </div>
                  <div className="md:col-span-2 space-y-4">
                    <div>
                      <span className="text-xs font-semibold text-text-secondary/70 uppercase tracking-widest block mb-1">Mô tả</span>
                      <p className="text-sm leading-relaxed text-text-primary font-medium">
                        {topic.description || "Chưa có thông tin mô tả chi tiết."}
                      </p>
                    </div>
                    <div className="flex gap-4">
                      <div>
                        <span className="text-xs font-semibold text-text-secondary/70 uppercase tracking-widest block mb-1">Trạng thái</span>
                        <Badge variant={topic.status === "PUBLISHED" ? "success" : topic.status === "DRAFT" ? "info" : "danger"}>
                          {topic.status}
                        </Badge>
                      </div>
                      <div>
                        <span className="text-xs font-semibold text-text-secondary/70 uppercase tracking-widest block mb-1">Ngày khởi tạo</span>
                        <p className="text-xs font-bold text-text-primary">
                          {new Date(topic.createdAt).toLocaleDateString("vi-VN")}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar statistics summary */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Thống kê chủ đề</CardTitle>
              <CardDescription>Các chỉ số nội dung chi tiết trong chủ đề.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-2">
              <div className="flex justify-between items-center text-sm border-b border-border/40 pb-3">
                <span className="text-text-secondary font-semibold">Tổng số từ:</span>
                <span className="font-extrabold text-text-primary">{stats.total} từ</span>
              </div>
              <div className="flex justify-between items-center text-sm border-b border-border/40 pb-3">
                <span className="text-text-secondary font-semibold">Từ đã xuất bản:</span>
                <span className="font-extrabold text-success">{stats.published} từ</span>
              </div>
              <div className="flex justify-between items-center text-sm border-b border-border/40 pb-3">
                <span className="text-text-secondary font-semibold">Từ bản nháp:</span>
                <span className="font-extrabold text-primary">{stats.drafts} từ</span>
              </div>
              <div className="flex justify-between items-center text-sm pb-1">
                <span className="text-text-secondary font-semibold">Lưu trữ (Ẩn):</span>
                <span className="font-extrabold text-warning">{stats.archived} từ</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
export default TopicDetailPage;
