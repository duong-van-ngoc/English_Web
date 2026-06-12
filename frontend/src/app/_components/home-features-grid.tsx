import { GlassCard } from "@/components/ui/glass-card";

/**
 * HomeFeaturesGrid displays a bento grid of smart platform features
 * (pronunciation, context examples, quick quizzes, vocabulary saves, score statistics, AI tutor).
 */
export function HomeFeaturesGrid() {
  return (
    <section className="py-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-text-primary mb-4">Tính năng học thông minh</h2>
        <div className="h-1 w-20 bg-gradient-to-r from-primary to-secondary mx-auto rounded-full"></div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <GlassCard className="p-6 rounded-2xl text-center flex flex-col items-center justify-center col-span-2 min-h-[120px]">
          <span className="material-symbols-outlined text-primary mb-3 text-3xl" aria-hidden="true">{'record_voice_over'}</span>
          <h4 className="text-sm font-semibold text-text-primary">Phát âm từ vựng chuẩn</h4>
        </GlassCard>
        <GlassCard className="p-6 rounded-2xl text-center flex flex-col items-center justify-center min-h-[120px]">
          <span className="material-symbols-outlined text-accent mb-3 text-3xl" aria-hidden="true">{'lightbulb'}</span>
          <h4 className="text-sm font-semibold text-text-primary">Ví dụ thực tế sinh động</h4>
        </GlassCard>
        <GlassCard className="p-6 rounded-2xl text-center flex flex-col items-center justify-center min-h-[120px]">
          <span className="material-symbols-outlined text-primary mb-3 text-3xl" aria-hidden="true">{'fact_check'}</span>
          <h4 className="text-sm font-semibold text-text-primary">Bài tập trắc nghiệm nhanh</h4>
        </GlassCard>
        <GlassCard className="p-6 rounded-2xl text-center flex flex-col items-center justify-center col-span-2 min-h-[120px]">
          <span className="material-symbols-outlined text-accent mb-3 text-3xl" aria-hidden="true">{'bookmark'}</span>
          <h4 className="text-sm font-semibold text-text-primary">Lưu từ vựng chưa thuộc</h4>
        </GlassCard>
        <GlassCard className="p-6 rounded-2xl text-center flex flex-col items-center justify-center col-span-3 min-h-[120px]">
          <span className="material-symbols-outlined text-primary mb-3 text-3xl" aria-hidden="true">{'bar_chart'}</span>
          <h4 className="text-sm font-semibold text-text-primary">Thống kê điểm số quiz</h4>
        </GlassCard>
        <GlassCard className="p-6 rounded-2xl text-center flex flex-col items-center justify-center col-span-3 min-h-[120px]">
          <span className="material-symbols-outlined text-accent mb-3 text-3xl" aria-hidden="true">{'psychology'}</span>
          <h4 className="text-sm font-semibold text-text-primary">AI giải thích cấu trúc</h4>
        </GlassCard>
      </div>
    </section>
  );
}
