"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { useAuthContext } from "@/contexts/auth-context";

interface UseAuthOptions {
  redirectToLogin?: boolean;
}

export function useAuth({ redirectToLogin = false }: UseAuthOptions = {}) {
  const router = useRouter();
  const { status, user, error, login, logout, refreshUser } = useAuthContext();

  useEffect(() => {
    if (status === "unauthenticated" && redirectToLogin) {
      router.replace("/login");
    }
  }, [status, redirectToLogin, router]);

  return {
    error,
    logout,
    status,
    user,
    login,
    refreshUser,
  };
}
