/**
 * Sinh ảnh sản phẩm & blog tự động (không cần tải ảnh từ internet).
 * Chạy: npm run images:generate
 * Tạo file .jpg trong public/products và public/blog với tên SEO-friendly.
 */
import { mkdir, writeFile, access } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import sharp from "sharp";
import { SEED_PRODUCTS } from "../database/seed-data/products";
import { SEED_POSTS } from "../database/seed-data/posts";

const ROOT = process.cwd();
const PRODUCT_DIR = path.join(ROOT, "public", "products");
const BLOG_DIR = path.join(ROOT, "public", "blog");

/** Bảng màu theo nhóm danh mục */
const PALETTES: Record<string, [string, string, string]> = {
  "op-lung": ["#1e3a8a", "#3b82f6", "#93c5fd"],
  "cap-sac": ["#0f766e", "#14b8a6", "#99f6e4"],
  "cu-sac": ["#7c2d12", "#f97316", "#fed7aa"],
  "tai-nghe": ["#4c1d95", "#8b5cf6", "#ddd6fe"],
  "sac-du-phong": ["#164e63", "#06b6d4", "#a5f3fc"],
  "kinh-cuong-luc": ["#1e293b", "#64748b", "#cbd5e1"],
  "gia-do-dien-thoai": ["#831843", "#ec4899", "#fbcfe8"],
  "phu-kien-laptop": ["#312e81", "#6366f1", "#c7d2fe"],
  "phu-kien-gaming": ["#450a0a", "#ef4444", "#fecaca"],
};

