import { drizzle as drizzlePg } from "drizzle-orm/node-postgres";
import { drizzle as drizzlePglite } from "drizzle-orm/pglite";
import { PGlite } from "@electric-sql/pglite";import * as schema from "./schema";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import type { PgliteDatabase } from "drizzle-orm/pglite";

export type Database = NodePgDatabase<typeof schema> | PgliteDatabase<typeof schema>;

type GlobalCache = {
  db?: Database;
  pglite?: PGlite;
  pgClient?: unknown;
};

const globalForDb = globalThis as unknown as GlobalCache;

/**
 * Chọn driver:
 * - DATABASE_URL có "postgres://" hoặc "postgresql://"  -> dùng node-postgres (Supabase/Vercel/Neon)
 * - DATABASE_URL rỗng hoặc không set                        -> dùng PGlite (file DB local, không cần cài server)
 *
 * Type guard: hẹp kiểu `string | undefined` thành `string` khi là Postgres URL.
 */
function isPostgresUrl(url?: string): url is string {
  if (!url) return false;
  return /^postgres(ql)?:\/\//i.test(url.trim());
}

/**
 * SSL cho PostgreSQL thật (Supabase / Neon / RDS).
 *
 * VÌ SAO PHẢI TỰ QUẢN LÝ:
 * `pg` parse connection string rồi GHI ĐÈ `config.ssl` của ta:
 *   Object.assign({}, config, parse(connectionString))
 * - URL có `?sslmode=require`  -> ssl = {}  => rejectUnauthorized mặc định của
 *   Node TLS là `true` => verify CA hệ thống => FAIL với Supabase/Neon
 *   (self-signed hoặc CA riêng không nằm trong trust store của Node).
 * - URL không có sslmode       -> ssl = undefined => mất SSL hoàn toàn.
 *
 * Cách sửa chuẩn: bỏ `sslmode` khỏi connection string và tự truyền `ssl`.
 * Vì vậy hàm này trả về CẢ connection string đã chuẩn hoá lẫn cấu hình SSL.
 */
export function resolvePgConnection(url: string): {
  connectionString: string;
  ssl: { rejectUnauthorized: boolean } | false | undefined;
} {
  let connectionString = url.trim();

  // localhost / 127.0.0.1: không SSL (thường Postgres local chưa bật TLS)
  const isLocal = /localhost|127\.0\.0\.1|::1|\/docker\.sock/i.test(connectionString);

  // Người dùng chủ động tắt SSL -> tôn trọng, và bỏ param để pg không ghi đè.
  const sslDisabled = /[?&]sslmode=disable/i.test(connectionString);

  // Bỏ `sslmode` để `pg` KHÔNG ghi đè cấu hình ssl ta truyền vào.
  try {
    const parsed = new URL(connectionString);
    parsed.searchParams.delete("sslmode");
    connectionString = parsed.toString();
  } catch {
    // URL không parse được (vd. socket path) -> giữ nguyên.
  }

  if (sslDisabled) return { connectionString, ssl: false };
  if (isLocal) return { connectionString, ssl: undefined };

  // Managed Postgres: SSL có, nhưng không verify chuỗi CA (self-signed).
  return { connectionString, ssl: { rejectUnauthorized: false } };
}

/** Tạo Pool node-postgres với SSL đúng cách. */
async function createPgPool(url: string, max?: number) {
  const { Pool } = await import("pg");
  const { connectionString, ssl } = resolvePgConnection(url);
  return new Pool({
    connectionString,
    max: Number(max ?? process.env.DATABASE_POOL_MAX ?? 10),
    ssl,
  });
}

/**
 * PGlite là DB dạng file: một data dir chỉ được mở bởi MỘT process tại một thời điểm.
 * `next build` chạy song song main process + static worker => cả hai cùng mở ./.pglite sẽ
 * khiến PGlite abort với "RuntimeError: Aborted()".
 *
 * Cách xử lý: khi đang build (NEXT_PHASE = phase-production-build) và không có DATABASE_URL,
 * mỗi process dùng một bản copy riêng của data dir (`.pglite-build-<pid>`), được copy từ
 * `.pglite` gốc nếu chưa tồn tại. Nhờ vậy build luôn thành công mà vẫn prerender được
 * nội dung thật từ database local.
 *
 * Ở production thật (Vercel/Supabase) luôn dùng PostgreSQL nên nhánh này không bao giờ chạy.
 */
