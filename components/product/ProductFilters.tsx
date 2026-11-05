"use client";

import Link from "next/link";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useState, useTransition } from "react";
import { Check, ChevronDown, SlidersHorizontal, X } from "lucide-react";
import type { Brand, Category } from "@/database/schema";
import { cn } from "@/lib/utils";
import type { SortOption } from "@/types";

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "newest", label: "Sản phẩm mới" },
  { value: "price-asc", label: "Giá: Thấp đến cao" },
  { value: "price-desc", label: "Giá: Cao đến thấp" },
  { value: "popular", label: "Bán chạy nhất" },
  { value: "rating", label: "Đánh giá cao" },
  { value: "name-asc", label: "Tên A-Z" },
  { value: "name-desc", label: "Tên Z-A" },
];

type FilterState = {
  category?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: SortOption;
  inStock?: boolean;
  onSale?: boolean;
  rating?: number;
};

export function ProductFilters({
  categories,
  brands,
  categoryCounts,
  brandCounts,
  priceRange,
  current,
  basePath,
  mobile = false,
}: {
  categories: Category[];
  brands: Brand[];
  categoryCounts: Record<string, number>;
  brandCounts: Record<string, number>;
  priceRange: { min: number; max: number };
  current: FilterState;
  basePath: string;
  mobile?: boolean;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [openMobile, setOpenMobile] = useState(false);
  const [expanded, setExpanded] = useState({
    category: true,
    brand: true,
    price: true,
    options: true,
  });

  function apply(next: Partial<FilterState>) {
    const params = new URLSearchParams(searchParams.toString());
    // reset trang khi thay đổi bộ lọc
    params.delete("trang");

    const setOrDelete = (key: string, value: string | undefined) => {
      if (value) params.set(key, value);
      else params.delete(key);
    };

    setOrDelete("danh-muc", next.category);
    setOrDelete("thuong-hieu", next.brand);
    setOrDelete("gia_min", next.minPrice ? String(next.minPrice) : undefined);
    setOrDelete("gia_max", next.maxPrice ? String(next.maxPrice) : undefined);
    setOrDelete("sap-xep", next.sort === "newest" ? undefined : next.sort);
    setOrDelete("trong-kho", next.inStock ? "true" : undefined);
    setOrDelete("khuyen-mai", next.onSale ? "true" : undefined);
    setOrDelete("danh-gia", next.rating ? String(next.rating) : undefined);

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    });
  }

  const toggle = (key: keyof typeof expanded) =>
    setExpanded((p) => ({ ...p, [key]: !p[key] }));

  const hasActiveFilter =
    current.category ||
    current.brand ||
    current.minPrice ||
    current.maxPrice ||
    current.inStock ||
    current.onSale ||
    current.rating;

  const content = (
    <div className={cn("space-y-5", isPending && "opacity-60")}>
      {/* Danh mục */}
      <FilterSection
        title="Danh mục"
        open={expanded.category}
        onToggle={() => toggle("category")}
      >
        <ul className="space-y-1">
          {categories.map((c) => {
            const active = current.category === c.slug;
            const count = categoryCounts[c.slug] ?? 0;
            return (
              <li key={c.id}>
                <button
                  type="button"
                  onClick={() => apply({ category: active ? undefined : c.slug })}
                  className={cn(
                    "flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-left text-sm transition",
                    active
                      ? "bg-brand-50 font-medium text-brand-700"
                      : "text-ink-700 hover:bg-ink-50",
                  )}
                >
                  <span className="flex items-center gap-2">
                    {active && <Check className="size-3.5" />}
                    {c.name}
                  </span>
                  <span className="text-xs text-ink-400">{count}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </FilterSection>

      {/* Thương hiệu */}
      <FilterSection
        title="Thương hiệu"
        open={expanded.brand}
        onToggle={() => toggle("brand")}
      >
        <ul className="space-y-1">
          {brands.map((b) => {
            const active = current.brand === b.slug;
            const count = brandCounts[b.slug] ?? 0;
            return (
              <li key={b.id}>
                <button
                  type="button"
                  onClick={() => apply({ brand: active ? undefined : b.slug })}
                  className={cn(
                    "flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-left text-sm transition",
                    active
                      ? "bg-brand-50 font-medium text-brand-700"
                      : "text-ink-700 hover:bg-ink-50",
                  )}
                >
                  <span className="flex items-center gap-2">
                    {active && <Check className="size-3.5" />}
                    {b.name}
                  </span>
                  <span className="text-xs text-ink-400">{count}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </FilterSection>

      {/* Khoảng giá */}
      <FilterSection
        title="Khoảng giá"
        open={expanded.price}
        onToggle={() => toggle("price")}
      >
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <input
              type="number"
              inputMode="numeric"
              min={0}
              placeholder={String(priceRange.min)}
              defaultValue={current.minPrice ?? ""}
              onBlur={(e) =>
                apply({
                  minPrice: e.target.value ? Number(e.target.value) : undefined,
                })
              }
              className="h-9 w-full rounded-lg border border-ink-200 px-2.5 text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
              aria-label="Giá thấp nhất"
            />
            <span className="text-ink-400">–</span>
            <input
              type="number"
              inputMode="numeric"
              min={0}
              placeholder={String(priceRange.max)}
              defaultValue={current.maxPrice ?? ""}
              onBlur={(e) =>
                apply({
                  maxPrice: e.target.value ? Number(e.target.value) : undefined,
                })
              }
              className="h-9 w-full rounded-lg border border-ink-200 px-2.5 text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
              aria-label="Giá cao nhất"
            />
          </div>
          <div className="flex flex-wrap gap-1.5">
            {[
              { label: "Dưới 200K", min: undefined, max: 200000 },
              { label: "200K - 500K", min: 200000, max: 500000 },
              { label: "500K - 1 triệu", min: 500000, max: 1000000 },
              { label: "Trên 1 triệu", min: 1000000, max: undefined },
            ].map((r) => (
              <button
                key={r.label}
                type="button"
                onClick={() =>
                  apply({
                    minPrice:
                      current.minPrice === r.min && current.maxPrice === r.max
                        ? undefined
                        : r.min,
                    maxPrice:
                      current.minPrice === r.min && current.maxPrice === r.max
                        ? undefined
                        : r.max,
                  })
                }
                className="rounded-full border border-ink-200 px-2.5 py-1 text-xs text-ink-600 transition hover:border-brand-300 hover:text-brand-600"
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>
      </FilterSection>

      {/* Tuỳ chọn khác */}
      <FilterSection
        title="Tuỳ chọn"
        open={expanded.options}
        onToggle={() => toggle("options")}
      >
        <div className="space-y-2">
          <label className="flex cursor-pointer items-center gap-2.5 text-sm text-ink-700">
            <input
              type="checkbox"
              checked={!!current.inStock}
              onChange={(e) => apply({ inStock: e.target.checked })}
              className="size-4 rounded border-ink-300 text-brand-600 focus:ring-brand-500"
            />
            Chỉ hiện sản phẩm còn hàng
          </label>
          <label className="flex cursor-pointer items-center gap-2.5 text-sm text-ink-700">
            <input
              type="checkbox"
              checked={!!current.onSale}
              onChange={(e) => apply({ onSale: e.target.checked })}
              className="size-4 rounded border-ink-300 text-brand-600 focus:ring-brand-500"
            />
            Đang giảm giá
          </label>
          <div className="pt-1">
            <p className="mb-1.5 text-xs text-ink-500">Đánh giá từ</p>
            <div className="flex flex-wrap gap-1.5">
              {[4, 3, 2].map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() =>
                    apply({
                      rating: current.rating === r ? undefined : r,
                    })
                  }
                  className={cn(
                    "rounded-full border px-2.5 py-1 text-xs transition",
                    current.rating === r
                      ? "border-brand-500 bg-brand-50 font-medium text-brand-700"
                      : "border-ink-200 text-ink-600 hover:border-brand-300",
                  )}
                >
                  {r}★ trở lên
                </button>
              ))}
            </div>
          </div>
        </div>
      </FilterSection>

      {hasActiveFilter && (
        <button
          type="button"
          onClick={() => {
            startTransition(() => {
              router.push(basePath, { scroll: false });
            });
          }}
          className="w-full rounded-lg border border-ink-200 py-2 text-sm font-medium text-ink-700 transition hover:bg-ink-50"
        >
          Xóa tất cả bộ lọc
        </button>
      )}
    </div>
  );

  if (mobile) {
    return (
      <>
        <button
          type="button"
          onClick={() => setOpenMobile(true)}
          className="flex w-full items-center justify-center gap-2 rounded-lg border border-ink-200 bg-white py-2.5 text-sm font-medium text-ink-800"
        >
          <SlidersHorizontal className="size-4" />
          Bộ lọc &amp; sắp xếp
          {hasActiveFilter && (
            <span className="grid size-5 place-items-center rounded-full bg-brand-600 text-[11px] text-white">
              •
            </span>
          )}
        </button>

        {openMobile && (
          <div className="fixed inset-0 z-[95]">
            <div
              className="absolute inset-0 bg-ink-950/50"
              onClick={() => setOpenMobile(false)}
            />
            <div className="absolute inset-y-0 right-0 flex w-full max-w-sm flex-col bg-white">
              <div className="flex items-center justify-between border-b border-ink-100 px-4 py-3">
                <h2 className="text-base font-semibold">Bộ lọc</h2>
                <button
                  type="button"
                  onClick={() => setOpenMobile(false)}
                  className="grid size-9 place-items-center rounded-lg text-ink-500 hover:bg-ink-100"
                  aria-label="Đóng bộ lọc"
                >
                  <X className="size-5" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-4">{content}</div>
              <div className="border-t border-ink-100 p-4">
                <button
                  type="button"
                  onClick={() => setOpenMobile(false)}
                  className="w-full rounded-lg bg-brand-600 py-2.5 text-sm font-semibold text-white"
                >
                  Xem kết quả
                </button>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  return (
    <aside className="hidden lg:block">
      <div className="sticky top-24 rounded-xl border border-ink-200 bg-white p-4">
        <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold text-ink-950">
          <SlidersHorizontal className="size-4 text-brand-600" />
          Bộ lọc sản phẩm
        </h2>
        {content}
      </div>
    </aside>
  );
}

function FilterSection({
  title,
  open,
  onToggle,
  children,
}: {
  title: string;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="border-b border-ink-100 pb-4 last:border-0">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between text-sm font-semibold text-ink-900"
        aria-expanded={open}
      >
        {title}
        <ChevronDown
          className={cn("size-4 text-ink-400 transition-transform", open && "rotate-180")}
        />
      </button>
      {open && <div className="mt-3">{children}</div>}
    </div>
  );
}

export function SortSelect({ current }: { current?: SortOption }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  return (
    <div className="relative">
      <select
        value={current ?? "newest"}
        disabled={isPending}
        onChange={(e) => {
          const params = new URLSearchParams(searchParams.toString());
          params.delete("trang");
          if (e.target.value === "newest") params.delete("sap-xep");
          else params.set("sap-xep", e.target.value);
          startTransition(() => {
            router.push(`${pathname}?${params.toString()}`, { scroll: false });
          });
        }}
        className="h-9 appearance-none rounded-lg border border-ink-200 bg-white pl-3 pr-9 text-sm text-ink-800 outline-none transition hover:border-ink-300 focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
        aria-label="Sắp xếp sản phẩm"
      >
        {SORT_OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-ink-400" />
    </div>
  );
}
