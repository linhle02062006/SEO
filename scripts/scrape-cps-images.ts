/**
 * Ánh xạ 38 sản phẩm TechZone sang sản phẩm tương ứng trên CellphoneS.
 * Bước 2: chọn ảnh đại diện + gallery cho từng sản phẩm.
 * Chạy: npx tsx scripts/scrape-cps-images.ts
 */
import { mkdir, writeFile, readFile, access, copyFile } from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";
import sharp from "sharp";

const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

const ROOT = process.cwd();
const OUT_DIR = path.join(ROOT, "public", "products");

type CpsProduct = {
  name: string;
  url: string;
  image: string;
  groups: string[];
};

/**
 * Quy tắc chọn ảnh cho từng slug của TechZone.
 * Mỗi rule là danh sách từ khóa, khớp theo thứ tự ưu tiên (sẽ thử lần lượt).
 */
const IMAGE_RULES: Record<string, string[][]> = {
  // ---------- ỐP LƯNG ----------
  "op-lung-iphone-15-plus-mipow-soft-trong-suat": [
    ["iphone 15", "mipow", "soft"],
    ["iphone 15", "op lung"],
    ["iphone 15"],
  ],
  "op-lung-silicon-samsung-galaxy-s25-plus": [
    ["silicon samsung galaxy s25 plus"],
    ["op lung samsung galaxy", "silicon"],
    ["op lung samsung galaxy s26 ultra"],
  ],
  "op-lung-araree-core-nukin-iphone-13-pro": [
    ["iphone 13 pro", "nukin"],
    ["iphone 13 pro"],
  ],
  "op-lung-silicon-samsung-galaxy-a35": [
    ["op lung samsung galaxy a35"],
    ["op lung samsung galaxy"],
  ],

  // ---------- CÁP SẠC ----------
  "cap-baseus-dura-usb-c-to-lightning-20w-1m": [
    ["cap", "20w", "usb-c to lightning"],
    ["cap", "20w"],
    ["cap", "usb-c to type-c", "mophie"],
  ],
  "cap-mophie-usb-c-to-usb-c-100w-3m": [
    ["cap", "100w", "mophie"],
    ["cap", "240w", "apple"],
    ["cap", "usb-c to type-c", "anker"],
    ["cap", "usb-c to type-c"],
  ],
  "cap-baseus-crystal-shine-usb-c-lightning-1-2m": [
    ["usb-c to lightning", "baseus", "crystal"],
    ["usb-c to lightning", "baseus"],
    ["usb-c to lightning"],
  ],
  "cap-baseus-bright-mirror-2-retractable-3-in-1": [
    ["3 in 1", "baseus", "bright mirror"],
    ["3 in 1", "baseus"],
    ["3 in 1"],
  ],

  // ---------- CỦ SẠC ----------
  "cu-sac-anker-20w-1c1a-kem-cap-type-c": [
    ["sac anker", "20w", "b2348"],
    ["sac anker nano", "20w"],
    ["cu sac", "20w", "anker"],
    ["cu sac", "20w"],
  ],
  "cu-sac-ugreen-robot-uno-gan-65w-2c1a": [
    ["sac", "65w", "ugreen", "robot"],
    ["sac", "45w", "anker", "nano", "led"],
    ["sac", "45w", "samsung"],
    ["cu sac", "65w"],
  ],
  "cu-sac-khong-day-aukey-magfusion-qi2-25w": [
    ["de sac khong day", "magsafe", "qi2", "25w"],
    ["de sac khong day", "aukey", "magfusion"],
    ["sac khong day", "magsafe"],
    ["de sac khong day"],
  ],
  "cu-sac-samsung-25w-ep-t2510nbegww": [
    ["sac nhanh samsung", "25w"],
    ["sac samsung", "45w", "ep-t4511x"],
    ["sac nhanh samsung"],
  ],

  // ---------- TAI NGHE ----------
  "tai-nghe-bluetooth-havit-tw972": [
    ["tai nghe bluetooth true wireless", "havit"],
    ["tai nghe bluetooth", "waterproof", "chay the thao"],
    ["tai nghe bluetooth", "sony", "wf-c710n"],
    ["tai nghe bluetooth", "true wireless"],
  ],
  "tai-nghe-chup-tai-gaming-sony-inzone-h3": [
    ["tai nghe chup tai gaming", "sony", "inzone h3"],
    ["tai nghe chup tai gaming"],
    ["tai nghe gaming"],
  ],
  "tai-nghe-bluetooth-the-thao-anker-soundcore-c50i": [
    ["tai nghe bluetooth the thao", "sony", "clip"],
    ["tai nghe bluetooth thể thao"],
    ["tai nghe bluetooth", "sport"],
  ],
  "tai-nghe-tws-gaming-rog-cetra": [
    ["tai nghe bluetooth true wireless gaming", "rog", "cetra"],
    ["tai nghe", "gaming", "cetra"],
    ["tai nghe gaming"],
  ],

  // ---------- SẠC DỰ PHÒNG ----------
  "pin-sac-du-phong-xiaomi-10000mah-22-5w": [
    ["10000mah", "22.5w", "xiaomi"],
    ["10000mah", "22.5w"],
    ["10000mah", "cuktech", "10 mini"],
  ],
  "pin-sac-du-phong-ugreen-qi2-10000mah-30w": [
    ["10000mah", "khong day", "ugreen", "pb761"],
    ["10000mah", "khong day", "magnetic"],
    ["10000mah", "qi2"],
  ],
  "pin-sac-du-phong-cuktech-cp24-20000mah-40w": [
    ["20000mah", "anker"],
    ["20000mah", "cuktech", "cp24"],
    ["20000mah", "baseus"],
    ["20000mah"],
  ],
  "pin-sac-du-phong-baseus-enercore-cr11-20000mah-67w": [
    ["20000mah", "67w", "baseus"],
    ["20000mah", "40w"],
    ["20000mah", "type-c"],
  ],

  // ---------- KÍNH CƯỜNG LỰC ----------
  "dan-kinh-cuong-luc-mipow-full-vien-iphone-17-18-pro-max": [
    ["iphone 15", "mipow", "full"],
    ["iphone 18 pro", "17 pro", "mipow", "full"],
    ["kinh cuong luc", "iphone"],
  ],
  "dan-kinh-cuong-luc-zagg-plus-edge-galaxy-s25-ultra": [
    ["galaxy s24", "mipow"],
    ["galaxy s25 ultra", "zagg"],
    ["galaxy s25 ultra", "zeelot"],
  ],
  "dan-bao-ve-camera-zeelot-vien-iphone-18-pro": [
    ["dan bao ve camera", "zeelot"],
    ["dan bao ve camera", "apple", "iphone"],
    ["dan bao ve camera"],
  ],
  "dan-kinh-chong-nhin-trom-zagg-invisibleshield-xtr": [
    ["chong nhin trom", "invisibleshield"],
    ["invisibleshield", "xtr"],
    ["khong vien", "iphone"],
  ],

  // ---------- GIÁ ĐỠ ----------
  "gia-do-dien-thoai-goojodoq-bd3059": [
    ["gia do ipad", "goojodoq", "bd3059"],
    ["gia do ipad", "goojodoq", "bd3052"],
    ["gia do ipad"],
  ],
  "gia-do-dien-thoai-o-to-wiwu-magnetic-ch056": [
    ["de gia kem sac khong day", "baseus", "magpro"],
    ["gia do dien thoai tren o to", "wiwu", "magnetic"],
    ["gia do dien thoai tren o to"],
  ],  "tripod-dien-thoai-goojodoq-bd3025": [
    ["tripod", "goojodoq", "bd3025"],
    ["tripod", "wiwu", "se001"],
    ["tripod", "ulanzi", "mt-44b"],
  ],
  "gia-do-ipad-dien-thoai-goojodoq-bd3099": [
    ["gia do ipad", "goojodoq", "bd3099"],
    ["gia do ipad", "goojodoq", "bd3052"],
    ["gia do ipad"],
  ],

  // ---------- PHỤ KIỆN LAPTOP ----------
  "hub-anker-7-trong-1-usb-c-a83d2": [
    ["7 trong 1", "anker", "a83d2"],
    ["7 trong 1", "belkin"],
    ["hub", "7 trong 1"],
  ],
  "tui-chong-soc-laptop-s-case-classic-15-6-inch": [
    ["tui chong soc", "15.6", "s-case"],
    ["balo laptop", "15.6", "kmore"],
    ["balo laptop", "15.6"],
    ["tui chong soc"],
  ],
  "chuot-khong-day-logitech-m331": [
    ["chuot khong day", "logitech", "m331"],
    ["chuot khong day", "logitech", "signature m650"],
    ["chuot khong day", "rapoo", "m330"],
    ["chuot khong day", "silent"],
  ],
  "ban-phim-co-khong-day-mchose-g75-pro-tri-mode": [
    ["ban phim khong day", "logitech", "silentkey"],
    ["ban phim co khong day", "mchose", "g75"],
    ["ban phim", "khong day", "bluetooth", "logitech"],
  ],

  // ---------- PHỤ KIỆN GAMING ----------
  "chuot-gaming-khong-day-mchose-g3-v2-tri-mode": [
    ["chuot gaming khong day", "mchose", "g3 v2"],
    ["chuot gaming khong day", "logitech", "g402"],
    ["chuot gaming khong day"],
  ],
  "chuot-gaming-co-day-asus-tuf-m3-gen-2": [
    ["chuot gaming co day", "dareu", "lm115g"],
    ["chuot gaming co day", "ed-ra", "tm621w"],
    ["chuot gaming co day"],
  ],
  "tay-cam-choi-game-dareu-h101x": [
    ["tay cam choi game", "dareu", "h101x"],
    ["tay cam choi game", "dareu", "h102"],
    ["tay cam choi game"],
  ],
  "den-ban-led-hyperwork-nova-dl02": [
    ["den ban led", "hyperwork", "nova"],
    ["den ban led", "hyperwork", "luna"],
    ["den ban led"],
  ],
  "tay-cam-choi-game-dareu-h102": [
    ["tay cam choi game", "dareu", "h102"],
    ["tay cam choi game"],
  ],
  "loa-bluetooth-sony-srs-xb100-extra-bass": [
    ["loa bluetooth", "sony", "srs-xb100"],
    ["loa bluetooth", "jbl", "flip 6"],
    ["loa bluetooth", "bose", "soundlink flex"],
    ["loa bluetooth"],
  ],
};

