"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { useAuth } from "@/hooks/use-auth";

const navItems = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/courses", label: "Courses" },
  { href: "/admin/lessons", label: "Lessons" },
  { href: "/admin/questions", label: "Questions" },
  { href: "/admin/vocabulary", label: "Vocabulary" },
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
          Dang kiem tra quyen admin...
        </div>
      </div>
    );
  }

  if (status === "authenticated" && user?.role !== "ADMIN") {
    return (
      <div className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="glass-panel rounded-lg border-error/40 p-6">
          <p className="text-sm font-semibold uppercase tracking-normal text-error">
            403
          </p>
          <h1 className="mt-3 text-2xl font-bold text-text-primary">
            Ban khong co quyen truy cap khu vuc admin.
          </h1>
        </div>
      </div>
    );
  }

  if (status !== "authenticated" || !user) {
    return null;
  }

  return (
    <div className="mx-auto grid w-full max-w-7xl gap-4 px-4 py-6 sm:px-6 lg:grid-cols-[240px_1fr] lg:px-8">
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
                className={`rounded-md px-3 py-2 text-sm font-semibold transition ${
                  isActive
                    ? "bg-primary text-white"
                    : "text-text-secondary hover:bg-surface hover:text-text-primary"
                }`}
                href={item.href}
                key={item.href}
              >
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
          Dang xuat
        </button>
      </aside>

      <section className="min-w-0">{children}</section>
    </div>
  );
}
