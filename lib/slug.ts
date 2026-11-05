/**
 * Slugify tiếng Việt -> ascii, dùng cho URL slug (SEO friendly).
 * "Ốp lưng iPhone 15 Silicone" -> "op-lung-iphone-15-silicone"
 */
export function slugify(input: string): string {
  return (
    input
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .replace(/Đ/g, "D")
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "") || "item"
  );
}

export function toSlug(input: string): string {
  return slugify(input);
}

/** Chuẩn hóa chuỗi để so sánh tìm kiếm (bỏ dấu, thường hoá) */
export function normalizeText(input: string): string {
  return input
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase()
    .trim();
}