function escapeXml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Tạo SVG minh họa sản phẩm theo danh mục */
function productSvg(
  title: string,
  category: string,
  variant: number,
): string {
  const [c1, c2, c3] = PALETTES[category] ?? ["#1e293b", "#64748b", "#cbd5e1"];
  const rot = variant * 18;
  const shapes: Record<string, string> = {
    "op-lung": `
      <rect x="250" y="120" width="220" height="360" rx="44" fill="${c3}" opacity="0.35"/>
      <rect x="250" y="120" width="220" height="360" rx="44" fill="none" stroke="${c2}" stroke-width="10"/>
      <rect x="290" y="150" width="70" height="70" rx="18" fill="none" stroke="${c2}" stroke-width="8" opacity="0.7"/>
      <rect x="375" y="150" width="70" height="70" rx="18" fill="none" stroke="${c2}" stroke-width="8" opacity="0.7"/>
      <rect x="290" y="240" width="70" height="70" rx="18" fill="none" stroke="${c2}" stroke-width="8" opacity="0.7"/>`,
    "cap-sac": `
      <path d="M190 300 Q190 210 300 210 L470 210 Q420 250 420 300 L420 400 Q420 460 360 460 L250 460 Q190 460 190 400 Z" fill="${c3}" opacity="0.4"/>
      <path d="M190 300 Q190 210 300 210 L470 210 Q420 250 420 300 L420 400 Q420 460 360 460 L250 460 Q190 460 190 400 Z" fill="none" stroke="${c2}" stroke-width="10"/>
      <rect x="420" y="280" width="90" height="56" rx="12" fill="${c2}" opacity="0.85"/>
      <rect x="168" y="300" width="34" height="46" rx="8" fill="${c2}" opacity="0.85"/>`,
    "cu-sac": `
      <rect x="245" y="200" width="230" height="240" rx="36" fill="${c3}" opacity="0.4"/>
      <rect x="245" y="200" width="230" height="240" rx="36" fill="none" stroke="${c2}" stroke-width="10"/>
      <rect x="295" y="170" width="52" height="46" rx="10" fill="${c2}"/>
      <rect x="368" y="170" width="52" height="46" rx="10" fill="${c2}"/>
      <circle cx="360" cy="310" r="34" fill="none" stroke="${c2}" stroke-width="9"/>`,
    "tai-nghe": `
      <path d="M245 320 A115 115 0 0 1 475 320" fill="none" stroke="${c2}" stroke-width="16"/>
      <rect x="205" y="300" width="80" height="130" rx="34" fill="${c3}" stroke="${c2}" stroke-width="9"/>
      <rect x="435" y="300" width="80" height="130" rx="34" fill="${c3}" stroke="${c2}" stroke-width="9"/>
      <path d="M245 430 Q245 470 285 470" fill="none" stroke="${c2}" stroke-width="10"/>`,
    "sac-du-phong": `
      <rect x="240" y="210" width="240" height="290" rx="32" fill="${c3}" opacity="0.4"/>
      <rect x="240" y="210" width="240" height="290" rx="32" fill="none" stroke="${c2}" stroke-width="10"/>
      <rect x="290" y="255" width="140" height="60" rx="14" fill="${c2}" opacity="0.9"/>
      <rect x="280" y="360" width="70" height="30" rx="8" fill="${c2}"/>
      <rect x="370" y="360" width="70" height="30" rx="8" fill="${c2}"/>`,
    "kinh-cuong-luc": `
      <rect x="260" y="110" width="200" height="400" rx="40" fill="${c3}" opacity="0.25"/>
      <rect x="260" y="110" width="200" height="400" rx="40" fill="none" stroke="${c2}" stroke-width="10"/>
      <path d="M300 180 L420 420" stroke="${c2}" stroke-width="8" opacity="0.5"/>
      <path d="M300 300 L360 180" stroke="${c2}" stroke-width="8" opacity="0.5"/>
      <rect x="300" y="135" width="52" height="52" rx="14" fill="none" stroke="${c2}" stroke-width="8"/>`,
    "gia-do-dien-thoai": `
      <rect x="285" y="130" width="150" height="250" rx="26" fill="${c3}" stroke="${c2}" stroke-width="9"/>
      <path d="M360 380 L360 470" stroke="${c2}" stroke-width="12"/>
      <path d="M280 470 L440 470" stroke="${c2}" stroke-width="12" stroke-linecap="round"/>
      <rect x="305" y="155" width="110" height="200" rx="14" fill="${c2}" opacity="0.2"/>`,
    "phu-kien-laptop": `
      <rect x="215" y="180" width="290" height="190" rx="18" fill="${c3}" opacity="0.4"/>
      <rect x="215" y="180" width="290" height="190" rx="18" fill="none" stroke="${c2}" stroke-width="10"/>
      <path d="M175 400 L545 400 L520 440 L200 440 Z" fill="${c2}" opacity="0.85"/>
      <rect x="330" y="405" width="60" height="8" rx="4" fill="${c3}"/>`,
    "phu-kien-gaming": `
      <path d="M230 280 Q230 220 300 220 L420 220 Q490 220 490 280 L490 340 Q490 400 430 400 L290 400 Q230 400 230 340 Z" fill="${c3}" opacity="0.4"/>
      <path d="M230 280 Q230 220 300 220 L420 220 Q490 220 490 280 L490 340 Q490 400 430 400 L290 400 Q230 400 230 340 Z" fill="none" stroke="${c2}" stroke-width="10"/>
      <circle cx="300" cy="310" r="26" fill="${c2}" opacity="0.9"/>
      <circle cx="420" cy="310" r="26" fill="${c2}" opacity="0.9"/>
      <rect x="348" y="270" width="24" height="12" rx="6" fill="${c2}"/>
      <rect x="354" y="264" width="12" height="24" rx="6" fill="${c2}"/>`,
  };

  const shape = shapes[category] ?? shapes["phu-kien-laptop"];

  return `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="800" viewBox="0 0 800 800">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${c1}"/>
      <stop offset="100%" stop-color="${c2}"/>
    </linearGradient>
    <linearGradient id="sheen" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.35"/>
      <stop offset="100%" stop-color="#ffffff" stop-opacity="0"/>
    </linearGradient>
  </defs>
  <rect width="800" height="800" fill="url(#bg)"/>
  <circle cx="${140 + variant * 20}" cy="120" r="180" fill="#ffffff" opacity="0.08"/>
  <circle cx="660" cy="680" r="220" fill="#000000" opacity="0.06"/>
  <g transform="rotate(${rot / 3} 400 400)">
    ${shape}
  </g>
  <rect width="800" height="800" fill="url(#sheen)"/>
  <text x="40" y="760" font-family="Arial, Helvetica, sans-serif" font-size="26" font-weight="700" fill="#ffffff" opacity="0.92">${escapeXml(
    title.slice(0, 46),
  )}</text>
</svg>`;
}

