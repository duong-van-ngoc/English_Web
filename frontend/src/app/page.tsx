import Link from "next/link";

import { EmptyState } from "@/components/empty-state";
import { GlassCard } from "@/components/glass-card";
import { api } from "@/lib/api";
import type { Course } from "@/types";

export default async function HomePage() {
  let courses: Course[] = [];

  try {
    courses = await api.getCourses();
  } catch {
    courses = [];
  }

  const featuredCourses = courses.slice(0, 3);
  const totalLessons = courses.reduce(
    (sum, course) => sum + (course.lessons?.length ?? 0),
    0,
  );

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Section 1: Hero */}
      <section className="mx-auto flex flex-col items-center gap-12 py-16 md:py-24 lg:flex-row">
        <div className="flex-1 space-y-8 text-center lg:text-left">
          <h1 className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-4xl font-extrabold tracking-tight text-transparent sm:text-5xl md:text-6xl leading-tight">
            Học tiếng Anh dễ hơn mỗi ngày
          </h1>
          <p className="text-lg text-text-secondary max-w-xl mx-auto lg:mx-0 leading-relaxed">
            Luyện từ vựng, ngữ pháp và kỹ năng TOEIC theo lộ trình cá nhân hóa, phù hợp cho người mới bắt đầu.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <Link
              href="/register"
              className="bg-gradient-to-br from-primary to-secondary text-white px-8 py-4 rounded-2xl font-bold shadow-lg hover:shadow-xl hover:translate-y-[-2px] active:scale-95 transition-all text-center inline-block"
            >
              Bắt đầu miễn phí
            </Link>
            <Link
              href="/courses"
              className="glass-panel text-primary px-8 py-4 rounded-2xl font-bold shadow-md hover:shadow-lg hover:translate-y-[-2px] active:scale-95 transition-all text-center inline-block"
            >
              Xem lộ trình học
            </Link>
          </div>
        </div>
        <div className="flex-1 w-full max-w-xl">
          <GlassCard className="p-4 rounded-[2rem] overflow-hidden">
            <img
              alt="Student learning English illustration"
              className="w-full h-auto rounded-2xl"
              src="https://lh3.googleusercontent.com/aida/AP1WRLtDhGWIW-McSDIuoqwjvvIFFv5EBiDyGL2TMDr9-uhndk4ZjBMkatiyRBWjMsjIr-L3UjRelyEYGWC35j6eQeLsa2U6oPrk8DSDARhKlAU12oJfkWTceh2U0bU09OwuCreGm-NGh02v9X34HjYDX4UuUd8SIdNW_X9cvJ3jwRx9l5r-SWD79iP-bgEdVVbjCjjFxT5hCBfBg3C8qqNtWLhSijA221Mr5K7KIK_5gai8ruwZpF4V9W5y9Rg"
            />
          </GlassCard>
        </div>
      </section>

      {/* Section 2: Vấn đề thường gặp */}
      <section className="py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-text-primary mb-4">Bạn đang gặp khó khăn gì?</h2>
          <div className="h-1 w-20 bg-gradient-to-r from-primary to-secondary mx-auto rounded-full"></div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <GlassCard className="p-6 rounded-2xl text-center flex flex-col items-center justify-center min-h-[160px]">
            <span className="material-symbols-outlined text-4xl mb-4 text-primary">help_outline</span>
            <h3 className="text-lg font-bold text-text-primary">Không biết bắt đầu từ đâu</h3>
          </GlassCard>
          <GlassCard className="p-6 rounded-2xl text-center flex flex-col items-center justify-center min-h-[160px]">
            <span className="material-symbols-outlined text-4xl mb-4 text-accent">auto_stories</span>
            <h3 className="text-lg font-bold text-text-primary">Học từ vựng nhanh quên</h3>
          </GlassCard>
          <GlassCard className="p-6 rounded-2xl text-center flex flex-col items-center justify-center min-h-[160px]">
            <span className="material-symbols-outlined text-4xl mb-4 text-primary">description</span>
            <h3 className="text-lg font-bold text-text-primary">Ngữ pháp khó hiểu</h3>
          </GlassCard>
          <GlassCard className="p-6 rounded-2xl text-center flex flex-col items-center justify-center min-h-[160px]">
            <span className="material-symbols-outlined text-4xl mb-4 text-accent">timeline</span>
            <h3 className="text-lg font-bold text-text-primary">Không có lộ trình rõ ràng</h3>
          </GlassCard>
        </div>
      </section>

      {/* Section 3: Giải pháp */}
      <section className="py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-text-primary mb-4">Giải pháp toàn diện từ EnglishUp</h2>
          <div className="h-1 w-20 bg-gradient-to-r from-primary to-secondary mx-auto rounded-full"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <GlassCard className="p-6 rounded-2xl group flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center mb-6 text-white group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined">category</span>
              </div>
              <h3 className="text-lg font-bold mb-2 text-text-primary">Học từ vựng theo chủ đề</h3>
              <p className="text-sm text-text-secondary">Phân loại từ vựng khoa học giúp bạn dễ dàng tra cứu và ghi nhớ.</p>
            </div>
          </GlassCard>
          <GlassCard className="p-6 rounded-2xl group flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center mb-6 text-white group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined">style</span>
              </div>
              <h3 className="text-lg font-bold mb-2 text-text-primary">Flashcard ghi nhớ lâu</h3>
              <p className="text-sm text-text-secondary">Ứng dụng phương pháp lặp lại ngắt quãng để lưu trữ thông tin hiệu quả.</p>
            </div>
          </GlassCard>
          <GlassCard className="p-6 rounded-2xl group flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center mb-6 text-white group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined">quiz</span>
              </div>
              <h3 className="text-lg font-bold mb-2 text-text-primary">Quiz kiểm tra mỗi bài</h3>
              <p className="text-sm text-text-secondary">Củng cố kiến thức ngay lập tức với các bài tập trắc nghiệm đa dạng.</p>
            </div>
          </GlassCard>
          <GlassCard className="p-6 rounded-2xl group flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center mb-6 text-white group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined">insights</span>
              </div>
              <h3 className="text-lg font-bold mb-2 text-text-primary">Theo dõi tiến độ</h3>
              <p className="text-sm text-text-secondary">Biểu đồ trực quan giúp bạn thấy rõ sự tiến bộ của mình từng ngày.</p>
            </div>
          </GlassCard>
        </div>
      </section>

      {/* Section 4: Lộ trình học */}
      <section className="py-16">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-text-primary mb-4">Lộ trình 3 bước chinh phục</h2>
          <div className="h-1 w-20 bg-gradient-to-r from-primary to-secondary mx-auto rounded-full"></div>
        </div>
        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Connector Line Desktop */}
          <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-primary to-secondary opacity-20 -z-10"></div>
          <GlassCard className="p-6 rounded-2xl text-center relative pt-12">
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary text-white flex items-center justify-center text-xl font-bold border-4 border-background shadow-md">1</div>
            <div>
              <h3 className="text-lg font-bold mb-3 text-text-primary">Kiểm tra trình độ</h3>
              <p className="text-sm text-text-secondary">Thực hiện bài test nhanh để xác định xuất phát điểm của bạn.</p>
            </div>
          </GlassCard>
          <GlassCard className="p-6 rounded-2xl text-center relative pt-12">
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary text-white flex items-center justify-center text-xl font-bold border-4 border-background shadow-md">2</div>
            <div>
              <h3 className="text-lg font-bold mb-3 text-text-primary">Học theo đề xuất</h3>
              <p className="text-sm text-text-secondary">Hệ thống gợi ý các bài học phù hợp nhất với năng lực hiện tại.</p>
            </div>
          </GlassCard>
          <GlassCard className="p-6 rounded-2xl text-center relative pt-12">
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary text-white flex items-center justify-center text-xl font-bold border-4 border-background shadow-md">3</div>
            <div>
              <h3 className="text-lg font-bold mb-3 text-text-primary">Làm quiz &amp; Tiến bộ</h3>
              <p className="text-sm text-text-secondary">Thực hành liên tục và theo dõi điểm số thăng hạng mỗi tuần.</p>
            </div>
          </GlassCard>
        </div>
      </section>

      {/* Section 5: Khóa học nổi bật */}
      <section className="py-16">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between mb-8">
          <div>
            <p className="text-sm font-semibold uppercase tracking-normal text-primary">Lộ trình học</p>
            <h2 className="text-3xl font-bold tracking-normal text-text-primary">Khóa học nổi bật</h2>
          </div>
          <Link className="text-sm font-semibold text-primary hover:text-hover" href="/courses">
            Xem tất cả khóa học
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredCourses.length > 0 ? (
            featuredCourses.map((course) => (
              <GlassCard key={course.id} className="p-6 rounded-2xl flex flex-col h-full border-transparent hover:border-primary transition-all">
                <div className="h-48 rounded-xl mb-6 flex items-center justify-center bg-primary/5">
                  <span className="material-symbols-outlined text-7xl text-primary">
                    {course.level === "BEGINNER" ? "school" : course.level === "INTERMEDIATE" ? "workspace_premium" : "translate"}
                  </span>
                </div>
                <h3 className="text-xl font-bold mb-2 text-text-primary">{course.title}</h3>
                <p className="text-sm text-text-secondary mb-6 flex-grow line-clamp-3">{course.description}</p>
                <div className="flex items-center justify-between mb-6">
                  <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-semibold">
                    {course.lessons?.length ?? 0} bài học
                  </span>
                  <span className="text-primary font-bold text-sm">
                    {course.level === "BEGINNER" ? "Miễn phí" : "Phổ biến"}
                  </span>
                </div>
                <Link
                  href={`/courses/${course.id}`}
                  className="w-full py-3 rounded-xl border border-primary text-primary font-semibold hover:bg-primary hover:text-white transition-colors text-center text-sm text-center"
                >
                  Xem chi tiết
                </Link>
              </GlassCard>
            ))
          ) : (
            <div className="col-span-full">
              <EmptyState
                title="Chưa tải được khóa học nổi bật"
                description="Hãy khởi động backend và kiểm tra NEXT_PUBLIC_API_URL để xem dữ liệu thật từ PostgreSQL."
              />
            </div>
          )}
        </div>
      </section>

      {/* Section 6: Tính năng (Bento Grid) */}
      <section className="py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-text-primary mb-4">Tính năng thông minh</h2>
          <div className="h-1 w-20 bg-gradient-to-r from-primary to-secondary mx-auto rounded-full"></div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <GlassCard className="p-6 rounded-2xl text-center flex flex-col items-center justify-center col-span-2 min-h-[120px]">
            <span className="material-symbols-outlined text-primary mb-3 text-3xl">record_voice_over</span>
            <h4 className="text-sm font-semibold text-text-primary">Phát âm từ vựng</h4>
          </GlassCard>
          <GlassCard className="p-6 rounded-2xl text-center flex flex-col items-center justify-center min-h-[120px]">
            <span className="material-symbols-outlined text-accent mb-3 text-3xl">lightbulb</span>
            <h4 className="text-sm font-semibold text-text-primary">Ví dụ thực tế</h4>
          </GlassCard>
          <GlassCard className="p-6 rounded-2xl text-center flex flex-col items-center justify-center min-h-[120px]">
            <span className="material-symbols-outlined text-primary mb-3 text-3xl">fact_check</span>
            <h4 className="text-sm font-semibold text-text-primary">Bài tập trắc nghiệm</h4>
          </GlassCard>
          <GlassCard className="p-6 rounded-2xl text-center flex flex-col items-center justify-center col-span-2 min-h-[120px]">
            <span className="material-symbols-outlined text-accent mb-3 text-3xl">bookmark</span>
            <h4 className="text-sm font-semibold text-text-primary">Lưu từ chưa thuộc</h4>
          </GlassCard>
          <GlassCard className="p-6 rounded-2xl text-center flex flex-col items-center justify-center col-span-3 min-h-[120px]">
            <span className="material-symbols-outlined text-primary mb-3 text-3xl">bar_chart</span>
            <h4 className="text-sm font-semibold text-text-primary">Thống kê điểm số</h4>
          </GlassCard>
          <GlassCard className="p-6 rounded-2xl text-center flex flex-col items-center justify-center col-span-3 min-h-[120px]">
            <span className="material-symbols-outlined text-accent mb-3 text-3xl">psychology</span>
            <h4 className="text-sm font-semibold text-text-primary">Gợi ý bài học phù hợp</h4>
          </GlassCard>
        </div>
      </section>

      {/* Section 7: Thống kê */}
      <section className="py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <GlassCard className="p-8 rounded-2xl text-center">
            <div className="text-4xl font-extrabold text-primary mb-2">
              {courses.length > 0 ? `${courses.length}+` : "10+"}
            </div>
            <div className="text-base font-bold text-text-secondary">Chủ đề học</div>
          </GlassCard>
          <GlassCard className="p-8 rounded-2xl text-center">
            <div className="text-4xl font-extrabold text-primary mb-2">
              {totalLessons > 0 ? `${totalLessons}+` : "200+"}
            </div>
            <div className="text-base font-bold text-text-secondary">Bài luyện tập</div>
          </GlassCard>
          <GlassCard className="p-8 rounded-2xl text-center">
            <div className="text-4xl font-extrabold text-primary mb-2">1000+</div>
            <div className="text-base font-bold text-text-secondary">Từ vựng thiết yếu</div>
          </GlassCard>
        </div>
      </section>

      {/* Section 8: Final CTA */}
      <section className="py-20">
        <div className="relative rounded-[2rem] overflow-hidden bg-gradient-to-br from-primary to-secondary p-12 text-center text-white shadow-xl">
          <div className="absolute inset-0 bg-white/10 backdrop-blur-md"></div>
          <div className="relative z-10 max-w-2xl mx-auto space-y-6">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">Sẵn sàng cải thiện tiếng Anh của bạn?</h2>
            <p className="text-lg opacity-90 max-w-md mx-auto">Bắt đầu học ngay hôm nay với lộ trình cá nhân hóa và hoàn toàn miễn phí.</p>
            <Link
              href="/register"
              className="bg-white text-primary px-10 py-5 rounded-2xl font-bold shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all inline-block"
            >
              Bắt đầu học miễn phí
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