async function resolvePglitePath(): Promise<string> {
  const base = process.env.PGLITE_PATH ?? "./.pglite";

  if (process.env.NEXT_PHASE !== "phase-production-build") {
    return base;
  }

  const { existsSync, cpSync, rmSync, unlinkSync } = await import("node:fs");
  const path = await import("node:path");

  const buildDir = path.resolve(
    process.cwd(),
    `${base.replace(/[\\/]+$/, "")}-build-${process.pid}`,
  );
  const sourceDir = path.resolve(process.cwd(), base);

  if (!existsSync(buildDir)) {
    if (!existsSync(sourceDir)) return base;
    try {
      cpSync(sourceDir, buildDir, { recursive: true });
      // Bản copy có thể chứa file lock/pid cũ của process trước đã bị kill
      // đột ngột -> PGlite abort với "RuntimeError: Aborted()" khi mở.
      // Xoá chúng khỏi bản copy (KHÔNG xoá trong .pglite gốc).
      for (const f of ["postmaster.pid", ".s.PGSQL.5432.lock.out"]) {
        const p = path.join(buildDir, f);
        try {
          if (existsSync(p)) unlinkSync(p);
        } catch {
          /* ignore */
        }
      }
    } catch {
      return base;
    }
  }

  // Bản copy (hoặc thư mục build còn sót từ lần build trước) có thể chứa file
  // `.pglite.owner` trỏ tới PID của server dev đang chạy (vì copy nguyên thư mục
  // `.pglite`). Nếu giữ lại, `assertPgliteNotBusy` sẽ tưởng đang bị trùng lock
  // và build fail -> phải xoá file owner trong bản copy (data dir gốc không đụng).
  try {
    const ownerInCopy = path.join(buildDir, PGLITE_OWNER_FILE);
    if (existsSync(ownerInCopy)) unlinkSync(ownerInCopy);
  } catch {
    /* ignore */
  }

  // Dọn bản copy khi process kết thúc
  const cleanup = () => {
    try {
      rmSync(buildDir, { recursive: true, force: true });
    } catch {
      /* ignore */
    }
  };
  process.once("exit", cleanup);
  process.once("SIGINT", () => {
    cleanup();
    process.exit(130);
  });

  return buildDir;
}

async function createDb(): Promise<Database> {
  const url = process.env.DATABASE_URL?.trim();

  if (isPostgresUrl(url)) {
    const pool = await createPgPool(url);
    globalForDb.pgClient = pool;
    return drizzlePg(pool, { schema, casing: "snake_case" });
  }

  // Local: PGlite lưu trong thư mục .pglite
  const { PGlite: PGliteCtor } = await import("@electric-sql/pglite");
  const dir = await resolvePglitePath();
  assertPgliteNotBusy(dir);
  await clearStalePgliteLocks(dir);
  const client = await openPgliteWithRepair(PGliteCtor, dir);
  globalForDb.pglite = client;
  return drizzlePglite(client, { schema, casing: "snake_case" });
}

/* ------------------------------------------------------------------ */
/* Theo dõi tiến trình giữ PGlite local                                */
/* ------------------------------------------------------------------ */

/**
 * File ghi nhận tiến trình nào đang mở PGlite local.
 *
 * VÌ SAO CẦN:
 * PGlite là DB dạng file — chỉ MỘT tiến trình được mở data dir tại một thời điểm.
 * Nếu server đang chạy mà bạn lại chạy script (seed, kiểm tra...), script sẽ
 * nhận lỗi `Aborted()` — trông giống hỏng DB, nhưng thực ra chỉ là trùng lock.
 *
 * Nếu không phân biệt được, code "tự phục hồi" sẽ XOÁ data dir đang chạy ->
 * mất sạch dữ liệu. Vì vậy ta ghi lại PID chủ sở hữu vào file `.pglite.owner`
 * để kiểm tra chính xác.
 */
const PGLITE_OWNER_FILE = ".pglite.owner";

function ownerFilePath(dir: string): string {
  const path = require("node:path") as typeof import("node:path");
  return path.join(path.resolve(dir), PGLITE_OWNER_FILE);
}

