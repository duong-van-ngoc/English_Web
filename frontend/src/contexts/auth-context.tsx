"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { api, isApiError } from "@/lib/api";
import { getAccessToken, setAccessToken as saveToken, clearAccessToken } from "@/lib/auth";
import type { AuthUser } from "@/types";

type AuthStatus = "loading" | "authenticated" | "unauthenticated";

interface AuthContextType {
  status: AuthStatus;
  user: AuthUser | null;
  error: string;
  login: (token: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [status, setStatus] = useState<AuthStatus>("loading");
  const [user, setUser] = useState<AuthUser | null>(null);
  const [error, setError] = useState("");

  const refreshUser = useCallback(async () => {
    const token = getAccessToken();
    if (!token) {
      setStatus("unauthenticated");
      setUser(null);
      return;
    }

    try {
      const currentUser = await api.getCurrentUser();
      setUser(currentUser);
      setStatus("authenticated");
      setError("");
    } catch (fetchError) {
      clearAccessToken();
      setUser(null);
      setStatus("unauthenticated");
      setError(
        isApiError(fetchError)
          ? fetchError.message
          : "Không thể kiểm tra phiên đăng nhập.",
      );
    }
  }, []);

  const login = useCallback(async (token: string) => {
    saveToken(token);
    setStatus("loading");
    try {
      const currentUser = await api.getCurrentUser();
      setUser(currentUser);
      setStatus("authenticated");
      setError("");
    } catch (fetchError) {
      clearAccessToken();
      setUser(null);
      setStatus("unauthenticated");
      setError(
        isApiError(fetchError)
          ? fetchError.message
          : "Không thể kiểm tra phiên đăng nhập sau khi đăng nhập.",
      );
      throw fetchError;
    }
  }, []);

  const logout = useCallback(() => {
    clearAccessToken();
    setUser(null);
    setStatus("unauthenticated");
    router.replace("/login");
  }, [router]);

  useEffect(() => {
    void refreshUser();
  }, [refreshUser]);

  return (
    <AuthContext.Provider
      value={{
        status,
        user,
        error,
        login,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
}
