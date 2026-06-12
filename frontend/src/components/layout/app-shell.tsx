"use client";

import type { ReactNode } from "react";

interface AppShellProps {
  children: ReactNode;
}

/**
 * AppShell component placeholder.
 * Used as a wrapper for pages needing sidebar and header layouts.
 */
export function AppShell({ children }: AppShellProps) {
  return <div className="min-h-screen bg-background">{children}</div>;
}
