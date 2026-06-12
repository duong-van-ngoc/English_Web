import Image from "next/image";
import Link from "next/link";
import { GlassCard } from "@/components/ui/glass-card";

/**
 * HomeHero renders the top banner of the landing page,
 * introducing the English learning platform and main calls to action.
 */
export function HomeHero() {
  return (
    <section className="mx-auto flex flex-col items-center gap-12 py-16 md:py-24 lg:flex-row">
      <div className="flex-1 space-y-8 text-center lg:text-left">
        <h1 className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-4xl font-extrabold tracking-tight text-transparent sm:text-5xl md:text-6xl leading-tight">
          Học tiếng Anh trực tuyến dễ hơn mỗi ngày
        </h1>
        <p className="text-lg text-text-secondary max-w-xl mx-auto lg:mx-0 leading-relaxed">
          Lộ trình học tiếng Anh cho người mất gốc và luyện thi TOEIC 450 - 500+ được cá nhân hóa hoàn toàn.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
          <Link
            href="/register"
            className="bg-gradient-to-br from-primary to-secondary text-white px-8 py-4 rounded-2xl font-bold shadow-lg hover:shadow-xl hover:translate-y-[-2px] active:scale-95 transition-all text-center inline-block"
            title="Đăng ký tài khoản học tiếng Anh miễn phí"
          >
            Bắt đầu miễn phí
          </Link>
          <Link
            href="/courses"
            className="glass-panel text-primary px-8 py-4 rounded-2xl font-bold shadow-md hover:shadow-lg hover:translate-y-[-2px] active:scale-95 transition-all text-center inline-block"
            title="Xem danh sách khóa học và lộ trình đề xuất"
          >
            Xem lộ trình học
          </Link>
        </div>
      </div>
      <div className="flex-1 w-full max-w-xl">
        <GlassCard className="p-4 rounded-[2rem] overflow-hidden">
          <Image
            alt="Học viên đang ôn luyện thi tiếng Anh trực tuyến cùng EnglishTobi"
            className="w-full h-auto rounded-2xl object-cover"
            src="https://lh3.googleusercontent.com/aida/AP1WRLtDhGWIW-McSDIuoqwjvvIFFv5EBiDyGL2TMDr9-uhndk4ZjBMkatiyRBWjMsjIr-L3UjRelyEYGWC35j6eQeLsa2U6oPrk8DSDARhKlAU12oJfkWTceh2U0bU09OwuCreGm-NGh02v9X34HjYDX4UuUd8SIdNW_X9cvJ3jwRx9l5r-SWD79iP-bgEdVVbjCjjFxT5hCBfBg3C8qqNtWLhSijA221Mr5K7KIK_5gai8ruwZpF4V9W5y9Rg"
            width={600}
            height={400}
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </GlassCard>
      </div>
    </section>
  );
}
