"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  FolderTree,
  Tag,
  ShoppingCart,
  Users,
  FileText,
  Settings,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";

export type AdminNavItem = {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  /** Chỉ hiển thị với role admin */
  adminOnly?: boolean;
};

export const ADMIN_NAV: {
  group: string;
  items: AdminNavItem[];
}[] = [
  {
    group: "Tổng quan",
    items: [
      { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    ],
  },
  {
    group: "Bán hàng",
    items: [
      { href: "/admin/san-pham", label: "Sản phẩm", icon: Package },
      { href: "/admin/don-hang", label: "Đơn hàng", icon: ShoppingCart },
      { href: "/admin/khach-hang", label: "Khách hàng", icon: Users },
    ],
  },
  {
    group: "Nội dung",
    items: [
      { href: "/admin/danh-muc", label: "Danh mục", icon: FolderTree },
      { href: "/admin/thuong-hieu", label: "Thương hiệu", icon: Tag },
      { href: "/admin/blog", label: "Blog", icon: FileText },
    ],
  },
  {
    group: "Hệ thống",
    items: [
      {
        href: "/admin/cai-dat",
        label: "Cài đặt",
        icon: Settings,
        adminOnly: true,
      },
    ],
  },
];

export function AdminSidebar({
  user,
}: {
  user: { name: string; email: string; role: string };
}) {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-ink-200 bg-ink-950 lg:flex">
      {/* Logo */}
      <div className="flex h-16 items-center gap-2.5 border-b border-white/10 px-5">
        <span className="grid size-9 place-items-center rounded-xl bg-brand-600 text-sm font-bold text-white">
          TZ
        </span>
        <div>
          <p className="text-sm font-bold text-white">
            Tech<span className="text-brand-300">Zone</span>
          </p>
          <p className="text-[11px] text-ink-400">Trang quản trị</p>
        </div>
      </div>

      {/* Menu */}
      <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-5">
        {ADMIN_NAV.map((section) => {
          const items = section.items.filter(
            (i) => !i.adminOnly || user.role === "admin",
          );
          if (!items.length) return null;
          return (
            <div key={section.group}>
              <p className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-wider text-ink-500">
                {section.group}
              </p>
              <ul className="space-y-0.5">
                {items.map((item) => {
                  const active =
                    item.href === "/admin"
                      ? pathname === "/admin"
                      : pathname.startsWith(item.href);
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className={cn(
                          "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition",
                          active
                            ? "bg-brand-600 font-medium text-white"
                            : "text-ink-300 hover:bg-white/5 hover:text-white",
                        )}
                        aria-current={active ? "page" : undefined}
                      >
                        <item.icon className="size-4 shrink-0" />
                        {item.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </nav>

      {/* Xem website */}
      <div className="border-t border-white/10 p-3">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-ink-300 transition hover:bg-white/5 hover:text-white"
        >
          <ExternalLink className="size-4" />
          Xem website
        </Link>
      </div>
    </aside>
  );
}
