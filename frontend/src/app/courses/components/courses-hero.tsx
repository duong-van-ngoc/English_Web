import Link from "next/link";
import Image from "next/image";

/**
 * CoursesHero displays the promotional hero block on top of the courses list,
 * encouraging users to start learning immediately or test their level.
 */
export function CoursesHero() {
  return (
    <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
      <div className="space-y-8 animate-in slide-in-from-left duration-700">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/10 text-accent border border-accent/20">
          <span className="material-symbols-outlined text-[18px]" aria-hidden="true">
            school
          </span>
          <span className="text-xs font-semibold">Lộ trình cho người mất gốc</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-text-primary leading-tight">
          Khám phá khóa học tiếng Anh phù hợp với bạn
        </h1>
        <p className="text-base md:text-lg text-text-secondary max-w-xl leading-relaxed">
          Hệ thống học tập thông minh giúp bạn chinh phục mục tiêu TOEIC 450-500 và VSTEP chỉ trong thời gian ngắn nhất. Cam kết hiệu quả với phương pháp thực hành 80%.
        </p>
        <div className="flex flex-wrap gap-4">
          <Link
            href="#courses-section"
            className="bg-gradient-to-r from-primary to-secondary text-white px-8 py-4 rounded-xl font-bold flex items-center gap-2 shadow-lg hover:shadow-xl hover:translate-y-[-2px] active:scale-95 transition-all text-center"
            title="Khám phá danh sách khóa học"
          >
            Bắt đầu học ngay
            <span className="material-symbols-outlined" aria-hidden="true">
              arrow_forward
            </span>
          </Link>
          <Link
            href="/practice"
            className="glass-panel text-primary px-8 py-4 rounded-xl font-bold flex items-center gap-2 border-primary/40 hover:bg-primary/5 hover:translate-y-[-2px] active:scale-95 transition-all text-center"
            title="Thực hiện bài kiểm tra năng lực"
          >
            Kiểm tra trình độ
            <span className="material-symbols-outlined" aria-hidden="true">
              quiz
            </span>
          </Link>
        </div>
      </div>
      <div className="relative animate-in zoom-in duration-1000">
        <div className="glass-card p-4 rounded-[2rem] transform rotate-2 relative z-10">
          <Image
            alt="Học viên đang học trực tuyến với laptop cùng EnglishTobi"
            className="rounded-2xl w-full h-auto object-cover aspect-video"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBLY3SRlNXkN-nXy-YTM-7dWBqDuNxfKbvW3lps_v48N51i3bZ8Kg3p4BBd40RRTUUA_Oe6-RsEoBqeU8YvCkbtJMJspGX7bCAmQXa3gCluPh_MJ8oGR_Fi66PZ4dm1IgKbPcsLoatfr6tQWVTjuKaJPnO6LtJy-WDOvRABJOrdvVdyxu6qPb6ZeAWENrd_MlBwiwDBhi4RwR7Te-fw48-1xN9JwEVexK2cwpU6KPX-ZVRL2-PpidwNSM1qsBMmIvEOrTAjEykAWAkr"
            width={600}
            height={340}
            priority
          />
        </div>
        <div className="absolute -top-6 -right-6 w-32 h-32 bg-primary/10 rounded-full blur-3xl" aria-hidden="true"></div>
        <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-accent/10 rounded-full blur-3xl" aria-hidden="true"></div>
      </div>
    </section>
  );
}
