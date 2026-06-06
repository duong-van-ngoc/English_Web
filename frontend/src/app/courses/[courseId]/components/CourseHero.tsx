import Link from "next/link";
import { Award, Layers, BookOpen, Clock } from "lucide-react";

interface CourseHeroProps {
  onContinueLearning: () => void;
}

export function CourseHero({ onContinueLearning }: CourseHeroProps) {
  return (
    <div className="relative overflow-hidden rounded-[24px] border border-white/20 bg-gradient-to-br from-white/70 via-white/50 to-[#b7eaff]/20 p-6 md:p-8 shadow-sm backdrop-blur-md animate-in fade-in slide-in-from-top-4 duration-500">
      {/* Background Glow */}
      <div className="absolute -top-24 -left-24 -z-10 h-48 w-48 rounded-full bg-primary/10 blur-3xl" />
      <div className="absolute -bottom-24 -right-24 -z-10 h-48 w-48 rounded-full bg-secondary/15 blur-3xl" />

      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div className="space-y-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary">
            Chứng chỉ quốc gia
          </div>
          
          <h1 className="text-3xl font-extrabold tracking-tight text-text-primary md:text-4xl bg-gradient-to-r from-[#004b5d] to-[#520fbc] bg-clip-text text-transparent">
            Ôn thi VSTEP B1-B2
          </h1>
          
          <p className="text-base leading-relaxed text-text-secondary">
            Lộ trình học toàn diện giúp bạn tự tin vượt qua kỳ thi đánh giá năng lực tiếng Anh VSTEP từ cấp độ cơ bản đến mục tiêu đạt chuẩn B1-B2 theo Khung năng lực Ngoại ngữ 6 bậc Việt Nam.
          </p>

          {/* Badges Grid */}
          <div className="flex flex-wrap gap-4 pt-2">
            <div className="flex items-center gap-2 rounded-xl bg-white/60 border border-white/40 px-3 py-2 text-xs font-semibold text-text-primary shadow-sm">
              <Award className="h-4 w-4 text-primary" />
              <span>Trình độ: A0-A1 &rarr; B1-B2</span>
            </div>
            
            <div className="flex items-center gap-2 rounded-xl bg-white/60 border border-white/40 px-3 py-2 text-xs font-semibold text-text-primary shadow-sm">
              <Layers className="h-4 w-4 text-[#520fbc]" />
              <span>7 Modules học tập</span>
            </div>

            <div className="flex items-center gap-2 rounded-xl bg-white/60 border border-white/40 px-3 py-2 text-xs font-semibold text-text-primary shadow-sm">
              <BookOpen className="h-4 w-4 text-[#00687a]" />
              <span>80+ Bài học và Quiz</span>
            </div>

            <div className="flex items-center gap-2 rounded-xl bg-white/60 border border-white/40 px-3 py-2 text-xs font-semibold text-text-primary shadow-sm">
              <Clock className="h-4 w-4 text-amber-500" />
              <span>Lộ trình: 8 - 12 tuần</span>
            </div>
          </div>
        </div>

        {/* Hero Actions */}
        <div className="flex flex-col gap-3 min-w-[180px]">
          <button
            onClick={onContinueLearning}
            className="w-full rounded-xl bg-gradient-to-r from-primary to-secondary px-5 py-3 text-sm font-bold text-white shadow-md shadow-primary/20 hover:brightness-105 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 cursor-pointer text-center"
          >
            Tiếp tục học
          </button>
          
          <Link
            href="#modules-section"
            className="w-full rounded-xl border border-primary/20 bg-white/60 hover:bg-primary/5 hover:border-primary/45 px-5 py-3 text-sm font-bold text-primary transition-all text-center"
          >
            Xem lộ trình
          </Link>
        </div>
      </div>
    </div>
  );
}