/** Đọc PID chủ sở hữu PGlite local (null nếu không có hoặc không còn sống). */
function readPgliteOwnerPid(dir: string): number | null {
  const fs = require("node:fs") as typeof import("node:fs");
  try {
    const p = ownerFilePath(dir);
    if (!fs.existsSync(p)) return null;
    const pid = Number(fs.readFileSync(p, "utf8").trim());
    if (!Number.isFinite(pid) || pid <= 0) return null;
    if (isProcessAlive(pid)) return pid;
    // Tiến trình chủ sở hữu đã chết (server bị kill) -> dọn file owner để
    // lần mở sau không bị chặn nhầm.
    try {
      fs.unlinkSync(p);
    } catch {
      /* ignore */
    }
    return null;
  } catch {
    return null;
  }
}

/** Ghi nhận tiến trình này là chủ sở hữu PGlite local. */
function claimPgliteOwnership(dir: string): void {
  const fs = require("node:fs") as typeof import("node:fs");
  try {
    fs.writeFileSync(ownerFilePath(dir), String(process.pid), "utf8");
  } catch {
    /* ignore */
  }
  const release = () => {
    try {
      const p = ownerFilePath(dir);
      if (fs.existsSync(p) && fs.readFileSync(p, "utf8").trim() === String(process.pid)) {
        fs.unlinkSync(p);
      }
    } catch {
      /* ignore */
    }
  };
  process.once("exit", release);
}

/**
 * Chặn việc mở PGlite local khi tiến trình khác đang giữ data dir.
 *
 * Trả về lỗi rõ ràng thay vì để PGlite abort mơ hồ.
 */
function assertPgliteNotBusy(dir: string): void {
  const ownerPid = readPgliteOwnerPid(dir);
  if (ownerPid && ownerPid !== process.pid) {
    throw new Error(
      `PGlite local (${dir}) đang được tiến trình khác (PID ${ownerPid}) sử dụng. ` +
        "Hãy dừng server đang chạy trước khi chạy script trên cùng database.",
    );
  }
}

/**
 * Mở PGlite, tự phục hồi nếu data dir bị hỏng.
 *
 * VÌ SAO CẦN:
 * Nếu process bị kill đột ngột (Task Manager, hết bộ nhớ, Ctrl+C mạnh), WAL của
 * PostgreSQL có thể bị ghi dở -> lần mở sau PostgreSQL báo:
 *   PANIC: could not locate a valid checkpoint record  ->  RuntimeError: Aborted()
 * Data dir hỏng thì app sập hoàn toàn, dù code hoàn toàn đúng.
 *
 * CÁCH PHỤC HỒI:
 * 1. Thử mở bình thường.
 * 2. Nếu lỗi -> xoá data dir hỏng, tạo lại schema, seed lại dữ liệu từ
 *    `database/seed-data/*` (nguồn dữ liệu duy nhất, luôn có trong repo).
 *
 * LƯU Ý: chỉ áp dụng cho PGlite local. Production luôn dùng PostgreSQL thật
 * (Supabase/Neon) nên nhánh này không bao giờ chạy khi deploy.
 */
async function openPgliteWithRepair(
  Ctor: typeof PGlite,
  dir: string,
): Promise<PGlite> {
  try {
    const client = new Ctor(dir);
    await client.waitReady;
    await ensureLocalSchemaAndSeed(client);
    claimPgliteOwnership(dir);
    return client;
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    if (!isPgliteCorruptionError(msg)) throw err;

    // CHỈ phục hồi được khi KHÔNG có process nào khác đang dùng data dir.
    // Nếu server đang chạy và giữ DB, việc xoá data dir sẽ phá huỷ dữ liệu
    // của process đó -> phải báo lỗi rõ ràng thay vì tự sửa.
    const ownerPid = readPgliteOwnerPid(dir);
    if (ownerPid && ownerPid !== process.pid) {
      throw new Error(
        `PGlite local (${dir}) đang được tiến trình khác (PID ${ownerPid}) sử dụng. ` +
          "Hãy dừng server đang chạy trước khi mở PGlite từ script khác. " +
          `Chi tiết: ${msg.split("\n")[0]}`,
      );
    }

    console.warn(
      "[db] PGlite local bị hỏng (%s). Đang khôi phục lại từ dữ liệu seed...",
      msg.split("\n")[0],
    );

    const { rmSync, existsSync } = await import("node:fs");
    if (existsSync(dir)) rmSync(dir, { recursive: true, force: true });

    const client = new Ctor(dir);
    await client.waitReady;

    const { ENUM_SQL, SCHEMA_SQL } = await import("./schema-sql");
    await client.exec(ENUM_SQL);
    await client.exec(SCHEMA_SQL);

    await seedLocalDatabase(client);
    console.log("[db] ✅ Đã khôi phục PGlite local thành công.");
    return client;  }
}

