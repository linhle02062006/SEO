import { formatNumber } from "@/lib/format";

const EVENT_META: Record<string, { label: string; color: string }> = {
  page_view: { label: "Lượt xem trang", color: "bg-blue-500" },
  view_item: { label: "Xem sản phẩm", color: "bg-violet-500" },
  search: { label: "Tìm kiếm", color: "bg-cyan-500" },
  add_to_cart: { label: "Thêm giỏ hàng", color: "bg-amber-500" },
  begin_checkout: { label: "Bắt đầu thanh toán", color: "bg-orange-500" },
  purchase: { label: "Mua hàng", color: "bg-emerald-500" },
};

export function EventsTable({
  events,
}: {
  events: Record<string, { count: number; value: number }>;
}) {
  const rows = Object.entries(EVENT_META).map(([key, meta]) => ({
    key,
    label: meta.label,
    color: meta.color,
    count: events[key]?.count ?? 0,
  }));

  const max = Math.max(1, ...rows.map((r) => r.count));

  return (
    <div className="mt-4 space-y-2.5">
      {rows.map((r) => (
        <div key={r.key}>
          <div className="flex items-center justify-between text-xs">
            <span className="text-ink-700">{r.label}</span>
            <span className="font-semibold text-ink-950">
              {formatNumber(r.count)}
            </span>
          </div>
          <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-ink-100">
            <div
              className={`h-full rounded-full ${r.color}`}
              style={{ width: `${Math.max(2, (r.count / max) * 100)}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