function blogSvg(title: string, index: number): string {
  const hues = [
    ["#1e3a8a", "#3b82f6"],
    ["#831843", "#ec4899"],
    ["#14532d", "#22c55e"],
    ["#7c2d12", "#f97316"],
    ["#4c1d95", "#8b5cf6"],
    ["#0f766e", "#14b8a6"],
  ];
  const [c1, c2] = hues[index % hues.length];
  const icon = [
    "M250 250 h300 v300 h-300 z",
    "M270 200 h260 v260 h-260 z",
    "M400 200 l140 260 h-280 z",
    "M240 300 h320 v180 h-320 z",
    "M400 200 l160 180 -160 180 -160 -180 z",
    "M260 260 h280 v280 h-280 z",
  ][index % 6];

  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${c1}"/>
      <stop offset="100%" stop-color="${c2}"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#g)"/>
  <circle cx="1050" cy="90" r="220" fill="#ffffff" opacity="0.08"/>
  <circle cx="120" cy="580" r="180" fill="#000000" opacity="0.07"/>
  <g transform="translate(400,60) scale(0.9)" opacity="0.22">
    <path d="${icon}" fill="none" stroke="#ffffff" stroke-width="22" stroke-linejoin="round"/>
  </g>
  <text x="70" y="330" font-family="Arial, Helvetica, sans-serif" font-size="52" font-weight="800" fill="#ffffff">${escapeXml(
    title.slice(0, 34),
  )}</text>
  <text x="70" y="390" font-family="Arial, Helvetica, sans-serif" font-size="52" font-weight="800" fill="#ffffff">${escapeXml(
    title.slice(34, 68),
  )}</text>
  <text x="70" y="520" font-family="Arial, Helvetica, sans-serif" font-size="30" font-weight="600" fill="#ffffff" opacity="0.85">TechZone · Hướng dẫn phụ kiện điện thoại</text>
</svg>`;
}

async function exists(p: string) {
  try {
    await access(p);
    return true;
  } catch {
    return false;
  }
}

async function main() {
  await mkdir(PRODUCT_DIR, { recursive: true });
  await mkdir(BLOG_DIR, { recursive: true });

  const force = process.argv.includes("--force");
  let count = 0;

  for (const p of SEED_PRODUCTS) {
    for (let v = 1; v <= 2; v++) {
      const suffix = v === 1 ? "" : `-${v}`;
      const file = path.join(PRODUCT_DIR, `${p.slug}${suffix}.jpg`);
      if (!force && (await exists(file))) continue;
      const svg = productSvg(p.name, p.category, v);
      await sharp(Buffer.from(svg))
        .jpeg({ quality: 82, progressive: true, mozjpeg: true })
        .toFile(file);
      count++;
    }
  }

  for (let i = 0; i < SEED_POSTS.length; i++) {
    const post = SEED_POSTS[i];
    const file = path.join(BLOG_DIR, `${post.slug}.jpg`);
    if (!force && (await exists(file))) continue;
    const svg = blogSvg(post.title, i);
    await sharp(Buffer.from(svg))
      .jpeg({ quality: 80, progressive: true, mozjpeg: true })
      .toFile(file);
    count++;
  }

  // Placeholder dùng chung
  const placeholder = path.join(PRODUCT_DIR, "placeholder.svg");
  if (!existsSync(placeholder)) {
    await writeFile(
      placeholder,
      `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="800"><rect width="800" height="800" fill="#f1f5f9"/><text x="400" y="400" text-anchor="middle" font-family="Arial" font-size="34" fill="#94a3b8">TechZone</text></svg>`,
    );
  }

  // OG image mặc định
  const ogDir = path.join(ROOT, "public");
  const og = path.join(ogDir, "og-default.jpg");
  if (!existsSync(og)) {
    await sharp(Buffer.from(blogSvg("TechZone - Phụ kiện điện thoại chính hãng", 0)))
      .jpeg({ quality: 82, progressive: true })
      .toFile(og);
  }

  console.log(`🖼️  Đã tạo ${count} ảnh vào public/products và public/blog`);
}

main().catch((err) => {
  console.error("❌ Lỗi sinh ảnh:", err);
  process.exit(1);
});
