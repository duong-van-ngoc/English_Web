import {
  Target,
  BookOpen,
  Calendar,
  Layers,
  FileText,
  Volume2,
  PenTool,
  Mic,
  Trophy,
  ChevronRight,
} from "lucide-react";

interface CourseSidebarProps {
  percent: number;
  currentModule: string;
  currentLesson: string;
  onContinue: () => void;
}

export function CourseSidebar({
  percent,
  currentModule,
  currentLesson,
  onContinue,
}: CourseSidebarProps) {
  return (
    <aside className="space-y-6">
      {/* Target Progress Card */}
      <div className="glass-card rounded-[22px] border border-white/20 bg-white/55 p-6 backdrop-blur-md shadow-sm">
        <h3 className="text-sm font-bold text-text-primary uppercase tracking-wider mb-4 flex items-center gap-2">
          <Trophy className="h-4 w-4 text-amber-500" />
          Tiến trình của bạn
        </h3>
        
        <div className="flex items-end justify-between mb-2">
          <span className="text-sm text-text-secondary font-semibold">Tỷ lệ hoàn thành</span>
          <span className="text-xl font-extrabold text-primary">{percent}%</span>
        </div>
        
        <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-primary to-secondary transition-all duration-1000"
            style={{ width: `${percent}%` }}
          />
        </div>

        {/* Current Lesson Area */}
        <div className="mt-6 border-t border-slate-200/60 pt-5 space-y-3">
          <div>
            <span className="text-[11px] font-bold text-text-secondary uppercase">Đang học dở</span>
            <p className="text-xs font-bold text-[#520fbc] mt-0.5">{currentModule}</p>
            <p className="text-sm font-bold text-text-primary">{currentLesson}</p>
          </div>

          <button
            onClick={onContinue}
            className="w-full flex items-center justify-center gap-1.5 rounded-xl bg-[#004b5d] hover:bg-[#00687a] text-white py-2.5 text-xs font-bold transition-all shadow-sm shadow-[#004b5d]/10 cursor-pointer"
          >
            Học tiếp bài này
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Study Goal Card */}
      <div className="glass-card rounded-[22px] border border-white/20 bg-white/55 p-6 backdrop-blur-md shadow-sm">
        <h3 className="text-sm font-bold text-text-primary uppercase tracking-wider mb-4 flex items-center gap-2">
          <Target className="h-4 w-4 text-primary" />
          Mục tiêu học tập
        </h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-white/40 rounded-xl border border-white/30">
            <span className="text-xs font-semibold text-text-secondary">Mục tiêu đạt</span>
            <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">B1 - B2</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-white/40 rounded-xl border border-white/30">
            <span className="text-xs font-semibold text-text-secondary">Thời lượng học</span>
            <span className="text-xs font-bold text-[#520fbc] bg-[#520fbc]/10 px-2 py-0.5 rounded-full">5 giờ / tuần</span>
          </div>
        </div>
      </div>

      {/* Course Includes Card */}
      <div className="glass-card rounded-[22px] border border-white/20 bg-white/55 p-6 backdrop-blur-md shadow-sm">
        <h3 className="text-sm font-bold text-text-primary uppercase tracking-wider mb-4">
          Khóa học bao gồm
        </h3>
        
        <nav className="space-y-3.5" aria-label="Course includes">
          <div className="flex items-center gap-3 text-xs font-semibold text-text-secondary">
            <Layers className="h-4 w-4 text-primary flex-shrink-0" />
            <span>7 modules lý thuyết và thực hành</span>
          </div>
          <div className="flex items-center gap-3 text-xs font-semibold text-text-secondary">
            <BookOpen className="h-4 w-4 text-[#520fbc] flex-shrink-0" />
            <span>80+ bài học và bài kiểm tra ngắn</span>
          </div>
          <div className="flex items-center gap-3 text-xs font-semibold text-text-secondary">
            <Calendar className="h-4 w-4 text-amber-500 flex-shrink-0" />
            <span>Học từ vựng theo 20+ chủ đề thi</span>
          </div>
          <div className="flex items-center gap-3 text-xs font-semibold text-text-secondary">
            <Volume2 className="h-4 w-4 text-teal-600 flex-shrink-0" />
            <span>Luyện nghe giọng chuẩn VSTEP</span>
          </div>
          <div className="flex items-center gap-3 text-xs font-semibold text-text-secondary">
            <FileText className="h-4 w-4 text-[#00687a] flex-shrink-0" />
            <span>Đọc hiểu 24 chủ đề cốt lõi</span>
          </div>
          <div className="flex items-center gap-3 text-xs font-semibold text-text-secondary">
            <PenTool className="h-4 w-4 text-rose-500 flex-shrink-0" />
            <span>Bài mẫu viết thư & viết luận VSTEP</span>
          </div>
          <div className="flex items-center gap-3 text-xs font-semibold text-text-secondary">
            <Mic className="h-4 w-4 text-indigo-500 flex-shrink-0" />
            <span>Luyện nói tương tác 3 phần thi</span>
          </div>
        </nav>
      </div>
    </aside>
  );
}
