"use client";

import React, { use, useState } from "react";
import Link from "next/link";
import { useTopicDetail } from "../hooks/use-topic-detail";
import { useTopicWords } from "../hooks/use-topic-words";
import { usePublishWord } from "../hooks/use-publish-word";
import { useArchiveWord } from "../hooks/use-archive-word";
import { WordTable } from "../components/words/word-table";
import { WordFilterBar } from "../components/words/word-filter-bar";
import { StudentImpactPanel } from "../components/words/student-impact-panel";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { VOCABULARY_ROUTES } from "../constants/vocabulary-routes";

interface TopicWordsManagementPageProps {
  params: Promise<{ topicId: string }>;
}

export function TopicWordsManagementPage({ params }: TopicWordsManagementPageProps) {
  const { topicId } = use(params);
  const { topic } = useTopicDetail(topicId);
  const { words, isLoading, refetch } = useTopicWords(topicId);

  const { publishWord } = usePublishWord(topicId);
  const { archiveWord } = useArchiveWord(topicId);

  const [search, setSearch] = useState("");
  const [partOfSpeechFilter, setPartOfSpeechFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const handlePublish = async (wordId: string) => {
    await publishWord(wordId);
    refetch();
  };

  const handleArchive = async (wordId: string) => {
    await archiveWord(wordId);
    refetch();
  };

  // Filter client-side
  const filteredWords = words.filter((w) => {
    const matchSearch =
      w.word.toLowerCase().includes(search.toLowerCase()) ||
      w.meaning.toLowerCase().includes(search.toLowerCase()) ||
      (w.phonetic && w.phonetic.toLowerCase().includes(search.toLowerCase()));
    const matchPartOfSpeech = partOfSpeechFilter ? w.partOfSpeech === partOfSpeechFilter : true;
    const matchStatus = statusFilter ? w.status === statusFilter : true;
    return matchSearch && matchPartOfSpeech && matchStatus;
  });

  // Calculate new draft/unpublished words added to warn about student impact
  const draftWordsCount = words.filter((w) => w.status === "DRAFT").length;

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
            <Link href={VOCABULARY_ROUTES.TOPIC_DETAIL(topicId)} className="hover:text-primary">
              {topic?.name || "Chủ đề"}
            </Link>
            <span className="material-symbols-outlined text-[10px]">arrow_forward_ios</span>
            <span>Danh sách từ</span>
          </div>
          <h2 className="text-3xl font-extrabold text-text-primary tracking-tight">
            Quản lý từ vựng
          </h2>
          <p className="text-sm text-text-secondary mt-1">
            Chỉnh sửa, thêm mới hoặc nhập từ vựng bằng file vào chủ đề **{topic?.name}**.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link href={VOCABULARY_ROUTES.IMPORT_WORD(topicId)} passHref legacyBehavior>
            <Button variant="secondary" className="gap-2">
              <span className="material-symbols-outlined">upload_file</span>
              Nhập Excel/CSV
            </Button>
          </Link>
          <Link href={VOCABULARY_ROUTES.ADD_WORD(topicId)} passHref legacyBehavior>
            <Button variant="primary" className="gap-2">
              <span className="material-symbols-outlined">add_circle</span>
              Thêm từ mới
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Words Table & Filters */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader className="pb-6">
              <WordFilterBar
                search={search}
                onSearchChange={setSearch}
                partOfSpeechFilter={partOfSpeechFilter}
                onPartOfSpeechFilterChange={setPartOfSpeechFilter}
                statusFilter={statusFilter}
                onStatusFilterChange={setStatusFilter}
              />
            </CardHeader>
            <CardContent className="p-0 border-t border-border/40">
              {isLoading ? (
                <div className="py-12 text-center text-text-secondary">Đang tải danh sách từ vựng...</div>
              ) : (
                <WordTable
                  words={filteredWords}
                  topicId={topicId}
                  onPublish={handlePublish}
                  onArchive={handleArchive}
                />
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar warning cards */}
        <div className="space-y-6">
          <StudentImpactPanel newWordsCount={draftWordsCount} />
        </div>
      </div>
    </div>
  );
}
export default TopicWordsManagementPage;
