"use client";

import React, { use } from "react";
import Link from "next/link";
import { useTopicDetail } from "../hooks/use-topic-detail";
import { useWordDetail } from "../hooks/use-word-detail";
import { usePublishWord } from "../hooks/use-publish-word";
import { FlashcardPreview } from "../components/preview/flashcard-preview";
import { PublishReadinessPanel } from "../components/preview/publish-readiness-panel";
import { WordDetailsPanel } from "../components/preview/word-details-panel";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PreviewWarningCard } from "../components/preview/preview-warning-card";
import { VOCABULARY_ROUTES } from "../constants/vocabulary-routes";

interface PreviewFlashcardPageProps {
  params: Promise<{ topicId: string; wordId: string }>;
}

export function PreviewFlashcardPage({ params }: PreviewFlashcardPageProps) {
  const { topicId, wordId } = use(params);
  const { topic } = useTopicDetail(topicId);
  const { word, isLoading, refetch } = useWordDetail(wordId);
  const { publishWord, isPublishing } = usePublishWord(topicId);

  const handlePublish = async () => {
    try {
      await publishWord(wordId);
      refetch();
      window.location.href = VOCABULARY_ROUTES.TOPIC_WORDS(topicId);
    } catch (err) {
      console.error(err);
    }
  };

  if (isLoading) {
    return (
      <div className="py-12 text-center text-text-secondary font-medium">
        Đang tải thông tin xem trước từ vựng...
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

  const isWordPublished = word.status === "PUBLISHED";

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
            <Link href={VOCABULARY_ROUTES.TOPIC_WORDS(topicId)} className="hover:text-primary">
              {topic?.name || "Danh sách từ"}
            </Link>
            <span className="material-symbols-outlined text-[10px]">arrow_forward_ios</span>
            <span>Xem trước Flashcard</span>
          </div>
          <h2 className="text-3xl font-extrabold text-text-primary tracking-tight">
            Xem trước Flashcard
          </h2>
          <p className="text-sm text-text-secondary mt-1">
            Giao diện thực tế hiển thị cho học viên.
          </p>
        </div>

        {!isWordPublished && (
          <Button variant="primary" className="gap-2" onClick={handlePublish} disabled={isPublishing}>
            <span className="material-symbols-outlined">publish</span>
            Xuất bản ngay
          </Button>
        )}
      </div>

      {/* Preview alert warning */}
      <PreviewWarningCard />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Flashcard 3D simulation */}
        <div className="lg:col-span-1">
          <Card className="py-10">
            <FlashcardPreview
              word={word.word}
              phonetic={word.phonetic}
              meaning={word.meaning}
              example={word.example}
              imageUrl={word.imageUrl}
              audioUrl={word.audioUrl}
            />
          </Card>
        </div>

        {/* Text details and health audit */}
        <div className="lg:col-span-2 space-y-6">
          <PublishReadinessPanel
            hasPhonetic={Boolean(word.phonetic)}
            hasAudio={Boolean(word.audioUrl)}
            hasImage={Boolean(word.imageUrl)}
            hasExample={Boolean(word.example)}
          />

          <WordDetailsPanel
            word={word.word}
            partOfSpeech={word.partOfSpeech}
            meaning={word.meaning}
            phonetic={word.phonetic}
            example={word.example}
          />
        </div>
      </div>
    </div>
  );
}
export default PreviewFlashcardPage;
