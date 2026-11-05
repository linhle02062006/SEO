import { randomBytes, createHash } from "node:crypto";
import { and, desc, eq, sql } from "drizzle-orm";
import { getDb } from "@/database/db";
import {
  customerAddresses,
  customers,
  orders,
  products,
  users,
  wishlistItems,
  type CustomerAddress,
  type User,
} from "@/database/schema";
import { hashPassword, verifyPassword } from "@/lib/password";

/**
 * Service cho tài khoản khách hàng (role = "customer").
 *
 * Khác với `lib/auth.ts` (dùng cho admin/editor), file này quản lý vòng đời
 * đầy đủ của khách: đăng ký, xác nhận email, đổi mật khẩu, sổ địa chỉ,
 * danh sách yêu thích và lịch sử đơn hàng.
 */

const VERIFY_TOKEN_TTL_MINUTES = 60 * 24; // 24 giờ

/* ------------------------------------------------------------------ */
/* Helpers                                                              */
/* ------------------------------------------------------------------ */

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

export function generateVerifyToken(): string {
  return randomBytes(32).toString("hex");
}

/* ------------------------------------------------------------------ */
/* Đăng ký / đăng nhập                                                  */
/* ------------------------------------------------------------------ */

export type RegisterInput = {
  name: string;
  email: string;
  phone?: string | null;
  password: string;
};

export type RegisterResult =
  | { ok: true; user: User; verifyToken: string }
  | { ok: false; message: string; field?: "email" | "name" | "password" };

/**
 * Tạo tài khoản khách hàng mới.
 *
 * - Email phải chưa tồn tại (so khớp không phân biệt hoa thường).
 * - Mật khẩu được hash bằng bcrypt (KHÔNG lưu bản rõ).
 * - Trả về token xác nhận email (bản rõ) để gửi mail; DB chỉ lưu hash.
 */
export async function registerCustomer(
  input: RegisterInput,
): Promise<RegisterResult> {
  const db = await getDb();
  const email = normalizeEmail(input.email);
  const name = input.name.trim();
  const phone = input.phone?.trim() || null;

  const existing = await db
    .select({ id: users.id })
    .from(users)
    .where(sql`lower(${users.email}) = ${email}`)
    .limit(1);

  if (existing.length) {
    return {
      ok: false,
      message: "Email này đã được đăng ký. Vui lòng đăng nhập hoặc đổi email.",
      field: "email",
    };
  }

  const passwordHash = await hashPassword(input.password);
  const verifyToken = generateVerifyToken();

  const inserted = await db
    .insert(users)
    .values({
      email,
      name,
      phone,
      passwordHash,
      role: "customer",
      isActive: true,
      emailVerifyToken: hashToken(verifyToken),
      emailVerifyExpiresAt: new Date(
        Date.now() + VERIFY_TOKEN_TTL_MINUTES * 60 * 1000,
      ),
    })
    .returning();

  return { ok: true, user: inserted[0], verifyToken };
}

/**
 * Đăng nhập bằng email + mật khẩu.
 * Chỉ nhận tài khoản role "customer" (admin dùng luồng riêng).
 */
export async function loginCustomer(
  email: string,
  password: string,
): Promise<
  | { ok: true; user: User }
  | { ok: false; message: string }
> {
  const db = await getDb();
  const normalized = normalizeEmail(email);

  const rows = await db
    .select()
    .from(users)
    .where(sql`lower(${users.email}) = ${normalized}`)
    .limit(1);

  const user = rows[0];
  if (!user || !user.isActive) {
    return { ok: false, message: "Email hoặc mật khẩu không đúng." };
  }

  const ok = await verifyPassword(password, user.passwordHash);
  if (!ok) {
    return { ok: false, message: "Email hoặc mật khẩu không đúng." };
  }

  await db
    .update(users)
    .set({ lastLoginAt: new Date(), updatedAt: new Date() })
    .where(eq(users.id, user.id));

  return { ok: true, user };
}

/**
 * Xác nhận email bằng token.
 * Trả về true nếu xác nhận thành công (hoặc email đã được xác nhận trước đó).
 */
export async function verifyCustomerEmail(token: string): Promise<boolean> {
  const db = await getDb();
  const hashed = hashToken(token.trim());

  const rows = await db
    .select()
    .from(users)
    .where(eq(users.emailVerifyToken, hashed))
    .limit(1);

  const user = rows[0];
  if (!user) return false;

  // Token hết hạn -> từ chối (trừ khi email đã xác nhận trước đó).
  if (user.emailVerifiedAt) return true;
  if (
    user.emailVerifyExpiresAt &&
    user.emailVerifyExpiresAt.getTime() < Date.now()
  ) {
    return false;
  }

  await db
    .update(users)
    .set({
      emailVerifiedAt: new Date(),
      emailVerifyToken: null,
      emailVerifyExpiresAt: null,
      updatedAt: new Date(),
    })
    .where(eq(users.id, user.id));

  return true;
}

