/** Format tiền VND: 1.290.000 ₫ */
export function formatPrice(value: number | string | null | undefined): string {
  const n = typeof value === "string" ? Number(value) : (value ?? 0);
  if (!Number.isFinite(n)) return "0 ₫";
  return `${Math.round(n).toLocaleString("vi-VN")} ₫`;
}

/** Giá không ký hiệu, dùng cho JSON-LD price */
export function rawPrice(value: number | string | null | undefined): number {
  const n = typeof value === "string" ? Number(value) : (value ?? 0);
  return Number.isFinite(n) ? Math.round(n) : 0;
}

export function formatNumber(value: number | string): string {
  return Number(value).toLocaleString("vi-VN");
}

export function formatDate(
  date: Date | string | null | undefined,
  withTime = false,
): string {
  if (!date) return "";
  const d = typeof date === "string" ? new Date(date) : date;
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    ...(withTime ? { hour: "2-digit", minute: "2-digit" } : {}),
  });
}

export function formatDateShort(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export function percentOff(
  price: number | string,
  salePrice: number | string | null | undefined,
): number {
  const p = Number(price);
  const s = salePrice == null ? null : Number(salePrice);
  if (!s || !p || s >= p) return 0;
  return Math.round(((p - s) / p) * 100);
}
