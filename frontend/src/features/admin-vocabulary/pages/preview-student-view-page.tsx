"use client";

import React, { use } from "react";
import Link from "next/link";
import { useTopicDetail } from "../hooks/use-topic-detail";
import { useTopicWords } from "../hooks/use-topic-words";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PreviewWarningCard } from "../components/preview/preview-warning-card";
import { VOCABULARY_ROUTES } from "../constants/vocabulary-routes";

interface PreviewStudentViewPageProps {
  params: Promise<{ topicId: string }>;
}

export function PreviewStudentViewPage({ params }: PreviewStudentViewPageProps) {
  const { topicId } = use(params);
  const { topic } = useTopicDetail(topicId);
  const { words, isLoading } = useTopicWords(topicId);

  if (isLoading) {
    return (
      <div className="py-12 text-center text-text-secondary font-medium">
        Đang tải chế độ xem trước học viên...
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

  // Business rule simulation:
  // - Topic originally had 80 words.
  // - Learner has completed 80/80 words.
  // - Admin added 20 new words (some are drafts, some published).
  // - Student completed remains "Completed" but shows "+20 new words added"
  const originalWordsCount = 80;
  const newWordsCount = 20;
  const totalWordsCombined = originalWordsCount + newWordsCount;

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
            {topic.name}
          </Link>
          <span className="material-symbols-outlined text-[10px]">arrow_forward_ios</span>
          <span>Xem góc học viên</span>
        </div>
        <h2 className="text-3xl font-extrabold text-text-primary tracking-tight">
          Góc nhìn của học viên
        </h2>
        <p className="text-sm text-text-secondary mt-1">
          Bản mô phỏng trực quan cách học viên nhìn thấy chủ đề này sau khi thêm từ mới.
        </p>
      </div>

      <PreviewWarningCard />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Learner's Topic Card View */}
        <div className="lg:col-span-1 space-y-6">
          <h3 className="text-sm font-bold text-text-primary">Chủ đề hiển thị trong danh sách học viên</h3>
          
          <Card className="overflow-hidden border border-[#cffafe] bg-white/70 backdrop-blur-md shadow-md rounded-3xl">
            {topic.imageUrl && (
              <div className="relative w-full h-40 bg-black/5">
                <img src={topic.imageUrl} alt={topic.name} className="w-full h-full object-cover" />
                <div className="absolute top-3 right-3 bg-green-500 text-white text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider shadow">
                  Completed
                </div>
              </div>
            )}
            
            <CardContent className="p-6 space-y-4">
              <div>
                <h4 className="text-lg font-bold text-text-primary mb-1">
                  {topic.name}
                </h4>
                <p className="text-xs text-text-secondary/80 line-clamp-2">
                  {topic.description || "Không có mô tả"}
                </p>
              </div>

              {/* Progress Bar */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-xs font-bold">
                  <span className="text-text-secondary">Đã học: 80 / 80 từ</span>
                  <span className="text-success">100% Hoàn thành</span>
                </div>
                <div className="w-full h-2.5 bg-green-100 rounded-full overflow-hidden">
                  <div className="h-full bg-green-500 rounded-full" style={{ width: "100%" }} />
                </div>
              </div>

              {/* Business Rule Alert Banner */}
              <div className="p-3.5 bg-primary/10 border border-primary/20 rounded-2xl flex items-start gap-2.5 animate-pulse">
                <span className="material-symbols-outlined text-primary text-lg mt-0.5">add_circle</span>
                <div>
                  <p className="text-xs font-bold text-text-primary leading-tight">
                    +{newWordsCount} từ mới được thêm vào!
                  </p>
                  <p className="text-[10px] text-text-secondary mt-0.5 leading-relaxed">
                    Bạn vẫn giữ nguyên chứng nhận hoàn thành. Bấm nút bên dưới để học bổ sung.
                  </p>
                </div>
              </div>

              <div className="flex gap-2 pt-2 border-t border-border/40">
                <Button variant="secondary" className="flex-1 text-xs py-2 rounded-xl">
                  Luyện tập Quiz
                </Button>
                <Button variant="primary" className="flex-1 text-xs py-2 rounded-xl gap-1">
                  <span className="material-symbols-outlined text-sm">school</span>
                  Học từ mới
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Explanation */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Giải thích thuật toán bảo toàn thành tích</CardTitle>
              <CardDescription>Nguyên lý hoạt động của cơ chế bảo toàn điểm số.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm leading-relaxed text-text-secondary">
              <p>
                Khi Admin bổ sung **{newWordsCount}** từ mới vào chủ đề đã hoàn thành (Ví dụ chủ đề có **80** từ lên thành **100** từ), hệ thống sẽ hoạt động như sau:
              </p>
              
              <div className="p-4 bg-surface rounded-2xl border border-border space-y-3">
                <div className="flex gap-2">
                  <strong className="text-text-primary shrink-0">1. Tiến độ học viên:</strong>
                  <span>Số lượng từ đã học của học viên vẫn là **80/80 (100%)**. Trạng thái của bài học không bị chuyển từ "Completed" về "In progress", tránh gây ức chế cho học viên.</span>
                </div>
                <div className="flex gap-2">
                  <strong className="text-text-primary shrink-0">2. Huy hiệu chỉ báo:</strong>
                  <span>Hệ thống tự động tính toán chênh lệch số từ hiện tại và số từ tại thời điểm hoàn thành (`currentTotalWords - progress.totalWordsInTopic = 20`).</span>
                </div>
                <div className="flex gap-2">
                  <strong className="text-text-primary shrink-0">3. Nút học bổ sung:</strong>
                  <span>Hiển thị thẻ nhắc nhở kèm nút **Học từ mới (Learn New Words)**. Khi học viên click vào, hệ thống chỉ lọc danh sách **20 từ mới** này để học viên học bổ sung qua Flashcard/Quiz.</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
export default PreviewStudentViewPage;
