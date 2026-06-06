"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/features/auth/hooks/use-auth";

export function AppSidebar() {
  const pathname = usePathname();
  const { user } = useAuth();

  const menuItems = [
    { href: "/dashboard", label: "Dashboard", icon: "dashboard" },
    { href: "/courses", label: "Khóa học", icon: "school" },
    { href: "/me", label: "Cá nhân", icon: "person" },
  ];

  // RBAC control: Only show Admin link if user role is ADMIN
  const showAdminLink = user?.role === "ADMIN";

  return (
    <aside className="w-64 bg-surface/60 border-r border-border backdrop-blur-md h-screen flex flex-col p-4 shrink-0">
      <div className="mb-8 flex items-center gap-3">
        <span className="material-symbols-outlined text-primary text-2xl">school</span>
        <span className="font-extrabold text-lg text-text-primary">EnglishTobi</span>
      </div>

      <nav className="flex-1 space-y-1">
        {menuItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                isActive
                  ? "primary-gradient-btn text-white"
                  : "text-text-secondary hover:bg-primary/5 hover:text-primary"
              }`}
            >
              <span className="material-symbols-outlined text-lg">{item.icon}</span>
              {item.label}
            </Link>
          );
        })}

        {/* RBAC conditional item */}
        {showAdminLink && (
          <Link
            href="/admin"
            className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-bold border border-primary/20 text-primary bg-primary/5 hover:bg-primary/10 transition-all mt-4`}
          >
            <span className="material-symbols-outlined text-lg">admin_panel_settings</span>
            Admin Panel
          </Link>
        )}
      </nav>
    </aside>
  );
}
export default AppSidebar;