/** Chuẩn hóa chuỗi để so khớp không phân biệt dấu tiếng Việt */
function normalize(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

async function fetchHtml(url: string): Promise<string> {
  const res = await fetch(url, {
    headers: { "User-Agent": UA, Accept: "text/html" },
  });
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  return await res.text();
}

/** Chuyển URL ảnh CDN về dạng media path gốc để tải bản lớn nhất */
function toMediaPath(imageUrl: string): string {
  // https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/x/y/file.png
  const m = imageUrl.match(/https:\/\/cellphones\.com\.vn\/(media\/catalog\/product\/[^"?]+)/);
  if (m) return m[1];
  const m2 = imageUrl.match(/media\/catalog\/product\/[^"?]+/);
  return m2 ? m2[0] : "";
}

/** Trích toàn bộ ảnh trong trang chi tiết sản phẩm (gallery) */
function parseGallery(html: string): string[] {
  const set = new Set<string>();
  const re = /media\/catalog\/product\/[^"'\\ )]+/g;
  for (const m of html.matchAll(re)) {
    const p = m[0].replace(/&amp;/g, "");
    // Bỏ ảnh nhỏ dùng cho icon/avatar
    if (/\/(favicon|logo)/i.test(p)) continue;
    set.add(p);
  }
  // Ưu tiên ảnh có hậu tố _2_ trở đi (ảnh phụ), sau đó mới đến ảnh gốc
  return [...set].sort((a, b) => {
    const rank = (s: string) => {
      const m = s.match(/_(\d+)__?/);
      if (!m) return 99;
      const n = parseInt(m[1], 10);
      return n <= 1 ? 99 : n;
    };
    return rank(a) - rank(b);
  });
}

async function download(url: string): Promise<Buffer> {
  const res = await fetch(url, { headers: { "User-Agent": UA } });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return Buffer.from(await res.arrayBuffer());
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
  const catalogRaw = await readFile(
    path.join(ROOT, "_tmp", "cps-catalog.json"),
    "utf8",
  );
  const catalog = JSON.parse(catalogRaw) as CpsProduct[];
  const byNorm = catalog.map((p) => ({ ...p, norm: normalize(p.name) }));

  const mapping: Record<string, { name: string; url: string; image: string }> = {};
  const unmatched: string[] = [];

  for (const [slug, rules] of Object.entries(IMAGE_RULES)) {
    let found: (typeof byNorm)[number] | undefined;
    for (const rule of rules) {
      found = byNorm.find((p) => rule.every((kw) => p.norm.includes(normalize(kw))));
      if (found) break;
    }
    if (found) {
      mapping[slug] = { name: found.name, url: found.url, image: found.image };
    } else {
      unmatched.push(slug);
    }
  }

  console.log(`Khớp được: ${Object.keys(mapping).length}/${Object.keys(IMAGE_RULES).length}`);
  if (unmatched.length) {
    console.log("KHÔNG KHỚP:");
    for (const s of unmatched) console.log("  - " + s);
  }

  await mkdir(OUT_DIR, { recursive: true });
  const results: Record<string, { primary: string; gallery: string[]; source: string }> = {};

  for (const [slug, info] of Object.entries(mapping)) {
    const mediaPath = toMediaPath(info.image);
    if (!mediaPath) {
      console.warn(`✗ ${slug}: không lấy được media path`);
      continue;
    }
    try {
      const primaryFile = path.join(OUT_DIR, `${slug}.jpg`);
      const secondFile = path.join(OUT_DIR, `${slug}-2.jpg`);
      const force = process.argv.includes("--force");
      const havePrimary = await exists(primaryFile);
      const haveSecond = await exists(secondFile);

      // Ảnh chính: tải bản gốc, resize về 1000px vuông, nền trắng
      if (force || !havePrimary) {
        const primaryUrl = `https://cellphones.com.vn/${mediaPath}`;
        const buf = await download(primaryUrl);
        await sharp(buf)
          .resize(1000, 1000, { fit: "contain", background: { r: 255, g: 255, b: 255 } })
          .jpeg({ quality: 86, progressive: true, mozjpeg: true })
          .toFile(primaryFile);
      }

      // Ảnh thứ 2: lấy từ gallery trang chi tiết
      let galleryFiles: string[] = [];
      try {
        if (force || !haveSecond) {
          const html = await fetchHtml(info.url);
          const gallery = parseGallery(html).filter((g) => g !== mediaPath);
          const primaryHash = crypto
            .createHash("md5")
            .update(await readFile(primaryFile))
            .digest("hex");
          let saved = false;
          for (const cand of gallery.slice(0, 5)) {
            try {
              const gBuf = await download(`https://cellphones.com.vn/${cand}`);
              if (
                crypto.createHash("md5").update(gBuf).digest("hex") === primaryHash
              ) {
                continue;
              }
              await sharp(gBuf)
                .resize(1000, 1000, { fit: "contain", background: { r: 255, g: 255, b: 255 } })
                .jpeg({ quality: 86, progressive: true, mozjpeg: true })
                .toFile(secondFile);
              saved = true;
              break;
            } catch {
              continue;
            }
          }
          if (!saved) {
            await copyFile(primaryFile, secondFile);
          }
        }
        if (await exists(secondFile)) galleryFiles = [secondFile];      } catch (e) {
        console.warn(`  ! ${slug}: không lấy được ảnh gallery (${(e as Error).message})`);
      }

      results[slug] = {
        primary: primaryFile,
        gallery: galleryFiles,
        source: info.url,
      };
      console.log(`✓ ${slug} <- ${info.name}`);
      await new Promise((r) => setTimeout(r, 250));
    } catch (e) {
      console.warn(`✗ ${slug}: ${(e as Error).message}`);
    }
  }

  await writeFile(
    path.join(ROOT, "_tmp", "cps-image-mapping.json"),
    JSON.stringify(results, null, 2),
    "utf8",
  );
  console.log(`\nHoàn tất: ${Object.keys(results).length} sản phẩm có ảnh thật.`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
