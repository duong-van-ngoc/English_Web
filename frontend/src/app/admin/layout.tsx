"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/features/auth/hooks/use-auth";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: "dashboard" },
  { href: "/admin/courses", label: "Courses", icon: "school" },
  { href: "/admin/lessons", label: "Lessons", icon: "menu_book" },
  { href: "/admin/questions", label: "Questions", icon: "quiz" },
  { href: "/admin/vocabulary", label: "Vocabulary", icon: "translate" },
  { href: "/admin/files", label: "Files", icon: "folder" },
  { href: "/admin/toeic/groups", label: "TOEIC Media", icon: "perm_media" },
];

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const { logout, status, user } = useAuth({ redirectToLogin: true });

  if (status === "loading") {
    return (
      <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="glass-panel rounded-lg p-6 text-sm text-text-secondary">
          Đang kiểm tra quyền truy cập Admin...
        </div>
      </div>
    );
  }

  // Fallback protection: If middleware somehow fails, prevent rendering and let client route handler catch
  if (status === "authenticated" && user?.role !== "ADMIN") {
    return null;
  }

  if (status !== "authenticated" || !user) {
    return null;
  }

  return (
    <div className="mx-auto grid w-full max-w-[1440px] gap-4 px-4 py-6 sm:px-6 lg:grid-cols-[240px_1fr] lg:px-8">
      <aside className="glass-panel-strong h-fit rounded-lg p-4">
        <div className="border-b border-border pb-4">
          <p className="text-xs font-semibold uppercase tracking-normal text-primary">
            Admin
          </p>
          <p className="mt-2 truncate text-sm font-bold text-text-primary">
            {user.name || user.email}
          </p>
          <p className="mt-1 text-xs text-text-secondary">{user.email}</p>
        </div>

        <nav className="mt-4 grid gap-1" aria-label="Admin">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/admin" && pathname.startsWith(item.href));

            return (
              <Link
                className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm font-semibold transition ${
                  isActive
                    ? "bg-primary text-white"
                    : "text-text-secondary hover:bg-surface hover:text-text-primary"
                }`}
                href={item.href}
                key={item.href}
              >
                <span className="material-symbols-outlined text-[18px]">{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        <button
          className="mt-4 w-full rounded-md border border-border bg-surface-strong px-3 py-2 text-sm font-semibold text-text-primary transition hover:border-primary/40 hover:text-primary"
          onClick={logout}
          type="button"
        >
          Đăng xuất
        </button>
      </aside>

      <section className="min-w-0">{children}</section>
    </div>
  );
}
