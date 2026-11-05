/**
 * Tạo ảnh cover cho bài viết blog từ ảnh sản phẩm thật đã tải về.
 * Kết quả: public/blog/{slug}.jpg — 1200x630, nền gradient thương hiệu + ảnh sản phẩm + tiêu đề.
 * Chạy: npx tsx scripts/generate-blog-covers.ts
 */
import { mkdir, readFile, access } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import { SEED_POSTS } from "../database/seed-data/posts";

const ROOT = process.cwd();
const BLOG_DIR = path.join(ROOT, "public", "blog");
const PRODUCT_DIR = path.join(ROOT, "public", "products");

/** Bảng màu theo chủ đề bài viết */
const THEMES: Record<string, { from: string; to: string; accent: string }> = {
  "cach-chon-cu-sac-nhanh": { from: "#7c2d12", to: "#f97316", accent: "#fed7aa" },
  "cach-chon-cap-sac": { from: "#0f766e", to: "#14b8a6", accent: "#99f6e4" },
  "co-nen-dung-sac-nhanh": { from: "#7c2d12", to: "#fb923c", accent: "#ffedd5" },
  "cach-bao-ve-pin-dien-thoai": { from: "#1e3a8a", to: "#3b82f6", accent: "#bfdbfe" },
  "cach-chon-sac-du-phong": { from: "#164e63", to: "#06b6d4", accent: "#a5f3fc" },
  "usb-c-la-gi": { from: "#312e81", to: "#6366f1", accent: "#c7d2fe" },
  "pd-va-qc-khac-nhau-the-nao": { from: "#831843", to: "#ec4899", accent: "#fbcfe8" },
  "cach-chon-tai-nghe-bluetooth": { from: "#4c1d95", to: "#8b5cf6", accent: "#ddd6fe" },
  "cach-chon-kinh-cuong-luc": { from: "#1e293b", to: "#64748b", accent: "#cbd5e1" },
  "nhung-phu-kien-dien-thoai-can-thiet": { from: "#450a0a", to: "#ef4444", accent: "#fecaca" },
};

/** Ảnh sản phẩm đại diện cho từng bài viết */
const POST_IMAGE: Record<string, string> = {
  "cach-chon-cu-sac-nhanh": "cu-sac-ugreen-robot-uno-gan-65w-2c1a",
  "cach-chon-cap-sac": "cap-mophie-usb-c-to-usb-c-100w-3m",
  "co-nen-dung-sac-nhanh": "cu-sac-samsung-25w-ep-t2510nbegww",
  "cach-bao-ve-pin-dien-thoai": "pin-sac-du-phong-xiaomi-10000mah-22-5w",
  "cach-chon-sac-du-phong": "pin-sac-du-phong-baseus-enercore-cr11-20000mah-67w",
  "usb-c-la-gi": "cap-baseus-crystal-shine-usb-c-lightning-1-2m",
  "pd-va-qc-khac-nhau-the-nao": "cu-sac-anker-20w-1c1a-kem-cap-type-c",
  "cach-chon-tai-nghe-bluetooth": "tai-nghe-bluetooth-havit-tw972",
  "cach-chon-kinh-cuong-luc": "dan-kinh-cuong-luc-mipow-full-vien-iphone-17-18-pro-max",
  "nhung-phu-kien-dien-thoai-can-thiet": "op-lung-iphone-15-plus-mipow-soft-trong-suat",
};

