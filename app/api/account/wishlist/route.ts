import { NextResponse } from "next/server";
import { z } from "zod";
import { getSession } from "@/lib/auth";
import { toggleWishlist } from "@/services/account-service";

export const dynamic = "force-dynamic";

const toggleSchema = z.object({
  productId: z.number().int().positive(),
});

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        {
          ok: false,
          message: "Bạn cần đăng nhập để lưu sản phẩm yêu thích.",
          requiresAuth: true,
        },
        { status: 401 },
      );
    }

    const body = await request.json();
    const parsed = toggleSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, message: "Sản phẩm không hợp lệ." },
        { status: 400 },
      );
    }

    const result = await toggleWishlist(session.sub, parsed.data.productId);

    return NextResponse.json({
      ok: true,
      inWishlist: result.ok,
      message: result.ok
        ? "Đã thêm vào danh sách yêu thích."
        : "Đã xoá khỏi danh sách yêu thích.",
    });
  } catch (err) {
    console.error("[api/account/wishlist] Lỗi:", err);
    return NextResponse.json(
      { ok: false, message: "Không cập nhật được danh sách yêu thích." },
      { status: 500 },
    );
  }
}
