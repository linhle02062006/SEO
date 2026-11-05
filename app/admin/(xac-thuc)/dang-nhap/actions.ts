"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { authenticate } from "@/lib/password";
import { createSession } from "@/lib/auth";

const loginSchema = z.object({
  email: z.string().trim().email("Email không hợp lệ"),
  password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
  next: z.string().optional(),
});

export type LoginState = {
  ok: boolean;
  message?: string;
  errors?: Record<string, string>;
};

export async function loginAction(
  _prev: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
    next: formData.get("next") ?? undefined,
  });

  if (!parsed.success) {
    const errors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] ?? "form");
      if (!errors[key]) errors[key] = issue.message;
    }
    return { ok: false, message: "Vui lòng kiểm tra lại thông tin.", errors };
  }

  const user = await authenticate(parsed.data.email, parsed.data.password);

  if (!user) {
    return {
      ok: false,
      message: "Email hoặc mật khẩu không đúng.",
    };
  }

  if (!["admin", "editor"].includes(user.role)) {
    return {
      ok: false,
      message: "Tài khoản này không có quyền truy cập trang quản trị.",
    };
  }

  await createSession({
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  });

  // Chỉ cho phép chuyển hướng nội bộ
  const next = parsed.data.next;
  redirect(
    next && next.startsWith("/admin") && !next.startsWith("//")
      ? next
      : "/admin",
  );
}
