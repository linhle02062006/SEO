"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { CalendarDays, CalendarRange, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

const OPTIONS = [
  { value: "day", label: "Hôm nay", icon: CalendarDays },
  { value: "week", label: "7 ngày", icon: CalendarRange },
  { value: "month", label: "Tháng này", icon: Calendar },
];

export function RangeFilter({
  current,
  paramName = "range",
}: {
  current: string;
  paramName?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function apply(value: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.set(paramName, value);
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="flex flex-wrap items-center gap-2 rounded-xl border border-ink-200 bg-white p-3">
      <span className="mr-1 text-xs font-medium text-ink-600">
        Khoảng thời gian:
      </span>
      {OPTIONS.map((o) => (
        <button
          key={o.value}
          type="button"
          onClick={() => apply(o.value)}
          className={cn(
            "inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition",
            current === o.value
              ? "bg-brand-600 text-white"
              : "bg-ink-100 text-ink-700 hover:bg-ink-200",
          )}
          aria-pressed={current === o.value}
        >
          <o.icon className="size-3.5" />
          {o.label}
        </button>
      ))}
    </div>
  );
}
