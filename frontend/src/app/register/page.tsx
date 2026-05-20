import Link from "next/link";

import { AuthForm } from "@/components/auth-form";

export default function RegisterPage() {
  return (
    <div className="mx-auto grid w-full max-w-6xl gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[1fr_420px] lg:px-8">
      <section className="glass-panel floating-card rounded-lg p-6 sm:p-8">
        <p className="text-sm font-semibold uppercase tracking-normal text-primary">
          New learner
        </p>
        <h1 className="mt-3 text-3xl font-bold tracking-normal text-text-primary">
          Tạo tài khoản học thử
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-text-secondary">
          Tạo hồ sơ học để bắt đầu với lộ trình phù hợp với nền tảng hiện tại.
        </p>
      </section>

      <section className="glass-panel-strong rounded-lg p-6">
        <AuthForm mode="register" />
        <p className="mt-5 text-center text-sm text-text-secondary">
          Đã có tài khoản?{" "}
          <Link className="font-semibold text-primary hover:text-hover" href="/login">
            Đăng nhập
          </Link>
        </p>
      </section>
    </div>
  );
}
