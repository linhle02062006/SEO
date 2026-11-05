import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function Pagination({
  page,
  totalPages,
  basePath,
  params = {},
}: {
  page: number;
  totalPages: number;
  basePath: string;
  params?: Record<string, string>;
}) {
  if (totalPages <= 1) return null;

  function href(p: number) {
    const qs = new URLSearchParams(params);
    if (p > 1) qs.set("trang", String(p));
    else qs.delete("trang");
    const s = qs.toString();
    return s ? `${basePath}?${s}` : basePath;
  }

  const pages = getPageList(page, totalPages);

  return (
    <nav
      className="mt-10 flex items-center justify-center gap-1.5"
      aria-label="Phân trang sản phẩm"
    >
      <Link
        href={href(page - 1)}
        aria-disabled={page === 1}
        className={cn(
          "grid size-9 place-items-center rounded-lg border text-sm transition",
          page === 1
            ? "pointer-events-none border-ink-200 text-ink-300"
            : "border-ink-200 text-ink-700 hover:border-brand-300 hover:text-brand-600",
        )}
        aria-label="Trang trước"
      >
        <ChevronLeft className="size-4" />
      </Link>

      {pages.map((p, i) =>
        p === "..." ? (
          <span key={`gap-${i}`} className="px-1.5 text-sm text-ink-400">
            …
          </span>
        ) : (
          <Link
            key={p}
            href={href(p)}
            aria-current={p === page ? "page" : undefined}
            className={cn(
              "grid size-9 place-items-center rounded-lg border text-sm font-medium transition",
              p === page
                ? "border-brand-600 bg-brand-600 text-white"
                : "border-ink-200 text-ink-700 hover:border-brand-300 hover:text-brand-600",
            )}
          >
            {p}
          </Link>
        ),
      )}

      <Link
        href={href(page + 1)}
        aria-disabled={page === totalPages}
        className={cn(
          "grid size-9 place-items-center rounded-lg border text-sm transition",
          page === totalPages
            ? "pointer-events-none border-ink-200 text-ink-300"
            : "border-ink-200 text-ink-700 hover:border-brand-300 hover:text-brand-600",
        )}
        aria-label="Trang sau"
      >
        <ChevronRight className="size-4" />
      </Link>
    </nav>
  );
}

function getPageList(current: number, total: number): (number | "...")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  const list: (number | "...")[] = [];
  list.push(1);
  if (current > 3) list.push("...");
  for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) {
    list.push(i);
  }
  if (current < total - 2) list.push("...");
  list.push(total);
  return list;
}
