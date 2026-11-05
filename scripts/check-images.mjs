/**
 * Kiểm tra ảnh trên TẤT CẢ các trang: mọi URL ảnh được tham chiếu trong HTML
 * (kể cả ảnh điện thoại / danh mục / blog) đều phải trả về HTTP 200.
 *
 * Chạy: node scripts/check-images.mjs
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";

const BASE = process.env.BASE_URL ?? "http://localhost:3000";

const PAGES = [
  "/",
  "/san-pham",
  "/danh-muc",
  "/danh-muc/op-lung",
  "/danh-muc/cap-sac",
  "/danh-muc/cu-sac",
  "/danh-muc/tai-nghe",
  "/danh-muc/sac-du-phong",
  "/danh-muc/kinh-cuong-luc",
  "/danh-muc/gia-do-dien-thoai",
  "/danh-muc/phu-kien-laptop",
  "/danh-muc/phu-kien-gaming",
  "/thuong-hieu",
  "/thuong-hieu/anker",
  "/thuong-hieu/baseus",
  "/thuong-hieu/samsung",
  "/blog",
  "/blog/cach-chon-cap-sac",
  "/gioi-thieu",
  "/lien-he",
  "/huong-dan-mua-hang",
  "/chinh-sach",
  "/chinh-sach/chinh-sach-bao-hanh",
  "/tim-kiem?q=sac",
  "/tim-kiem?q=sac%20du%20phong",
  "/tim-kiem?q=cap%20sac",
];

/** Trích mọi URL ảnh nội bộ từ HTML. */
function extractImageUrls(html) {
  const urls = new Set();

  // Ảnh điện thoại / danh mục / blog đi qua next/image -> `?url=%2F...`
  for (const m of html.matchAll(/url=%2F([^&"']+)/g)) {
    urls.add("/" + decodeURIComponent(m[1]));
  }

  // Ảnh gốc (không qua optimizer)
  for (const m of html.matchAll(/src="(\/(?:products|categories|blog|icons)\/[^"]+)"/g)) {
    urls.add(m[1]);
  }

  // srcset: mỗi ứng viên có thể là đường dẫn gốc hoặc optimizer
  for (const m of html.matchAll(/srcSet="([^"]+)"/g)) {
    for (const part of m[1].split(",")) {
      const candidate = part.trim().split(/\s+/)[0];
      if (!candidate) continue;
      if (candidate.includes("url=%2F")) {
        const dec = decodeURIComponent(candidate.split("url=%2F")[1].split("&")[0]);
        urls.add("/" + dec);
      } else if (candidate.startsWith("/")) {
        urls.add(candidate);
      }
    }
  }

  return [...urls];
}

let totalRefs = 0;
const broken = [];
const pageErrors = [];

for (const page of PAGES) {
  let res;
  let html = "";
  try {
    res = await fetch(BASE + page);
    html = await res.text();
  } catch (err) {
    pageErrors.push(`${page} -> ${err.message}`);
    continue;
  }

  if (!res.ok) {
    pageErrors.push(`${page} -> HTTP ${res.status}`);
    continue;
  }

  const urls = extractImageUrls(html);
  totalRefs += urls.length;

  const bad = [];
  for (const url of urls) {
    const r = await fetch(BASE + url, { method: "HEAD" });
    if (!r.ok) bad.push(`${url} -> HTTP ${r.status}`);
  }

  if (bad.length) broken.push(...bad);
  console.log(
    `${page.padEnd(40)} HTTP ${res.status}  ảnh: ${String(urls.length).padStart(3)}  lỗi: ${bad.length}`,
  );
}

console.log("\n---");
console.log(`Tổng số tham chiếu ảnh: ${totalRefs}`);
console.log(`Trang lỗi: ${pageErrors.length}`);
pageErrors.forEach((e) => console.log("  -", e));
console.log(`Ảnh lỗi: ${broken.length}`);
broken.forEach((e) => console.log("  -", e));

if (pageErrors.length || broken.length) {
  console.log("\n❌ Có ảnh/trang lỗi.");
  process.exit(1);
}
console.log("\n✅ Mọi ảnh trên mọi trang đều trả về HTTP 200.");