/** Nhận diện lỗi hỏng WAL/data dir của PGlite (không phải lỗi logic app). */
function isPgliteCorruptionError(message: string): boolean {
  return (
    /Aborted\(\)/.test(message) ||
    /could not locate a valid checkpoint/i.test(message)
  );
}

/**
 * Đảm bảo PGlite local có schema + dữ liệu mẫu.
 *
 * - Data dir mới tạo (chưa có bảng nào) -> tạo schema + seed dữ liệu.
 * - Data dir đã có dữ liệu -> giữ nguyên, không ghi đè.
 *
 * Nhờ vậy `npm run dev` chạy được ngay trên máy mới clone repo, không cần
 * chạy `db:push`/`db:seed` thủ công.
 */
async function ensureLocalSchemaAndSeed(client: {
  exec: (sql: string) => Promise<unknown>;
  query: (sql: string) => Promise<{ rows: Record<string, unknown>[] }>;
}): Promise<void> {
  const { ENUM_SQL, SCHEMA_SQL } = await import("./schema-sql");

  // Bảng `products` đã tồn tại => data dir dùng được, không cần can thiệp.
  const probe = await client.query(
    "SELECT count(*)::int AS c FROM information_schema.tables WHERE table_name = 'products'",
  );
  if (Number(probe.rows?.[0]?.c ?? 0) > 0) return;

  console.log("[db] Phát hiện database local trống — đang tạo schema và seed dữ liệu mẫu...");
  await client.exec(ENUM_SQL);
  await client.exec(SCHEMA_SQL);
  await seedLocalDatabase(client);
  console.log("[db] ✅ Database local đã sẵn sàng.");
}

/** Seed lại dữ liệu cốt lõi (thương hiệu, danh mục, sản phẩm) khi phục hồi PGlite. */
async function seedLocalDatabase(client: {
  exec: (sql: string) => Promise<unknown>;
  query: (sql: string) => Promise<{ rows: Record<string, unknown>[] }>;
}): Promise<void> {
  const { SEED_BRANDS, SEED_CATEGORIES } = await import("./seed-data/catalog");
  const { SEED_PRODUCTS } = await import("./seed-data/products");

  const q = (v: unknown) => `'${String(v).replace(/'/g, "''")}'`;

  for (const b of SEED_BRANDS) {
    await client.exec(
      `INSERT INTO brands (name, slug, description, is_featured, seo_title, seo_description)
       VALUES (${q(b.name)}, ${q(b.slug)}, ${q(b.description ?? "")}, ${b.isFeatured ?? false},
               ${q(`${b.name} - phụ kiện điện thoại chính hãng`)}, ${q((b.description ?? "").slice(0, 300))})
       ON CONFLICT (slug) DO NOTHING;`,
    );
  }

  for (const c of SEED_CATEGORIES) {
    await client.exec(
      `INSERT INTO categories (name, slug, description, image_url, icon, position, is_featured, seo_title, seo_description)
       VALUES (${q(c.name)}, ${q(c.slug)}, ${q(c.description ?? "")}, ${q(`/categories/${c.slug}.jpg`)}, ${q(c.icon ?? "")},
               ${c.position ?? 0}, ${c.isFeatured ?? false},
               ${q(`${c.name} chính hãng giá tốt`)}, ${q((c.description ?? "").slice(0, 300))})
       ON CONFLICT (slug) DO NOTHING;`,
    );
  }

  await client.exec(
    `CREATE TEMP TABLE seed_cat (slug text, id int);
     INSERT INTO seed_cat SELECT slug, id FROM categories;`,
  );
  await client.exec(
    `CREATE TEMP TABLE seed_brand (slug text, id int);
     INSERT INTO seed_brand SELECT slug, id FROM brands;`,
  );

  for (const p of SEED_PRODUCTS) {
    await client.exec(
      `INSERT INTO products
         (name, slug, sku, short_description, description, price, sale_price, image_url, gallery,
          category_id, brand_id, stock, sold_count, view_count, rating_average, rating_count,
          badge, status, specs, faq, is_featured, seo_title, seo_description)
       VALUES (
         ${q(p.name)}, ${q(p.slug)}, ${q(p.sku)}, ${q(p.shortDescription ?? "")}, ${q(p.description ?? "")},
         ${Number(p.price)}, ${p.salePrice != null ? Number(p.salePrice) : "NULL"},
         ${q(`/products/${p.slug}.jpg`)},
         ARRAY[${q(`/products/${p.slug}.jpg`)}, ${q(`/products/${p.slug}-2.jpg`)}]::text[],
         (SELECT id FROM seed_cat WHERE slug = ${q(p.category)}),
         (SELECT id FROM seed_brand WHERE slug = ${q(p.brand)}),
         ${p.stock ?? 0}, 0, 0, 0, 0,
         ${p.badge ? q(p.badge) : "NULL"}, 'active',
         ${q(JSON.stringify(p.specs ?? {}))},
         ${p.faq ? q(JSON.stringify(p.faq)) : "NULL"},
         ${p.isFeatured ?? false}, ${q(p.name)},
         ${q(`${p.shortDescription ?? ""} Giá ${Number(p.salePrice ?? p.price).toLocaleString("vi-VN")} đ, bảo hành 12 tháng, giao hàng 24-48h toàn quốc.`)}
       )
       ON CONFLICT (slug) DO NOTHING;`,
    );
  }

  await seedLocalContent(client);
}

