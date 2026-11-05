/**
 * Xoá sạch database local (PGlite) rồi tạo lại từ đầu.
 *
 * Chạy: npm run db:reset
 *
 * Dùng khi:
 * - Database local bị hỏng (kill đột ngột làm hỏng WAL).
 * - Muốn bắt đầu lại từ dữ liệu seed sạch.
 */
import "./load-env";
import { rmSync, existsSync } from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

const dir = path.resolve(process.cwd(), process.env.PGLITE_PATH ?? "./.pglite");
const owner = path.join(dir, ".pglite.owner");

if (existsSync(owner)) {
  const pid = Number(require("node:fs").readFileSync(owner, "utf8").trim());
  if (Number.isFinite(pid) && pid > 0) {
    let alive = false;
    try {
      process.kill(pid, 0);
      alive = true;
    } catch {
      alive = false;
    }
    if (alive) {
      console.error(
        `❌ PGlite local đang được tiến trình khác (PID ${pid}) sử dụng. ` +
          "Hãy dừng server trước khi reset database.",
      );
      process.exit(1);
    }
  }
}

console.log(`🗑️  Xoá database local: ${dir}`);
rmSync(dir, { recursive: true, force: true });
rmSync(`${dir}.owner`, { recursive: true, force: true });

for (const script of ["db:push", "db:seed"]) {
  console.log(`\n▶️  npm run ${script}`);
  const res = spawnSync("npm", ["run", script], {
    stdio: "inherit",
    shell: process.platform === "win32",
  });
  if (res.status !== 0) {
    console.error(`❌ npm run ${script} thất bại.`);
    process.exit(res.status ?? 1);
  }
}

console.log("\n✅ Database local đã được reset xong.");
