/**
 * Bước 3: lấy giá + thông số kỹ thuật thật từ trang chi tiết sản phẩm CellphoneS.
 * Input : _tmp/cps-image-mapping.json (slug -> { source: url })
 * Output: _tmp/cps-specs.json
 * Chạy : npx tsx scripts/scrape-cps-specs.ts
 */
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

const ROOT = process.cwd();

type Mapping = Record<string, { source: string }>;

function decode(s: string) {
  return s
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ");
}

function stripTags(s: string) {
  return decode(s.replace(/<[^>]*>/g, " ")).replace(/\s+/g, " ").trim();
}

async function fetchHtml(url: string): Promise<string> {
  const res = await fetch(url, {
    headers: {
      "User-Agent": UA,
      Accept: "text/html,application/xhtml+xml",
      "Accept-Language": "vi,en;q=0.8",
    },
  });
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  return await res.text();
}

/** Bảng thông số: <tr><td>Tên</td><td>Giá trị</td></tr> */
function parseSpecRows(html: string): { label: string; value: string }[] {
  const rows: { label: string; value: string }[] = [];
  const seen = new Set<string>();
  const trRe = /<tr[^>]*>([\s\S]*?)<\/tr>/gi;
  for (const m of html.matchAll(trRe)) {
    const cells = [...m[1].matchAll(/<(td|th)[^>]*>([\s\S]*?)<\/\1>/gi)].map(
      (c) => stripTags(c[2]),
    );
    if (cells.length < 2) continue;
    const label = cells[0];
    const value = cells.slice(1).join(" - ");
    if (!label || !value) continue;
    if (label.length > 60 || value.length > 300) continue;
    const key = label.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    rows.push({ label, value });
  }
  return rows;
}

/** Lấy giá hiện tại + giá gốc từ block giá bán của CellphoneS */
function parsePrices(html: string): { sale: number | null; base: number | null } {
  const toNum = (raw?: string | null) => {
    if (!raw) return null;
    const digits = raw.replace(/[^\d]/g, "");
    const n = parseInt(digits, 10);
    return n > 1000 ? n : null;
  };
  const saleM = html.match(/class="sale-price"[^>]*>\s*([\d.,]+)/);
  const baseM =
    html.match(/class="base-price"[^>]*>\s*([\d.,]+)/) ??
    html.match(/<del[^>]*>\s*([\d.,]+)/);
  return { sale: toNum(saleM?.[1]), base: toNum(baseM?.[1]) };
}

function parseTitle(html: string): string {
  const m =
    html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i) ??
    html.match(/<title>([\s\S]*?)<\/title>/i);
  return m ? stripTags(m[1]) : "";
}

/** Tên thương hiệu đoán từ tiêu đề (phần trước mã model) */
function guessBrand(title: string): string {
  const known = [
    "Apple",
    "Samsung",
    "Xiaomi",
    "Anker",
    "Baseus",
    "Ugreen",
    "Logitech",
    "Mophie",
    "Aukey",
    "Havit",
    "Sony",
    "Asus",
    "ROG",
    "Cuktech",
    "Zagg",
    "Zeelot",
    "Goojodoq",
    "GOOJODOQ",
    "Wiwu",
    "S-case",
    "Mchose",
    "Dareu",
    "Hyperwork",
    "Mipow",
    "Araree",
    "Belkin",
    "JBL",
    "Bose",
    "Spigen",
    "Nuki",
    "Araree",
  ];
  for (const b of known) {
    if (title.toLowerCase().includes(b.toLowerCase())) return b;
  }
  return "";
}

async function main() {
  const map = JSON.parse(
    await readFile(path.join(ROOT, "_tmp", "cps-image-mapping.json"), "utf8"),
  ) as Mapping;

  const out: Record<
    string,
    {
      title: string;
      url: string;
      brand: string;
      salePrice: number | null;
      basePrice: number | null;
      specs: { label: string; value: string }[];
    }
  > = {};

  for (const [slug, info] of Object.entries(map)) {
    try {
      const html = await fetchHtml(info.source);
      const title = parseTitle(html);
      const specs = parseSpecRows(html);
      const prices = parsePrices(html);
      out[slug] = {
        title,
        url: info.source,
        brand: guessBrand(title),
        salePrice: prices.sale,
        basePrice: prices.base,
        specs: specs.slice(0, 12),
      };
      console.log(
        `✓ ${slug} :: ${title} :: ${prices.sale ?? "?"}/${prices.base ?? "?"}`,
      );
    } catch (e) {
      console.warn(`✗ ${slug}: ${(e as Error).message}`);
    }
    await new Promise((r) => setTimeout(r, 300));
  }

  await writeFile(
    path.join(ROOT, "_tmp", "cps-specs.json"),
    JSON.stringify(out, null, 2),
    "utf8",
  );
  console.log(`\nĐã lưu ${Object.keys(out).length} sản phẩm có thông số.`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
