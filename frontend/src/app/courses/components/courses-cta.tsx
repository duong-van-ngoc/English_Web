"use client";

import Link from "next/link";

/**
 * CoursesCta displays the final call to action encouraging users to test their level.
 */
export function CoursesCta() {
  return (
    <section className="py-8">
      <div className="relative overflow-hidden glass-card rounded-[2.5rem] p-12 lg:p-20 text-center shadow-xl">
        <div className="relative z-10 space-y-8 max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-text-primary">
            Bạn chưa biết nên bắt đầu từ đâu?
          </h2>
          <p className="text-base text-text-secondary">
            Hãy để chúng tôi giúp bạn xây dựng lộ trình học cá nhân hóa dựa trên trình độ hiện tại của bạn.
          </p>
          <Link
            href="/practice"
            className="bg-gradient-to-r from-primary to-secondary text-white px-10 py-5 rounded-2xl font-bold inline-flex items-center gap-3 hover:translate-y-[-2px] active:scale-95 transition-all shadow-md"
            title="Khởi chạy đánh giá năng lực"
          >
            Kiểm tra trình độ ngay
            <span className="material-symbols-outlined" aria-hidden="true">
              analytics
            </span>
          </Link>
        </div>
        <div className="absolute -top-20 -left-20 w-80 h-80 bg-primary/10 rounded-full blur-[80px]" aria-hidden="true"></div>
        <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-accent/10 rounded-full blur-[80px]" aria-hidden="true"></div>
      </div>
    </section>
  );
}
