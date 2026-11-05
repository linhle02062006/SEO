"use client";

import { useMemo, useState } from "react";
import { BarChart3 } from "lucide-react";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";

type Point = { day: string; revenue: number; orders: number };

export function RevenueChart({ data }: { data: Point[] }) {
  const [mode, setMode] = useState<"revenue" | "orders">("revenue");

  const max = useMemo(
    () => Math.max(1, ...data.map((d) => (mode === "revenue" ? d.revenue : d.orders))),
    [data, mode],
  );

  return (
    <div className="rounded-xl border border-ink-200 bg-white p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="flex items-center gap-2 text-base font-semibold text-ink-950">
          <BarChart3 className="size-4 text-brand-600" />
          Biểu đồ doanh thu
        </h2>
        <div className="flex gap-1 rounded-lg bg-ink-100 p-1">
          {(
            [
              { key: "revenue", label: "Doanh thu" },
              { key: "orders", label: "Đơn hàng" },
            ] as const
          ).map((m) => (
            <button
              key={m.key}
              type="button"
              onClick={() => setMode(m.key)}
              className={cn(
                "rounded-md px-3 py-1 text-xs font-medium transition",
                mode === m.key
                  ? "bg-white text-ink-900 shadow-sm"
                  : "text-ink-600 hover:text-ink-900",
              )}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      {data.length === 0 ? (
        <p className="py-14 text-center text-sm text-ink-500">
          Chưa có dữ liệu trong khoảng thời gian này.
        </p>
      ) : (
        <>
          <div className="mt-6 flex h-56 items-end gap-1.5">
            {data.map((d) => {
              const value = mode === "revenue" ? d.revenue : d.orders;
              const pct = Math.max(2, Math.round((value / max) * 100));
              return (
                <div
                  key={d.day}
                  className="group relative flex h-full flex-1 flex-col justify-end"
                >
                  <div
                    className="w-full rounded-t-md bg-brand-500 transition hover:bg-brand-600"
                    style={{ height: `${pct}%` }}
                  />
                  <div className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 hidden -translate-x-1/2 whitespace-nowrap rounded-lg bg-ink-950 px-2.5 py-1.5 text-[11px] text-white shadow-lg group-hover:block">
                    {d.day}
                    <br />
                    {mode === "revenue"
                      ? formatPrice(d.revenue)
                      : `${d.orders} đơn`}
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-3 flex justify-between border-t border-ink-100 pt-3 text-[11px] text-ink-500">
            <span>{data[0]?.day}</span>
            <span>{data[data.length - 1]?.day}</span>
          </div>
        </>
      )}
    </div>
  );
}
