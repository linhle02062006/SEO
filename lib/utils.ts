import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Chuẩn hóa searchParams sang Record<string, string> bỏ các giá trị rỗng.
 * Dùng cho Link phân trang / lọc để không tạo query string rác.
 */
export function buildSearchParams(
  obj: Record<string, string | string[] | undefined>,
): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [key, value] of Object.entries(obj)) {
    const v = Array.isArray(value) ? value[0] : value;
    if (v) out[key] = v;
  }
  return out;
}
