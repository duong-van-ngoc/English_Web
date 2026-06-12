import { GlassCard } from "@/components/ui/glass-card";

/**
 * HomeRoadmap visualizes the 3-step learning path from level assessment to testing.
 */
export function HomeRoadmap() {
  return (
    <section className="py-16">
      <div className="text-center mb-16">
        <h2 className="text-3xl font-bold text-text-primary mb-4">Lộ trình 3 bước chinh phục mục tiêu</h2>
        <div className="h-1 w-20 bg-gradient-to-r from-primary to-secondary mx-auto rounded-full"></div>
      </div>
      <div className="relative grid grid-cols-1 md:grid-cols-3 gap-12">
        <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-primary to-secondary opacity-20 -z-10"></div>
        <GlassCard className="p-6 rounded-2xl text-center relative pt-12">
          <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary text-white flex items-center justify-center text-xl font-bold border-4 border-background shadow-md">1</div>
          <div>
            <h3 className="text-lg font-bold mb-3 text-text-primary">Kiểm tra trình độ</h3>
            <p className="text-sm text-text-secondary">Thực hiện bài test nhanh để xác định năng lực và xuất phát điểm.</p>
          </div>
        </GlassCard>
        <GlassCard className="p-6 rounded-2xl text-center relative pt-12">
          <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary text-white flex items-center justify-center text-xl font-bold border-4 border-background shadow-md">2</div>
          <div>
            <h3 className="text-lg font-bold mb-3 text-text-primary">Học theo đề xuất</h3>
            <p className="text-sm text-text-secondary">Hệ thống gợi ý các bài học phù hợp nhất với năng lực hiện tại của bạn.</p>
          </div>
        </GlassCard>
        <GlassCard className="p-6 rounded-2xl text-center relative pt-12">
          <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary text-white flex items-center justify-center text-xl font-bold border-4 border-background shadow-md">3</div>
          <div>
            <h3 className="text-lg font-bold mb-3 text-text-primary">Làm quiz &amp; Tiến bộ</h3>
            <p className="text-sm text-text-secondary">Thực hành liên tục để nâng điểm thi TOEIC và VSTEP thăng hạng mỗi tuần.</p>
          </div>
        </GlassCard>
      </div>
    </section>
  );
}
