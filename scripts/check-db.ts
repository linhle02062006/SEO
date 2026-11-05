/**
 * Kiểm tra kết nối database.
 * Chạy: npm run db:check
 *
 * In ra driver đang dùng (PostgreSQL thật hay PGlite local), phiên bản DB,
 * số bảng và số bản ghi ở các bảng chính để xác nhận seed đã chạy đúng.
 */
import "./load-env";
import { sql } from "drizzle-orm";
import { getStandaloneDb } from "../database/db";
import * as schema from "../database/schema";

/** Chạy raw query và trả về mảng row dạng object (tương thích cả 2 driver). */
async function rawRows(
  db: any,
  query: string,
): Promise<Record<string, unknown>[]> {
  const res = await db.execute(sql.raw(query));
  if (Array.isArray(res)) return res as Record<string, unknown>[];
  if (Array.isArray(res?.rows)) return res.rows as Record<string, unknown>[];
  if (Array.isArray(res?._?.rows)) return res._.rows as Record<string, unknown>[];
  return [];
}

async function main() {
  const url = process.env.DATABASE_URL?.trim();
  const usingPostgres = Boolean(url && /^postgres(ql)?:\/\//i.test(url));

  console.log("🔌 Đang kiểm tra kết nối database...");
  console.log(
    `   Driver: ${usingPostgres ? "PostgreSQL (node-postgres)" : "PGlite local file (./.pglite)"}`,
  );

  if (usingPostgres) {
    // Không in mật khẩu
    const safe = url!.replace(/\/\/([^:]+):([^@]*)@/, "//$1:***@");
    console.log(`   URL: ${safe}`);
  } else {
    console.log("   ⚠️  DATABASE_URL chưa được đặt — đang dùng PGlite file DB.");
    console.log("      Để gắn Postgres thật, điền DATABASE_URL trong .env.local");
  }

  const db = await getStandaloneDb();

  // 1) Kiểm tra kết nối + phiên bản
  const vRows = await rawRows(db, "SELECT version() AS v");
  const version = String(vRows[0]?.v ?? "unknown");
  console.log(`   ✅ Kết nối thành công — ${version.split("\n")[0].slice(0, 70)}`);

  // 2) Đếm bảng tồn tại
  const tRows = await rawRows(
    db,
    `SELECT COUNT(*)::int AS c FROM information_schema.tables WHERE table_schema = 'public'`,
  );
  console.log(`   📁 Số bảng trong schema 'public': ${Number(tRows[0]?.c ?? 0)}`);

  // 3) Đếm bản ghi các bảng chính
  console.log("\n📊 Dữ liệu hiện có:");
  const tables = [
    ["users", schema.users],
    ["categories", schema.categories],
    ["brands", schema.brands],
    ["products", schema.products],
    ["orders", schema.orders],
    ["blog_posts", schema.blogPosts],
    ["customers", schema.customers],
  ] as const;

  for (const [name, table] of tables) {
    const rows = await rawRows(db, `SELECT COUNT(*)::int AS c FROM "${name}"`);
    const count = Number(rows[0]?.c ?? 0);
    console.log(
      `   ${name.padEnd(12)} ${String(count).padStart(6)}${count === 0 ? "   (rỗng — cần chạy npm run db:seed)" : ""}`,
    );
  }

  console.log("\n✅ OK");
  process.exit(0);
}

main().catch((err) => {
  console.error("\n❌ Lỗi kết nối database:");
  console.error("  ", err instanceof Error ? err.message : err);
  console.error(
    "\nGợi ý: kiểm tra DATABASE_URL trong .env.local, firewall/IP allowlist của provider,",
  );
  console.error(
    "       và chắc chắn mật khẩu đúng (ký tự đặc biệt phải được URL-encode).",
  );
  process.exit(1);
});
