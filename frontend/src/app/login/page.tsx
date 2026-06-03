import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { AuthForm } from "@/components/auth-form";

export const metadata: Metadata = {
  title: "Đăng nhập | EnglishTobi",
  description: "Đăng nhập tài khoản EnglishTobi để tiếp tục hành trình học tiếng Anh trực tuyến và luyện thi TOEIC/VSTEP.",
};

export default function LoginPage() {
  return (
    <div className="bg-gradient-mesh min-h-[calc(100vh-130px)] flex items-center justify-center px-4 md:px-8 py-12 relative overflow-hidden">
      {/* Decorative background blobs */}
      <div className="absolute top-1/4 -left-20 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "2s" }}></div>

      <div className="w-full max-w-6xl grid md:grid-cols-2 gap-12 items-center relative z-10">
        {/* Left Side: Login Form */}
        <div className="flex justify-center md:justify-start order-2 md:order-1">
          <div className="glass-panel w-full max-w-md rounded-[24px] p-8 flex flex-col gap-6">
            <div className="text-center md:text-left">
              <h1 className="text-3xl font-bold tracking-tight text-primary mb-2">
                Chào mừng!
              </h1>
              <p className="text-sm text-text-secondary">
                Đăng nhập để tiếp tục hành trình chinh phục tiếng Anh.
              </p>
            </div>

            <AuthForm mode="login" />

            <div className="relative flex items-center py-2">
              <div className="flex-grow border-t border-border/60"></div>
              <span className="flex-shrink mx-4 text-xs font-semibold text-text-secondary/60">
                Hoặc đăng nhập với
              </span>
              <div className="flex-grow border-t border-border/60"></div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button className="input-glass flex items-center justify-center gap-2 py-3 rounded-xl hover:bg-white/50 transition-all active:scale-95 cursor-pointer">
                <img
                  alt="Google Logo"
                  className="w-5 h-5 object-contain"
                  src="https://www.google.com/images/branding/googleg/1x/googleg_standard_color_128dp.png"
                />
                <span className="text-sm font-semibold text-text-primary">Google</span>
              </button>
              <button className="input-glass flex items-center justify-center gap-2 py-3 rounded-xl hover:bg-white/50 transition-all active:scale-95 cursor-pointer">
                <span className="material-symbols-outlined text-[#1877F2] text-xl" aria-hidden="true">
                  social_leaderboard
                </span>
                <span className="text-sm font-semibold text-text-primary">Facebook</span>
              </button>
            </div>

            <p className="text-center text-sm text-text-secondary">
              Chưa có tài khoản?{" "}
              <Link className="text-primary font-bold hover:underline transition-all ml-1" href="/register">
                Đăng ký ngay
              </Link>
            </p>
          </div>
        </div>

        {/* Right Side: Illustration */}
        <div className="hidden md:flex flex-col items-center justify-center order-1 md:order-2">
          <div className="relative w-full aspect-square max-w-lg">
            {/* Glassy floating elements */}
            <div className="absolute top-10 right-10 glass-panel p-4 rounded-2xl animate-bounce z-20" style={{ animationDuration: "3s" }}>
              <span className="material-symbols-outlined text-accent text-4xl" aria-hidden="true">
                translate
              </span>
            </div>
            <div className="absolute bottom-20 left-0 glass-panel p-4 rounded-2xl animate-bounce z-20" style={{ animationDuration: "4s", animationDelay: "1s" }}>
              <span className="material-symbols-outlined text-primary text-4xl" aria-hidden="true">
                auto_stories
              </span>
            </div>

            <Image
              className="w-full h-full object-cover rounded-[40px] shadow-2xl"
              alt="Học viên học tiếng Anh trực tuyến cùng EnglishTobi"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCogARz9BE1YkNhMIS1LADPugYmQYt05JXdIby7a5ZXVKp_ck6ChKZTHc42IBeS-7yt203Axt-oUoFzoMUYyzVxNecz5_Swu_zzYt--wjl2sTjavLoV-XGsJWnFyOOyqooW7JCF_OUbW8xWQVPK1UuXsSGhTxPrsDd3JKMckB8E3aG4DHJeT8B8oOQBqJYjc4WHbykedhBnV1NIp0LPrEte78PrwCjnBJTT_pyd2XxHOA1R5moMvweaKqOxqu1gEPSh6k1HpNrdmMac"
              width={500}
              height={500}
              priority
            />

            <div className="absolute -bottom-6 -right-6 glass-panel p-6 rounded-[24px] max-w-xs shadow-xl">
              <p className="text-lg font-bold text-primary mb-1">
                "English is your passport to the world."
              </p>
              <p className="text-xs text-text-secondary">
                — Học tiếng Anh mỗi ngày cùng EnglishTobi
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
