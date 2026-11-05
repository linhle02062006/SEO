import { randomBytes } from "node:crypto";
import { eq } from "drizzle-orm";
import { getDb } from "@/database/db";
import { users, type User } from "@/database/schema";
import { hashPassword } from "@/lib/password";
import { hashToken, normalizeEmail } from "@/services/account-service";

/**
 * Tạo tài khoản khách hàng NGAY TRONG LUỒNG ĐẶT HÀNG.
 *
 * Khách mua hàng nhập email + mật khẩu ở form đặt hàng -> hệ thống tự tạo
 * tài khoản (role "customer") để lần sau họ đăng nhập xem lịch sử đơn hàng.
 *
 * Ràng buộc:
 * - KHÔNG chặn đơn hàng nếu việc tạo tài khoản thất bại (đơn hàng quan trọng hơn).
 * - Nếu email đã có tài khoản -> KHÔNG tạo trùng, chỉ liên kết đơn hàng với user đó.
 * - Token xác nhận email được trả về để gửi mail (không lưu bản rõ trong DB).
 */

export type AccountCreationResult = {
  /** true nếu vừa tạo tài khoản mới (cần gửi email xác nhận). */
  created: boolean;
  user: User | null;
  /** Token xác nhận email bản rõ — chỉ có khi `created` = true. */
  verifyToken: string | null;
};

const VERIFY_TOKEN_TTL_MINUTES = 60 * 24;

export async function ensureCustomerAccount(input: {
  name: string;
  email: string;
  password: string;
  phone: string;
}): Promise<AccountCreationResult> {
  const db = await getDb();
  const email = normalizeEmail(input.email);

  // Đã có tài khoản với email này -> dùng lại, không tạo trùng.
  const existing = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  if (existing.length) {
    return { created: false, user: existing[0], verifyToken: null };
  }

  const passwordHash = await hashPassword(input.password);
  const verifyToken = randomBytes(32).toString("hex");

  const inserted = await db
    .insert(users)
    .values({
      email,
      name: input.name.trim(),
      phone: input.phone.trim(),
      passwordHash,
      role: "customer",
      isActive: true,
      emailVerifyToken: hashToken(verifyToken),
      emailVerifyExpiresAt: new Date(
        Date.now() + VERIFY_TOKEN_TTL_MINUTES * 60 * 1000,
      ),
    })
    .returning();

  return { created: true, user: inserted[0], verifyToken };
}
