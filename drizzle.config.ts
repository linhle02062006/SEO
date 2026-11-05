import type { Config } from "drizzle-kit";
import { defineConfig } from "drizzle-kit";
import "dotenv/config";
import { config } from "dotenv";
import path from "node:path";

// drizzle-kit chỉ tự đọc file `.env`. Project đặt cấu hình ở `.env.local`
// nên phải nạp thủ công, nếu không `db:generate` / `db:studio` sẽ trỏ
// về connection string mặc định (localhost) dù DATABASE_URL đã được đặt.
config({ path: path.resolve(process.cwd(), ".env.local"), override: false, quiet: true });
config({ path: path.resolve(process.cwd(), ".env"), override: false, quiet: true });

export default defineConfig({
  schema: "./database/schema.ts",
  out: "./database/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url:
      process.env.DATABASE_URL ||
      "postgresql://postgres:postgres@localhost:5432/techzone",
  },
  verbose: true,
  strict: true,
});
