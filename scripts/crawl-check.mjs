import fs from "node:fs";
import path from "node:path";

const BASE = "http://localhost:3000";

async function check(url) {
  try {
    const res = await fetch(BASE + url, { redirect: "manual" });
    return { url, status: res.status, ok: res.status === 200 || res.status === 307 || res.status === 308 };
  } catch (e) {
    return { url, status: "ERR " + e.message, ok: false };
  }
}

// 1. Collect routes
const routes = new Set([
  "/", "/san-pham", "/gio-hang", "/dat-hang", "/lien-he", "/gioi-thieu",
  "/huong-dan-mua-hang", "/chinh-sach", "/blog", "/danh-muc", "/thuong-hieu",
  "/tim-kiem?q=sac", "/robots.txt", "/sitemap.xml", "/manifest.webmanifest",
]);

function walk(dir, base = "") {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, base);
    else if (e.name === "page.tsx") {
      const seg = base.replace(/^\/|\/$/g, "");
      if (seg.includes("[")) continue;
      routes.add("/" + seg);
    }
  }
}
walk(path.join(process.cwd(), "app"));

// add dynamic routes from sitemap
const sm = await fetch(BASE + "/sitemap.xml").then((r) => r.text());
for (const m of sm.matchAll(/<loc>([^<]+)<\/loc>/g)) {
  const u = m[1].replace(BASE, "");
  routes.add(u);
}

// 2. Collect images
const images = [];
for (const dir of ["public/products", "public/categories", "public/blog"]) {
  if (!fs.existsSync(dir)) continue;
  for (const f of fs.readdirSync(dir)) {
    if (/\.(jpg|jpeg|png|webp|svg|avif)$/i.test(f)) images.push("/" + dir.replace(/\\/g, "/").replace("public/", "") + "/" + f);
  }
}
for (const f of fs.readdirSync("public")) {
  if (/\.(jpg|jpeg|png|webp|svg|avif|ico)$/i.test(f)) images.push("/" + f);
}

const all = [...[...routes].map((r) => ({ url: r, kind: "route" })), ...images.map((i) => ({ url: i, kind: "img" }))];

const results = [];
const CONC = 12;
for (let i = 0; i < all.length; i += CONC) {
  const chunk = all.slice(i, i + CONC);
  results.push(...(await Promise.all(chunk.map((a) => check(a.url).then((r) => ({ ...r, kind: a.kind }))))));
}

const bad = results.filter((r) => !r.ok);
console.log(`Checked ${results.length} URLs (${routes.size} routes, ${images.length} images)`);
console.log(`Failures: ${bad.length}`);
for (const b of bad) console.log(`  ${b.status} ${b.kind} ${b.url}`);

const missing = [];
for (const img of images) {
  if (!fs.existsSync(path.join("public", img.replace(/^\//, "")))) missing.push(img);
}
console.log(`Missing on disk: ${missing.length}`, missing.slice(0, 10).join(", "));
process.exit(bad.length ? 1 : 0);
