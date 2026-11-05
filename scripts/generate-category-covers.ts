/**
 * Sinh ảnh đại diện cho danh mục (16:9) từ ảnh sản phẩm thật đã tải về.
 * Kết quả: public/categories/{slug}.jpg
 * Chạy: npx tsx scripts/generate-category-covers.ts
 */
import { mkdir, readFile, access } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const ROOT = process.cwd();
const CATEGORY_DIR = path.join(ROOT, "public", "categories");
const PRODUCT_DIR = path.join(ROOT, "public", "products");

/** Danh mục -> (sản phẩm đại diện, màu nền, màu nhấn) */
const CATEGORY_COVERS: Record<
  string,
  { product: string; from: string; to: string; accent: string }
> = {
  "op-lung": {
    product: "op-lung-iphone-15-plus-mipow-soft-trong-suat",
    from: "#1e3a8a",
    to: "#3b82f6",
    accent: "#93c5fd",
  },
  "cap-sac": {
    product: "cap-mophie-usb-c-to-usb-c-100w-3m",
    from: "#0f766e",
    to: "#14b8a6",
    accent: "#99f6e4",
  },
  "cu-sac": {
    product: "cu-sac-ugreen-robot-uno-gan-65w-2c1a",
    from: "#7c2d12",
    to: "#f97316",
    accent: "#fed7aa",
  },
  "tai-nghe": {
    product: "tai-nghe-bluetooth-havit-tw972",
    from: "#4c1d95",
    to: "#8b5cf6",
    accent: "#ddd6fe",
  },
  "sac-du-phong": {
    product: "pin-sac-du-phong-xiaomi-10000mah-22-5w",
    from: "#164e63",
    to: "#06b6d4",
    accent: "#a5f3fc",
  },
  "kinh-cuong-luc": {
    product: "dan-kinh-cuong-luc-mipow-full-vien-iphone-17-18-pro-max",
    from: "#1e293b",
    to: "#64748b",
    accent: "#cbd5e1",
  },
  "gia-do-dien-thoai": {
    product: "gia-do-ipad-dien-thoai-goojodoq-bd3099",
    from: "#831843",
    to: "#ec4899",
    accent: "#fbcfe8",
  },
  "phu-kien-laptop": {
    product: "hub-anker-7-trong-1-usb-c-a83d2",
    from: "#312e81",
    to: "#6366f1",
    accent: "#c7d2fe",
  },
  "phu-kien-gaming": {
    product: "chuot-gaming-khong-day-mchose-g3-v2-tri-mode",
    from: "#450a0a",
    to: "#ef4444",
    accent: "#fecaca",
  },
};

/** Tên danh mục hiển thị */
const CATEGORY_NAMES: Record<string, string> = {
  "op-lung": "Ốp lưng",
  "cap-sac": "Cáp sạc",
  "cu-sac": "Củ sạc",
  "tai-nghe": "Tai nghe",
  "sac-du-phong": "Sạc dự phòng",
  "kinh-cuong-luc": "Kính cường lực",
  "gia-do-dien-thoai": "Giá đỡ điện thoại",
  "phu-kien-laptop": "Phụ kiện laptop",
  "phu-kien-gaming": "Phụ kiện gaming",
};

function escapeXml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
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
  await mkdir(CATEGORY_DIR, { recursive: true });
  let count = 0;

  for (const [slug, cfg] of Object.entries(CATEGORY_COVERS)) {
    const imgPath = path.join(PRODUCT_DIR, `${cfg.product}.jpg`);
    if (!(await exists(imgPath))) {
      console.warn(`✗ ${slug}: thiếu ảnh sản phẩm ${cfg.product}`);
      continue;
    }

    const buf = await readFile(imgPath);
    const inner = await sharp(buf)
      .resize(460, 460, { fit: "contain", background: { r: 255, g: 255, b: 255 } })
      .png()
      .toBuffer();

    const name = CATEGORY_NAMES[slug] ?? slug;
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="675" viewBox="0 0 1200 675">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${cfg.from}"/>
      <stop offset="100%" stop-color="${cfg.to}"/>
    </linearGradient>
    <linearGradient id="sheen" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.18"/>
      <stop offset="100%" stop-color="#ffffff" stop-opacity="0"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="675" fill="url(#bg)"/>
  <circle cx="1060" cy="120" r="230" fill="#ffffff" opacity="0.08"/>
  <circle cx="140" cy="620" r="180" fill="#000000" opacity="0.08"/>
  <g transform="translate(700,110)">
    <ellipse cx="230" cy="450" rx="200" ry="28" fill="#000" opacity="0.25"/>
    <circle cx="230" cy="225" r="225" fill="${cfg.accent}" opacity="0.18"/>
    <image href="data:image/png;base64,${inner.toString("base64")}" x="0" y="-5" width="460" height="460"/>
  </g>
  <rect width="1200" height="675" fill="url(#sheen)"/>
  <rect x="0" y="0" width="14" height="675" fill="${cfg.accent}"/>
  <text x="80" y="300" font-family="Arial, Helvetica, sans-serif" font-size="72" font-weight="800" fill="#ffffff">${escapeXml(name)}</text>
  <text x="80" y="370" font-family="Arial, Helvetica, sans-serif" font-size="32" font-weight="500" fill="#ffffff" opacity="0.85">Phụ kiện chính hãng · Bảo hành uy tín</text>
</svg>`;

    await sharp(Buffer.from(svg))
      .jpeg({ quality: 86, progressive: true, mozjpeg: true })
      .toFile(path.join(CATEGORY_DIR, `${slug}.jpg`));
    count++;
  }

  console.log(`🖼️  Đã tạo ${count} ảnh danh mục vào public/categories`);
}

main().catch((e) => {
  console.error("❌ Lỗi:", e);
  process.exit(1);
});
