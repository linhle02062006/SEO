import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import { cn } from "@/lib/utils";

export type Crumb = { name: string; href: string };

export function Breadcrumb({
  items,
  className,
  separator = "/",
}: {
  items: Crumb[];
  className?: string;
  separator?: string;
}) {
  return (
    <nav aria-label="Breadcrumb" className={cn("min-w-0", className)}>
      <ol className="flex flex-wrap items-center gap-1 text-sm text-ink-500">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={item.href} className="flex items-center gap-1">
              {index > 0 && (
                <ChevronRight className="size-3.5 shrink-0 text-ink-300" aria-hidden />
              )}
              {isLast ? (
                <span
                  className="max-w-[16rem] truncate font-medium text-ink-800"
                  aria-current="page"
                >
                  {item.name}
                </span>
              ) : (
                <Link
                  href={item.href}
                  className="max-w-[16rem] truncate transition hover:text-brand-600"
                >
                  {item.name}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export function HomeCrumb() {
  return {
    name: "Trang chủ",
    href: "/",
    icon: <Home className="size-3.5" aria-hidden />,
  };
}
