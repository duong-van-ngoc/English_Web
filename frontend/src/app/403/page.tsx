"use client";

import React from "react";
import Link from "next/link";
import { useAuth } from "@/features/auth/hooks/use-auth";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function ForbiddenPage() {
  const { logout } = useAuth();

  return (
    <div className="flex items-center justify-center min-h-[80vh] px-4">
      <Card className="max-w-md w-full border border-error/20 bg-white/70 backdrop-blur-md shadow-lg rounded-3xl text-center p-8 space-y-6">
        <div className="mx-auto w-16 h-16 rounded-full bg-error/10 border border-error/20 text-error flex items-center justify-center shadow-sm">
          <span className="material-symbols-outlined text-3xl font-extrabold">gpp_bad</span>
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-black text-text-primary">
            403 - Không có quyền truy cập
          </h1>
          <p className="text-xs text-text-secondary leading-relaxed">
            Tài khoản hiện tại không có quyền quản trị. Vui lòng quay lại trang học tập hoặc đăng nhập bằng tài khoản Admin.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-border/40 justify-center">
          <Link href="/dashboard" passHref legacyBehavior>
            <Button variant="secondary" className="w-full sm:w-auto text-xs py-2 rounded-xl">
              Quay về trang học tập
            </Button>
          </Link>
          <Button
            variant="danger"
            onClick={logout}
            className="w-full sm:w-auto text-xs py-2 rounded-xl gap-1.5"
            type="button"
          >
            <span className="material-symbols-outlined text-sm">logout</span>
            Đăng nhập tài khoản khác
          </Button>
        </div>
      </Card>
    </div>
  );
}
