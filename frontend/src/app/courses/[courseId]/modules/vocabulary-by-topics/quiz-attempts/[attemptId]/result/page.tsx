"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  CheckCircle,
  XCircle,
  ChevronLeft,
  Award,
  RefreshCw,
  BookOpen,
  ArrowLeft,
  ChevronRight,
  BookMarked,
  AlertTriangle,
} from "lucide-react";

interface WrongAnswer {
  questionText: string;
  selectedAnswer: string;
  correctAnswer: string;
  explanation: string;
}

interface QuizAttempt {
  attemptId: string;
  topicId: string;
  topicName: string;
  score: number;
  correctCount: number;
  wrongCount: number;
  isPassed: boolean;
  wrongAnswers: WrongAnswer[];
  timestamp: string;
}

export default function QuizResultPage() {
  const params = useParams();
  const router = useRouter();
  
  const courseId = (params?.courseId as string) || "on-thi-vstep-b1";
  const attemptId = (params?.attemptId as string);

  const [attempt, setAttempt] = useState<QuizAttempt | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedAttempts = localStorage.getItem("vocab_quiz_attempts");
      if (storedAttempts) {
        const attemptsList: QuizAttempt[] = JSON.parse(storedAttempts);
        const found = attemptsList.find((a) => a.attemptId === attemptId);
        if (found) {
          setAttempt(found);
        } else {
          router.push(`/courses/${courseId}/modules/vocabulary-by-topics`);
        }
      } else {
        router.push(`/courses/${courseId}/modules/vocabulary-by-topics`);
      }
    }
  }, [attemptId, courseId, router]);

  if (!attempt) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f0fdff]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-[#f0fdff]/90 bg-grid pb-16">
      {/* Decorative Blur Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 rounded-full bg-primary/10 blur-[80px] pointer-events-none -z-10" />
      <div className="absolute bottom-[10%] right-[-5%] w-80 h-80 rounded-full bg-violet-500/10 blur-[80px] pointer-events-none -z-10" />

      <div className="mx-auto w-full max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
        
        {/* Navigation Breadcrumb */}
        <div className="mb-6 flex justify-between items-center">
          <Link
            href={`/courses/${courseId}/modules/vocabulary-by-topics/topics/${attempt.topicId}`}
            className="group flex items-center gap-1 text-sm font-bold text-text-secondary hover:text-primary transition-colors"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
            Quay lại chi tiết chủ đề
          </Link>
        </div>

        {/* Results Hero Card */}
        <section className="glass-panel rounded-3xl p-6 sm:p-8 bg-white/75 backdrop-blur-md border border-white/50 shadow-md text-center flex flex-col items-center gap-5 mb-8">
          
          {/* Status Badge Icon */}
          <div className="w-16 h-16 rounded-full flex items-center justify-center">
            {attempt.isPassed ? (
              <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                <span className="material-symbols-outlined text-4xl">verified</span>
              </div>
            ) : (
              <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
                <span className="material-symbols-outlined text-4xl">error</span>
              </div>
            )}
          </div>

          <div className="space-y-1">
            <h1 className="text-2xl font-extrabold text-text-primary">
              Kết quả kiểm tra từ vựng
            </h1>
            <p className="text-xs text-text-secondary">
              Chủ đề: <b>{attempt.topicName}</b>
            </p>
          </div>

          {/* Pass/Fail Banner */}
          <div className={`px-5 py-2.5 rounded-full text-xs font-black uppercase tracking-wider ${
            attempt.isPassed
              ? "bg-emerald-100 border border-emerald-200 text-emerald-800"
              : "bg-amber-100 border border-amber-200 text-amber-800"
          }`}>
            {attempt.isPassed ? "ĐẠT (PASSED)" : "CHƯA ĐẠT (FAILED)"}
          </div>

          {/* Score & Counter Grid */}
          <div className="w-full grid grid-cols-3 gap-4 my-2 border-t border-b border-slate-200/50 py-5">
            <div className="flex flex-col items-center">
              <span className="text-2xl sm:text-3xl font-black text-text-primary">{attempt.score}%</span>
              <span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider mt-1">Điểm số</span>
            </div>
            <div className="flex flex-col items-center border-l border-r border-slate-200/50">
              <span className="text-2xl sm:text-3xl font-black text-emerald-600">+{attempt.correctCount}</span>
              <span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider mt-1">Câu đúng</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-2xl sm:text-3xl font-black text-red-500">-{attempt.wrongCount}</span>
              <span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider mt-1">Câu sai</span>
            </div>
          </div>

          {/* Tips/Feedback comment */}
          <p className="text-xs text-text-secondary italic px-4">
            {attempt.isPassed
              ? "Tuyệt vời! Bạn đã nắm rất vững từ vựng chủ đề này. Hãy tiếp tục thử sức với các chủ đề khác nhé."
              : "Đừng nản chí! Bạn cần đạt tối thiểu 70% để vượt qua bài kiểm tra. Hãy ôn lại flashcard và làm lại quiz nhé."}
          </p>

          {/* Action Button Group */}
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <Link
              href={`/courses/${courseId}/modules/vocabulary-by-topics/topics/${attempt.topicId}/quiz`}
              className="py-3 rounded-2xl bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold transition-all shadow-sm hover:shadow flex items-center justify-center gap-1.5 transform hover:-translate-y-0.5"
            >
              <RefreshCw className="h-4 w-4 shrink-0" />
              Làm lại kiểm tra
            </Link>
            <Link
              href={`/courses/${courseId}/modules/vocabulary-by-topics/topics/${attempt.topicId}`}
              className="py-3 rounded-2xl bg-white border border-primary/20 text-primary hover:bg-slate-50 text-xs font-bold transition-all shadow-sm hover:shadow flex items-center justify-center gap-1.5"
            >
              <BookOpen className="h-4 w-4 shrink-0" />
              Ôn lại từ vựng
            </Link>
          </div>

        </section>

        {/* Detailed Correction Panel (only show if there are wrong answers) */}
        {attempt.wrongAnswers.length > 0 && (
          <section className="space-y-4">
            <h3 className="text-sm font-bold text-text-primary flex items-center gap-1.5 mb-2 px-1">
              <AlertTriangle className="h-4 w-4 text-red-500" />
              Chi tiết các câu trả lời sai
            </h3>

            {attempt.wrongAnswers.map((item, idx) => (
              <div
                key={idx}
                className="glass-panel rounded-3xl p-5 bg-white border border-slate-200 shadow-sm space-y-4"
              >
                
                {/* Question Info */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold text-red-600 bg-red-50 border border-red-100 px-2 py-0.5 rounded-md uppercase">
                    Câu sai {idx + 1}
                  </span>
                  <p className="text-xs font-bold text-text-primary leading-relaxed">
                    {item.questionText}
                  </p>
                </div>

                {/* Answers Choice Detail */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-red-50 border border-red-100 rounded-2xl flex items-start gap-2">
                    <XCircle className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-red-800 text-[10px] uppercase">Đáp án bạn chọn</p>
                      <p className="font-semibold text-red-700 mt-0.5">{item.selectedAnswer}</p>
                    </div>
                  </div>

                  <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-emerald-800 text-[10px] uppercase">Đáp án chính xác</p>
                      <p className="font-semibold text-emerald-700 mt-0.5">{item.correctAnswer}</p>
                    </div>
                  </div>
                </div>

                {/* Explanation Card */}
                <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 space-y-1 text-xs">
                  <p className="font-bold text-text-primary text-[10px] uppercase">Giải thích chi tiết</p>
                  <p className="text-text-secondary leading-relaxed mt-0.5 font-medium">
                    {item.explanation}
                  </p>
                </div>

              </div>
            ))}
          </section>
        )}

      </div>
    </div>
  );
}