/** Gửi lại link xác nhận: tạo token mới, trả về token bản rõ để gửi mail. */
export async function regenerateVerifyToken(
  userId: number,
): Promise<string | null> {
  const db = await getDb();
  const token = generateVerifyToken();

  const updated = await db
    .update(users)
    .set({
      emailVerifyToken: hashToken(token),
      emailVerifyExpiresAt: new Date(
        Date.now() + VERIFY_TOKEN_TTL_MINUTES * 60 * 1000,
      ),
      updatedAt: new Date(),
    })
    .where(eq(users.id, userId))
    .returning();

  return updated.length ? token : null;
}

/* ------------------------------------------------------------------ */
/* Đổi mật khẩu / cập nhật hồ sơ                                       */
/* ------------------------------------------------------------------ */

export type ChangePasswordResult =
  | { ok: true }
  | { ok: false; message: string; field?: "currentPassword" | "newPassword" };

export async function changeCustomerPassword(
  userId: number,
  currentPassword: string,
  newPassword: string,
): Promise<ChangePasswordResult> {
  const db = await getDb();

  const rows = await db
    .select()
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);
  const user = rows[0];
  if (!user) {
    return { ok: false, message: "Không tìm thấy tài khoản." };
  }

  const ok = await verifyPassword(currentPassword, user.passwordHash);
  if (!ok) {
    return {
      ok: false,
      message: "Mật khẩu hiện tại không đúng.",
      field: "currentPassword",
    };
  }

  const passwordHash = await hashPassword(newPassword);
  await db
    .update(users)
    .set({ passwordHash, updatedAt: new Date() })
    .where(eq(users.id, userId));

  return { ok: true };
}

export type ProfileInput = {
  name: string;
  phone?: string | null;
};

/** Cập nhật hồ sơ khách hàng. Trả về false nếu email đã bị tài khoản khác dùng. */
export async function updateCustomerProfile(
  userId: number,
  input: ProfileInput,
): Promise<{ ok: true } | { ok: false; message: string }> {
  const db = await getDb();

  await db
    .update(users)
    .set({
      name: input.name.trim(),
      phone: input.phone?.trim() || null,
      updatedAt: new Date(),
    })
    .where(eq(users.id, userId));

  // Đồng bộ tên/điện thoại sang hồ sơ khách hàng (nếu đã có liên kết).
  await db
    .update(customers)
    .set({
      fullName: input.name.trim(),
      phone: input.phone?.trim() || undefined,
      updatedAt: new Date(),
    })
    .where(eq(customers.userId, userId));

  return { ok: true };
}

/* ------------------------------------------------------------------ */
/* Sổ địa chỉ                                                          */
/* ------------------------------------------------------------------ */

export type AddressInput = {
  label: string;
  fullName: string;
  phone: string;
  address: string;
  ward?: string | null;
  district?: string | null;
  city?: string | null;
  isDefault?: boolean;
};

export async function listAddresses(userId: number): Promise<CustomerAddress[]> {
  const db = await getDb();
  return db
    .select()
    .from(customerAddresses)
    .where(eq(customerAddresses.userId, userId))
    .orderBy(
      desc(customerAddresses.isDefault),
      desc(customerAddresses.updatedAt),
    );
}

export async function addAddress(
  userId: number,
  input: AddressInput,
): Promise<{ ok: true } | { ok: false; message: string }> {
  const db = await getDb();

  const existing = await listAddresses(userId);
  const makeDefault = input.isDefault || existing.length === 0;

  if (makeDefault) {
    await db
      .update(customerAddresses)
      .set({ isDefault: false, updatedAt: new Date() })
      .where(eq(customerAddresses.userId, userId));
  }

  await db.insert(customerAddresses).values({
    userId,
    label: input.label.trim() || "Mặc định",
    fullName: input.fullName.trim(),
    phone: input.phone.trim(),
    address: input.address.trim(),
    ward: input.ward?.trim() || null,
    district: input.district?.trim() || null,
    city: input.city?.trim() || null,
    isDefault: makeDefault,
  });

  return { ok: true };
}

export async function removeAddress(
  userId: number,
  addressId: number,
): Promise<void> {
  const db = await getDb();
  await db
    .delete(customerAddresses)
    .where(
      and(
        eq(customerAddresses.id, addressId),
        eq(customerAddresses.userId, userId),
      ),
    );
}

