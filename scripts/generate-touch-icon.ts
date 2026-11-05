/**
 * Sinh apple-touch-icon.png (180x180) từ public/logo.svg.
 * Chạy: npx tsx scripts/generate-touch-icon.ts
 */
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const ROOT = process.cwd();

async function main() {
  const svg = await readFile(path.join(ROOT, "public", "logo.svg"));
  const out = path.join(ROOT, "public", "apple-touch-icon.png");
  await sharp(svg, { density: 600 })
    .resize(180, 180, { fit: "contain", background: { r: 255, g: 255, b: 255, alpha: 0 } })
    .png({ compressionLevel: 9 })
    .toFile(out);

  // Icon lớn cho manifest
  const icon192 = path.join(ROOT, "public", "icon-192.png");
  const icon512 = path.join(ROOT, "public", "icon-512.png");
  await sharp(svg, { density: 600 })
    .resize(192, 192, { fit: "contain" })
    .png({ compressionLevel: 9 })
    .toFile(icon192);
  await sharp(svg, { density: 600 })
    .resize(512, 512, { fit: "contain" })
    .png({ compressionLevel: 9 })
    .toFile(icon512);

  console.log("✅ Đã tạo apple-touch-icon.png, icon-192.png, icon-512.png");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
