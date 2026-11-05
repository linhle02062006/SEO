import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { getDb } from "@/database/db";
import { users, type User } from "@/database/schema";

export async function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, 10);
}

export async function verifyPassword(
  plain: string,
  hash: string,
): Promise<boolean> {
  return bcrypt.compare(plain, hash);
}

export async function authenticate(
  email: string,
  password: string,
): Promise<User | null> {
  const db = await getDb();
  const rows = await db
    .select()
    .from(users)
    .where(eq(users.email, email.trim().toLowerCase()))
    .limit(1);

  const user = rows[0];
  if (!user || !user.isActive) return null;

  const ok = await verifyPassword(password, user.passwordHash);
  if (!ok) return null;

  await db
    .update(users)
    .set({ lastLoginAt: new Date() })
    .where(eq(users.id, user.id));

  return user;
}
