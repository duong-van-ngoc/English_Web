"use client";

import { PrimaryButton } from "@/components/primary-button";
import { useAuth } from "@/hooks/use-auth";

export default function MePage() {
  const { error, logout, status, user } = useAuth({ redirectToLogin: true });

  if (status === "loading") {
    return (
      <div className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <section className="glass-panel-strong rounded-lg p-6">
          <p className="text-sm font-semibold text-text-secondary">
            Đang kiểm tra phiên đăng nhập...
          </p>
        </section>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <section className="glass-panel-strong rounded-lg p-6">
          <p className="text-sm font-semibold text-error">
            {error || "Phiên đăng nhập không hợp lệ."}
          </p>
        </section>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <section className="glass-panel floating-card rounded-lg p-6 sm:p-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-normal text-primary">
              Hồ sơ học viên
            </p>
            <h1 className="mt-3 text-3xl font-bold tracking-normal text-text-primary">
              Xin chào {user.name || user.email}
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-text-secondary">
              Tiếp tục lộ trình học và theo dõi thông tin tài khoản của bạn.
            </p>
          </div>

          <PrimaryButton onClick={logout} type="button" variant="secondary">
            Đăng xuất
          </PrimaryButton>
        </div>

        <dl className="mt-8 grid gap-4 border-t border-border pt-6 sm:grid-cols-3">
          <div className="rounded-md border border-border bg-surface-strong p-4">
            <dt className="text-xs font-semibold uppercase tracking-normal text-text-secondary">
              Tên
            </dt>
            <dd className="mt-2 text-sm font-bold text-text-primary">
              {user.name || "Chưa cập nhật"}
            </dd>
          </div>
          <div className="rounded-md border border-border bg-surface-strong p-4">
            <dt className="text-xs font-semibold uppercase tracking-normal text-text-secondary">
              Email
            </dt>
            <dd className="mt-2 break-words text-sm font-bold text-text-primary">
              {user.email}
            </dd>
          </div>
          <div className="rounded-md border border-border bg-surface-strong p-4">
            <dt className="text-xs font-semibold uppercase tracking-normal text-text-secondary">
              Role
            </dt>
            <dd className="mt-2 text-sm font-bold text-text-primary">
              {user.role}
            </dd>
          </div>
        </dl>
      </section>

      {user.role === "ADMIN" ? (
        <section className="mt-6 rounded-lg border border-primary/30 bg-surface-strong p-6">
          <h2 className="text-lg font-bold text-text-primary">Admin</h2>
          <p className="mt-2 text-sm leading-6 text-text-secondary">
            Bạn có quyền quản lý khóa học, bài học, từ vựng và câu hỏi.
          </p>
        </section>
      ) : null}
    </div>
  );
}
