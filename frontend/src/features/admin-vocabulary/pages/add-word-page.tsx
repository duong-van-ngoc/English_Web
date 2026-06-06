"use client";

import React, { use } from "react";
import Link from "next/link";
import { useTopicDetail } from "../hooks/use-topic-detail";
import { useCreateWord } from "../hooks/use-create-word";
import { WordForm } from "../components/words/word-form";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { ModuleInfoBanner } from "../components/shared/module-info-banner";
import { VOCABULARY_ROUTES } from "../constants/vocabulary-routes";

interface AddWordPageProps {
  params: Promise<{ topicId: string }>;
}

export function AddWordPage({ params }: AddWordPageProps) {
  const { topicId } = use(params);
  const { topic } = useTopicDetail(topicId);
  const { createWord, isCreating } = useCreateWord(topicId);

  const handleFormSubmit = async (values: any) => {
    try {
      await createWord(values);
      window.location.href = VOCABULARY_ROUTES.TOPIC_WORDS(topicId);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Header breadcrumb */}
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold text-text-secondary mb-2">
          <Link href={VOCABULARY_ROUTES.TOPICS_LIST} className="hover:text-primary">
            Chủ đề từ vựng
          </Link>
          <span className="material-symbols-outlined text-[10px]">arrow_forward_ios</span>
          <Link href={VOCABULARY_ROUTES.TOPIC_WORDS(topicId)} className="hover:text-primary">
            {topic?.name || "Danh sách từ"}
          </Link>
          <span className="material-symbols-outlined text-[10px]">arrow_forward_ios</span>
          <span>Thêm từ mới</span>
        </div>
        <h2 className="text-3xl font-extrabold text-text-primary tracking-tight">
          Thêm từ vựng mới
        </h2>
        <p className="text-sm text-text-secondary mt-1">
          Bổ sung từ mới vào chủ đề **{topic?.name}**.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Form panel */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Chi tiết từ vựng</CardTitle>
              <CardDescription>Cung cấp đầy đủ nghĩa, ví dụ, phiên âm và hình ảnh minh họa.</CardDescription>
            </CardHeader>
            <CardContent>
              <WordForm onSubmit={handleFormSubmit} isLoading={isCreating} />
            </CardContent>
          </Card>
        </div>

        {/* Info banners */}
        <div className="space-y-6">
          <ModuleInfoBanner
            title="Quy tắc thêm từ mới"
            description="Từ vựng khi vừa tạo mặc định ở trạng thái DRAFT. Sau khi lưu, bạn có thể kiểm tra hình ảnh và phát âm trước khi nhấn Xuất bản (Publish) để áp dụng cho học viên."
          />
        </div>
      </div>
    </div>
  );
}
export default AddWordPage;
