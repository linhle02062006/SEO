import { drizzle as drizzlePg } from "drizzle-orm/node-postgres";
import { drizzle as drizzlePglite } from "drizzle-orm/pglite";
import { PGlite } from "@electric-sql/pglite";
import * as schema from "./schema";
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

  const { existsSync, cpSync, rmSync } = await import("node:fs");
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
    } catch {
      return base;
    }
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
  const client = new PGliteCtor(dir);
  globalForDb.pglite = client;
  return drizzlePglite(client, { schema, casing: "snake_case" });
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
  const client = new PGlite(process.env.PGLITE_PATH ?? "./.pglite");
  return drizzlePglite(client, { schema, casing: "snake_case" });
}

export { schema };

/** Alias cho scripts */
export const getStandaloneDb = createStandaloneDb;
