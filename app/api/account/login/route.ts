import { NextResponse } from "next/server";
import { z } from "zod";
import { loginCustomer } from "@/services/account-service";
import { createSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

const loginSchema = z.object({
  email: z.string().trim().email("Email không hợp lệ"),
  password: z.string().min(1, "Vui lòng nhập mật khẩu"),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = loginSchema.safeParse(body);

    if (!parsed.success) {
      const errors: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const key = String(issue.path[0] ?? "form");
        if (!errors[key]) errors[key] = issue.message;
      }
      return NextResponse.json(
        { ok: false, message: "Vui lòng nhỉp lại thông tin.", errors },
        { status: 400 },
      );
    }

    const result = await loginCustomer(parsed.data.email, parsed.data.password);

    if (!result.ok) {
      return NextResponse.json(
        { ok: false, message: result.message },
        { status: 401 },
      );
    }

    // Tài khoản quản trị đăng nhập ở khu vực riêng, không cho vào session khách hàng.
    if (result.user.role !== "customer") {
      return NextResponse.json(
        {
          ok: false,
          message:
            "Tài khoản quản trị vui lòng đăng nhập tại trang quản trị.",
        },
        { status: 403 },
      );
    }

    await createSession({
      id: result.user.id,
      email: result.user.email,
      name: result.user.name,
      role: result.user.role,
    });

    return NextResponse.json({
      ok: true,
      message: "Đăng nhập thành công.",
      user: {
        id: result.user.id,
        email: result.user.email,
        name: result.user.name,
      },
    });
  } catch (err) {
    console.error("[api/account/login] Lỗi:", err);
    return NextResponse.json(
      { ok: false, message: "Đã có lỗi xảy ra khi đăng nhập." },
      { status: 500 },
    );
  }
}
