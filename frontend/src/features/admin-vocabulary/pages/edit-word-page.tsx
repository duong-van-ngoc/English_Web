"use client";

import React, { use } from "react";
import Link from "next/link";
import { useTopicDetail } from "../hooks/use-topic-detail";
import { useWordDetail } from "../hooks/use-word-detail";
import { useUpdateWord } from "../hooks/use-update-word";
import { WordForm } from "../components/words/word-form";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { VOCABULARY_ROUTES } from "../constants/vocabulary-routes";

interface EditWordPageProps {
  params: Promise<{ topicId: string; wordId: string }>;
}

export function EditWordPage({ params }: EditWordPageProps) {
  const { topicId, wordId } = use(params);
  const { topic } = useTopicDetail(topicId);
  const { word, isLoading } = useWordDetail(wordId);
  const { updateWord, isUpdating } = useUpdateWord(topicId, wordId);

  const handleFormSubmit = async (values: any) => {
    try {
      await updateWord(values);
      window.location.href = VOCABULARY_ROUTES.TOPIC_WORDS(topicId);
    } catch (err) {
      console.error(err);
    }
  };

  if (isLoading) {
    return (
      <div className="py-12 text-center text-text-secondary font-medium">
        Đang tải thông tin chi tiết từ vựng...
      </div>
    );
  }

  if (!word) {
    return (
      <div className="py-12 text-center text-text-secondary font-medium">
        Không tìm thấy từ vựng yêu cầu.
      </div>
    );
  }

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
          <span>Chỉnh sửa từ vựng</span>
        </div>
        <h2 className="text-3xl font-extrabold text-text-primary tracking-tight">
          Chỉnh sửa từ vựng
        </h2>
        <p className="text-sm text-text-secondary mt-1">
          Cập nhật thông tin chi tiết cho từ **{word.word}** trong chủ đề **{topic?.name}**.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Form panel */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Cập nhật thông tin</CardTitle>
              <CardDescription>Cập nhật nghĩa, phát âm, âm thanh hoặc hình ảnh minh họa.</CardDescription>
            </CardHeader>
            <CardContent>
              <WordForm initialValues={word} onSubmit={handleFormSubmit} isLoading={isUpdating} />
            </CardContent>
          </Card>
        </div>

        {/* Info or helper cards */}
        <div className="space-y-6">
          <Card className="bg-white/40 border border-border/80 p-5 rounded-2xl text-xs text-text-secondary leading-relaxed">
            <h4 className="font-bold text-text-primary mb-2">Lưu ý khi chỉnh sửa</h4>
            <p>
              Việc sửa đổi nghĩa hoặc từ loại sẽ trực tiếp thay đổi nội dung học của học viên ngay lập tức sau khi bạn nhấn Lưu. Cần cẩn trọng khi chỉnh sửa các từ vựng đã được xuất bản để tránh gây hiểu lầm cho học viên.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
export default EditWordPage;