function escapeXml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Chia tiêu đề thành các dòng vừa khung 16:9 */
function wrapTitle(title: string, maxLen = 26): string[] {
  const words = title.split(" ");
  const lines: string[] = [];
  let cur = "";
  for (const w of words) {
    if ((cur + " " + w).trim().length > maxLen) {
      lines.push(cur.trim());
      cur = w;
    } else {
      cur = (cur + " " + w).trim();
    }
  }
  if (cur) lines.push(cur);
  return lines.slice(0, 3);
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
  await mkdir(BLOG_DIR, { recursive: true });
  let count = 0;

  for (const post of SEED_POSTS) {
    const theme = THEMES[post.slug] ?? { from: "#1e3a8a", to: "#3b82f6", accent: "#bfdbfe" };
    const imgKey = POST_IMAGE[post.slug];
    const imgPath = imgKey
      ? path.join(PRODUCT_DIR, `${imgKey}.jpg`)
      : path.join(PRODUCT_DIR, "placeholder.svg");

    // Ảnh sản phẩm cắt tròn + đổ bóng
    let productLayer = "";
    if (await exists(imgPath)) {
      const buf = await readFile(imgPath);
      const inner = await sharp(buf)
        .resize(420, 420, { fit: "cover" })
        .composite([
          {
            input: Buffer.from(
              `<svg width="420" height="420"><defs><mask id="m"><rect width="420" height="420" rx="210" fill="#fff"/></mask></defs><rect width="420" height="420" rx="210" fill="#fff" mask="url(#m)"/></svg>`,
            ),
            blend: "dest-in",
          },
        ])
        .png()
        .toBuffer();
      productLayer = `<g transform="translate(700,110)">
        <ellipse cx="210" cy="410" rx="180" ry="26" fill="#000" opacity="0.25"/>
        <circle cx="210" cy="210" r="205" fill="${theme.accent}" opacity="0.18"/>
        <image href="data:image/png;base64,${inner.toString("base64")}" x="0" y="0" width="420" height="420"/>
      </g>`;
    }

    const lines = wrapTitle(post.title);
    const titleSvg = lines
      .map(
        (l, i) =>
          `<text x="80" y="${300 + i * 76}" font-family="Arial, Helvetica, sans-serif" font-size="64" font-weight="800" fill="#ffffff">${escapeXml(l)}</text>`,
      )
      .join("\n");

    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${theme.from}"/>
      <stop offset="100%" stop-color="${theme.to}"/>
    </linearGradient>
    <linearGradient id="sheen" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.16"/>
      <stop offset="100%" stop-color="#ffffff" stop-opacity="0"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <circle cx="1120" cy="90" r="240" fill="#ffffff" opacity="0.07"/>
  <circle cx="120" cy="600" r="190" fill="#000000" opacity="0.08"/>
  ${productLayer}
  <rect width="1200" height="630" fill="url(#sheen)"/>
  <rect x="0" y="0" width="14" height="630" fill="${theme.accent}"/>
  <text x="80" y="150" font-family="Arial, Helvetica, sans-serif" font-size="28" font-weight="700" fill="${theme.accent}" letter-spacing="3">TECHZONE</text>
  ${titleSvg}
  <text x="80" y="${300 + lines.length * 76}" font-family="Arial, Helvetica, sans-serif" font-size="26" font-weight="500" fill="#ffffff" opacity="0.82">Hướng dẫn phụ kiện điện thoại chính hãng</text>
</svg>`;

    await sharp(Buffer.from(svg))
      .jpeg({ quality: 86, progressive: true, mozjpeg: true })
      .toFile(path.join(BLOG_DIR, `${post.slug}.jpg`));
    count++;
  }

  // OG image mặc định
  const og = path.join(ROOT, "public", "og-default.jpg");
  const ogSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0%" stop-color="#1e3a8a"/><stop offset="100%" stop-color="#3b82f6"/>
  </linearGradient></defs>
  <rect width="1200" height="630" fill="url(#g)"/>
  <circle cx="1020" cy="110" r="230" fill="#ffffff" opacity="0.08"/>
  <circle cx="150" cy="560" r="180" fill="#000000" opacity="0.08"/>
  <text x="80" y="290" font-family="Arial, Helvetica, sans-serif" font-size="72" font-weight="800" fill="#ffffff">TechZone</text>
  <text x="80" y="380" font-family="Arial, Helvetica, sans-serif" font-size="44" font-weight="600" fill="#ffffff" opacity="0.9">Phụ kiện điện thoại chính hãng</text>
  <text x="80" y="450" font-family="Arial, Helvetica, sans-serif" font-size="28" font-weight="500" fill="#ffffff" opacity="0.75">Sạc · Cáp · Ốp · Tai nghe · Sạc dự phòng</text>
</svg>`;
  await sharp(Buffer.from(ogSvg))
    .jpeg({ quality: 86, progressive: true, mozjpeg: true })
    .toFile(og);

  console.log(`🖼️  Đã tạo ${count} ảnh cover blog + og-default.jpg`);
}

main().catch((e) => {
  console.error("❌ Lỗi:", e);
  process.exit(1);
});
