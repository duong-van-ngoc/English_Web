import { GlassCard } from "@/components/ui/glass-card";

/**
 * HomeProblems displays common difficulties learners face when studying English,
 * validating their pain points.
 */
export function HomeProblems() {
  return (
    <section className="py-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-text-primary mb-4">Bạn đang gặp khó khăn gì khi học tiếng Anh?</h2>
        <div className="h-1 w-20 bg-gradient-to-r from-primary to-secondary mx-auto rounded-full"></div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <GlassCard className="p-6 rounded-2xl text-center flex flex-col items-center justify-center min-h-[160px]">
          <span className="material-symbols-outlined text-4xl mb-4 text-primary" aria-hidden="true">{'help_outline'}</span>
          <h3 className="text-lg font-bold text-text-primary">Không biết bắt đầu từ đâu</h3>
        </GlassCard>
        <GlassCard className="p-6 rounded-2xl text-center flex flex-col items-center justify-center min-h-[160px]">
          <span className="material-symbols-outlined text-4xl mb-4 text-accent" aria-hidden="true">{'auto_stories'}</span>
          <h3 className="text-lg font-bold text-text-primary">Học từ vựng nhanh quên</h3>
        </GlassCard>
        <GlassCard className="p-6 rounded-2xl text-center flex flex-col items-center justify-center min-h-[160px]">
          <span className="material-symbols-outlined text-4xl mb-4 text-primary" aria-hidden="true">{'description'}</span>
          <h3 className="text-lg font-bold text-text-primary">Ngữ pháp tiếng Anh khó hiểu</h3>
        </GlassCard>
        <GlassCard className="p-6 rounded-2xl text-center flex flex-col items-center justify-center min-h-[160px]">
          <span className="material-symbols-outlined text-4xl mb-4 text-accent" aria-hidden="true">{'timeline'}</span>
          <h3 className="text-lg font-bold text-text-primary">Không có lộ trình rõ ràng</h3>
        </GlassCard>
      </div>
    </section>
  );
}
