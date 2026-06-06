"use client";

/**
 * CoursesRoadmap displays the 3-step scientific roadmap for learning english.
 */
export function CoursesRoadmap() {
  return (
    <section className="py-8 space-y-12">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold text-text-primary">
          Lộ trình học tập đề xuất
        </h2>
        <div className="h-1 w-20 bg-gradient-to-r from-primary to-secondary mx-auto rounded-full"></div>
        <p className="text-base text-text-secondary">
          Quy trình 3 bước khoa học giúp bạn đạt kết quả tối đa
        </p>
      </div>
      <div className="glass-card rounded-[2.5rem] p-8 md:p-12 shadow-lg">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 relative">
          <div className="hidden lg:block absolute top-1/2 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-primary/30 via-accent/30 to-primary/30 -translate-y-12 z-0" aria-hidden="true"></div>
          
          {/* Step 1 */}
          <div className="relative z-10 flex flex-col items-center text-center space-y-6">
            <div className="w-20 h-20 rounded-2xl bg-primary text-white flex items-center justify-center text-2xl font-bold shadow-xl shadow-primary/20">
              1
            </div>
            <div className="space-y-2">
              <h4 className="text-lg font-bold text-text-primary">
                Đánh giá &amp; Phân tích
              </h4>
              <p className="text-sm text-text-secondary leading-relaxed">
                Thực hiện bài kiểm tra đầu vào để xác định chính xác trình độ và lỗ hổng kiến thức hiện tại.
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="relative z-10 flex flex-col items-center text-center space-y-6">
            <div className="w-20 h-20 rounded-2xl bg-accent text-white flex items-center justify-center text-2xl font-bold shadow-xl shadow-accent/20">
              2
            </div>
            <div className="space-y-2">
              <h4 className="text-lg font-bold text-text-primary">
                Học tập Cá nhân hóa
              </h4>
              <p className="text-sm text-text-secondary leading-relaxed">
                Hệ thống tự động gợi ý các bài học và bài luyện tập phù hợp nhất với điểm yếu của bạn.
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="relative z-10 flex flex-col items-center text-center space-y-6">
            <div className="w-20 h-20 rounded-2xl bg-secondary text-white flex items-center justify-center text-2xl font-bold shadow-xl shadow-secondary/20">
              3
            </div>
            <div className="space-y-2">
              <h4 className="text-lg font-bold text-text-primary">
                Luyện tập &amp; Chinh phục
              </h4>
              <p className="text-sm text-text-secondary leading-relaxed">
                Thực hành liên tục với các bộ đề thi thử TOEIC &amp; VSTEP sát thực tế để tự tin bứt phá điểm thi.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
