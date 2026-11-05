import fs from "node:fs";
import path from "node:path";

const BASE = "http://localhost:3000";

const decodeEntities = (s) =>
  s.replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">");

const pages = [];
function walk(dir, base = "") {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, base);
    else if (e.name === "page.tsx") {
      const seg = base.replace(/^\/|\/$/g, "");
      if (!seg.includes("[")) pages.push("/" + seg);
    }
  }
}
walk(path.join(process.cwd(), "app"));

const sm = await fetch(BASE + "/sitemap.xml").then((r) => r.text());
const sitemapUrls = [...sm.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].replace(BASE, ""));

const targets = [...new Set([...pages, ...sitemapUrls])];
console.log(`Scanning ${targets.length} pages for internal links...`);

const linkMap = new Map();
for (const t of targets) {
  const html = await fetch(BASE + t).then((r) => r.text());
  const links = new Set();
  for (const m of html.matchAll(/href="(\/[^"#?]*)/g)) links.add(m[1]);
  for (const m of html.matchAll(/src="(\/_next\/image\?url=[^"]+)/g)) links.add(decodeEntities(m[1]));
  linkMap.set(t, [...links]);
}

// check all discovered internal links
const allLinks = new Set();
for (const list of linkMap.values()) for (const l of list) allLinks.add(l);
console.log(`Found ${allLinks.size} unique internal links/asset refs.`);

const results = [];
const CONC = 15;
const list = [...allLinks];
for (let i = 0; i < list.length; i += CONC) {
  const chunk = list.slice(i, i + CONC);
  results.push(
    ...(await Promise.all(
      chunk.map(async (l) => {
        try {
          const res = await fetch(BASE + l, { redirect: "manual" });
          return { l, status: res.status, ok: res.status >= 200 && res.status < 400 };
        } catch (e) {
          return { l, status: "ERR", ok: false };
        }
      }),
    )),
  );
}

const bad = results.filter((r) => !r.ok);
console.log(`Broken internal links: ${bad.length}`);
for (const b of bad.slice(0, 40)) console.log(`  ${b.status} ${b.l}`);

// Check for empty/missing alt or img with empty src
console.log("\n--- Image sanity ---");
let totalImgs = 0, noAlt = 0;
for (const t of targets) {
  const html = await fetch(BASE + t).then((r) => r.text());
  for (const m of html.matchAll(/<img\b[^>]*>/g)) {
    totalImgs++;
    if (!/\salt=/.test(m[0])) noAlt++;
  }
}
console.log(`<img> tags: ${totalImgs}, without alt: ${noAlt}`);
process.exit(bad.length ? 1 : 0);
