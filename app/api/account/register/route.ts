import { NextResponse } from "next/server";
import { z } from "zod";
import { registerCustomer } from "@/services/account-service";
import { sendAccountVerificationEmail } from "@/lib/mailer";
import { getSiteUrl } from "@/lib/site";

export const dynamic = "force-dynamic";

const registerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Họ tên phải có ít nhất 2 ký tự")
    .max(120, "Họ tên quá dài"),
  email: z.string().trim().email("Email không hợp lệ"),
  phone: z
    .string()
    .trim()
    .regex(/^(0|\+84)\d{8,11}$/, "Số điện thoại không hợp lệ")
    .optional()
    .or(z.literal("")),
  password: z
    .string()
    .min(6, "Mật khẩu phải có ít nhất 6 ký tự")
    .max(100, "Mật khẩu quá dài"),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      const errors: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const key = String(issue.path[0] ?? "form");
        if (!errors[key]) errors[key] = issue.message;
      }
      return NextResponse.json(
        {
          ok: false,
          message: "Vui lòng kiểm tra lại thông tin đăng ký.",
          errors,
        },
        { status: 400 },
      );
    }

    const result = await registerCustomer({
      name: parsed.data.name,
      email: parsed.data.email,
      phone: parsed.data.phone || null,
      password: parsed.data.password,
    });

    if (!result.ok) {
      return NextResponse.json(
        { ok: false, message: result.message, errors: { email: result.message } },
        { status: 409 },
      );
    }

    // Gửi email xác nhận. Lỗi mail KHÔNG làm hỏng đăng ký.
    let mailSent = true;
    try {
      await sendAccountVerificationEmail({
        fullName: result.user.name,
        email: result.user.email,
        verifyUrl: `${getSiteUrl()}/xac-nhan-email?token=${result.verifyToken}`,
      });
    } catch (err) {
      console.error("[api/account/register] Không gửi được email xác nhận:", err);
      mailSent = false;
    }

    return NextResponse.json({
      ok: true,
      message: mailSent
        ? "Đăng ký thành công. Vui lòng kiểm tra email để xác nhận tài khoản."
        : "Đăng ký thành công. Bạn có thể đăng nhập ngay. Nếu chưa nhận được email xác nhận, hãy dùng chức năng gửi lại.",
      emailSent: mailSent,
    });
  } catch (err) {
    console.error("[api/account/register] Lỗi:", err);
    return NextResponse.json(
      { ok: false, message: "Đã có lỗi xảy ra khi đăng ký. Vui lòng thử lại." },
      { status: 500 },
    );
  }
}
