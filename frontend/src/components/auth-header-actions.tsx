"use client";

import { PrimaryButton } from "@/components/primary-button";
import { useAuth } from "@/hooks/use-auth";

export function AuthHeaderActions() {
  const { logout, status, user } = useAuth();

  if (status === "loading") {
    return (
      <div
        aria-hidden="true"
        className="hidden h-11 w-44 animate-pulse rounded-md bg-surface-strong sm:block"
      />
    );
  }

  if (status === "authenticated" && user) {
    return (
      <div className="flex items-center gap-2">
        {user.role === "ADMIN" ? (
          <PrimaryButton className="hidden sm:inline-flex" href="/admin" variant="ghost">
            Admin
          </PrimaryButton>
        ) : null}
        <PrimaryButton className="hidden sm:inline-flex" href="/me" variant="ghost">
          {user.name || user.email}
        </PrimaryButton>
        <PrimaryButton onClick={logout} type="button" variant="secondary">
          Đăng xuất
        </PrimaryButton>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <PrimaryButton className="hidden sm:inline-flex" href="/login" variant="ghost">
        Đăng nhập
      </PrimaryButton>
      <PrimaryButton href="/register">Bắt đầu</PrimaryButton>
    </div>
  );
}
