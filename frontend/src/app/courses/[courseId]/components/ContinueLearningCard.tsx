import { PlayCircle } from "lucide-react";

interface ContinueLearningCardProps {
  moduleTitle: string;
  lessonTitle: string;
  onContinue: () => void;
}

export function ContinueLearningCard({
  moduleTitle,
  lessonTitle,
  onContinue,
}: ContinueLearningCardProps) {
  return (
    <div className="glass-card rounded-[22px] border border-white/20 bg-white/55 p-6 backdrop-blur-md shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div className="flex items-start gap-4">
        <div className="rounded-2xl bg-secondary/15 p-3.5 text-secondary flex-shrink-0">
          <PlayCircle className="h-6 w-6" />
        </div>
        <div className="space-y-1">
          <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
            Bài học đang dở
          </span>
          <h4 className="text-sm font-extrabold text-[#520fbc]">{moduleTitle}</h4>
          <p className="text-base font-bold text-text-primary">{lessonTitle}</p>
        </div>
      </div>

      <button
        onClick={onContinue}
        className="self-start sm:self-center rounded-xl bg-[#004b5d] hover:bg-[#00687a] text-white font-bold px-5 py-3 text-sm transition-all shadow-md shadow-[#004b5d]/10 flex items-center gap-2 cursor-pointer active:scale-95"
      >
        <span>Tiếp tục bài học</span>
        <span className="material-symbols-outlined !text-md">arrow_forward</span>
      </button>
    </div>
  );
}
