/**
 * Kiểm tra TOÀN BỘ trang chi tiết sản phẩm:
 *  - Trang trả về HTTP 200
 *  - Có đủ 2 ảnh trong gallery (`{slug}.jpg` và `{slug}-2.jpg`)
 *  - Cả 2 ảnh đều tải được (HTTP 200)
 *
 * Nguồn danh sách sản phẩm: sitemap.xml (chính là danh sách route thật).
 * KHÔNG suy đoán từ tên file vì slug có thể kết thúc bằng "-2"
 * (vd. `chuot-gaming-co-day-asus-tuf-m3-gen-2`).
 *
 * Chạy: node scripts/check-product-images.mjs
 */
import fs from "node:fs";
import path from "node:path";

const BASE = process.env.BASE_URL ?? "http://localhost:3000";
const PRODUCT_DIR = path.join(process.cwd(), "public", "products");

// 1. Lấy danh sách slug sản phẩm từ sitemap (đã bao gồm cả 2 ảnh của mỗi SP)
const sm = await fetch(BASE + "/sitemap.xml").then((r) => r.text());
const slugs = [
  ...new Set(
    [...sm.matchAll(/<loc>([^<]+)<\/loc>/g)]
      .map((m) => m[1].replace(BASE, ""))
      .filter((u) => u.startsWith("/san-pham/"))
      .map((u) => u.replace("/san-pham/", "")),
  ),
].sort();

console.log(`Kiểm tra ${slugs.length} sản phẩm (theo sitemap)...\n`);

const problems = [];

// 2. Mọi sản phẩm trong sitemap phải có đủ 2 file ảnh trên đĩa
for (const slug of slugs) {
  for (const file of [`${slug}.jpg`, `${slug}-2.jpg`]) {
    const p = path.join(PRODUCT_DIR, file);
    if (!fs.existsSync(p)) problems.push(`${slug}: thiếu file ${file}`);
  }
}

// 3. Ngược lại: mọi file ảnh trên đĩa phải thuộc một sản phẩm có trong sitemap
const onDisk = new Set(
  fs
    .readdirSync(PRODUCT_DIR)
    .filter((f) => f.endsWith(".jpg"))
    .map((f) => f.replace(/\.jpg$/, "")),
);
for (const slug of slugs) {
  onDisk.delete(slug);
  onDisk.delete(`${slug}-2`);
}
for (const orphan of onDisk) {
  problems.push(`orphaned: public/products/${orphan}.jpg không khớp sản phẩm nào`);
}

// 4. Trang chi tiết phải trả về 200 và tham chiếu đủ 2 ảnh
for (const slug of slugs) {
  const res = await fetch(`${BASE}/san-pham/${slug}`);
  if (!res.ok) {
    problems.push(`${slug}: trang /san-pham/${slug} -> HTTP ${res.status}`);
    continue;
  }
  const html = await res.text();

  if (!html.includes(`url=%2Fproducts%2F${slug}.jpg`)) {
    problems.push(`${slug}: HTML không tham chiếu ảnh chính`);
  }
  if (!html.includes(`url=%2Fproducts%2F${slug}-2.jpg`)) {
    problems.push(`${slug}: HTML không tham chiếu ảnh thứ 2`);
  }

  for (const file of [`/products/${slug}.jpg`, `/products/${slug}-2.jpg`]) {
    const r = await fetch(BASE + file, { method: "HEAD" });
    if (!r.ok) problems.push(`${slug}: ${file} -> HTTP ${r.status}`);
  }
}

console.log(`Sản phẩm kiểm tra: ${slugs.length}`);
console.log(`Vấn đề: ${problems.length}`);
problems.forEach((p) => console.log("  -", p));

if (problems.length) process.exit(1);
console.log("\n✅ Mọi sản phẩm đều có đủ 2 ảnh thật, tải được, không lỗi.");