/**
 * Seed nội dung còn lại (bài viết blog, từ khoá, cài đặt, tài khoản admin)
 * dùng khi phục hồi PGlite local.
 */
async function seedLocalContent(client: {
  exec: (sql: string) => Promise<unknown>;
  query: (sql: string) => Promise<{ rows: Record<string, unknown>[] }>;
}): Promise<void> {
  const { SEED_POSTS } = await import("./seed-data/posts");
  const { SEED_KEYWORDS } = await import("./seed-data/keywords");
  const { slugify } = await import("../lib/slug");
  const { hashPassword } = await import("../lib/password");

  const q = (v: unknown) => `'${String(v).replace(/'/g, "''")}'`;
  const arr = (list: string[]) =>
    `ARRAY[${list.map((x) => q(x)).join(", ")}]::text[]`;

  // Tài khoản admin
  await client.exec(
    `INSERT INTO users (email, password_hash, name, role, is_active)
     VALUES (${q("admin@techzone.vn")}, ${q(await hashPassword("Admin@12345"))},
             ${q("Quản trị viên TechZone")}, 'admin', true)
     ON CONFLICT DO NOTHING;`,
  );

  // Bài viết blog dùng `categories.category_id` trỏ tới danh mục sản phẩm
  // (nếu trùng slug) — giống hệt hành vi của `scripts/seed.ts`.
  // Những danh mục riêng cho blog (huong-dan, kien-thuc...) không tạo ở đây
  // để trang /danh-muc và bộ lọc sản phẩm không bị nhiễu.

  for (const p of SEED_POSTS) {
    await client.exec(
      `INSERT INTO blog_posts
         (title, slug, excerpt, content, cover_image, cover_alt, category_id, author_name,
          tags, status, is_published, reading_time, view_count, seo_title, seo_description, published_at)
       VALUES (
         ${q(p.title)}, ${q(p.slug)}, ${q(p.excerpt)}, ${q(p.content)},
         ${q(p.coverImage)}, ${q(p.coverAlt)},
         (SELECT id FROM categories WHERE slug = ${q(p.category)}),
         ${q("Ban biên tập TechZone")},
         ${arr(p.tags ?? [])},
         'published', true, ${p.readingTime ?? 4}, 0,
         ${q(p.seoTitle ?? p.title)}, ${q(p.seoDescription ?? p.excerpt ?? "")},
         ${q(p.publishedAt)}
       )
       ON CONFLICT (slug) DO NOTHING;`,
    );
  }

  for (const k of SEED_KEYWORDS) {
    await client.exec(
      `INSERT INTO keywords
         (keyword, slug, intent, topic_group, target_url, priority, search_volume, difficulty, position, notes, is_active)
       VALUES (
         ${q(k.keyword)}, ${q(slugify(k.keyword))}, ${q(k.intent)}, ${q(k.topicGroup)}, ${q(k.targetUrl)},
         ${q(k.priority)}, ${k.searchVolume ?? 0}, ${k.difficulty ?? 0},
         ${k.position != null ? Number(k.position) : "NULL"},
         ${k.notes ? q(k.notes) : "NULL"}, true
       )
       ON CONFLICT (slug) DO NOTHING;`,
    );
  }

  const contactEmail =
    process.env.CONTACT_EMAIL?.trim() ||
    process.env.NEXT_PUBLIC_CONTACT_EMAIL?.trim() ||
    "1350080137@sv.hcmunre.edu.vn";

  const settings: Array<[string, string]> = [
    ["brand_name", "TechZone"],
    ["brand_logo", "/logo.svg"],
    ["brand_description", "Chuyên phân phối phụ kiện điện thoại và công nghệ chính hãng tại Việt Nam."],
    ["contact_email", contactEmail],
  ];
  for (const [key, value] of settings) {
    await client.exec(
      `INSERT INTO settings (key, value) VALUES (${q(key)}, ${q(value)})
       ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;`,
    );
  }
  // Dọn setting liên hệ giả còn sót từ phiên bản seed trước.
  await client.exec(
    `DELETE FROM settings WHERE key IN ('contact_phone', 'contact_address');`,
  );

  await seedLocalDemoCommerce(client);
}

