"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { api, isApiError } from "@/lib/api";
import { clearAccessToken, getAccessToken } from "@/lib/auth";
import type { AuthUser } from "@/types";

type AuthStatus = "loading" | "authenticated" | "unauthenticated";

interface UseAuthOptions {
  redirectToLogin?: boolean;
}

export function useAuth({ redirectToLogin = false }: UseAuthOptions = {}) {
  const router = useRouter();
  const [status, setStatus] = useState<AuthStatus>("loading");
  const [user, setUser] = useState<AuthUser | null>(null);
  const [error, setError] = useState("");

  const logout = useCallback(() => {
    clearAccessToken();
    setUser(null);
    setStatus("unauthenticated");
    router.replace("/login");
  }, [router]);

  useEffect(() => {
    let isMounted = true;

    async function loadCurrentUser() {
      const token = getAccessToken();

      if (!token) {
        if (isMounted) {
          setStatus("unauthenticated");
        }

        if (redirectToLogin) {
          router.replace("/login");
        }

        return;
      }

      try {
        const currentUser = await api.getCurrentUser();

        if (!isMounted) {
          return;
        }

        setUser(currentUser);
        setStatus("authenticated");
        setError("");
      } catch (fetchError) {
        clearAccessToken();

        if (!isMounted) {
          return;
        }

        setUser(null);
        setStatus("unauthenticated");
        setError(
          isApiError(fetchError)
            ? fetchError.message
            : "Không thể kiểm tra phiên đăng nhập.",
        );

        if (redirectToLogin) {
          router.replace("/login");
        }
      }
    }

    void loadCurrentUser();

    return () => {
      isMounted = false;
    };
  }, [redirectToLogin, router]);

  return {
    error,
    logout,
    status,
    user,
  };
}
