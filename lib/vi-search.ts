/**
 * Tìm kiếm tiếng Việt không dấu / không phân biệt dấu.
 *
 * Vấn đề: `ilike('%sac%')` KHÔNG match "Sạc" vì "ạ" != "a".
 * PostgreSQL có `unaccent` extension nhưng extension này KHÔNG có sẵn trong
 * PGlite mặc định và cũng không chạy được trên một số provider Postgres
 * (Neon/Supabase cần bật extension trước).
 *
 * Giải pháp portable: dùng `translate()` — hàm built-in của PostgreSQL, luôn có
 * sẵn, chạy được cả PGlite lẫn Postgres thật. Ta bỏ dấu ở CẢ HAI VẾ:
 *   translate(lower(tên sản phẩm), SRC, DST) LIKE translate(lower(từ khóa), SRC, DST)
 *
 * Nhờ vậy "sac", "sạc", "SẠC", "Sac" đều ra cùng một chuỗi "sac".
 */
import { sql } from "drizzle-orm";

/** Ký tự tiếng Việt (đã lowercase + sắp xếp theo thứ tự ASCII tương ứng). */
export const VI_SRC =
  "àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỷỹỵđ" +
  "ÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỶỸỴĐ";

/** Ký tự ASCII tương ứng (cùng thứ tự với VI_SRC). */
export const VI_DST =
  "aaaaaaaaaaaaaaaaaeeeeeeeeeeeiiiiiooooooooooooooooouuuuuuuuuuuyyyyyd" +
  "AAAAAAAAAAAAAAAAAEEEEEEEEEEEIIIIIOOOOOOOOOOOOOOOOOUUUUUUUUUUUYYYYYD";

/**
 * Biểu thức SQL bỏ dấu + hạ chữ thường cho một cột text.
 * Dùng: sql`translate(lower(${column}), ${VI_SRC}, ${VI_DST})`
 */
export function foldSql(column: unknown) {
  return sql`translate(lower(${column}), ${VI_SRC}, ${VI_DST})`;
}

/** Bỏ dấu + hạ chữ thường phía JS (dùng để so khớp ký tự đặc biệt). */
export function foldText(input: string): string {
  return input
    .toLowerCase()
    .replace(/[àáạảãâầấậẩẫăằắặẳẵ]/g, "a")
    .replace(/[èéẹẻẽêềếệểễ]/g, "e")
    .replace(/[ìíịỉĩ]/g, "i")
    .replace(/[òóọỏõôồốộổỗơờớợởỡ]/g, "o")
    .replace(/[ùúụủũưừứựửữ]/g, "u")
    .replace(/[ỳýỷỹỵ]/g, "y")
    .replace(/đ/g, "d");
}

/**
 * Tách từ khóa thành các token riêng biệt (mọi token đều phải khớp).
 * "cáp sạc nhanh" -> ["cap", "sac", "nhanh"]
 */
export function tokenizeQuery(q: string): string[] {
  return foldText(q)
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean);
}
