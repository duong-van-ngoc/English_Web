import Link from "next/link";

/**
 * HomeCta renders the final conversion banner motivating users to sign up.
 */
export function HomeCta() {
  return (
    <section className="py-20">
      <div className="relative rounded-[2rem] overflow-hidden bg-gradient-to-br from-primary to-secondary p-12 text-center text-white shadow-xl">
        <div className="absolute inset-0 bg-white/10 backdrop-blur-md"></div>
        <div className="relative z-10 max-w-2xl mx-auto space-y-6">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">Sẵn sàng nâng cao trình độ tiếng Anh?</h2>
          <p className="text-lg opacity-90 max-w-md mx-auto">Bắt đầu học ngay hôm nay với lộ trình cá nhân hóa hoàn toàn miễn phí.</p>
          <Link
            href="/register"
            className="bg-white text-primary px-10 py-5 rounded-2xl font-bold shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all inline-block"
            title="Đăng ký tài khoản học tiếng Anh ngay bây giờ"
          >
            Bắt đầu học miễn phí
          </Link>
        </div>
      </div>
    </section>
  );
}
