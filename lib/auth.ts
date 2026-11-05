import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";
import { eq } from "drizzle-orm";
import { getDb } from "@/database/db";
import { users, type User, type UserRole } from "@/database/schema";

const COOKIE_NAME = "tz_session";
const SESSION_DAYS = 7;

function getSecretKey(): Uint8Array {
  const secret =
    process.env.AUTH_SECRET ||
    (process.env.NODE_ENV === "production"
      ? undefined
      : "techzone-dev-secret-do-not-use-in-production-please-change");
  if (!secret) {
    throw new Error(
      "AUTH_SECRET chưa được thiết lập. Hãy thêm AUTH_SECRET vào .env.local (xem .env.example).",
    );
  }
  return new TextEncoder().encode(secret);
}

export type SessionPayload = {
  sub: number;
  email: string;
  name: string;
  role: UserRole;
};

export async function createSession(user: {
  id: number;
  email: string;
  name: string;
  role: UserRole;
}) {
  const token = await new SignJWT({
    email: user.email,
    name: user.name,
    role: user.role,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(String(user.id))
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DAYS}d`)
    .sign(getSecretKey());

  const store = await cookies();
  store.set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_DAYS * 24 * 60 * 60,
  });
}

export async function destroySession() {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}

export async function getSession(): Promise<SessionPayload | null> {
  try {
    const store = await cookies();
    const token = store.get(COOKIE_NAME)?.value;
    if (!token) return null;
    const { payload } = await jwtVerify(token, getSecretKey());
    return {
      sub: Number(payload.sub),
      email: String(payload.email),
      name: String(payload.name),
      role: payload.role as UserRole,
    };
  } catch {
    return null;
  }
}

export async function getCurrentUser(): Promise<User | null> {
  const session = await getSession();
  if (!session) return null;
  const db = await getDb();
  const rows = await db
    .select()
    .from(users)
    .where(eq(users.id, session.sub))
    .limit(1);
  const user = rows[0];
  if (!user || !user.isActive) return null;
  return user;
}

/** Dùng trong layout admin: chuyển hướng nếu chưa đăng nhập / không có quyền */
export async function requireAdmin(
  roles: UserRole[] = ["admin", "editor"],
): Promise<User> {
  const user = await getCurrentUser();
  if (!user) {
    const { redirect } = await import("next/navigation");
    redirect("/admin/dang-nhap?next=/admin");
  }
  if (!roles.includes(user!.role)) {
    const { redirect } = await import("next/navigation");
    redirect("/admin?error=forbidden");
  }
  return user!;
}

export { COOKIE_NAME };