/**
 * Seed dữ liệu demo cho dashboard quản trị (khách hàng, đơn hàng, lưu lượng).
 *
 * Dùng chung dataset với `scripts/seed.ts` (`database/seed-data/demo.ts`) để
 * bản phục hồi PGlite và bản seed đầy đủ cho kết quả giống nhau.
 *
 * Mọi mốc thời gian là TƯƠNG ĐỐI so với lúc chạy -> dashboard luôn có số liệu
 * cho bộ lọc "Hôm nay" / "7 ngày" / "Tháng này".
 */
async function seedLocalDemoCommerce(client: {
  exec: (sql: string) => Promise<unknown>;
  query: (sql: string) => Promise<{ rows: Record<string, unknown>[] }>;
}): Promise<void> {
  const {
    DEMO_CUSTOMERS,
    DEMO_ORDERS,
    buildDemoEvents,
    daysAgoDate,
  } = await import("./seed-data/demo");
  const { SEED_PRODUCTS } = await import("./seed-data/products");

  const q = (v: unknown) => `'${String(v).replace(/'/g, "''")}'`;

  // ---- Khách hàng ----
  const customerIds = new Map<string, number>();
  for (const c of DEMO_CUSTOMERS) {
    const existing = await client.query(
      `SELECT id FROM customers WHERE phone = ${q(c.phone)} LIMIT 1;`,
    );
    const existingId = readFirstId(existing);
    if (existingId) {
      customerIds.set(c.phone, existingId);
      continue;
    }
    const res = await client.query(
      `INSERT INTO customers (full_name, phone, email, address, ward, district, city, created_at)
       VALUES (${q(c.fullName)}, ${q(c.phone)}, ${q(c.email)}, ${q(c.address)},
               ${q(c.address)}, ${q(c.district)}, ${q(c.city)}, ${q(daysAgoDate(45).toISOString())})
       RETURNING id;`,
    );
    const rowId = readFirstId(res);
    if (rowId) customerIds.set(c.phone, rowId);
  }

  // ---- Đơn hàng + sản phẩm trong đơn ----
  const slugToId = new Map<string, number>();
  for (const p of SEED_PRODUCTS) {
    const res = await client.query(
      `SELECT id FROM products WHERE slug = ${q(p.slug)} LIMIT 1;`,
    );
    const rowId = readFirstId(res);
    if (rowId) slugToId.set(p.slug, rowId);
  }

  for (const o of DEMO_ORDERS) {
    const product = SEED_PRODUCTS.find((p) => p.slug === o.productSlug);
    const productId = slugToId.get(o.productSlug);
    if (!product || !productId) continue;

    const customer = DEMO_CUSTOMERS[o.customerIndex];
    const customerId = customerIds.get(customer.phone) ?? null;
    const unit = product.salePrice ?? product.price;
    const subtotal = unit * o.quantity;
    const shipping = subtotal >= 300000 ? 0 : 30000;
    const createdAt = daysAgoDate(o.daysAgo).toISOString();

    const orderRes = await client.query(
      `INSERT INTO orders
         (order_code, customer_id, full_name, phone, email, address,
          payment_method, payment_status, status, subtotal, shipping_fee, discount, total,
          created_at, updated_at)
       VALUES (${q(o.orderCode)}, ${customerId ?? "NULL"}, ${q(customer.fullName)}, ${q(customer.phone)},
               ${q(customer.email)}, ${q(customer.address)},
               ${q(o.paymentMethod)}, ${q(o.paymentStatus)}, ${q(o.status)},
               ${subtotal}, ${shipping}, 0, ${subtotal + shipping},
               ${q(createdAt)}, ${q(createdAt)})
       ON CONFLICT (order_code) DO UPDATE SET created_at = EXCLUDED.created_at
       RETURNING id;`,
    );
    const orderId = readFirstId(orderRes);
    if (!orderId) continue;

    // Idempotent: chỉ tạo item nếu đơn chưa có item nào.
    const hasItems = await client.query(
      `SELECT count(*)::int AS c FROM order_items WHERE order_id = ${orderId};`,
    );
    if (Number(hasItems.rows?.[0]?.c ?? 0) === 0) {
      await client.exec(
        `INSERT INTO order_items
           (order_id, product_id, product_name, product_slug, product_image, sku,
            unit_price, quantity, line_total)
         VALUES (${orderId}, ${productId}, ${q(product.name)}, ${q(product.slug)},
                 ${q(`/products/${product.slug}.jpg`)}, ${q(product.sku)},
                 ${unit}, ${o.quantity}, ${subtotal});`,
      );
    }

    // Cập nhật tổng chi của khách hàng
    await client.exec(
      `UPDATE customers SET
         total_orders = (SELECT count(*) FROM orders o
                         WHERE o.phone = ${q(customer.phone)} AND o.status <> 'cancelled'),
         total_spent  = (SELECT COALESCE(SUM(o.total), 0) FROM orders o
                         WHERE o.phone = ${q(customer.phone)} AND o.status <> 'cancelled')
       WHERE phone = ${q(customer.phone)};`,
    );
  }

  // ---- Lưu lượng khách hàng (analytics) ----
  const events = buildDemoEvents(
    SEED_PRODUCTS.map((p) => ({ slug: p.slug, name: p.name })),
    30,
  );
  const productIdBySlug = slugToId;

  const values = events.map((e) => {
    const pid = e.productSlug
      ? (productIdBySlug.get(e.productSlug) ?? null)
      : null;
    return `(${q(e.type)}, ${q(e.path)}, ${e.label ? q(e.label) : "NULL"}, ${
      pid ?? "NULL"
    }, ${e.value}, ${q(e.sessionId)}, ${q(e.createdAt.toISOString())})`;
  });

  // Chia nhỏ để tránh câu SQL quá dài.
  const CHUNK = 300;
  for (let i = 0; i < values.length; i += CHUNK) {
    const chunk = values.slice(i, i + CHUNK);
    await client.exec(
      `INSERT INTO seo_events (type, path, label, product_id, value, session_id, created_at)
       VALUES ${chunk.join(", ")};`,
    );
  }
}

