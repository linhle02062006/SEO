"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { LogIn, UserRound } from "lucide-react";
import { ROUTES } from "@/lib/site";

type SessionUser = {
  id: number;
  email: string;
  name: string;
  role: string;
};

/**
 * Nút tài khoản trên header.
 * - Chưa đăng nhập -> link tới trang đăng nhập.
 * - Đã đăng nhập -> link tới trang "Tài khoản của tôi".
 */
export function AccountMenuButton() {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;

    fetch("/api/account/session")
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return;
        if (data?.authenticated) setUser(data.user);
      })
      .catch(() => undefined)
      .finally(() => {
        if (!cancelled) setLoaded(true);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  if (!loaded) {
    // Giữ chỗ để tránh layout shift (SSR khác client).
    return <span className="size-10" aria-hidden />;
  }

  if (user) {
    // Tài khoản quản trị dùng khu vực quản trị riêng.
    const href =
      user.role === "customer" ? ROUTES.account : ROUTES.admin;

    return (
      <Link
        href={href}
        className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-ink-700 transition hover:bg-ink-50"
        aria-label={`Tài khoản của ${user.name}`}
        title={user.name}
      >
        <span className="grid size-8 place-items-center rounded-full bg-brand-600 text-xs font-bold text-white">
          {user.name.trim().charAt(0).toUpperCase() || "K"}
        </span>
        <span className="hidden max-w-24 truncate text-sm font-medium lg:block">
          {user.name}
        </span>
      </Link>
    );
  }

  return (
    <Link
      href={ROUTES.login}
      className="grid size-10 place-items-center rounded-lg text-ink-700 transition hover:bg-ink-50"
      aria-label="Đăng nhập"
    >
      <UserRound className="size-5" />
    </Link>
  );
}
