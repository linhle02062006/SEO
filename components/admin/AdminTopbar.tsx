"use client";

import Link from "next/link";
import { useState } from "react";
import {
  LogOut,
  Menu,
  X,
  Search,
  ChevronDown,
  User,
} from "lucide-react";
import { ADMIN_NAV } from "@/components/admin/AdminSidebar";
import { logoutAction } from "@/app/admin/actions";

export function AdminTopbar({
  user,
}: {
  user: { name: string; email: string; role: string };
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);

  const navItems = ADMIN_NAV.flatMap((s) => s.items).filter(
    (i) => !i.adminOnly || user.role === "admin",
  );

  return (
    <header className="sticky top-0 z-30 border-b border-ink-200 bg-white">
      <div className="flex h-16 items-center gap-3 px-4 lg:px-8">
        {/* Nút menu mobile */}
        <button
          type="button"
          onClick={() => setMenuOpen(true)}
          className="grid size-9 place-items-center rounded-lg text-ink-600 transition hover:bg-ink-100 lg:hidden"
          aria-label="Mở menu"
        >
          <Menu className="size-5" />
        </button>

        <div className="hidden flex-1 items-center gap-3 sm:flex">
          <div className="relative max-w-md flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-ink-400" />
            <input
              type="search"
              placeholder="Tìm kiếm trong quản trị..."
              className="h-9 w-full rounded-lg border border-ink-200 bg-ink-50 pl-9 pr-3 text-sm outline-none transition placeholder:text-ink-400 focus:border-brand-400 focus:bg-white focus:ring-2 focus:ring-brand-100"
              aria-label="Tìm kiếm quản trị"
            />
          </div>
        </div>

        <div className="ml-auto flex items-center gap-2">
          <span className="hidden rounded-full bg-brand-50 px-2.5 py-1 text-[11px] font-medium capitalize text-brand-700 ring-1 ring-brand-600/20 sm:inline">
            {user.role === "admin" ? "Quản trị viên" : "Biên tập viên"}
          </span>

          <div className="relative">
            <button
              type="button"
              onClick={() => setUserOpen((v) => !v)}
              className="flex items-center gap-2 rounded-lg px-2 py-1.5 transition hover:bg-ink-100"
              aria-expanded={userOpen}
            >
              <span className="grid size-8 place-items-center rounded-lg bg-ink-900 text-xs font-bold text-white">
                <User className="size-4" />
              </span>
              <span className="hidden text-left sm:block">
                <span className="block text-xs font-semibold text-ink-900">
                  {user.name}
                </span>
                <span className="block text-[11px] text-ink-500">
                  {user.email}
                </span>
              </span>
              <ChevronDown className="size-4 text-ink-400" />
            </button>

            {userOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setUserOpen(false)}
                />
                <div className="absolute right-0 z-50 mt-2 w-52 overflow-hidden rounded-xl border border-ink-200 bg-white shadow-lg">
                  <div className="border-b border-ink-100 px-4 py-3">
                    <p className="text-sm font-semibold text-ink-950">
                      {user.name}
                    </p>
                    <p className="truncate text-xs text-ink-500">{user.email}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => logoutAction()}
                    className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-ink-700 transition hover:bg-ink-50 hover:text-rose-600"
                  >
                    <LogOut className="size-4" />
                    Đăng xuất
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Menu mobile */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-ink-950/50"
            onClick={() => setMenuOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 flex w-72 flex-col bg-ink-950">
            <div className="flex h-16 items-center justify-between border-b border-white/10 px-5">
              <span className="text-sm font-bold text-white">
                Tech<span className="text-brand-300">Zone</span> Admin
              </span>
              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                className="grid size-9 place-items-center rounded-lg text-ink-300 hover:bg-white/10"
                aria-label="Đóng menu"
              >
                <X className="size-5" />
              </button>
            </div>
            <nav className="flex-1 space-y-0.5 overflow-y-auto p-3">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-ink-300 transition hover:bg-white/5 hover:text-white"
                >
                  <item.icon className="size-4" />
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
