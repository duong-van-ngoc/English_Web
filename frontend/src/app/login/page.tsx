import Link from "next/link";

import { AuthForm } from "@/components/auth-form";

export default function LoginPage() {
  return (
    <div className="mx-auto grid w-full max-w-6xl gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[1fr_420px] lg:px-8">
      <section className="glass-panel floating-card rounded-lg p-6 sm:p-8">
        <p className="text-sm font-semibold uppercase tracking-normal text-primary">
          Learner account
        </p>
        <h1 className="mt-3 text-3xl font-bold tracking-normal text-text-primary">
          Đăng nhập để tiếp tục lộ trình học
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-text-secondary">
          Lưu tiến độ học, tiếp tục bài đang học và quay lại danh sách cần ôn.
        </p>
      </section>

      <section className="glass-panel-strong rounded-lg p-6">
        <AuthForm mode="login" />
        <p className="mt-5 text-center text-sm text-text-secondary">
          Chưa có tài khoản?{" "}
          <Link className="font-semibold text-primary hover:text-hover" href="/register">
            Tạo tài khoản
          </Link>
        </p>
      </section>
    </div>
  );
}