/**
 * Đọc giá trị `id` đầu tiên từ kết quả truy vấn của PGlite.
 *
 * PGlite trả về `{ rows, fields, affectedRows }`; tên cột trả về đúng như
 * trong SQL (`id`). Hàm này an toàn với cả `exec` và `query`.
 */
function readFirstId(result: unknown): number | null {
  const rows = (result as { rows?: Record<string, unknown>[] })?.rows;
  const first = rows?.[0];
  if (!first) return null;
  const raw = first.id ?? Object.values(first)[0];
  const n = Number(raw);
  return Number.isFinite(n) ? n : null;
}

/**
 * Xoá file lock/pid còn sót lại trong data dir PGlite.
 *
 * PGlite dùng cơ chế lock file kiểu PostgreSQL. Nếu process bị kill đột ngột
 * (Ctrl+C, task manager, hết bộ nhớ) thì `postmaster.pid` và
 * `.s.PGSQL.5432.lock.out` vẫn còn -> lần mở sau sẽ abort với
 * "RuntimeError: Aborted()" dù data dir hoàn toàn hợp lệ.
 *
 * Chỉ xoá khi KHÔNG có tiến trình nào đang thực sự giữ data dir này, nên an toàn.
 */
async function clearStalePgliteLocks(dir: string): Promise<void> {
  const { existsSync, readdirSync, unlinkSync, readFileSync } = await import("node:fs");
  const path = await import("node:path");

  if (!existsSync(dir)) return;

  // Nếu đang có process khác dùng data dir thì KHÔNG đụng vào.
  const lockFile = path.join(dir, ".s.PGSQL.5432.lock.out");
  if (existsSync(lockFile)) {
    try {
      const pid = Number(readFileSync(lockFile, "utf8").trim());
      if (pid > 0 && pid !== process.pid && isProcessAlive(pid)) return;
    } catch {
      /* ignore */
    }
  }

  for (const f of ["postmaster.pid", ".s.PGSQL.5432.lock.out"]) {
    const p = path.join(dir, f);
    try {
      if (existsSync(p)) unlinkSync(p);
    } catch {
      /* ignore */
    }
  }
}

