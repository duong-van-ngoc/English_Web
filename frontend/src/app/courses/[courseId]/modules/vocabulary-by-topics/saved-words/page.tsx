"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  Volume2,
  Bookmark,
  ChevronDown,
  ChevronUp,
  Search,
  BookOpen,
  ArrowLeft,
  BookmarkCheck,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { api } from "@/lib/api";
import { Word } from "../data";

interface SavedWordDetail extends Word {
  topicId: string;
  topicSlug: string;
  topicName: string;
}

export default function SavedWordsPage() {
  const params = useParams();
  const router = useRouter();
  
  const courseId = (params?.courseId as string) || "on-thi-vstep-b1";

  const [savedWords, setSavedWords] = useState<SavedWordDetail[]>([]);
  const [topics, setTopics] = useState<any[]>([]);
  const [expandedWordId, setExpandedWordId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [topicFilter, setTopicFilter] = useState<string>("all");
  const [posFilter, setPosFilter] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadSavedWords() {
      try {
        setIsLoading(true);
        setError(null);
        
        const fetchedTopics = await api.getVocabularyTopics(courseId);
        setTopics(fetchedTopics.map((t: any) => ({ id: t.slug, name: t.name })));
        
        const collectedSavedWords: SavedWordDetail[] = [];
        
        await Promise.all(
          fetchedTopics.map(async (topicData: any) => {
            try {
              const wordsData = await api.getTopicWords(courseId, topicData.slug);
              const words = wordsData.words || [];
              const saved = words.filter((w: any) => w.isFavorite);
              
              saved.forEach((w: any) => {
                collectedSavedWords.push({
                  id: w.id,
                  word: w.word,
                  ipa: w.phonetic || "",
                  partOfSpeech: w.partOfSpeech || "noun",
                  meaningVi: w.meaning || "",
                  exampleEn: w.example || "",
                  exampleVi: w.exampleVi || "",
                  synonyms: w.synonyms || [],
                  collocations: w.collocations || [],
                  wordFamily: w.wordFamily || [],
                  commonMistakes: w.commonMistakes || [],
                  topicId: topicData.id,
                  topicSlug: topicData.slug,
                  topicName: topicData.name,
                });
              });
            } catch (err) {
              console.error("Failed to fetch words for topic", topicData.slug, err);
            }
          })
        );
        
        setSavedWords(collectedSavedWords);
      } catch (err: any) {
        console.error("Failed to load saved words:", err);
        setError(err.message || "Không thể tải danh sách từ vựng đã lưu.");
      } finally {
        setIsLoading(false);
      }
    }
    
    loadSavedWords();
  }, [courseId]);

  const removeSavedWord = async (wordId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await api.removeWordFavorite(wordId);
      setSavedWords((prev) => prev.filter((w) => w.id !== wordId));
    } catch (err) {
      console.error("Failed to remove favorite:", err);
    }
  };

  const playTTS = (text: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "en-US";
      utterance.rate = 0.85;
      window.speechSynthesis.speak(utterance);
    }
  };

  const filteredWords = savedWords.filter((w) => {
    const matchesSearch =
      w.word.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.meaningVi.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTopic = topicFilter === "all" || w.topicSlug === topicFilter || w.topicId === topicFilter;
    const matchesPOS = posFilter === "all" || w.partOfSpeech === posFilter;

    return matchesSearch && matchesTopic && matchesPOS;
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f0fdff]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#f0fdff] gap-4">
        <AlertCircle className="h-10 w-10 text-red-500" />
        <p className="text-sm font-bold text-text-primary">{error}</p>
        <button onClick={() => window.location.reload()} className="px-4 py-2 bg-[#004b5d] text-white rounded-xl text-xs font-bold cursor-pointer hover:bg-[#00687a]">Thử lại</button>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-[#f0fdff]/90 bg-grid pb-16">
      {/* Decorative Blur Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 rounded-full bg-primary/10 blur-[80px] pointer-events-none -z-10" />
      <div className="absolute bottom-[10%] right-[-5%] w-80 h-80 rounded-full bg-violet-500/10 blur-[80px] pointer-events-none -z-10" />

      <div className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        
        {/* Back Link */}
        <div className="mb-6">
          <Link
            href={`/courses/${courseId}/modules/vocabulary-by-topics`}
            className="group flex items-center gap-1.5 text-sm font-bold text-text-secondary hover:text-primary transition-colors"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
            Quay lại danh sách chủ đề
          </Link>
        </div>

        {/* Page Header */}
        <section className="glass-panel rounded-3xl p-6 sm:p-8 bg-white/75 backdrop-blur-md border border-white/50 shadow-sm mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-2xl bg-violet-100 flex items-center justify-center text-violet-600">
              <BookmarkCheck className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-text-primary">Từ vựng đã lưu (Saved Words)</h1>
              <p className="text-xs text-text-secondary">
                Tổng hợp tất cả các từ vựng học thuật VSTEP bạn đã đánh dấu lưu lại để ôn luyện.
              </p>
            </div>
          </div>
          <div className="mt-4 flex items-center gap-4">
            <span className="text-xs font-bold text-text-secondary bg-slate-100 px-3 py-1.5 rounded-full border border-slate-200">
              Đang lưu: {savedWords.length} từ vựng
            </span>
          </div>
        </section>

        {/* Filters and search */}
        <section className="flex flex-col sm:flex-row gap-4 items-center justify-between mb-6">
          
          {/* Search bar */}
          <div className="relative w-full sm:max-w-xs">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary text-base">search</span>
            <input
              type="text"
              placeholder="Tìm từ vựng hoặc nghĩa..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-2xl bg-white/60 border border-secondary-container/40 focus:bg-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none backdrop-blur-sm transition-all text-xs"
            />
          </div>

          {/* POS & Topic filters dropdowns */}
          <div className="flex gap-3 w-full sm:w-auto">
            {/* Topic Filter */}
            <select
              value={topicFilter}
              onChange={(e) => setTopicFilter(e.target.value)}
              className="flex-1 sm:flex-none px-3.5 py-2.5 rounded-2xl bg-white/60 border border-secondary-container/40 text-xs text-text-primary focus:bg-white outline-none backdrop-blur-sm transition-all font-semibold"
            >
              <option value="all">Tất cả chủ đề</option>
              {topics.map((topic) => (
                <option key={topic.id} value={topic.id}>
                  {topic.name}
                </option>
              ))}
            </select>

            {/* POS Filter */}
            <select
              value={posFilter}
              onChange={(e) => setPosFilter(e.target.value)}
              className="flex-1 sm:flex-none px-3.5 py-2.5 rounded-2xl bg-white/60 border border-secondary-container/40 text-xs text-text-primary focus:bg-white outline-none backdrop-blur-sm transition-all font-semibold"
            >
              <option value="all">Tất cả từ loại</option>
              <option value="noun">Danh từ (n)</option>
              <option value="verb">Động từ (v)</option>
              <option value="adjective">Tính từ (adj)</option>
              <option value="adverb">Trạng từ (adv)</option>
              <option value="phrase">Cụm từ (phrase)</option>
            </select>
          </div>

        </section>

        {/* Vocabulary Items List */}
        <section className="space-y-4">
          {filteredWords.length > 0 ? (
            filteredWords.map((word) => {
              const isExpanded = expandedWordId === word.id;
              
              return (
                <div
                  key={word.id}
                  onClick={() => setExpandedWordId(isExpanded ? null : word.id)}
                  className={`glass-panel rounded-3xl p-5 bg-white/75 hover:bg-white/95 backdrop-blur-md border border-white/50 transition-all duration-200 cursor-pointer shadow-sm ${
                    isExpanded ? "ring-2 ring-primary/20 bg-white" : ""
                  }`}
                >
                  
                  {/* Row Summary */}
                  <div className="flex justify-between items-center gap-4">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-baseline gap-2">
                        <span className="text-base font-extrabold text-text-primary tracking-tight">
                          {word.word}
                        </span>
                        <span className="text-xs text-text-secondary font-mono italic">
                          {word.ipa}
                        </span>
                        <span className="px-2 py-0.5 rounded-md bg-secondary-container/10 border border-secondary-container/20 text-[10px] text-text-secondary font-bold uppercase">
                          {word.partOfSpeech}
                        </span>
                        <span className="px-2 py-0.5 rounded-md bg-violet-50 text-[10px] text-violet-800 font-bold">
                          Chủ đề: {word.topicName}
                        </span>
                      </div>
                      <p className="text-xs text-text-secondary mt-1 font-semibold truncate">
                        {word.meaningVi}
                      </p>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-2 shrink-0">
                      {/* Speaker pronunciation */}
                      <button
                        onClick={(e) => playTTS(word.word, e)}
                        className="p-2.5 rounded-xl hover:bg-slate-100 text-text-secondary hover:text-primary transition-all cursor-pointer"
                        title="Nghe phát âm"
                      >
                        <Volume2 className="h-4 w-4" />
                      </button>

                      {/* Bookmark save button (remove from saved words) */}
                      <button
                        onClick={(e) => removeSavedWord(word.id, e)}
                        className="p-2.5 rounded-xl hover:bg-slate-100 text-violet-500 transition-all cursor-pointer"
                        title="Xóa khỏi danh sách lưu"
                      >
                        <Bookmark className="h-4 w-4 fill-violet-500 text-violet-500" />
                      </button>

                      {/* Expand Toggle */}
                      <div className="text-text-secondary p-1">
                        {isExpanded ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Expanded Detail Panel */}
                  {isExpanded && (
                    <div
                      className="mt-5 pt-5 border-t border-dashed border-slate-200 space-y-4 text-xs text-text-secondary cursor-default"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {/* Definition & Examples */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <h4 className="font-bold text-text-primary uppercase tracking-wider text-[10px]">Định nghĩa tiếng Việt</h4>
                          <p className="text-text-secondary font-medium pl-3 border-l-2 border-primary/30">
                            {word.meaningVi} ({word.partOfSpeech})
                          </p>
                        </div>
                        <div className="space-y-1.5">
                          <h4 className="font-bold text-text-primary uppercase tracking-wider text-[10px]">Ví dụ trong ngữ cảnh VSTEP</h4>
                          <div className="pl-3 border-l-2 border-secondary/30 space-y-1">
                            <p className="font-semibold text-text-primary italic">&ldquo;{word.exampleEn}&rdquo;</p>
                            <p className="text-text-secondary">&rarr; {word.exampleVi}</p>
                          </div>
                        </div>
                      </div>

                      {/* Synonyms & Collocations */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                        {word.synonyms.length > 0 && (
                          <div className="space-y-1.5">
                            <h4 className="font-bold text-text-primary uppercase tracking-wider text-[10px]">Từ đồng nghĩa (Synonyms)</h4>
                            <div className="flex flex-wrap gap-1.5">
                              {word.synonyms.map((s: string, idx: number) => (
                                <span key={idx} className="px-2 py-0.5 rounded-full bg-slate-100 border border-slate-200 text-text-primary font-medium text-[11px]">
                                  {s}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                        {word.collocations.length > 0 && (
                          <div className="space-y-1.5">
                            <h4 className="font-bold text-text-primary uppercase tracking-wider text-[10px]">Cụm từ đi kèm (Collocations)</h4>
                            <div className="flex flex-wrap gap-1.5">
                              {word.collocations.map((col: string, idx: number) => (
                                <span key={idx} className="px-2 py-0.5 rounded-full bg-cyan-50 border border-cyan-100 text-cyan-800 font-medium text-[11px]">
                                  {col}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                </div>
              );
            })
          ) : (
            <div className="py-16 flex flex-col items-center justify-center text-center bg-white/40 border border-dashed border-primary/20 rounded-3xl p-8">
              <span className="material-symbols-outlined text-4xl text-text-secondary mb-2">bookmark_border</span>
              <p className="text-sm font-bold text-text-primary">Danh sách từ vựng đã lưu trống</p>
              <p className="text-xs text-text-secondary mt-1">
                Hãy bắt đầu học từ vựng và nhấn biểu tượng Bookmark để lưu lại những từ khó nhé!
              </p>
              <Link
                href={`/courses/${courseId}/modules/vocabulary-by-topics`}
                className="mt-5 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-primary to-secondary text-white text-xs font-bold transition-all shadow-sm hover:shadow"
              >
                Học từ vựng ngay
              </Link>
            </div>
          )}
        </section>

      </div>
    </div>
  );
}
