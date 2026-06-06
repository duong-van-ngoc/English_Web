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
  Award,
  BookmarkCheck,
  CheckCircle,
  HelpCircle,
  AlertCircle,
} from "lucide-react";
import { api } from "@/lib/api";

export default function TopicDetailPage() {
  const params = useParams();
  const router = useRouter();
  
  const courseId = (params?.courseId as string) || "on-thi-vstep-b1";
  const topicId = (params?.topicId as string) || "environment";

  const [topic, setTopic] = useState<any | null>(null);
  const [words, setWords] = useState<any[]>([]);
  const [expandedWordId, setExpandedWordId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [posFilter, setPosFilter] = useState<string>("all");
  const [sortOption, setSortOption] = useState<string>("az");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadTopicData() {
      try {
        setIsLoading(true);
        setError(null);
        // topicId from useParams is topicSlug (e.g. "environment")
        const result = await api.getTopicWords(courseId, topicId);
        if (result && result.topic) {
          setTopic(result.topic);
          
          const mappedWords = (result.words || []).map((w: any) => ({
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
            isFavorite: w.isFavorite || false,
            reviewStatus: w.reviewStatus || null,
            note: w.note || null
          }));
          setWords(mappedWords);
          
          // Save last studied topic
          localStorage.setItem("vocab_last_studied_topic", topicId);
        } else {
          router.push(`/courses/${courseId}/modules/vocabulary-by-topics`);
        }
      } catch (err: any) {
        console.error("Failed to load topic words:", err);
        setError(err.message || "Không thể tải danh sách từ vựng.");
      } finally {
        setIsLoading(false);
      }
    }
    loadTopicData();
  }, [topicId, courseId, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f0fdff]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !topic) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#f0fdff] gap-4">
        <AlertCircle className="h-10 w-10 text-red-500" />
        <p className="text-sm font-bold text-text-primary">{error || "Không tìm thấy dữ liệu chủ đề."}</p>
        <button onClick={() => window.location.reload()} className="px-4 py-2 bg-[#004b5d] text-white rounded-xl text-xs font-bold cursor-pointer hover:bg-[#00687a]">Thử lại</button>
      </div>
    );
  }

  // Toggle saved word
  const toggleSaveWord = async (wordId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const targetWord = words.find(w => w.id === wordId);
    if (!targetWord) return;
    
    const isCurrentlySaved = targetWord.isFavorite;
    try {
      if (isCurrentlySaved) {
        await api.removeWordFavorite(wordId);
      } else {
        await api.setWordFavorite(wordId);
      }
      setWords(prev => prev.map(w => w.id === wordId ? { ...w, isFavorite: !w.isFavorite } : w));
    } catch (err) {
      console.error("Failed to toggle favorite:", err);
    }
  };

  // Play audio using browser Web Speech TTS
  const playTTS = (text: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "en-US";
      utterance.rate = 0.85;
      window.speechSynthesis.speak(utterance);
    } else {
      alert("Trình duyệt của bạn không hỗ trợ tính năng phát âm.");
    }
  };

  // Calculate statistics
  const totalWordsCount = words.length;
  const learnedCount = words.filter((w) => w.reviewStatus === "MASTERED").length;
  const reviewCount = words.filter((w) => w.reviewStatus === "LEARNING" || w.reviewStatus === "DUE").length;
  const savedCount = words.filter((w) => w.isFavorite).length;
  const progressPercent = totalWordsCount > 0 ? Math.round((learnedCount / totalWordsCount) * 100) : 0;

  // Filter & Sort vocabulary
  const filteredWords = words
    .filter((w) => {
      const matchesSearch = w.word.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            w.meaningVi.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesPOS = posFilter === "all" || w.partOfSpeech === posFilter;
      return matchesSearch && matchesPOS;
    })
    .sort((a, b) => {
      if (sortOption === "az") {
        return a.word.localeCompare(b.word);
      }
      if (sortOption === "za") {
        return b.word.localeCompare(a.word);
      }
      if (sortOption === "not-started") {
        const aStarted = a.reviewStatus !== null ? 1 : 0;
        const bStarted = b.reviewStatus !== null ? 1 : 0;
        return aStarted - bStarted; // not started (0) before started (1)
      }
      if (sortOption === "review") {
        const aReview = (a.reviewStatus === "LEARNING" || a.reviewStatus === "DUE") ? 1 : 0;
        const bReview = (b.reviewStatus === "LEARNING" || b.reviewStatus === "DUE") ? 1 : 0;
        return bReview - aReview; // review (1) before others (0)
      }
      if (sortOption === "saved") {
        const aSaved = a.isFavorite ? 1 : 0;
        const bSaved = b.isFavorite ? 1 : 0;
        return bSaved - aSaved; // saved (1) before others (0)
      }
      return 0;
    });

  const getPartOfSpeechLabel = (pos: string) => {
    switch (pos) {
      case "noun": return "danh từ";
      case "verb": return "động từ";
      case "adjective": return "tính từ";
      case "adverb": return "trạng từ";
      case "phrase": return "cụm từ";
      default: return pos;
    }
  };

  const getWordStatusIcon = (word: any) => {
    if (word.reviewStatus === "MASTERED") {
      return <span className="material-symbols-outlined text-emerald-500 text-lg" title="Đã học">check_circle</span>;
    }
    if (word.reviewStatus === "LEARNING" || word.reviewStatus === "DUE") {
      return <span className="material-symbols-outlined text-red-500 text-lg animate-pulse" title="Cần ôn lại">error</span>;
    }
    return <span className="material-symbols-outlined text-slate-300 text-lg" title="Chưa học">radio_button_unchecked</span>;
  };

  return (
    <div className="relative min-h-screen bg-[#f0fdff]/90 bg-grid pb-16">
      {/* Decorative Blur Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 rounded-full bg-primary/10 blur-[80px] pointer-events-none -z-10" />
      <div className="absolute bottom-[10%] right-[-5%] w-80 h-80 rounded-full bg-violet-500/10 blur-[80px] pointer-events-none -z-10" />

      <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        
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

        {/* Topic Header Block */}
        <section className="glass-panel rounded-3xl p-6 sm:p-8 bg-white/75 backdrop-blur-md border border-white/50 shadow-sm mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            
            {/* Topic Info */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-2xl">menu_book</span>
                <span className="text-xs font-bold text-primary uppercase tracking-wider">Chủ đề từ vựng VSTEP</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-text-primary">
                {topic.name}
              </h1>
              <p className="text-sm text-text-secondary leading-relaxed max-w-xl">
                {topic.description}
              </p>
            </div>

            {/* CTAs */}
            <div className="flex gap-3 w-full md:w-auto">
              <Link
                href={`/courses/${courseId}/modules/vocabulary-by-topics/topics/${topic.id}/learn`}
                className="flex-1 md:flex-none px-6 py-3 rounded-2xl bg-gradient-to-r from-primary to-secondary text-white text-xs font-bold flex items-center justify-center gap-2 hover:shadow-md transition-all transform hover:-translate-y-0.5"
              >
                <span className="material-symbols-outlined text-base">style</span>
                Học Flashcard
              </Link>
              <Link
                href={`/courses/${courseId}/modules/vocabulary-by-topics/topics/${topic.id}/quiz`}
                className="flex-1 md:flex-none px-6 py-3 rounded-2xl bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold flex items-center justify-center gap-2 hover:shadow-md transition-all transform hover:-translate-y-0.5"
              >
                <Award className="h-4 w-4" />
                Làm bài Quiz
              </Link>
            </div>

          </div>

          {/* Stats Progress Breakdown */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-6 border-t border-slate-200/50">
            <div>
              <p className="text-xs text-text-secondary">Tiến độ tổng thể</p>
              <div className="flex items-center gap-2 mt-1">
                <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="bg-primary h-full" style={{ width: `${progressPercent}%` }} />
                </div>
                <span className="text-xs font-bold text-text-primary">{progressPercent}%</span>
              </div>
            </div>
            <div>
              <p className="text-xs text-text-secondary">Đã thuộc</p>
              <p className="text-sm font-bold text-emerald-600 mt-1">{learnedCount} / {totalWordsCount} từ</p>
            </div>
            <div>
              <p className="text-xs text-text-secondary">Cần ôn lại</p>
              <p className="text-sm font-bold text-red-500 mt-1">{reviewCount} từ</p>
            </div>
            <div>
              <p className="text-xs text-text-secondary font-semibold">Từ khó đã lưu</p>
              <p className="text-sm font-bold text-violet-600 mt-1">{savedCount} từ</p>
            </div>
          </div>
        </section>

        {/* Filter & Sort Controls */}
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

          {/* POS Filters & Sort dropdowns */}
          <div className="flex gap-3 w-full sm:w-auto">
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

            {/* Sort Filter */}
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="flex-1 sm:flex-none px-3.5 py-2.5 rounded-2xl bg-white/60 border border-secondary-container/40 text-xs text-text-primary focus:bg-white outline-none backdrop-blur-sm transition-all font-semibold"
            >
              <option value="az">Sắp xếp: A-Z</option>
              <option value="za">Sắp xếp: Z-A</option>
              <option value="not-started">Chưa học lên trước</option>
              <option value="review">Cần ôn lại lên trước</option>
              <option value="saved">Từ đã lưu lên trước</option>
            </select>
          </div>

        </section>

        {/* Vocabulary Items List */}
        <section className="space-y-4">
          {filteredWords.length > 0 ? (
            filteredWords.map((word) => {
              const isExpanded = expandedWordId === word.id;
              const isSaved = word.isFavorite;
              
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
                    <div className="flex items-center gap-3 min-w-0">
                      {/* Learn Status Icon */}
                      {getWordStatusIcon(word)}

                      {/* Word & IPA & POS */}
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
                        </div>
                        <p className="text-xs text-text-secondary mt-1 font-semibold truncate">
                          {word.meaningVi}
                        </p>
                      </div>
                    </div>

                    {/* Action buttons on the right */}
                    <div className="flex items-center gap-2 shrink-0">
                      {/* Speaker pronunciation */}
                      <button
                        onClick={(e) => playTTS(word.word, e)}
                        className="p-2.5 rounded-xl hover:bg-slate-100 text-text-secondary hover:text-primary transition-all cursor-pointer"
                        title="Nghe phát âm"
                      >
                        <Volume2 className="h-4 w-4" />
                      </button>

                      {/* Bookmark save button */}
                      <button
                        onClick={(e) => toggleSaveWord(word.id, e)}
                        className="p-2.5 rounded-xl hover:bg-slate-100 transition-all cursor-pointer"
                        title={isSaved ? "Bỏ lưu từ khó" : "Lưu từ khó"}
                      >
                        <Bookmark
                          className={`h-4 w-4 ${
                            isSaved
                              ? "fill-violet-500 text-violet-500"
                              : "text-text-secondary hover:text-violet-500"
                          }`}
                        />
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
                      onClick={(e) => e.stopPropagation()} // prevent collapsing when clicking detail area
                    >
                      {/* Definition & Examples */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <h4 className="font-bold text-text-primary uppercase tracking-wider text-[10px]">Định nghĩa tiếng Việt</h4>
                          <p className="text-text-secondary font-medium pl-3 border-l-2 border-primary/30">
                            {word.meaningVi} ({getPartOfSpeechLabel(word.partOfSpeech)})
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

                      {/* Word family & Common mistakes */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                        {word.wordFamily.length > 0 && (
                          <div className="space-y-1.5">
                            <h4 className="font-bold text-text-primary uppercase tracking-wider text-[10px]">Gia đình từ (Word Family)</h4>
                            <div className="flex flex-wrap gap-1.5">
                              {word.wordFamily.map((wf: string, idx: number) => (
                                <span key={idx} className="px-2 py-0.5 rounded-full bg-violet-50 border border-violet-100 text-violet-800 font-medium text-[11px]">
                                  {wf}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                        {word.commonMistakes.length > 0 && (
                          <div className="space-y-1.5">
                            <h4 className="font-bold text-red-500 uppercase tracking-wider text-[10px]">Lưu ý / Lỗi thường gặp</h4>
                            <div className="pl-3 border-l-2 border-red-200 text-red-700 space-y-1">
                              {word.commonMistakes.map((err: string, idx: number) => (
                                <p key={idx} className="font-medium">{err}</p>
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
              <span className="material-symbols-outlined text-4xl text-text-secondary mb-2">find_in_page</span>
              <p className="text-sm font-bold text-text-primary">Không tìm thấy từ vựng nào</p>
              <p className="text-xs text-text-secondary mt-1">Thử nhập từ khóa khác hoặc chuyển bộ lọc từ loại.</p>
            </div>
          )}
        </section>

      </div>
    </div>
  );
}
