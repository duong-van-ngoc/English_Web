import type { Metadata } from "next";
import { Inter, Geist_Mono } from "next/font/google";

import { AppHeader } from "@/components/layout/app-header";
import { AuthProvider } from "@/contexts/auth-context";
import { QueryProvider } from "@/providers/query-provider";

import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "vietnamese"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "English Tobi",
  description: "Lộ trình học tiếng Anh nền tảng cho người mới bắt đầu luyện TOEIC.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="vi"
      className={`${inter.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined" rel="stylesheet" />
      </head>
      <body
        suppressHydrationWarning
        className="min-h-full bg-background text-text-primary"
      >
        <QueryProvider>
          <AuthProvider>
            <div className="flex min-h-screen flex-col">
              <AppHeader />
              <main className="flex-1">{children}</main>
              <footer className="border-t border-border bg-surface/80 backdrop-blur-xl">
                <div className="mx-auto flex w-full max-w-6xl flex-col gap-2 px-4 py-6 text-sm text-text-secondary sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
                  <span>English ToBi</span>
                </div>
              </footer>
            </div>
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}

