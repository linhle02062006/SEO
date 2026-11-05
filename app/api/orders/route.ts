import { NextResponse } from "next/server";
import { submitOrder } from "@/services/checkout-service";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = await submitOrder(body);

    if (!result.ok) {
      return NextResponse.json(
        { ok: false, message: result.message, errors: result.errors },
        { status: 400 },
      );
    }

    return NextResponse.json({
      ok: true,
      orderCode: result.orderCode,
      total: result.total,
      accountCreated: result.accountCreated,
    });
  } catch (err) {
    console.error("[api/orders] Lỗi:", err);
    return NextResponse.json(
      { ok: false, message: "Đã có lỗi xảy ra khi tạo đơn hàng." },
      { status: 500 },
    );
  }
}