/**
 * Kiểm tra tiến trình còn sống hay không (Windows + POSIX).
 *
 * LƯU Ý QUAN TRỌNG (Windows):
 * `tasklist /FI "PID eq <pid>" /NH` trả về exit code 0 KỂ CẢ khi không tìm
 * thấy tiến trình (chỉ in ra dòng "INFO: No tasks are running...").
 * Nếu chỉ dựa vào exit code thì ta luôn cho là "còn sống" -> file `.pglite.owner`
 * của tiến trình đã chết sẽ chặn mọi lần mở DB sau đó.
 *
 * Vì vậy ta kiểm tra THỰC SỰ có PID xuất hiện trong output hay không.
 */
function isProcessAlive(pid: number): boolean {
  try {
    if (process.platform === "win32") {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const { execFileSync } = require("node:child_process") as typeof import("node:child_process");
      const out = execFileSync(
        "tasklist",
        ["/FI", `PID eq ${pid}`, "/NH", "/FO", "CSV"],
        { encoding: "utf8", windowsHide: true, stdio: ["ignore", "pipe", "ignore"] },
      );
      // Dòng khớp sẽ có dạng: "node.exe","1234","Console","1","12,345 K"
      const lines = String(out)
        .split(/\r?\n/)
        .filter((l) => l.trim().length > 0);
      return lines.some((l) => {
        const cols = l.split(",");
        if (cols.length < 2) return false;
        return Number(cols[1].replace(/"/g, "").trim()) === pid;
      });
    }
    process.kill(pid, 0);
    return true;
  } catch {
    return false;
  }
}

export async function getDb(): Promise<Database> {
  if (!globalForDb.db) {
    globalForDb.db = await createDb();
  }
  return globalForDb.db;
}

/**
 * Dùng cho scripts (seed, migrate) — không cache trong global.
 */
export async function createStandaloneDb(): Promise<Database> {
  const url = process.env.DATABASE_URL?.trim();
  if (isPostgresUrl(url)) {
    const pool = await createPgPool(url);
    return drizzlePg(pool, { schema, casing: "snake_case" });
  }
  const { PGlite } = await import("@electric-sql/pglite");
  const dir = process.env.PGLITE_PATH ?? "./.pglite";
  assertPgliteNotBusy(dir);
  await clearStalePgliteLocks(dir);
  const client = new PGlite(dir);
  await client.waitReady;
  claimPgliteOwnership(dir);
  return drizzlePglite(client, { schema, casing: "snake_case" });
}

export { schema };

/** Alias cho scripts */
export const getStandaloneDb = createStandaloneDb;

/**
 * Mở PGlite local cho script (migrate, kiểm tra) — có kiểm tra trùng lock.
 *
 * Script KHÔNG được mở data dir đang bị server chạy giữ, vì vậy hàm này sẽ
 * ném lỗi rõ ràng nếu phát hiện tiến trình khác đang sử dụng.
 */
export async function openPgliteForScript(
  dir?: string,
): Promise<PGlite> {
  const { PGlite: PGliteCtor } = await import("@electric-sql/pglite");
  const target = dir ?? process.env.PGLITE_PATH ?? "./.pglite";
  assertPgliteNotBusy(target);
  await clearStalePgliteLocks(target);
  const client = new PGliteCtor(target);
  await client.waitReady;
  claimPgliteOwnership(target);
  return client;
}
