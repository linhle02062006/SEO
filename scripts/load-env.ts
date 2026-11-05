/**
 * Nạp biến môi trường cho các script CLI (migrate, seed, check-db).
 *
 * VÌ SAO CẦN FILE NÀY:
 * `import "dotenv/config"` mặc định CHỈ đọc file `.env`.
 * Nhưng project đặt cấu hình ở `.env.local` (theo .gitignore) — vì vậy
 * `DATABASE_URL` sẽ KHÔNG được nạp vào script => migrate/seed âm thầm
 * fallback về PGlite và tạo bảng ở SAI database (file `.pglite` local).
 *
 * THỨ TỰ ƯU TIÊN:
 *   1. biến đã có trong process.env (CI, Vercel, shell) — không bị ghi đè
 *   2. .env.local
 *   3. .env
 *
 * QUY TẮC "GIÁ TRỊ RỖNG KHÔNG CHẶN":
 * dotenv mặc định "first wins" — nếu `.env.local` có `DATABASE_URL=` (rỗng)
 * thì giá trị thật ở `.env` sẽ bị bỏ qua. Ở đây ta coi giá trị RỖNG là
 * "chưa cấu hình", nên `.env` (hoặc `.env.local` ở lần load sau) có thể lấp
 * chỗ trống — giống hành vi mong muốn khi developer điền URL sau.
 */
import { config, parse } from "dotenv";
import { readFileSync } from "node:fs";
import path from "node:path";

/** Nạp 1 file env, chỉ ghi vào process.env nếu biến chưa có GIÁ TRỊ KHÁC RỖNG. */
function applyFile(filePath: string): void {
  let parsed: Record<string, string>;
  try {
    parsed = parse(readFileSync(filePath, "utf8"));
  } catch {
    return; // file không tồn tại -> bỏ qua
  }

  for (const [key, value] of Object.entries(parsed)) {
    const current = process.env[key];
    const currentIsBlank = current === undefined || current.trim() === "";
    const incomingIsBlank = value.trim() === "";

    // Biến đã có giá trị thật (từ shell / CI / file ưu tiên cao hơn) -> giữ nguyên.
    if (!currentIsBlank) continue;

    // Giá trị rỗng KHÔNG được chặn giá trị thật ở file sau.
    // (`.env.local` có `DATABASE_URL=` rỗng vẫn cho phép `.env` lấp giá trị thật.)
    if (!incomingIsBlank) {
      process.env[key] = value;
      continue;
    }

    // Chỉ ghi giá trị rỗng khi biến chưa tồn tại (giữ "đã cấu hình = rỗng" cho biến tuỳ chọn).
    if (current === undefined) {
      process.env[key] = value;
    }
  }
}

export function loadEnv(): void {
  const cwd = process.cwd();

  // .env.local — cấu hình thật của developer (không commit)
  applyFile(path.resolve(cwd, ".env.local"));

  // .env — fallback chung (ví dụ DATABASE_URL dùng chung cho team)
  applyFile(path.resolve(cwd, ".env"));

  // dotenv cũng hỗ trợ file .env.<NODE_ENV>.local — nạp thêm cho chắc.
  const nodeEnv = process.env.NODE_ENV;
  if (nodeEnv) {
    applyFile(path.resolve(cwd, `.env.${nodeEnv}.local`));
  }
}

// Side-effect: chạy ngay khi module được import.
loadEnv();

/** Re-export để tương thích với cách dùng `import { config } from "dotenv"`. */
export { config };
