import { GlassCard } from "@/components/ui/glass-card";

/**
 * HomeSolutions explains the core solutions of the platform
 * (topic vocabulary, flashcards, grammar quizzes, progress tracking).
 */
export function HomeSolutions() {
  return (
    <section className="py-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-text-primary mb-4">Giải pháp học tiếng Anh toàn diện</h2>
        <div className="h-1 w-20 bg-gradient-to-r from-primary to-secondary mx-auto rounded-full"></div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <GlassCard className="p-6 rounded-2xl group flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center mb-6 text-white group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined" aria-hidden="true">{'category'}</span>
            </div>
            <h3 className="text-lg font-bold mb-2 text-text-primary">Học từ vựng theo chủ đề</h3>
            <p className="text-sm text-text-secondary">Phân loại từ vựng khoa học giúp bạn dễ dàng tra cứu và ghi nhớ lâu dài.</p>
          </div>
        </GlassCard>
        <GlassCard className="p-6 rounded-2xl group flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center mb-6 text-white group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined" aria-hidden="true">{'style'}</span>
            </div>
            <h3 className="text-lg font-bold mb-2 text-text-primary">Flashcard ghi nhớ từ vựng</h3>
            <p className="text-sm text-text-secondary">Ứng dụng phương pháp lặp lại ngắt quãng để lưu trữ thông tin hiệu quả.</p>
          </div>
        </GlassCard>
        <GlassCard className="p-6 rounded-2xl group flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center mb-6 text-white group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined" aria-hidden="true">{'quiz'}</span>
            </div>
            <h3 className="text-lg font-bold mb-2 text-text-primary">Quiz kiểm tra ngữ pháp</h3>
            <p className="text-sm text-text-secondary">Củng cố kiến thức ngay lập tức với các bài tập trắc nghiệm đa dạng sau bài học.</p>
          </div>
        </GlassCard>
        <GlassCard className="p-6 rounded-2xl group flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center mb-6 text-white group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined" aria-hidden="true">{'insights'}</span>
            </div>
            <h3 className="text-lg font-bold mb-2 text-text-primary">Theo dõi tiến độ học tập</h3>
            <p className="text-sm text-text-secondary">Biểu đồ trực quan giúp bạn thấy rõ sự tiến bộ của mình từng ngày.</p>
          </div>
        </GlassCard>
      </div>
    </section>
  );
}
