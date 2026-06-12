import { GlassCard } from "@/components/ui/glass-card";

interface HomeStatsProps {
  coursesCount: number;
  totalLessons: number;
}

/**
 * HomeStats displays counters representing learning topics, exercises, and vocabulary count.
 */
export function HomeStats({ coursesCount, totalLessons }: HomeStatsProps) {
  return (
    <section className="py-16">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <GlassCard className="p-8 rounded-2xl text-center">
          <div className="text-4xl font-extrabold text-primary mb-2">
            {coursesCount > 0 ? `${coursesCount}+` : "10+"}
          </div>
          <div className="text-base font-bold text-text-secondary">Chủ đề học từ vựng</div>
        </GlassCard>
        <GlassCard className="p-8 rounded-2xl text-center">
          <div className="text-4xl font-extrabold text-primary mb-2">
            {totalLessons > 0 ? `${totalLessons}+` : "200+"}
          </div>
          <div className="text-base font-bold text-text-secondary">Bài luyện tập &amp; Quiz</div>
        </GlassCard>
        <GlassCard className="p-8 rounded-2xl text-center">
          <div className="text-4xl font-extrabold text-primary mb-2">1000+</div>
          <div className="text-base font-bold text-text-secondary">Từ vựng TOEIC &amp; VSTEP</div>
        </GlassCard>
      </div>
    </section>
  );
}
