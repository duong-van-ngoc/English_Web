"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  BookOpen,
  Search,
  BookMarked,
  AlertCircle,
  Award,
  HelpCircle,
  Lightbulb,
  CheckCircle,
  Play,
  ArrowRight,
  TrendingUp,
  Volume2,
} from "lucide-react";
import { api } from "@/lib/api";
import { Topic } from "./data";

export default function VocabularyTopicsPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = (params?.courseId as string) || "on-thi-vstep-b1";

  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"all" | "in-progress" | "completed" | "updated" | "locked">("all");
  const [topics, setTopics] = useState<Topic[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // States loaded from API
  const [stats, setStats] = useState({
    wordsLearned: 0,
    needReview: 0,
    savedWords: 0,
    quizAverage: 82,
  });
  
  const [recentTopic, setRecentTopic] = useState<{ id: string; name: string; progress: number } | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        setIsLoading(true);
        setError(null);
        const fetchedTopics = await api.getVocabularyTopics(courseId);
        
        let learned = 0;
        let saved = 0;
        let review = 0;
        
        const updatedTopics = await Promise.all(
          fetchedTopics.map(async (topicData: any) => {
            learned += topicData.masteredCount || 0;
            
            let words: any[] = [];
            try {
              const wordsData = await api.getTopicWords(courseId, topicData.slug);
              words = wordsData.words || [];
            } catch (err) {
              console.error("Failed to fetch words for topic", topicData.slug, err);
            }
            
            const savedInTopic = words.filter((w: any) => w.isFavorite).length;
            const reviewInTopic = words.filter((w: any) => w.reviewStatus === "LEARNING" || w.reviewStatus === "DUE").length;
            
            saved += savedInTopic;
            review += reviewInTopic;
            
            let status: "not-started" | "in-progress" | "completed" | "locked" | "updated" = "not-started";
            if (topicData.progressPercent === 100) {
              status = "completed";
            } else if (topicData.progressPercent > 0) {
              status = "in-progress";
            }
            
            return {
              id: topicData.id,
              slug: topicData.slug,
              name: topicData.name,
              description: topicData.description || "",
              imageUrl: topicData.imageUrl,
              icon: topicData.icon || "menu_book",
              totalWords: topicData.wordCount || 0,
              progressPercent: topicData.progressPercent || 0,
              status,
              isUpdated: topicData.slug === "environment",
              words: words
            } as any;
          })
        );
        
        setTopics(updatedTopics);

        let avgScore = 82;
        if (typeof window !== "undefined") {
          const storedAttempts = localStorage.getItem("vocab_quiz_attempts");
          const attemptsList = storedAttempts ? JSON.parse(storedAttempts) : [];
          if (attemptsList.length > 0) {
            const sum = attemptsList.reduce((acc: number, item: any) => acc + item.score, 0);
            avgScore = Math.round(sum / attemptsList.length);
          }
        }

        setStats({
          wordsLearned: learned,
          needReview: review,
          savedWords: saved,
          quizAverage: avgScore,
        });

        if (typeof window !== "undefined") {
          const lastStudied = localStorage.getItem("vocab_last_studied_topic");
          if (lastStudied) {
            const found = updatedTopics.find((t) => t.id === lastStudied || t.slug === lastStudied);
            if (found) {
              setRecentTopic({
                id: found.slug,
                name: found.name,
                progress: found.progressPercent,
              });
            }
          } else {
            const firstInProgress = updatedTopics.find((t) => t.status === "in-progress" || t.isUpdated);
            if (firstInProgress) {
              setRecentTopic({
                id: firstInProgress.slug,
                name: firstInProgress.name,
                progress: firstInProgress.progressPercent,
              });
            } else if (updatedTopics.length > 0) {
              setRecentTopic({
                id: updatedTopics[0].slug,
                name: updatedTopics[0].name,
                progress: updatedTopics[0].progressPercent,
              });
            }
          }
        }
      } catch (err: any) {
        console.error("Failed to load vocabulary topics:", err);
        setError(err.message || "Đã xảy ra lỗi khi tải dữ liệu.");
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, [courseId]);

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

  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case "eco":
        return <span className="material-symbols-outlined text-emerald-600 text-2xl">eco</span>;
      case "school":
        return <span className="material-symbols-outlined text-primary text-2xl">school</span>;
      case "biotech":
        return <span className="material-symbols-outlined text-purple-600 text-2xl">biotech</span>;
      case "flight":
        return <span className="material-symbols-outlined text-cyan-600 text-2xl">flight</span>;
      case "health_and_safety":
        return <span className="material-symbols-outlined text-red-500 text-2xl">health_and_safety</span>;
      case "work":
        return <span className="material-symbols-outlined text-amber-600 text-2xl">work</span>;
      default:
        return <BookOpen className="h-6 w-6 text-primary" />;
    }
  };

  const getStatusBadge = (topic: Topic) => {
    switch (topic.status) {
      case "completed":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100/80 px-2.5 py-0.5 text-[10px] font-bold text-emerald-800 backdrop-blur-sm">
            <CheckCircle className="h-3 w-3" />
            Đã hoàn thành
          </span>
        );
      case "in-progress":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-blue-100/80 px-2.5 py-0.5 text-[10px] font-bold text-blue-800 backdrop-blur-sm animate-pulse">
            Đang học
          </span>
        );
      case "updated":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-violet-100/85 px-2.5 py-0.5 text-[10px] font-bold text-violet-800 backdrop-blur-sm border border-violet-200">
            Cập nhật
          </span>
        );
      case "locked":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-slate-100/80 px-2.5 py-0.5 text-[10px] font-bold text-slate-500 backdrop-blur-sm">
            Đang khóa
          </span>
        );
      case "not-started":
      default:
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-slate-100/80 px-2.5 py-0.5 text-[10px] font-bold text-slate-800 backdrop-blur-sm">
            Chưa bắt đầu
          </span>
        );
    }
  };

  // Filter topics
  const filteredTopics = topics.filter((topic) => {
    const matchesSearch =
      topic.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      topic.description.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (activeTab === "all") return true;
    if (activeTab === "in-progress") return topic.status === "in-progress" || (topic.progressPercent > 0 && topic.progressPercent < 100);
    if (activeTab === "completed") return topic.status === "completed" || topic.progressPercent === 100;
    if (activeTab === "updated") return topic.isUpdated;
    if (activeTab === "locked") return topic.status === "locked";
    return true;
  });

  return (
    <div className="relative min-h-screen bg-[#f0fdff]/90 bg-grid pb-16">
      {/* Decorative Blur Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 rounded-full bg-primary/10 blur-[80px] pointer-events-none -z-10" />
      <div className="absolute bottom-[10%] right-[-5%] w-80 h-80 rounded-full bg-indigo-500/10 blur-[80px] pointer-events-none -z-10" />

      <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Navigation Breadcrumb */}
        <div className="mb-6">
          <Link
            href={`/courses/${courseId}`}
            className="group flex items-center gap-1 text-sm font-bold text-text-secondary hover:text-primary transition-colors"
          >
            <span className="material-symbols-outlined text-sm transition-transform group-hover:-translate-x-0.5">chevron_left</span>
            Quay lại chi tiết khóa học
          </Link>
        </div>

        {/* Dynamic Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          
          {/* Main Panel (Columns 1 to 8) */}
          <div className="md:col-span-8 flex flex-col gap-8">
            
            {/* Hero Section */}
            <section className="relative overflow-hidden rounded-3xl p-8 sm:p-10 bg-gradient-to-br from-primary/10 via-secondary/5 to-white border border-primary/10 shadow-[0_10px_30px_rgba(8,145,178,0.05)]">
              <div className="relative z-10 max-w-xl">
                <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-primary mb-2">
                  Vocabulary by Topics
                </h1>
                <p className="text-sm sm:text-base text-text-secondary mb-8">
                  Học hơn 3.000 từ vựng học thuật quan trọng nhất được chọn lọc kỹ lưỡng cho kỳ thi VSTEP B1-B2 thông qua các ngữ cảnh thực tế.
                </p>
                <div className="flex flex-wrap gap-4">
                  {recentTopic ? (
                    <Link
                      href={`/courses/${courseId}/modules/vocabulary-by-topics/topics/${recentTopic.id}`}
                      className="px-6 py-3 rounded-full bg-gradient-to-r from-primary to-secondary text-white text-sm font-bold flex items-center gap-2 hover:shadow-lg transition-all transform hover:-translate-y-0.5"
                    >
                      <span className="material-symbols-outlined text-sm">play_arrow</span>
                      Tiếp tục học: {recentTopic.name}
                    </Link>
                  ) : (
                    <Link
                      href={`/courses/${courseId}/modules/vocabulary-by-topics/topics/environment`}
                      className="px-6 py-3 rounded-full bg-gradient-to-r from-primary to-secondary text-white text-sm font-bold flex items-center gap-2 hover:shadow-lg transition-all transform hover:-translate-y-0.5"
                    >
                      <span className="material-symbols-outlined text-sm">play_arrow</span>
                      Bắt đầu học ngay
                    </Link>
                  )}
                  <Link
                    href={`/courses/${courseId}/modules/vocabulary-by-topics/saved-words`}
                    className="px-6 py-3 rounded-full bg-white/60 border border-primary/20 text-primary text-sm font-bold flex items-center gap-2 hover:bg-white/90 backdrop-blur-sm transition-all"
                  >
                    <BookMarked className="h-4 w-4" />
                    Từ vựng đã lưu ({stats.savedWords})
                  </Link>
                </div>
              </div>
              <div className="absolute right-[-20px] top-[-20px] opacity-10 pointer-events-none text-primary">
                <span className="material-symbols-outlined" style={{ fontSize: "240px" }}>menu_book</span>
              </div>
            </section>

            {/* Stats Overview */}
            <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="glass-panel p-5 rounded-3xl flex flex-col items-center justify-center text-center bg-white/70 backdrop-blur-md border border-white/40 shadow-sm">
                <span className="text-primary font-bold text-2xl sm:text-3xl">{stats.wordsLearned}</span>
                <span className="text-[10px] sm:text-xs font-bold text-text-secondary uppercase tracking-wider mt-1">Từ đã thuộc</span>
              </div>
              <div className="glass-panel p-5 rounded-3xl flex flex-col items-center justify-center text-center bg-white/70 backdrop-blur-md border border-white/40 shadow-sm">
                <span className="text-red-500 font-bold text-2xl sm:text-3xl">{stats.needReview}</span>
                <span className="text-[10px] sm:text-xs font-bold text-text-secondary uppercase tracking-wider mt-1">Cần ôn lại</span>
              </div>
              <div className="glass-panel p-5 rounded-3xl flex flex-col items-center justify-center text-center bg-white/70 backdrop-blur-md border border-white/40 shadow-sm">
                <span className="text-violet-600 font-bold text-2xl sm:text-3xl">{stats.savedWords}</span>
                <span className="text-[10px] sm:text-xs font-bold text-text-secondary uppercase tracking-wider mt-1">Từ đã lưu</span>
              </div>
              <div className="glass-panel p-5 rounded-3xl flex flex-col items-center justify-center text-center bg-white/70 backdrop-blur-md border border-white/40 shadow-sm">
                <span className="text-secondary font-bold text-2xl sm:text-3xl">{stats.quizAverage}%</span>
                <span className="text-[10px] sm:text-xs font-bold text-text-secondary uppercase tracking-wider mt-1">ĐTB Kiểm tra</span>
              </div>
            </section>

            {/* Environment Updated Alert */}
            {topics.find(t => t.id === "environment")?.isUpdated && (
              <section className="glass-panel-strong rounded-3xl border-l-4 border-l-violet-500 p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white/80 backdrop-blur-md border border-white/50 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-violet-100 flex items-center justify-center text-violet-600">
                    <span className="material-symbols-outlined">campaign</span>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-violet-700">Chủ đề Environment mới được cập nhật</h4>
                    <p className="text-xs text-text-secondary">Thêm từ vựng nâng cao phục vụ cho Writing & Speaking VSTEP B2.</p>
                  </div>
                </div>
                <Link
                  href={`/courses/${courseId}/modules/vocabulary-by-topics/topics/environment`}
                  className="px-5 py-2 rounded-full bg-violet-600 text-white text-xs font-bold whitespace-nowrap hover:bg-violet-700 hover:shadow-md transition-all self-stretch sm:self-auto text-center"
                >
                  Học từ mới ngay
                </Link>
              </section>
            )}

            {/* Search & Filter Bar */}
            <section className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div className="relative w-full sm:flex-1">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary text-lg">search</span>
                <input
                  type="text"
                  placeholder="Tìm kiếm chủ đề từ vựng..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white/60 border border-secondary-container/40 focus:bg-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none backdrop-blur-sm transition-all text-sm"
                />
              </div>
              <div className="flex gap-1.5 overflow-x-auto pb-1 w-full sm:w-auto scrollbar-none">
                {(["all", "in-progress", "completed", "updated", "locked"] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-2 rounded-full text-xs font-bold capitalize transition-all border whitespace-nowrap cursor-pointer ${
                      activeTab === tab
                        ? "bg-primary text-white border-primary shadow-sm"
                        : "bg-white/40 text-text-secondary border-primary/10 hover:bg-white/80"
                    }`}
                  >
                    {tab === "all" && "Tất cả"}
                    {tab === "in-progress" && "Đang học"}
                    {tab === "completed" && "Hoàn thành"}
                    {tab === "updated" && "Mới cập nhật"}
                    {tab === "locked" && "Đang khóa"}
                  </button>
                ))}
              </div>
            </section>

            {/* Topic Cards Grid */}
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTopics.length > 0 ? (
                filteredTopics.map((topic) => {
                  const isLocked = topic.status === "locked";
                  
                  return (
                    <div
                      key={topic.id}
                      className={`glass-panel rounded-3xl p-6 flex flex-col justify-between hover:-translate-y-1 hover:shadow-md transition-all duration-300 bg-white/70 backdrop-blur-md border border-white/50 h-full ${
                        isLocked ? "opacity-60" : ""
                      }`}
                    >
                      <div>
                        {/* Header: Icon & Badge */}
                        <div className="flex justify-between items-start mb-4">
                          <div className="w-11 h-11 rounded-2xl bg-primary/10 flex items-center justify-center">
                            {getIconComponent(topic.icon)}
                          </div>
                          {getStatusBadge(topic)}
                        </div>

                        {/* Title & Desc */}
                        <h3 className="text-lg font-bold text-text-primary mb-1">
                          {topic.name}
                        </h3>
                        <p className="text-xs text-text-secondary leading-relaxed mb-6">
                          {topic.description}
                        </p>
                      </div>

                      {/* Footer: Progress & Button */}
                      <div className="mt-auto">
                        <div className="flex justify-between items-center text-[10px] font-bold text-text-secondary mb-1.5">
                          <span>{topic.progressPercent}% hoàn thành</span>
                          <span>{topic.totalWords} từ vựng</span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden mb-4">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${
                              topic.status === "updated"
                                ? "bg-gradient-to-r from-primary to-violet-600"
                                : "bg-primary"
                            }`}
                            style={{ width: `${topic.progressPercent}%` }}
                          />
                        </div>

                        {isLocked ? (
                          <button
                            disabled
                            className="w-full py-2.5 rounded-2xl border border-slate-200 bg-slate-50 text-slate-400 text-xs font-bold cursor-not-allowed flex items-center justify-center gap-1.5"
                          >
                            <span className="material-symbols-outlined text-sm">lock</span>
                            Chưa mở khóa
                          </button>
                        ) : (
                          <Link
                            href={`/courses/${courseId}/modules/vocabulary-by-topics/topics/${topic.slug || topic.id}`}
                            className={`w-full py-2.5 rounded-2xl text-xs font-bold transition-all text-center block ${
                              topic.status === "updated"
                                ? "bg-violet-600 hover:bg-violet-700 text-white"
                                : topic.status === "completed"
                                ? "bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200"
                                : "bg-[#004b5d] hover:bg-[#00687a] text-white"
                            }`}
                          >
                            {topic.status === "completed" ? "Ôn tập chủ đề" : topic.progressPercent > 0 ? "Tiếp tục học" : "Bắt đầu học"}
                          </Link>
                        )}
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="col-span-full py-16 flex flex-col items-center justify-center text-center bg-white/40 border border-dashed border-primary/20 rounded-3xl p-8">
                  <span className="material-symbols-outlined text-4xl text-text-secondary mb-2">find_in_page</span>
                  <p className="text-sm font-bold text-text-primary">Không tìm thấy chủ đề nào</p>
                  <p className="text-xs text-text-secondary mt-1">Thử đổi từ khóa hoặc bộ lọc của bạn.</p>
                </div>
              )}
            </section>
          </div>

          {/* Right Sidebar Panel (Columns 9 to 12) */}
          <aside className="md:col-span-4 flex flex-col gap-6">
            
            {/* Resume Studied Card */}
            {recentTopic && (
              <div className="glass-panel-strong rounded-3xl p-5 relative overflow-hidden bg-white/80 backdrop-blur-md border border-white/50 shadow-sm">
                <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full -mr-8 -mt-8" />
                <h3 className="text-sm font-bold text-primary mb-3 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-base">auto_stories</span>
                  Học dở dang
                </h3>
                <div className="p-3.5 rounded-2xl bg-white/40 border border-primary/10 mb-4">
                  <div className="flex items-center gap-3 mb-2.5">
                    <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                      <span className="material-symbols-outlined text-primary text-xl">auto_stories</span>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-text-primary">{recentTopic.name}</p>
                      <p className="text-[10px] text-text-secondary">VSTEP B1-B2 Vocab</p>
                    </div>
                  </div>
                  <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden">
                    <div className="bg-primary h-full" style={{ width: `${recentTopic.progress}%` }} />
                  </div>
                  <p className="text-[9px] text-right font-bold text-primary mt-1">{recentTopic.progress}% hoàn thành</p>
                </div>
                <Link
                  href={`/courses/${courseId}/modules/vocabulary-by-topics/topics/${recentTopic.id}`}
                  className="w-full py-2.5 rounded-2xl bg-[#004b5d] hover:bg-[#00687a] text-white text-xs font-bold hover:shadow-md transition-all flex items-center justify-center gap-1"
                >
                  Học tiếp
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            )}

            {/* Today's Goal Card */}
            <div className="glass-panel rounded-3xl p-5 bg-white/70 backdrop-blur-md border border-white/40 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xs font-bold text-text-secondary uppercase tracking-wider">
                  Mục tiêu hôm nay
                </h3>
                <span className="text-xs font-bold text-primary">
                  {stats.wordsLearned % 10}/10 từ
                </span>
              </div>
              <div className="space-y-3.5">
                <div className="flex items-start gap-2 text-xs">
                  <span className="material-symbols-outlined text-sm text-primary mt-0.5">check_circle</span>
                  <span className="text-text-primary">Học 10 từ vựng mới mỗi ngày</span>
                </div>
                <div className="flex items-start gap-2 text-xs">
                  <span className="material-symbols-outlined text-sm text-primary mt-0.5">check_circle</span>
                  <span className="text-text-primary">Ôn tập {stats.needReview} từ trong danh sách ôn</span>
                </div>
                <div className="flex items-start gap-2 text-xs text-text-secondary opacity-60">
                  <span className="material-symbols-outlined text-sm mt-0.5">radio_button_unchecked</span>
                  <span>Hoàn thành 1 bài kiểm tra trắc nghiệm</span>
                </div>
              </div>
              <div className="mt-5 pt-4 border-t border-slate-200/50">
                <p className="text-[10px] text-text-secondary italic leading-relaxed">
                  &ldquo;Thành công là tổng hợp của các nỗ lực nhỏ, lặp đi lặp lại ngày qua ngày.&rdquo;
                </p>
              </div>
            </div>

            {/* Study Tips Card */}
            <div className="rounded-3xl p-5 bg-cyan-50/50 border border-cyan-100 shadow-sm">
              <h3 className="text-sm font-bold text-cyan-800 mb-3 flex items-center gap-1.5">
                <Lightbulb className="h-4 w-4 text-cyan-600" />
                Mẹo học hiệu quả
              </h3>
              <ul className="space-y-3">
                <li className="flex gap-2">
                  <div className="shrink-0 w-5 h-5 rounded-full bg-cyan-100 flex items-center justify-center text-[9px] font-bold text-cyan-800">1</div>
                  <p className="text-xs text-cyan-900 leading-relaxed">
                    Nên sử dụng từ mới để đặt câu ngay lập tức để tăng khả năng ghi nhớ dài hạn.
                  </p>
                </li>
                <li className="flex gap-2">
                  <div className="shrink-0 w-5 h-5 rounded-full bg-cyan-100 flex items-center justify-center text-[9px] font-bold text-cyan-800">2</div>
                  <p className="text-xs text-cyan-900 leading-relaxed">
                    Hãy nhấn nút nghe phát âm của từ ít nhất 3 lần để làm quen với ngữ điệu IPA bản xứ.
                  </p>
                </li>
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
