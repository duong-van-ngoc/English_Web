import Link from "next/link";
import {
  BookOpen,
  Languages,
  Headphones,
  FileText,
  PenTool,
  Mic,
  ClipboardCheck,
  Lock,
  CheckCircle,
  PlayCircle,
  HelpCircle,
} from "lucide-react";
import type { VstepModule } from "../data/vstepModules";
import type { CourseModule } from "@/types";

interface ModuleCardProps {
  module: VstepModule | CourseModule;
  courseId: string;
}

export function ModuleCard({ module, courseId }: ModuleCardProps) {
  const getModuleMetaData = (type: string) => {
    switch (type) {
      case "GRAMMAR":
        return { subtitle: "Nền tảng ngữ pháp", lessons: 12, quizzes: 3, progress: 60, status: "in-progress" as const, iconName: "Grammar" as const };
      case "VOCABULARY":
        return { subtitle: "Từ vựng theo chủ đề", lessons: 15, quizzes: 5, progress: 30, status: "in-progress" as const, iconName: "Vocabulary" as const };
      case "LISTENING":
        return { subtitle: "Luyện nghe", lessons: 10, quizzes: 4, progress: 15, status: "in-progress" as const, iconName: "Listening" as const };
      case "READING":
        return { subtitle: "Luyện đọc", lessons: 10, quizzes: 4, progress: 20, status: "in-progress" as const, iconName: "Reading" as const };
      case "WRITING":
        return { subtitle: "Luyện viết", lessons: 12, quizzes: 3, progress: 0, status: "not-started" as const, iconName: "Writing" as const };
      case "SPEAKING":
        return { subtitle: "Luyện nói", lessons: 12, quizzes: 3, progress: 0, status: "not-started" as const, iconName: "Speaking" as const };
      case "MOCK_TESTS":
        return { subtitle: "Đề thi thử", lessons: 8, quizzes: 8, progress: 0, status: "locked" as const, iconName: "MockTests" as const };
      default:
        return { subtitle: "Bài học kỹ năng", lessons: 10, quizzes: 2, progress: 0, status: "not-started" as const, iconName: "Grammar" as const };
    }
  };

  const isDbModule = "type" in module;
  const meta = isDbModule ? getModuleMetaData(module.type) : {
    subtitle: module.subtitle,
    lessons: module.lessons,
    quizzes: module.quizzes,
    progress: module.progress,
    status: module.status,
    iconName: module.iconName,
  };

  const { title, description, slug } = module;
  const { subtitle, lessons, quizzes, progress, status, iconName } = meta;

  // Map icon strings to Lucide icon components
  const getIcon = () => {
    const iconClass = "h-6 w-6";
    switch (iconName) {
      case "Grammar":
        return <BookOpen className={`${iconClass} text-primary`} />;
      case "Vocabulary":
        return <Languages className={`${iconClass} text-secondary`} />;
      case "Listening":
        return <Headphones className={`${iconClass} text-[#520fbc]`} />;
      case "Reading":
        return <FileText className={`${iconClass} text-[#00687a]`} />;
      case "Writing":
        return <PenTool className={`${iconClass} text-teal-600`} />;
      case "Speaking":
        return <Mic className={`${iconClass} text-indigo-600`} />;
      case "MockTests":
        return <ClipboardCheck className={`${iconClass} text-amber-600`} />;
      default:
        return <HelpCircle className={iconClass} />;
    }
  };

  // Get status badge styles
  const getStatusBadge = () => {
    switch (status) {
      case "completed":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-800">
            <CheckCircle className="h-3.5 w-3.5" />
            Đã hoàn thành
          </span>
        );
      case "in-progress":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-bold text-blue-800">
            <PlayCircle className="h-3.5 w-3.5 animate-pulse" />
            Đang học
          </span>
        );
      case "locked":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-bold text-slate-500">
            <Lock className="h-3.5 w-3.5" />
            Đang khóa
          </span>
        );
      case "not-started":
      default:
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-bold text-slate-800">
            Chưa bắt đầu
          </span>
        );
    }
  };

  // Get href link target based on module properties
  const getHref = () => {
    if (status === "locked") return "#";
    if (iconName === "MockTests") {
      return `/courses/${courseId}/tests`;
    }
    return `/courses/${courseId}/modules/${slug}`;
  };

  // Get CTA Button text & style
  const renderCTAButton = () => {
    const commonClass = "w-full rounded-xl py-2.5 text-sm font-bold text-center transition-all duration-200 cursor-pointer block";
    
    if (status === "locked") {
      return (
        <button
          disabled
          className={`${commonClass} border border-slate-200 bg-slate-50 text-slate-400 cursor-not-allowed flex items-center justify-center gap-1.5`}
        >
          <Lock className="h-4 w-4" />
          Bài học đang khóa
        </button>
      );
    }

    if (iconName === "MockTests") {
      return (
        <Link
          href={getHref()}
          className={`${commonClass} bg-amber-600 hover:bg-amber-700 text-white shadow-sm shadow-amber-600/10 hover:shadow-md hover:-translate-y-0.5`}
        >
          Làm đề thi thử
        </Link>
      );
    }

    if (status === "completed") {
      return (
        <Link
          href={getHref()}
          className={`${commonClass} border border-emerald-500 bg-emerald-50 hover:bg-emerald-100 text-emerald-700`}
        >
          Ôn tập bài học
        </Link>
      );
    }

    if (status === "in-progress") {
      return (
        <Link
          href={getHref()}
          className={`${commonClass} bg-[#004b5d] hover:bg-[#00687a] text-white shadow-sm shadow-[#004b5d]/10 hover:shadow-md hover:-translate-y-0.5`}
        >
          Tiếp tục học
        </Link>
      );
    }

    return (
      <Link
        href={getHref()}
        className={`${commonClass} border border-primary/30 hover:border-primary bg-white hover:bg-primary/5 text-primary`}
      >
        Bắt đầu học
      </Link>
    );
  };

  const isLocked = status === "locked";

  return (
    <div
      className={`glass-card rounded-[22px] border border-white/20 p-6 backdrop-blur-md shadow-sm transition-all duration-300 flex flex-col justify-between h-full bg-white/55 ${
        isLocked
          ? "opacity-75"
          : "hover:-translate-y-1.5 hover:shadow-lg hover:bg-white/70 hover:border-primary/20"
      }`}
    >
      <div className="space-y-4">
        {/* Card Header: Icon & Status */}
        <div className="flex items-center justify-between">
          <div className="rounded-2xl bg-white p-3 shadow-sm border border-slate-100">
            {getIcon()}
          </div>
          {getStatusBadge()}
        </div>

        {/* Title */}
        <div className="space-y-1">
          <h3 className="text-lg font-bold text-text-primary group-hover:text-primary transition-colors">
            {title}
          </h3>
          <p className="text-xs font-semibold text-text-secondary uppercase tracking-wide">
            {subtitle}
          </p>
        </div>

        {/* Description */}
        <p className="text-xs text-text-secondary leading-relaxed line-clamp-3">
          {description}
        </p>

        {/* Lessons & Quizzes count summary */}
        <div className="flex items-center gap-4 text-xs font-semibold text-text-secondary border-t border-dashed border-slate-200/60 pt-3">
          <span>{lessons} bài học</span>
          <span className="h-1.5 w-1.5 rounded-full bg-slate-300" />
          <span>{quizzes} bài Quizzes</span>
        </div>

        {/* Progress Bar (show if progress is > 0 or not locked) */}
        {!isLocked && (
          <div className="space-y-1.5 pt-1">
            <div className="flex items-center justify-between text-[11px] font-bold text-text-secondary">
              <span>Độ hoàn thành</span>
              <span>{progress}%</span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-slate-100">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  progress === 100
                    ? "bg-emerald-500"
                    : "bg-gradient-to-r from-primary to-secondary"
                }`}
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}
      </div>

      <div className="pt-5 mt-auto">
        {renderCTAButton()}
      </div>
    </div>
  );
}
