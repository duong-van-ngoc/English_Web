"use client";

/**
 * CoursesFeatures displays key advantages of studying courses in EnglishTobi.
 */
export function CoursesFeatures() {
  return (
    <section className="space-y-12">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold text-text-primary">
          Tại sao nên học theo khóa học?
        </h2>
        <div className="h-1 w-20 bg-gradient-to-r from-primary to-secondary mx-auto rounded-full"></div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glass-card p-6 rounded-2xl space-y-4 hover:border-primary/30 transition-all duration-300">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
            <span className="material-symbols-outlined text-2xl" aria-hidden="true">
              rocket_launch
            </span>
          </div>
          <h5 className="text-base font-bold text-text-primary">
            Học nhanh hơn 2x
          </h5>
          <p className="text-xs text-text-secondary leading-relaxed">
            Lộ trình học tập tinh gọn, tập trung hoàn toàn vào những kiến thức trọng tâm nhất.
          </p>
        </div>
        <div className="glass-card p-6 rounded-2xl space-y-4 hover:border-accent/30 transition-all duration-300">
          <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center text-accent">
            <span className="material-symbols-outlined text-2xl" aria-hidden="true">
              track_changes
            </span>
          </div>
          <h5 className="text-base font-bold text-text-primary">
            Theo sát mục tiêu
          </h5>
          <p className="text-xs text-text-secondary leading-relaxed">
            Luôn biết mình đang ở đâu và cần thêm bao nhiêu nỗ lực để đạt mục tiêu TOEIC/VSTEP mong muốn.
          </p>
        </div>
        <div className="glass-card p-6 rounded-2xl space-y-4 hover:border-secondary/30 transition-all duration-300">
          <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary">
            <span className="material-symbols-outlined text-2xl" aria-hidden="true">
              verified_user
            </span>
          </div>
          <h5 className="text-base font-bold text-text-primary">
            Cam kết chất lượng
          </h5>
          <p className="text-xs text-text-secondary leading-relaxed">
            Kiến thức chuẩn xác kết hợp với phương pháp học khoa học đã được kiểm chứng hiệu quả.
          </p>
        </div>
        <div className="glass-card p-6 rounded-2xl space-y-4 hover:border-primary/30 transition-all duration-300">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
            <span className="material-symbols-outlined text-2xl" aria-hidden="true">
              psychology
            </span>
          </div>
          <h5 className="text-base font-bold text-text-primary">
            Nhớ lâu gấp 3
          </h5>
          <p className="text-xs text-text-secondary leading-relaxed">
            Áp dụng phương pháp lặp lại ngắt quãng (Spaced Repetition) thông minh và học qua hình ảnh.
          </p>
        </div>
      </div>
    </section>
  );
}
