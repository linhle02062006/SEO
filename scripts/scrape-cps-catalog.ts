/**
 * Thu thập danh sách sản phẩm phụ kiện từ cellphones.com.vn (SSR HTML).
 * Bước 1: quét các trang danh mục, lưu ra _tmp/cps-catalog.json
 * Chạy: npx tsx scripts/scrape-cps-catalog.ts
 */
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

/** Các trang danh mục phụ kiện trên CellphoneS, map sang nhóm của TechZone */
const CATEGORY_PAGES: { group: string; url: string }[] = [
  { group: "op-lung", url: "https://cellphones.com.vn/phu-kien/bao-da-op-lung.html" },
  { group: "op-lung", url: "https://cellphones.com.vn/phu-kien/bao-da-op-lung/day-deo-dien-thoai.html" },
  { group: "cap-sac", url: "https://cellphones.com.vn/phu-kien/sac-dien-thoai.html" },
  { group: "cap-sac", url: "https://cellphones.com.vn/phu-kien/sac-dien-thoai/cap-chuyen-doi-dau-chuyen-doi-macbook.html" },
  { group: "cu-sac", url: "https://cellphones.com.vn/phu-kien/sac-dien-thoai.html" },
  { group: "tai-nghe", url: "https://cellphones.com.vn/thiet-bi-am-thanh/tai-nghe.html" },
  { group: "tai-nghe", url: "https://cellphones.com.vn/thiet-bi-am-thanh/tai-nghe/tai-nghe-bluetooth.html" },
  { group: "tai-nghe", url: "https://cellphones.com.vn/thiet-bi-am-thanh/tai-nghe/sony.html" },
  { group: "sac-du-phong", url: "https://cellphones.com.vn/phu-kien/pin-du-phong.html" },
  { group: "kinh-cuong-luc", url: "https://cellphones.com.vn/phu-kien/dan-man-hinh/iphone.html" },
  { group: "kinh-cuong-luc", url: "https://cellphones.com.vn/phu-kien/dan-man-hinh/samsung.html" },
  { group: "kinh-cuong-luc", url: "https://cellphones.com.vn/phu-kien/dan-man-hinh/xiaomi.html" },
  { group: "kinh-cuong-luc", url: "https://cellphones.com.vn/phu-kien/dan-man-hinh/laptop.html" },
  { group: "gia-do-dien-thoai", url: "https://cellphones.com.vn/phu-kien/decor-setup.html" },
  { group: "gia-do-dien-thoai", url: "https://cellphones.com.vn/phu-kien/phu-kien-tien-ich.html" },
  { group: "gia-do-dien-thoai", url: "https://cellphones.com.vn/phu-kien/den-pin.html" },
  { group: "phu-kien-laptop", url: "https://cellphones.com.vn/phu-kien/chuot-ban-phim-may-tinh.html" },
  { group: "phu-kien-laptop", url: "https://cellphones.com.vn/phu-kien/may-tinh-laptop.html" },
  { group: "phu-kien-laptop", url: "https://cellphones.com.vn/phu-kien/balo-tui-chong-soc-laptop.html" },
  { group: "phu-kien-gaming", url: "https://cellphones.com.vn/phu-kien/gaming-gear.html" },
  { group: "phu-kien-gaming", url: "https://cellphones.com.vn/phu-kien/dien-thoai.html" },
  // Nguồn bổ sung cho các mục khó
  { group: "op-lung", url: "https://cellphones.com.vn/phu-kien/apple.html" },
  { group: "op-lung", url: "https://cellphones.com.vn/phu-kien/bao-da-op-lung/iphone.html" },
  { group: "op-lung", url: "https://cellphones.com.vn/phu-kien/bao-da-op-lung/samsung.html" },
  { group: "op-lung", url: "https://cellphones.com.vn/phu-kien/bao-da-op-lung/xiaomi.html" },
  { group: "op-lung", url: "https://cellphones.com.vn/phu-kien/bao-da-op-lung/oppo.html" },
  { group: "loa-bluetooth", url: "https://cellphones.com.vn/thiet-bi-am-thanh/loa/loa-bluetooth.html" },
  { group: "loa-bluetooth", url: "https://cellphones.com.vn/thiet-bi-am-thanh/loa.html" },
  { group: "tai-nghe", url: "https://cellphones.com.vn/thiet-bi-am-thanh/dau-nghe-nhac.html" },
];

export type CpsProduct = {
  name: string;
  url: string;
  image: string;
  groups: string[];
};

function decodeEntities(s: string) {
  return s
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ");
}

async function fetchHtml(url: string): Promise<string> {
  const res = await fetch(url, {
    headers: {
      "User-Agent": UA,
      Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      "Accept-Language": "vi-VN,vi;q=0.9",
    },
  });
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  return await res.text();
}

/** Trích danh sách sản phẩm từ block <div class="product-info-container"> */
export function parseProducts(html: string, group: string): CpsProduct[] {
  const out: CpsProduct[] = [];
  const seen = new Set<string>();

  // Mỗi sản phẩm: <a ... href="URL" class="product__link ..."> ... <img src="IMG" ... alt="NAME" ...
  const re =
    /<a[^>]*href="(https:\/\/cellphones\.com\.vn\/[a-z0-9\-]+\.html)"[^>]*class="product__link[^"]*"[\s\S]*?<img[^>]*src="([^"]+)"[^>]*alt="([^"]*)"/g;

  for (const m of html.matchAll(re)) {
    const url = m[1];
    const image = m[2];
    const name = decodeEntities(m[3]).trim();
    if (!name || seen.has(url)) continue;
    seen.add(url);
    out.push({ name, url, image, groups: [group] });
  }
  return out;
}

async function main() {
  const all = new Map<string, CpsProduct>();
  for (const { group, url } of CATEGORY_PAGES) {
    try {
      const html = await fetchHtml(url);
      const products = parseProducts(html, group);
      for (const p of products) {
        const existing = all.get(p.url);
        if (existing) {
          if (!existing.groups.includes(group)) existing.groups.push(group);
        } else {
          all.set(p.url, p);
        }
      }
      console.log(`✓ ${group} <- ${url} : ${products.length} sản phẩm`);
    } catch (err) {
      console.warn(`✗ ${url} : ${(err as Error).message}`);
    }
    await new Promise((r) => setTimeout(r, 400));
  }

  const list = [...all.values()];
  const outDir = path.join(process.cwd(), "_tmp");
  await mkdir(outDir, { recursive: true });
  await writeFile(
    path.join(outDir, "cps-catalog.json"),
    JSON.stringify(list, null, 2),
    "utf8",
  );
  console.log(`\nTổng: ${list.length} sản phẩm unique -> _tmp/cps-catalog.json`);
}

if (process.argv[1]?.endsWith("scrape-cps-catalog.ts")) {
  main().catch((e) => {
    console.error(e);
    process.exit(1);
  });
}
