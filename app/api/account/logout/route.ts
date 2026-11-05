import { NextResponse } from "next/server";
import { destroySession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST() {
  try {
    await destroySession();
    return NextResponse.json({ ok: true, message: "Đã đăng xuất." });
  } catch (err) {
    console.error("[api/account/logout] Lỗi:", err);
    return NextResponse.json(
      { ok: false, message: "Không đăng xuất được. Vui lòng thử lại." },
      { status: 500 },
    );
  }
}
