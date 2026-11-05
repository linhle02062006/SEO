/**
 * Áp dụng schema lên database.
 * - Nếu DATABASE_URL trỏ tới PostgreSQL (Supabase/Neon/Vercel) -> dùng drizzle-kit push hoặc SQL migration.
 * - Nếu không -> dùng PGlite local, tự tạo bảng bằng SQL.
 *
 * Chạy: npm run db:push
 */
import "./load-env";
import { openPgliteForScript, resolvePgConnection } from "../database/db";
import { ENUM_SQL, SCHEMA_SQL } from "../database/schema-sql";

async function runOnPostgres(url: string) {
  console.log("🐘 Áp dụng schema lên PostgreSQL...");
  const { Client } = await import("pg");
  const { connectionString, ssl } = resolvePgConnection(url);
  const client = new Client({
    connectionString,
    ssl,
  });
  await client.connect();
  await client.query(ENUM_SQL);
  await client.query(SCHEMA_SQL);
  await client.end();
  console.log("✅ Schema PostgreSQL đã sẵn sàng.");
}

async function runOnPglite() {
  console.log("⚡ Áp dụng schema lên PGlite local (file: ./.pglite)...");
  const client = await openPgliteForScript();
  await client.exec(ENUM_SQL);
  await client.exec(SCHEMA_SQL);
  await client.close();
  console.log("✅ Schema PGlite đã sẵn sàng.");
}

async function main() {
  const url = process.env.DATABASE_URL?.trim();
  if (url && /^postgres(ql)?:\/\//i.test(url)) {
    await runOnPostgres(url);
  } else {
    await runOnPglite();
  }
  console.log("\n💡 Tiếp theo: npm run images:generate && npm run db:seed\n");
}

main().catch((err) => {
  console.error("❌ Lỗi migrate:", err);
  process.exit(1);
});
