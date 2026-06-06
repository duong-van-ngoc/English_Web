import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { AuthForm } from "@/features/auth/components/auth-form";

export const metadata: Metadata = {
  title: "Đăng ký | EnglishTobi",
  description: "Tạo tài khoản EnglishTobi để bắt đầu học tiếng Anh trực tuyến và luyện thi TOEIC/VSTEP với lộ trình cá nhân hóa miễn phí.",
};

export default function RegisterPage() {
  return (
    <div className="bg-gradient-mesh min-h-[calc(100vh-130px)] flex items-center justify-center px-4 md:px-8 py-12 relative overflow-hidden">
      {/* Decorative background blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-[-5%] right-[5%] w-[400px] h-[400px] bg-accent/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "2s" }}></div>
      <div className="absolute top-[20%] right-[-5%] w-[300px] h-[300px] bg-secondary/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "4s" }}></div>

      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-12 items-center relative z-10">
        {/* Left Side: Branding & Illustration */}
        <div className="hidden md:flex flex-col justify-center space-y-8 pr-12">
          <div className="space-y-4">
            <span className="text-4xl font-extrabold text-primary tracking-tight">
              EnglishTobi
            </span>
            <p className="text-xl text-text-secondary leading-relaxed">
              Bắt đầu hành trình chinh phục tiếng Anh với phương pháp học tập hiện đại và lộ trình học cá nhân hóa.
            </p>
          </div>
          <div className="relative w-full aspect-square rounded-[40px] overflow-hidden glass-panel p-4 shadow-xl">
            <Image
              className="w-full h-full object-cover rounded-[32px]"
              alt="Học viên cùng nhau thảo luận và học tiếng Anh"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBhca6Kb8IApZL8ymiXXAEgxGiujV8f7wZTLsA2leV9Eqd_VmfFUw54UU9mIq6m8JgFMCam3JrNeV20mcV0nl-md0tCHHzI5GC2tWwMcdowbAN6DJOnKYNhW4A-8gK3X0PAs_q8BndJ7fjPC1jlU4-OhxXS8k8oveUk19N2cGfB_w8qh5CxaaMUqpgFauYp4Mv2Z3hmWs7OWnO_mGcElwkFG0kx4jibTi59mJ_4FMtDb5Vofadzf2mY8CoVZJrmL59wcLtQOKyfiRbR"
              width={500}
              height={500}
              priority
            />
            {/* Floating Stat Overlay */}
            <div className="absolute bottom-10 right-10 glass-panel p-6 flex items-center gap-4 animate-bounce shadow-xl" style={{ animationDuration: "3s" }}>
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <span className="material-symbols-outlined text-2xl font-bold" aria-hidden="true">
                  trending_up
                </span>
              </div>
              <div>
                <p className="text-xs text-text-secondary">Học viên mới</p>
                <p className="text-lg font-bold text-primary">+2,500/tháng</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Sign Up Form */}
        <div className="flex flex-col items-center md:items-start">
          <div className="md:hidden mb-8 text-center">
            <span className="text-3xl font-extrabold text-primary tracking-tight">
              EnglishTobi
            </span>
          </div>
          <div className="glass-panel w-full max-w-md p-8 rounded-[24px] flex flex-col gap-6 shadow-xl">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tight text-primary">
                Tạo tài khoản
              </h2>
              <p className="text-sm text-text-secondary">
                Chào mừng bạn! Hãy điền thông tin để bắt đầu.
              </p>
            </div>

            <AuthForm mode="register" />

            <div className="relative flex items-center py-2">
              <div className="flex-grow border-t border-border/60"></div>
              <span className="flex-shrink mx-4 text-xs font-semibold text-text-secondary/60">
                HOẶC
              </span>
              <div className="flex-grow border-t border-border/60"></div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button className="flex items-center justify-center gap-2 py-3 glass-panel hover:bg-white/40 transition-colors rounded-xl cursor-pointer">
                <img
                  alt="Google Logo"
                  className="w-5 h-5 object-contain"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDJhD-amgZLnQmKeDZwcU1KyfdltDL2AwF5RxSehp0eEn-FdbrtkivH8ClOBQ8ykot_5GVTvVqX4DyVIew1QPgOIr9IT-3Cu134IsSa0lD9EBq0Z4uSRXf0nzfxLP67NongFsuk0Zf3iFCeY7r2Jekl2IrI9e02A5ZLaFova80iVQiU9zNNGEMd8AXN1HIEh3WtO-lTcFZYdKe95YTaTkAYA1Rvff3yfLyfmwZPgeOFbmgDpR_tWJjABst_W_TUunlVqAMP9auiZmkF"
                />
                <span className="text-sm font-semibold text-text-primary">Google</span>
              </button>
              <button className="flex items-center justify-center gap-2 py-3 glass-panel hover:bg-white/40 transition-colors rounded-xl cursor-pointer">
                <span className="material-symbols-outlined text-[#1877F2] text-xl" aria-hidden="true">
                  social_leaderboard
                </span>
                <span className="text-sm font-semibold text-text-primary">Facebook</span>
              </button>
            </div>

            <div className="pt-4 text-center border-t border-border/40">
              <p className="text-sm text-text-secondary">
                Đã có tài khoản?{" "}
                <Link className="text-primary font-bold hover:underline ml-1 transition-all" href="/login">
                  Đăng nhập
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
