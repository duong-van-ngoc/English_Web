"use client";

import React, { use, useState, useEffect } from "react";
import Link from "next/link";
import { useTopicDetail } from "../hooks/use-topic-detail";
import { useTopicWords } from "../hooks/use-topic-words";
import { usePublishWord } from "../hooks/use-publish-word";
import { useArchiveWord } from "../hooks/use-archive-word";
import { WordTable } from "../components/words/word-table";
import { WordFilterBar } from "../components/words/word-filter-bar";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { VOCABULARY_ROUTES } from "../constants/vocabulary-routes";
import { Pagination } from "@/components/ui/pagination";

interface TopicWordsManagementPageProps {
  params: Promise<{ topicId: string }>;
}

export function TopicWordsManagementPage({ params }: TopicWordsManagementPageProps) {
  const { topicId } = use(params);
  const { topic } = useTopicDetail(topicId);
  const { words, isLoading, refetch } = useTopicWords(topicId);

  const draftCount = words.filter((w) => w.status === "DRAFT").length;
  const publishedCount = words.filter((w) => w.status === "PUBLISHED").length;

  const { publishWord, publishAllWords, isPublishingAll } = usePublishWord(topicId);
  const { archiveWord } = useArchiveWord(topicId);

  const [search, setSearch] = useState("");
  const [partOfSpeechFilter, setPartOfSpeechFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 15;

  // Reset to page 1 whenever search criteria or filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [search, partOfSpeechFilter, statusFilter]);

  const handlePublish = async (wordId: string) => {
    await publishWord(wordId);
    refetch();
  };

  const handleArchive = async (wordId: string) => {
    await archiveWord(wordId);
    refetch();
  };

  const handlePublishAll = async () => {
    if (window.confirm(`Bạn có chắc chắn muốn xuất bản toàn bộ ${draftCount} từ vựng đang ở trạng thái bản nháp?`)) {
      try {
        await publishAllWords();
        refetch();
      } catch (err) {
        console.error("Failed to publish all words:", err);
      }
    }
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

  const totalPages = Math.ceil(filteredWords.length / pageSize);
  const paginatedWords = filteredWords.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-text-secondary mb-2">
            <Link href={VOCABULARY_ROUTES.TOPICS_LIST} className="hover:text-primary transition-colors">
              Chủ đề từ vựng
            </Link>
            <span className="material-symbols-outlined text-[10px]">arrow_forward_ios</span>
            <Link href={VOCABULARY_ROUTES.TOPIC_DETAIL(topicId)} className="hover:text-primary transition-colors">
              {topic?.name || "Chủ đề"}
            </Link>
            <span className="material-symbols-outlined text-[10px]">arrow_forward_ios</span>
            <span>Danh sách từ</span>
          </div>
          <h2 className="text-2xl font-extrabold text-text-primary tracking-tight">
            Quản lý từ vựng
            {topic?.name && (
              <span className="ml-2 text-lg font-semibold text-primary/70">— {topic.name}</span>
            )}
          </h2>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          {draftCount > 0 && (
            <Button
              variant="secondary"
              className="gap-2 border-emerald-600 text-emerald-600 hover:bg-emerald-50 bg-white/50"
              onClick={handlePublishAll}
              disabled={isPublishingAll}
            >
              <span className="material-symbols-outlined text-emerald-600">publish</span>
              Xuất bản tất cả ({draftCount})
            </Button>
          )}
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

      {/* Stats row */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/60 border border-border/40 shadow-sm">
          <span className="material-symbols-outlined text-[18px] text-primary">library_books</span>
          <span className="text-sm font-bold text-text-primary">{words.length}</span>
          <span className="text-xs text-text-secondary">từ vựng</span>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/60 border border-border/40 shadow-sm">
          <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0"></span>
          <span className="text-sm font-bold text-emerald-700">{publishedCount}</span>
          <span className="text-xs text-text-secondary">đã xuất bản</span>
        </div>
        {draftCount > 0 && (
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-50 border border-amber-200 shadow-sm">
            <span className="material-symbols-outlined text-[16px] text-amber-600">warning</span>
            <span className="text-sm font-bold text-amber-700">{draftCount}</span>
            <span className="text-xs text-amber-600">bản nháp chưa xuất bản</span>
          </div>
        )}
      </div>

      {/* Main table card — full width */}
      <Card>
        <CardHeader className="pb-4">
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
            <div className="py-16 text-center">
              <span className="material-symbols-outlined text-4xl text-primary/30 animate-pulse block mb-2">
                sync
              </span>
              <p className="text-sm text-text-secondary">Đang tải danh sách từ vựng...</p>
            </div>
          ) : (
            <>
              <WordTable
                words={paginatedWords}
                topicId={topicId}
                onPublish={handlePublish}
                onArchive={handleArchive}
              />
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                pageSize={pageSize}
                totalItems={filteredWords.length}
              />
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
export default TopicWordsManagementPage;
