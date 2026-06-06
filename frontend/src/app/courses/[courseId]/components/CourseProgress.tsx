import { Target } from "lucide-react";

interface CourseProgressProps {
  percent: number;
  completedLessons: number;
  totalLessons: number;
}

export function CourseProgress({
  percent,
  completedLessons,
  totalLessons,
}: CourseProgressProps) {
  return (
    <div className="glass-card rounded-[22px] border border-white/20 bg-white/55 p-6 backdrop-blur-md shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-primary/10 p-2.5 text-primary">
            <Target className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-text-primary">Tiến trình tổng quan</h3>
            <p className="text-xs text-text-secondary mt-0.5">
              {completedLessons} trên {totalLessons} bài học hoàn thành
            </p>
          </div>
        </div>
        <span className="text-2xl font-extrabold text-primary">{percent}%</span>
      </div>

      <div className="mt-4">
        <div className="h-3 w-full rounded-full bg-primary/10 p-[2px]">
          <div
            className="h-full rounded-full bg-gradient-to-r from-primary to-secondary transition-all duration-1000 ease-out"
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>
    </div>
  );
}
