"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ChevronLeft, Compass, Construction, BookOpen, ArrowRight, CheckCircle2, PlayCircle } from "lucide-react";
import { api, isApiError } from "@/lib/api";
import type { CourseModule, Lesson } from "@/types";

export default function ModuleRouterPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params?.courseId as string;
  const moduleSlug = params?.moduleSlug as string;

  const [currentModule, setCurrentModule] = useState<CourseModule | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!courseId || !moduleSlug) return;

    async function loadModuleData() {
      try {
        setIsLoading(true);
        setError(null);

        // Fetch all modules of the course
        const allModules = await api.getCourseModules(courseId);
        const activeModule = allModules.find((m) => m.slug === moduleSlug);

        if (!activeModule) {
          setError("Không tìm thấy module học tập này.");
          setIsLoading(false);
          return;
        }

        setCurrentModule(activeModule);

        // Redirect vocabulary module to the vocabulary-by-topics page
        if (activeModule.type === "VOCABULARY") {
          router.replace(`/courses/${courseId}/modules/vocabulary-by-topics`);
          return;
        }

        // Fetch lessons if module is GRAMMAR
        if (activeModule.type === "GRAMMAR") {
          const fetchedLessons = await api.getAdminLessons({
            courseId,
            moduleId: activeModule.id,
            status: "PUBLISHED"
          });
          
          // Sort lessons by order ascending
          const sortedLessons = [...fetchedLessons].sort((a, b) => a.order - b.order);
          setLessons(sortedLessons);
        }

        setIsLoading(false);
      } catch (err) {
        console.error("Failed to load module details:", err);
        setError(isApiError(err) ? err.message : "Có lỗi xảy ra khi tải dữ liệu.");
        setIsLoading(false);
      }
    }

    void loadModuleData();
  }, [courseId, moduleSlug, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f0fdff]/90">
        <div className="text-center space-y-3">
          <div className="h-10 w-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm font-semibold text-text-secondary">Đang tải dữ liệu bài học...</p>
        </div>
      </div>
    );
  }

  if (error || !currentModule) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f0fdff]/90 p-4">
        <div className="glass-panel border border-red-200/50 rounded-3xl p-8 max-w-md w-full text-center space-y-5 bg-white/70">
          <div className="h-12 w-12 rounded-full bg-red-50 flex items-center justify-center text-error mx-auto font-bold text-lg">!</div>
          <h2 className="text-xl font-bold text-text-primary">Đã xảy ra lỗi</h2>
          <p className="text-sm text-text-secondary">{error || "Không thể tải thông tin module."}</p>
          <Link
            href={`/courses/${courseId}`}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary text-white text-xs font-bold shadow-md hover:shadow-lg transition-all"
          >
            Quay lại khóa học
          </Link>
        </div>
      </div>
    );
  }

  // Render Grammar Lessons list page
  if (currentModule.type === "GRAMMAR") {
    return (
      <div className="relative min-h-screen bg-[#f0fdff]/40 pb-12">
        <div className="fixed inset-0 bg-grid pointer-events-none -z-10" />
        <div className="gradient-blob bg-primary/5 w-[500px] h-[500px] -top-48 -left-48 pointer-events-none -z-10" />
        <div className="gradient-blob bg-[#520fbc]/5 w-[400px] h-[400px] bottom-0 -right-24 pointer-events-none -z-10" />

        <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
          {/* Back link */}
          <div>
            <Link
              href={`/courses/${courseId}`}
              className="group inline-flex items-center gap-1.5 text-sm font-bold text-text-secondary hover:text-primary transition-colors"
            >
              <ChevronLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
              Quay lại chi tiết khóa học
            </Link>
          </div>

          {/* Module Banner */}
          <div className="glass-panel border border-white/40 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 bg-white/60 backdrop-blur-md shadow-sm">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold">
                <BookOpen className="h-3.5 w-3.5" />
                Nền tảng Ngữ pháp
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-text-primary tracking-tight">
                {currentModule.title}
              </h1>
              <p className="text-sm text-text-secondary max-w-2xl leading-relaxed">
                {currentModule.description || "Học và củng cố toàn bộ các chủ điểm ngữ pháp trọng tâm để phục vụ tốt nhất cho bài thi VSTEP B1-B2."}
              </p>
            </div>
            
            <div className="bg-white/80 border border-slate-100 rounded-2xl p-4 text-center min-w-[140px] shadow-sm">
              <div className="text-3xl font-extrabold text-primary">{lessons.length}</div>
              <div className="text-xs font-bold text-text-secondary uppercase tracking-wider mt-1">Bài học</div>
            </div>
          </div>

          {/* Lessons List Grid */}
          <div className="space-y-4">
            <h2 className="text-xl font-extrabold text-text-primary">Danh sách bài học</h2>
            
            {lessons.length === 0 ? (
              <div className="glass-panel border border-dashed border-primary/20 rounded-2xl p-10 text-center text-text-secondary text-sm bg-white/45">
                Module này hiện chưa được cập nhật bài học nào. Vui lòng quay lại sau!
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {lessons.map((lesson, index) => (
                  <div
                    key={lesson.id}
                    className="glass-card hover:bg-white/85 hover:border-primary/20 hover:-translate-y-0.5 transition-all duration-300 rounded-2xl border border-white/20 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/65 shadow-sm"
                  >
                    <div className="flex items-start gap-4">
                      <div className="h-10 w-10 shrink-0 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
                        {index + 1}
                      </div>
                      <div className="space-y-1">
                        <h3 className="font-bold text-text-primary text-base">
                          {lesson.title}
                        </h3>
                        <p className="text-xs text-text-secondary line-clamp-2 max-w-2xl">
                          {lesson.content.replace(/[#*`]/g, "").slice(0, 150)}...
                        </p>
                      </div>
                    </div>

                    <Link
                      href={`/lessons/${lesson.id}`}
                      className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#004b5d] hover:bg-[#00687a] text-white text-xs font-bold shadow-sm shadow-[#004b5d]/10 hover:shadow transition-all text-center"
                    >
                      Học bài
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Render "Coming Soon" screen for other modules (LISTENING, READING, WRITING, SPEAKING, MOCK_TESTS)
  return (
    <div className="relative min-h-screen flex items-center justify-center bg-[#f0fdff]/90 overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[400px] h-[400px] rounded-full bg-primary/10 blur-[80px] pointer-events-none" />
      <div className="absolute bottom-[10%] right-[-5%] w-[400px] h-[400px] rounded-full bg-[#520fbc]/10 blur-[80px] pointer-events-none" />
      
      <div className="mx-auto w-full max-w-xl px-4 z-10">
        <div className="mb-6">
          <Link
            href={`/courses/${courseId}`}
            className="group inline-flex items-center gap-1.5 text-sm font-bold text-text-secondary hover:text-primary transition-colors"
          >
            <ChevronLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
            Quay lại chi tiết khóa học
          </Link>
        </div>

        <div className="glass-panel border border-white/40 rounded-3xl p-8 sm:p-10 text-center shadow-xl bg-white/75 backdrop-blur-md">
          <div className="mx-auto w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-6 animate-bounce">
            <Construction className="h-8 w-8" />
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-text-primary mb-3">
            Tính năng đang phát triển
          </h1>
          
          <h2 className="text-lg font-bold text-primary mb-4">
            {currentModule.title}
          </h2>

          <p className="text-sm text-text-secondary leading-relaxed mb-8">
            Module học tập này đang được đội ngũ học thuật hoàn thiện nội dung câu hỏi và giao diện làm bài tương tác trực quan. Vui lòng quay lại sau!
          </p>

          <Link
            href={`/courses/${courseId}`}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-primary to-secondary text-white text-sm font-bold shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5"
          >
            <Compass className="h-4 w-4" />
            Khám phá các phần khác
          </Link>
        </div>
      </div>
    </div>
  );
}
