"use client";

import { useAuth } from "@/features/auth/hooks/use-auth";
import { StudentProfileCard } from "./_components/student-profile-card";
import { ProfileTabs } from "./_components/profile-tabs";
import Link from "next/link";

export default function MePage() {
  const { error, logout, status, user } = useAuth({ redirectToLogin: true });

  if (status === "loading") {
    return (
      <div className="relative min-h-screen flex justify-center items-center">
        <div className="fixed inset-0 bg-grid pointer-events-none" />
        <div className="relative z-10 h-10 w-10 animate-spin rounded-full border-4 border-[#004b5d] border-t-transparent" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="relative min-h-screen flex justify-center items-center px-4">
        <div className="fixed inset-0 bg-grid pointer-events-none" />
        <section className="relative z-10 glass-card rounded-[20px] p-6 max-w-md w-full bg-white/55 border border-white/20 text-center">
          <p className="text-sm font-semibold text-red-600">
            {error || "Phiên đăng nhập không hợp lệ."}
          </p>
        </section>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen">
      {/* Background Decor */}
      <div className="fixed inset-0 bg-grid pointer-events-none" />
      <div className="gradient-blob bg-[#004b5d] w-[500px] h-[500px] -top-48 -left-48" />
      <div className="gradient-blob bg-[#520fbc] w-[400px] h-[400px] bottom-0 -right-24" />

      <div className="relative z-10 w-full max-w-[1280px] mx-auto px-4 md:px-16 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Left Column: Student Identity Card */}
          <aside className="lg:col-span-1 space-y-6">
            <StudentProfileCard user={user} onLogout={logout} />

            {user.role === "ADMIN" ? (
              <section className="glass-card rounded-[20px] border border-[#b7eaff]/30 p-6 bg-white/55 backdrop-blur-md shadow-sm">
                <h2 className="text-lg font-bold text-[#181c20]">Admin Access</h2>
                <p className="mb-4 mt-2 text-sm leading-6 text-[#3f484c]">
                  Bạn có quyền quản lý khóa học, bài học, từ vựng và câu hỏi.
                </p>
                <Link
                  href="/admin"
                  className="font-bold text-[#004b5d] hover:underline hover:text-[#00687a]"
                >
                  Đi đến trang quản trị Admin &rarr;
                </Link>
              </section>
            ) : null}
          </aside>

          {/* Right Column: Tab Workspace */}
          <section className="lg:col-span-2">
            <ProfileTabs />
          </section>
        </div>
      </div>
    </div>
  );
}

