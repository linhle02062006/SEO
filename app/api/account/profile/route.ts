import { NextResponse } from "next/server";
import { z } from "zod";
import { getSession } from "@/lib/auth";
import {
  changeCustomerPassword,
  updateCustomerProfile,
} from "@/services/account-service";

export const dynamic = "force-dynamic";

const profileSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Họ tên phải có ít nhất 2 ký tự")
    .max(120, "Họ tên quá dài"),
  phone: z
    .string()
    .trim()
    .regex(/^(0|\+84)\d{8,11}$/, "Số điện thoại không hợp lệ")
    .optional()
    .or(z.literal("")),
});

const passwordSchema = z.object({
  currentPassword: z.string().min(1, "Vui lòng nhập mật khẩu hiện tại"),
  newPassword: z
    .string()
    .min(6, "Mật khẩu mới phải có ít nhất 6 ký tự")
    .max(100, "Mật khẩu quá dài"),
});

export async function PATCH(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { ok: false, message: "Bạn cần đăng nhập để thực hiện thao tác này." },
        { status: 401 },
      );
    }

    const body = await request.json();

    // Đổi mật khẩu
    if (body?.action === "change-password") {
      const parsed = passwordSchema.safeParse(body);
      if (!parsed.success) {
        const errors: Record<string, string> = {};
        for (const issue of parsed.error.issues) {
          const key = String(issue.path[0] ?? "form");
          if (!errors[key]) errors[key] = issue.message;
        }
        return NextResponse.json(
          { ok: false, message: "Vui lòng kiểm tra lại thông tin.", errors },
          { status: 400 },
        );
      }

      const result = await changeCustomerPassword(
        session.sub,
        parsed.data.currentPassword,
        parsed.data.newPassword,
      );

      if (!result.ok) {
        return NextResponse.json(
          {
            ok: false,
            message: result.message,
            errors: result.field ? { [result.field]: result.message } : undefined,
          },
          { status: 400 },
        );
      }

      return NextResponse.json({
        ok: true,
        message: "Đổi mật khẩu thành công.",
      });
    }

    // Cập nhật hồ sơ
    const parsed = profileSchema.safeParse(body);
    if (!parsed.success) {
      const errors: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const key = String(issue.path[0] ?? "form");
        if (!errors[key]) errors[key] = issue.message;
      }
      return NextResponse.json(
        { ok: false, message: "Vui lòng kiểm tra lại thông tin.", errors },
        { status: 400 },
      );
    }

    const result = await updateCustomerProfile(session.sub, {
      name: parsed.data.name,
      phone: parsed.data.phone || null,
    });

    if (!result.ok) {
      return NextResponse.json(
        { ok: false, message: result.message },
        { status: 400 },
      );
    }

    return NextResponse.json({
      ok: true,
      message: "Cập nhật thông tin thành công.",
    });
  } catch (err) {
    console.error("[api/account/profile] Lỗi:", err);
    return NextResponse.json(
      { ok: false, message: "Đã có lỗi xảy ra. Vui lòng thử lại." },
      { status: 500 },
    );
  }
}