export async function setDefaultAddress(
  userId: number,
  addressId: number,
): Promise<void> {
  const db = await getDb();
  await db
    .update(customerAddresses)
    .set({ isDefault: false, updatedAt: new Date() })
    .where(eq(customerAddresses.userId, userId));
  await db
    .update(customerAddresses)
    .set({ isDefault: true, updatedAt: new Date() })
    .where(
      and(
        eq(customerAddresses.id, addressId),
        eq(customerAddresses.userId, userId),
      ),
    );
}

/* ------------------------------------------------------------------ */
/* Wishlist (yêu thích)                                                 */
/* ------------------------------------------------------------------ */

export async function listWishlist(userId: number) {
  const db = await getDb();
  return db
    .select({
      item: wishlistItems,
      product: products,
    })
    .from(wishlistItems)
    .innerJoin(products, eq(wishlistItems.productId, products.id))
    .where(eq(wishlistItems.userId, userId))
    .orderBy(desc(wishlistItems.createdAt));
}

export async function getWishlistProductIds(userId: number): Promise<number[]> {
  const db = await getDb();
  const rows = await db
    .select({ productId: wishlistItems.productId })
    .from(wishlistItems)
    .where(eq(wishlistItems.userId, userId));
  return rows.map((r) => r.productId);
}

/** Bật/tắt sản phẩm trong wishlist. Trả về trạng thái sau khi cập nhật. */
export async function toggleWishlist(
  userId: number,
  productId: number,
): Promise<{ ok: boolean }> {
  const db = await getDb();

  const existing = await db
    .select({ id: wishlistItems.id })
    .from(wishlistItems)
    .where(
      and(
        eq(wishlistItems.userId, userId),
        eq(wishlistItems.productId, productId),
      ),
    )
    .limit(1);

  if (existing.length) {
    await db
      .delete(wishlistItems)
      .where(eq(wishlistItems.id, existing[0].id));
    return { ok: false };
  }

  const product = await db
    .select({ id: products.id })
    .from(products)
    .where(eq(products.id, productId))
    .limit(1);
  if (!product.length) {
    throw new Error("Sản phẩm không tồn tại.");
  }

  await db.insert(wishlistItems).values({ userId, productId });
  return { ok: true };
}

/* ------------------------------------------------------------------ */
/* Lịch sử đơn hàng                                                    */
/* ------------------------------------------------------------------ */

export async function listCustomerOrders(userId: number) {
  const db = await getDb();
  return db
    .select()
    .from(orders)
    .where(eq(orders.userId, userId))
    .orderBy(desc(orders.createdAt));
}

/** Tổng quan tài khoản: số đơn, tổng chi tiêu, số sản phẩm yêu thích. */
export async function getAccountSummary(userId: number) {
  const db = await getDb();

  const [orderRows] = await db
    .select({
      orderCount: sql<number>`count(*)`,
      totalSpent: sql<number>`COALESCE(SUM(${orders.total}), 0)`,
    })
    .from(orders)
    .where(
      and(eq(orders.userId, userId), sql`${orders.status} <> 'cancelled'`),
    );

  const [wishlistRows] = await db
    .select({ total: sql<number>`count(*)` })
    .from(wishlistItems)
    .where(eq(wishlistItems.userId, userId));

  return {
    orderCount: Number(orderRows.orderCount),
    totalSpent: Number(orderRows.totalSpent),
    wishlistCount: Number(wishlistRows.total),
  };
}

/**
 * Gắn hồ sơ `customers` cho tài khoản khách (nếu chưa có).
 * Dùng khi khách đặt hàng bằng tài khoản đã đăng nhập.
 */
export async function linkCustomerProfile(
  userId: number,
  data: { fullName: string; phone: string; email?: string | null; address?: string | null },
): Promise<number | null> {
  const db = await getDb();

  const existing = await db
    .select({ id: customers.id })
    .from(customers)
    .where(eq(customers.userId, userId))
    .limit(1);

  if (existing.length) {
    await db
      .update(customers)
      .set({
        fullName: data.fullName.trim(),
        phone: data.phone.trim(),
        email: data.email?.trim() || undefined,
        address: data.address?.trim() || undefined,
        updatedAt: new Date(),
      })
      .where(eq(customers.id, existing[0].id));
    return existing[0].id;
  }

  const inserted = await db
    .insert(customers)
    .values({
      userId,
      fullName: data.fullName.trim(),
      phone: data.phone.trim(),
      email: data.email?.trim() || null,
      address: data.address?.trim() || "",
    })
    .returning();

  return inserted[0]?.id ?? null;
}
