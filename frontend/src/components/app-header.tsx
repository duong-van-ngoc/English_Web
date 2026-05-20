import Link from "next/link";

import { AuthHeaderActions } from "@/components/auth-header-actions";

const navItems = [
  { href: "/", label: "Trang chủ" },
  { href: "/courses", label: "Khóa học" },
  { href: "/practice", label: "TOEIC" },
  { href: "/me", label: "Hồ sơ" },
];

export function AppHeader() {
  return (
    <header className="sticky top-0 z-20 border-b border-border bg-surface/95 backdrop-blur-xl">
      <div className="mx-auto flex min-h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link className="flex items-center gap-3" href="/">
          <span className="flex size-9 items-center justify-center rounded-md bg-primary text-sm font-bold text-white shadow-[var(--soft-shadow)]">
            EL
          </span>
          <span className="text-sm font-bold text-text-primary sm:text-base">
            English Learning Explorer
          </span>
        </Link>

        <nav aria-label="Điều hướng chính" className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => (
            <Link
              className="rounded-md px-3 py-2 text-sm font-medium text-text-secondary hover:bg-surface hover:text-text-primary"
              href={item.href}
              key={item.href}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <AuthHeaderActions />
      </div>

      <nav
        aria-label="Điều hướng chính trên mobile"
        className="mx-auto flex w-full max-w-6xl gap-2 px-4 pb-3 sm:px-6 md:hidden"
      >
        {navItems.map((item) => (
          <Link
            className="flex-1 rounded-md border border-border bg-surface-strong px-3 py-2 text-center text-sm font-semibold text-text-secondary hover:border-primary/40 hover:text-primary"
            href={item.href}
            key={item.href}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
