"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  Volume2,
  Bookmark,
  ArrowLeft,
  ArrowRight,
  ChevronLeft,
  Award,
  RefreshCw,
  Eye,
  Check,
  AlertCircle,
} from "lucide-react";
import { api } from "@/lib/api";
import { useAuth } from "@/features/auth/hooks/use-auth";

const highlightWord = (text: string, keyword: string) => {
  if (!text || !keyword) return text;
  
  const escapedKeyword = keyword.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
  const regex = new RegExp(`\\b(${escapedKeyword}(?:s|es|ed|ing|d)?)\\b`, 'gi');
  
  const parts = text.split(regex);
  
  return parts.map((part, index) => {
    if (index % 2 === 1) {
      return (
        <span key={index} className="text-red-600 font-extrabold px-0.5 rounded bg-red-50 border border-red-100">
          {part}
        </span>
      );
    }
    return part;
  });
};

export default function FlashcardLearnRedesignPage() {
  const params = useParams();
  const router = useRouter();
  const { status } = useAuth({ redirectToLogin: true });
  
  const courseId = (params?.courseId as string) || "on-thi-vstep-b1";
  const topicId = (params?.topicId as string) || "environment";

  const [topic, setTopic] = useState<any | null>(null);
  const [words, setWords] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [revealMeaning, setRevealMeaning] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [audioPlaying, setAudioPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Ref to hold the current audio instance to prevent overlapping audio
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Stats for current session
  const [knownCount, setKnownCount] = useState(0);
  const [reviewCount, setReviewCount] = useState(0);

  useEffect(() => {
    if (status !== "authenticated") return;
    async function loadTopicData() {
      try {
        setIsLoading(true);
        setError(null);
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
        } else {
          router.push(`/courses/${courseId}/modules/vocabulary-by-topics`);
        }
      } catch (err: any) {
        console.error("Failed to load learn page data:", err);
        setError(err.message || "Không thể tải từ vựng để học.");
      } finally {
        setIsLoading(false);
      }
    }
    loadTopicData();
  }, [topicId, courseId, router, status]);

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f0fdff]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !topic || words.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#f0fdff] gap-4">
        <AlertCircle className="h-10 w-10 text-red-500" />
        <p className="text-sm font-bold text-text-primary">{error || "Chủ đề này chưa có từ vựng nào để học."}</p>
        <Link href={`/courses/${courseId}/modules/vocabulary-by-topics`} className="px-4 py-2 bg-[#004b5d] text-white rounded-xl text-xs font-bold hover:bg-[#00687a]">Quay lại</Link>
      </div>
    );
  }

  const currentWord = words[currentIndex];

  const playGoogleTTS = (text: string) => {
    try {
      setAudioPlaying(true);

      // Stop previous audio if playing
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }

      const googleTtsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&tl=en&client=tw-ob&q=${encodeURIComponent(
        text
      )}`;
      const audio = new Audio(googleTtsUrl);
      audioRef.current = audio;

      audio.onended = () => {
        setAudioPlaying(false);
        audioRef.current = null;
      };
      audio.onerror = () => {
        playBrowserTTS(text);
      };
      audio.play().catch(() => playBrowserTTS(text));
    } catch (e) {
      playBrowserTTS(text);
    }
  };

  const playBrowserTTS = (text: string) => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "en-US";
      utterance.rate = 0.85;
      utterance.onend = () => setAudioPlaying(false);
      utterance.onerror = () => setAudioPlaying(false);
      window.speechSynthesis.speak(utterance);
    } else {
      setAudioPlaying(false);
    }
  };

  const playTTS = (text: string) => {
    // Stop previous audio if playing
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }

    // 1. Ưu tiên phát file Audio có sẵn của từ vựng nếu có
    if (currentWord?.audioUrl) {
      setAudioPlaying(true);
      const audio = new Audio(currentWord.audioUrl);
      audioRef.current = audio;

      audio.onended = () => {
        setAudioPlaying(false);
        audioRef.current = null;
      };
      audio.onerror = () => {
        playGoogleTTS(text);
      };
      audio.play().catch(() => playGoogleTTS(text));
    } else {
      // 2. Nếu không có file audio riêng, dùng Google Translate TTS cho mượt mà
      playGoogleTTS(text);
    }
  };



  // Mark word as known and advance
  const markAsKnown = async () => {
    const wordId = currentWord.id;
    try {
      await api.updateWordReviewStatus(wordId, { status: "MASTERED" });
      setWords(prev => prev.map(w => w.id === wordId ? { ...w, reviewStatus: "MASTERED" } : w));
    } catch (err) {
      console.error("Failed to update status to MASTERED:", err);
    }
    setKnownCount((prev) => prev + 1);
    handleNextWord();
  };

  // Mark word as review and advance
  const markAsReview = async () => {
    const wordId = currentWord.id;
    try {
      await api.updateWordReviewStatus(wordId, { status: "LEARNING" });
      setWords(prev => prev.map(w => w.id === wordId ? { ...w, reviewStatus: "LEARNING" } : w));
    } catch (err) {
      console.error("Failed to update status to LEARNING:", err);
    }
    setReviewCount((prev) => prev + 1);
    handleNextWord();
  };

  // Toggle saved word
  const toggleSaveWord = async () => {
    const wordId = currentWord.id;
    const isCurrentlySaved = currentWord.isFavorite;
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

  const handleNextWord = () => {
    setRevealMeaning(false);
    setTimeout(() => {
      if (currentIndex < words.length - 1) {
        setCurrentIndex(currentIndex + 1);
      } else {
        setIsCompleted(true);
      }
    }, 150);
  };

  const handleReset = () => {
    setCurrentIndex(0);
    setRevealMeaning(false);
    setIsCompleted(false);
    setKnownCount(0);
    setReviewCount(0);
  };

  const isSaved = currentWord ? currentWord.isFavorite : false;

  // Topic specific 3D illustration mapping
  const getTopicIllustration = (tId: string) => {
    if (tId === "environment") {
      return "https://lh3.googleusercontent.com/aida/AP1WRLssMq6t86iEhARr7P-odkfURx-2qMsJ3NxKRWD6JrTFjo8E84qFcn0AkjU0GcaUEOQ0xuLY5xbSRMlGCUvGTTh2ctSIQH3iEgCnIZzdUXRRDCmIApChp2YU0rqlhBZfdCvqgMtVG2ki2rvEiQue0doZAdWs5JAbsd7OC7YY7kdDgf6CwWelRCoLSCC8O6N05XEwry0BXJce7xjTE8gtCVtcHrJIdV-3qk3_Yts556fstosnsBDiEmFUuqpP";
    }
    return "https://lh3.googleusercontent.com/aida/AP1WRLsrEIWx6WHOaI4gpIhpVeHtZ4SelgKTVyGsGXmNPveuIhDN5a6ZzEN3FTZGZCJl9k6TGYV2hjogcxhdQd7c5bgflJEQsWbrvRSrKlhEd56k2jaSy0W6XTkigPDu1krrq1LZZZmE4qI5VNu5JQAwQ5rtwUEgNwPqdaWHV4bQG5Id2z4UpvdggJsNf1to54xIEY6oXJDAR0PMqJM_wzX6fP-xCOXGfwXucN9tJnFYJAZRPIQqgetxCeykW0ky";
  };

  const getTopicMaterialIcon = (tId: string) => {
    switch (tId) {
      case "environment": return "forest";
      case "education": return "school";
      case "technology": return "biotech";
      case "travel": return "flight";
      case "health": return "health_and_safety";
      case "work-jobs": return "work";
      default: return "menu_book";
    }
  };

  const progressPercent = Math.round(((currentIndex) / words.length) * 100);

  return (
    <div className="bg-[#f7f9ff] min-h-screen text-[#001d32] selection:bg-cyan-100 overflow-x-hidden relative">
      
      {/* Dynamic Background Blobs */}
      <div className="fixed inset-0 overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-5%] w-[40vw] h-[40vw] bg-cyan-200/30 rounded-full blur-[80px]"></div>
        <div className="absolute bottom-[-10%] right-[-5%] w-[45vw] h-[45vw] bg-violet-200/20 rounded-full blur-[80px]"></div>
        <div className="absolute top-[30%] right-[10%] w-[30vw] h-[30vw] bg-sky-200/20 rounded-full blur-[80px]"></div>
      </div>

      {/* Top Fixed Navigation Bar */}
      <nav className="fixed top-0 left-0 w-full z-50 px-6 sm:px-12 h-20 flex items-center bg-white/60 backdrop-blur-md border-b border-slate-200/30 shadow-sm">
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between gap-4">
          
          {/* Topic Info */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-600 flex items-center justify-center text-white">
              <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                {getTopicMaterialIcon(topic.slug)}
              </span>
            </div>
            <div>
              <h2 className="font-extrabold text-sm sm:text-base text-cyan-800 leading-tight">{topic.name}</h2>
              <p className="text-[10px] text-text-secondary">Vocab Mastery Journey</p>
            </div>
          </div>

          {/* Center Progress Tracker */}
          {!isCompleted && (
            <div className="flex-1 max-w-md hidden md:flex flex-col gap-1 px-8">
              <div className="flex justify-between items-end text-[11px] font-bold text-text-secondary">
                <span>Từ: {currentIndex + 1} / {words.length}</span>
                <span className="text-primary">{progressPercent}% Hoàn thành</span>
              </div>
              <div className="w-full h-2 bg-slate-200/50 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-primary to-violet-600 rounded-full transition-all duration-300"
                  style={{ width: `${(currentIndex / words.length) * 100}%` }}
                />
              </div>
            </div>
          )}

          {/* Exit Button */}
          <Link
            href={`/courses/${courseId}/modules/vocabulary-by-topics/topics/${topic.slug}`}
            className="group flex items-center gap-1.5 px-4 py-2 rounded-full border border-slate-200 hover:bg-slate-100/50 transition-all duration-300 bg-white/50"
          >
            <span className="material-symbols-outlined text-lg text-text-secondary group-hover:text-red-500 transition-colors">close</span>
            <span className="text-xs font-bold text-text-secondary group-hover:text-text-primary">Thoát</span>
          </Link>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="pt-28 pb-32 px-6 max-w-6xl mx-auto">
        {!isCompleted ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: 3D Illustration */}
            <div className="lg:col-span-6 flex justify-center items-center">
              <div className="glass-panel w-full aspect-[1.34] rounded-3xl p-5 overflow-hidden relative group bg-white/55 border border-cyan-100 shadow-[0_10px_30px_rgba(8,47,73,0.03)]">
                <img
                  alt={`${topic.name} illustration`}
                  className="w-full h-full object-cover rounded-2xl transition-transform duration-700 group-hover:scale-105"
                  src={getTopicIllustration(topic.slug)}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent pointer-events-none"></div>
              </div>
            </div>

            {/* Right Column: Vocabulary Details */}
            <div className="lg:col-span-6 flex flex-col gap-6">
              <div className="glass-panel-heavy rounded-3xl p-6 bg-white/65 backdrop-blur-md border border-cyan-100 shadow-sm relative min-h-[380px] flex flex-col justify-between">
                
                <div>
                  {/* Card Header: POS & Audio */}
                  <div className="flex justify-between items-start mb-4">
                    <span className="bg-violet-100 border border-violet-200 text-violet-800 font-bold text-xs px-4 py-1.5 rounded-full">
                      {currentWord.partOfSpeech}
                    </span>
                    <button
                      onClick={() => playTTS(currentWord.word)}
                      className="w-12 h-12 rounded-full glass-panel flex items-center justify-center text-primary bg-white/60 hover:bg-primary hover:text-white transition-all transform active:scale-90 border border-cyan-100 shadow-sm cursor-pointer"
                      title="Nghe phát âm"
                    >
                      <span className="material-symbols-outlined text-xl">
                        {audioPlaying ? "graphic_eq" : "volume_up"}
                      </span>
                    </button>
                  </div>

                  {/* Word title & IPA */}
                  <h1 className="text-3xl font-black text-text-primary mb-1 tracking-tight">
                    {currentWord.word}
                  </h1>
                  <p className="text-sm font-semibold text-text-secondary font-mono italic mb-6">
                    {currentWord.ipa}
                  </p>

                  {/* Dynamic Reveal Layer */}
                  {!revealMeaning ? (
                    <div
                      onClick={() => setRevealMeaning(true)}
                      className="flex-1 min-h-[160px] rounded-2xl border border-dashed border-primary/20 bg-cyan-50/20 hover:bg-cyan-50/50 transition-all flex flex-col items-center justify-center text-center p-6 cursor-pointer group"
                    >
                      <span className="material-symbols-outlined text-2xl text-primary mb-2 group-hover:scale-110 transition-transform">
                        visibility
                      </span>
                      <p className="text-xs font-bold text-primary">Bấm để lật xem định nghĩa</p>
                      <p className="text-[10px] text-text-secondary mt-1">Xem nghĩa tiếng Việt và câu ví dụ minh họa</p>
                    </div>
                  ) : (
                    <div className="space-y-5 animate-fade-in">
                      {/* Meaning Section */}
                      <div className="p-4 bg-cyan-50/50 rounded-2xl border border-cyan-100">
                        <p className="text-[9px] font-bold text-primary uppercase tracking-wider mb-1">Ý nghĩa tiếng Việt</p>
                        <p className="text-lg font-black text-cyan-800">{currentWord.meaningVi}</p>
                      </div>

                      {/* Example Section */}
                      <div className="space-y-1.5">
                        <p className="text-[9px] font-bold text-text-secondary uppercase tracking-wider">Ví dụ ngữ cảnh</p>
                        <div className="glass-panel p-4 rounded-2xl bg-white/40 border border-cyan-50">
                          <p className="text-xs font-bold text-text-primary italic leading-relaxed mb-1">
                            &ldquo;{highlightWord(currentWord.exampleEn, currentWord.word)}&rdquo;
                          </p>
                          {currentWord.exampleVi && (
                            <p className="text-[11px] text-text-secondary">
                              &rarr; {currentWord.exampleVi}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Related Words / Synonyms */}
                      {currentWord.synonyms && currentWord.synonyms.length > 0 && (
                        <div className="space-y-1.5">
                          <p className="text-[9px] font-bold text-text-secondary uppercase tracking-wider">Từ đồng nghĩa liên quan</p>
                          <div className="flex flex-wrap gap-1.5">
                            {currentWord.synonyms.map((syn: string, idx: number) => (
                              <span
                                key={idx}
                                onClick={() => playTTS(syn)}
                                className="px-3.5 py-1.5 glass-panel rounded-xl text-[11px] font-semibold text-text-primary hover:border-primary transition-all cursor-pointer bg-white/30"
                              >
                                {syn}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Balance space */}
                <div className="h-6" />

              </div>
            </div>

          </div>
        ) : (
          /* Completion Screen */
          <div className="w-full max-w-md mx-auto glass-panel rounded-3xl p-8 bg-white/80 backdrop-blur-md border border-white/50 shadow-md text-center flex flex-col items-center gap-6">
            <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
              <span className="material-symbols-outlined text-4xl">celebration</span>
            </div>
            
            <div className="space-y-1">
              <h2 className="text-2xl font-extrabold text-text-primary">
                Hoàn thành phiên học!
              </h2>
              <p className="text-xs text-text-secondary leading-relaxed">
                Bạn vừa hoàn thành việc học toàn bộ {words.length} thẻ từ vựng của chủ đề <b>{topic.name}</b>.
              </p>
            </div>

            {/* Session Summary Statistics */}
            <div className="w-full grid grid-cols-2 gap-4 my-2">
              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                <p className="text-xs text-emerald-800 font-bold uppercase tracking-wider text-[9px]">Đã thuộc (Known)</p>
                <p className="text-xl font-black text-emerald-700 mt-1">+{knownCount}</p>
              </div>
              <div className="p-4 bg-red-50 rounded-2xl border border-red-100">
                <p className="text-xs text-red-800 font-bold uppercase tracking-wider text-[9px]">Cần ôn (Review)</p>
                <p className="text-xl font-black text-red-700 mt-1">+{reviewCount}</p>
              </div>
            </div>

            {/* Finish Action Buttons */}
            <div className="w-full flex flex-col gap-3">
              <Link
                href={`/courses/${courseId}/modules/vocabulary-by-topics/topics/${topic.slug}/quiz`}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-primary to-secondary text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm hover:shadow"
              >
                <Award className="h-4 w-4" />
                Làm Quiz kiểm tra ngay
              </Link>
              <button
                onClick={handleReset}
                className="w-full py-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-text-primary text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <RefreshCw className="h-4 w-4" />
                Học lại chủ đề này
              </button>
              <Link
                href={`/courses/${courseId}/modules/vocabulary-by-topics`}
                className="w-full py-3.5 rounded-2xl border border-slate-200 bg-white/60 hover:bg-white text-text-secondary text-xs font-bold text-center block transition-all"
              >
                Quay lại danh sách chủ đề
              </Link>
            </div>
          </div>
        )}
      </main>

      {/* Fixed Bottom Study Judgments Bar */}
      {!isCompleted && (
        <div className="fixed bottom-0 left-0 w-full z-40 px-6 pb-10 pointer-events-none">
          <div className="max-w-4xl mx-auto flex items-center justify-center gap-4 pointer-events-auto">
            
            {/* Not Known Button */}
            <button
              onClick={markAsReview}
              className="flex-1 h-16 rounded-3xl bg-white/70 hover:bg-white border border-slate-200 hover:border-red-200 text-[#001d32] text-xs font-bold transition-all transform active:scale-95 shadow-xl flex items-center justify-center gap-3 cursor-pointer"
            >
              <span className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center text-orange-600 shrink-0">
                <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>
                  sentiment_dissatisfied
                </span>
              </span>
              <span>Chưa nhớ</span>
            </button>

            {/* Bookmark button */}
            <button
              onClick={toggleSaveWord}
              className="w-16 h-16 rounded-3xl bg-white/70 hover:bg-white border border-slate-200 hover:border-primary/40 text-[#001d32] flex items-center justify-center transition-all transform active:scale-95 shadow-xl cursor-pointer"
              title={isSaved ? "Bỏ lưu từ" : "Lưu từ khó"}
            >
              <span className={`material-symbols-outlined text-xl transition-colors ${
                isSaved ? "text-primary fill-current" : "text-text-secondary hover:text-primary"
              }`} style={{ fontVariationSettings: isSaved ? "'FILL' 1" : "'FILL' 0" }}>
                bookmark
              </span>
            </button>

            {/* Known Button (Primary Gradient) */}
            <button
              onClick={markAsKnown}
              className="flex-[1.5] h-16 rounded-3xl bg-gradient-to-r from-primary to-secondary text-white text-sm font-bold transition-all transform active:scale-95 shadow-2xl flex items-center justify-center gap-3 cursor-pointer"
            >
              <span className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center text-white shrink-0">
                <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>
                  task_alt
                </span>
              </span>
              <span>Biết rồi</span>
            </button>

          </div>
        </div>
      )}

    </div>
  );
}
