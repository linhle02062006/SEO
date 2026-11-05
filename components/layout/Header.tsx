"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  Search,
  ShoppingCart,
  Menu,
  X,
  ChevronDown,
  Phone,
  User,
  Truck,
  ShieldCheck,
} from "lucide-react";
import type { Category } from "@/database/schema";
import { ROUTES, SITE } from "@/lib/site";
import { cn } from "@/lib/utils";
import { useCart } from "@/hooks/useCart";

const NAV_LINKS = [
  { label: "Trang chủ", href: ROUTES.home },
  { label: "Sản phẩm", href: ROUTES.products },
  { label: "Danh mục", href: ROUTES.categories, hasDropdown: true },
  { label: "Thương hiệu", href: ROUTES.brands },
  { label: "Blog", href: ROUTES.blog },
  { label: "Liên hệ", href: ROUTES.contact },
];

export function Header({ categories }: { categories: Category[] }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [q, setQ] = useState("");
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { count } = useCart();
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Đóng menu khi điều hướng
  useEffect(() => {
    setMobileOpen(false);
    setMenuOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  // Escape đóng dropdown
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setMenuOpen(false);
        setSearchOpen(false);
        setMobileOpen(false);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Click ngoài đóng dropdown danh mục
  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (
        menuOpen &&
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(e.target as Node)
      ) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [menuOpen]);

  useEffect(() => {
    if (searchOpen) searchInputRef.current?.focus();
  }, [searchOpen]);

  function submitSearch(e: React.FormEvent) {
    e.preventDefault();
    const keyword = q.trim();
    if (!keyword) return;
    router.push(`${ROUTES.search}?q=${encodeURIComponent(keyword)}`);
    setSearchOpen(false);
    setQ("");
  }

  const isActive = (href: string) =>
    href === ROUTES.home ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      {/* Thanh thông tin */}
      <div className="hidden border-b border-ink-100 bg-ink-950 text-white md:block">
        <div className="container-x flex h-9 items-center justify-between text-xs">
          <p className="flex items-center gap-1.5">
            <Truck className="size-3.5" />
            Miễn phí vận chuyển cho đơn hàng từ 300.000 ₫
          </p>
          <div className="flex items-center gap-5">
            <a
              href={`tel:${SITE.phone.replace(/\s/g, "")}`}
              className="flex items-center gap-1.5 transition hover:text-brand-300"
            >
              <Phone className="size-3.5" />
              {SITE.phone}
            </a>
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="size-3.5" />
              Bảo hành chính hãng 12 tháng
            </span>
          </div>
        </div>
      </div>

      <div className="container-x flex h-16 items-center gap-3 lg:h-18">
        {/* Logo */}
        <Link
          href={ROUTES.home}
          className="flex shrink-0 items-center gap-2"
          aria-label={`${SITE.name} - Trang chủ`}
        >
          <span className="grid size-9 place-items-center rounded-xl bg-brand-600 text-sm font-bold text-white">
            TZ
          </span>
          <span className="text-lg font-bold tracking-tight text-ink-950">
            Tech<span className="text-brand-600">Zone</span>
          </span>
        </Link>

        {/* Menu desktop */}
        <nav className="ml-4 hidden items-center gap-1 lg:flex" aria-label="Menu chính">
          {NAV_LINKS.map((link) => {
            const hasDropdown = link.hasDropdown && categories.length > 0;
            return (
              <div key={link.href} className="relative" ref={hasDropdown ? mobileMenuRef : undefined}>
                <Link
                  href={link.href}
                  className={cn(
                    "flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium transition",
                    isActive(link.href)
                      ? "text-brand-600"
                      : "text-ink-700 hover:bg-ink-50 hover:text-ink-950",
                  )}
                  aria-current={isActive(link.href) ? "page" : undefined}
                >
                  {link.label}
                  {hasDropdown && (
                    <ChevronDown
                      className={cn(
                        "size-3.5 transition-transform",
                        menuOpen && "rotate-180",
                      )}
                    />
                  )}
                </Link>

                {hasDropdown && (
                  <div
                    className={cn(
                      "absolute left-0 top-full z-50 w-72 overflow-hidden rounded-xl border border-ink-200 bg-white p-2 shadow-xl shadow-ink-900/10 transition-all",
                      menuOpen
                        ? "visible translate-y-0 opacity-100"
                        : "invisible -translate-y-1 opacity-0",
                    )}
                    onMouseEnter={() => setMenuOpen(true)}
                    onMouseLeave={() => setMenuOpen(false)}
                  >
                    {categories.map((c) => (
                      <Link
                        key={c.id}
                        href={`${ROUTES.categories}/${c.slug}`}
                        className="block rounded-lg px-3 py-2 text-sm text-ink-700 transition hover:bg-brand-50 hover:text-brand-700"
                      >
                        {c.name}
                      </Link>
                    ))}
                    <Link
                      href={ROUTES.categories}
                      className="mt-1 block rounded-lg border-t border-ink-100 px-3 py-2 text-sm font-medium text-brand-600 hover:bg-brand-50"
                    >
                      Xem tất cả danh mục →
                    </Link>
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Thanh tìm kiếm desktop */}
        <form
          onSubmit={submitSearch}
          className="ml-auto hidden max-w-md flex-1 items-center md:flex"
          role="search"
        >
          <div className="relative w-full">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-ink-400" />
            <input
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Tìm cáp sạc, củ sạc, tai nghe..."
              className="h-10 w-full rounded-full border border-ink-200 bg-ink-50 pl-9 pr-4 text-sm text-ink-900 outline-none transition placeholder:text-ink-400 focus:border-brand-400 focus:bg-white focus:ring-2 focus:ring-brand-100"
              aria-label="Tìm kiếm sản phẩm"
            />
          </div>
        </form>

        {/* Actions */}
        <div className="ml-auto flex items-center gap-1 md:ml-2">
          <button
            type="button"
            onClick={() => setSearchOpen((v) => !v)}
            className="grid size-10 place-items-center rounded-lg text-ink-700 transition hover:bg-ink-50 md:hidden"
            aria-label="Mở tìm kiếm"
            aria-expanded={searchOpen}
          >
            <Search className="size-5" />
          </button>

          <Link
            href={ROUTES.admin}
            className="hidden size-10 place-items-center rounded-lg text-ink-700 transition hover:bg-ink-50 sm:grid"
            aria-label="Trang quản trị"
          >
            <User className="size-5" />
          </Link>

          <Link
            href={ROUTES.cart}
            className="relative grid size-10 place-items-center rounded-lg text-ink-700 transition hover:bg-ink-50"
            aria-label={`Giỏ hàng, ${count} sản phẩm`}
          >
            <ShoppingCart className="size-5" />
            {count > 0 && (
              <span className="absolute -right-0.5 -top-0.5 grid min-w-5 place-items-center rounded-full bg-accent-500 px-1 text-[11px] font-semibold leading-5 text-white">
                {count > 99 ? "99+" : count}
              </span>
            )}
          </Link>

          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            className="grid size-10 place-items-center rounded-lg text-ink-700 transition hover:bg-ink-50 lg:hidden"
            aria-label={mobileOpen ? "Đóng menu" : "Mở menu"}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {/* Search mobile */}
      {searchOpen && (
        <div className="border-t border-ink-100 bg-white px-4 py-3 md:hidden">
          <form onSubmit={submitSearch} role="search">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-ink-400" />
              <input
                ref={searchInputRef}
                type="search"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Tìm sản phẩm..."
                className="h-11 w-full rounded-lg border border-ink-200 bg-ink-50 pl-9 pr-4 text-sm outline-none focus:border-brand-400 focus:bg-white focus:ring-2 focus:ring-brand-100"
                aria-label="Tìm kiếm sản phẩm"
              />
            </div>
          </form>
        </div>
      )}

      {/* Menu mobile */}
      {mobileOpen && (
        <div className="max-h-[calc(100vh-4rem)] overflow-y-auto border-t border-ink-100 bg-white lg:hidden">
          <nav className="container-x py-3" aria-label="Menu di động">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "block rounded-lg px-3 py-2.5 text-sm font-medium transition",
                  isActive(link.href)
                    ? "bg-brand-50 text-brand-700"
                    : "text-ink-800 hover:bg-ink-50",
                )}
              >
                {link.label}
              </Link>
            ))}

            <p className="mt-3 border-t border-ink-100 px-3 pt-3 text-xs font-semibold uppercase tracking-wide text-ink-400">
              Danh mục
            </p>
            {categories.map((c) => (
              <Link
                key={c.id}
                href={`${ROUTES.categories}/${c.slug}`}
                className="block rounded-lg px-3 py-2 text-sm text-ink-700 hover:bg-ink-50"
              >
                {c.name}
              </Link>
            ))}

            <div className="mt-4 border-t border-ink-100 px-3 pt-4">
              <a
                href={`tel:${SITE.phone.replace(/\s/g, "")}`}
                className="flex items-center gap-2 text-sm font-medium text-ink-800"
              >
                <Phone className="size-4 text-brand-600" />
                {SITE.phone}
              </a>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
