import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getDb } from "@/database/db";
import { users } from "@/database/schema";
import { eq } from "drizzle-orm";

/**
 * Lấy thông tin phiên đăng nhập hiện tại (dùng cho client component).
 * Trả về 200 với `{ authenticated: false }` nếu chưa đăng nhập.
 */
export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ authenticated: false });
    }

    // Lấy thêm số điện thoại để form đặt hàng tự điền.
    let phone: string | null = null;
    try {
      const db = await getDb();
      const rows = await db
        .select({ phone: users.phone })
        .from(users)
        .where(eq(users.id, session.sub))
        .limit(1);
      phone = rows[0]?.phone ?? null;
    } catch {
      // Không quan trọng - bỏ qua.
    }

    return NextResponse.json({
      authenticated: true,
      user: {
        id: session.sub,
        email: session.email,
        name: session.name,
        role: session.role,
        phone,
      },
    });
  } catch (err) {
    console.error("[api/account/session] Lỗi:", err);
    return NextResponse.json(
      { authenticated: false, message: "Không đọc được phiên đăng nhập." },
      { status: 500 },
    );
  }
}
