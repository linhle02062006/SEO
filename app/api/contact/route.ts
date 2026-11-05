import { NextResponse } from "next/server";
import { z } from "zod";
import { getDb } from "@/database/db";
import { contactMessages } from "@/database/schema";

export const dynamic = "force-dynamic";

const schema = z.object({
  fullName: z.string().trim().min(2, "Vui lòng nhập họ và tên").max(120),
  email: z.string().trim().email("Email không hợp lệ"),
  phone: z
    .string()
    .trim()
    .min(8, "Số điện thoại không hợp lệ")
    .max(24)
    .optional()
    .or(z.literal("")),
  subject: z.string().trim().min(3, "Vui lòng nhập tiêu đề").max(200),
  content: z.string().trim().min(10, "Nội dung tối thiểu 10 ký tự").max(4000),
  // Honeypot: bot điền trường này
  website: z.string().max(0).optional(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = schema.safeParse(body);

    if (!parsed.success) {
      const errors: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const key = String(issue.path[0] ?? "form");
        if (!errors[key]) errors[key] = issue.message;
      }
      return NextResponse.json(
        { ok: false, message: "Dữ liệu không hợp lệ.", errors },
        { status: 400 },
      );
    }

    // Honeypot bị kích hoạt -> trả về thành công nhưng không lưu
    if (parsed.data.website) {
      return NextResponse.json({ ok: true, message: "Đã gửi." });
    }

    const db = await getDb();
    await db.insert(contactMessages).values({
      fullName: parsed.data.fullName,
      email: parsed.data.email,
      phone: parsed.data.phone || null,
      subject: parsed.data.subject,
      content: parsed.data.content,
    });

    return NextResponse.json({
      ok: true,
      message: "Cảm ơn bạn! Chúng tôi sẽ phản hồi trong vòng 24 giờ làm việc.",
    });
  } catch (err) {
    console.error("[api/contact] Lỗi:", err);
    return NextResponse.json(
      { ok: false, message: "Đã có lỗi xảy ra. Vui lòng thử lại sau." },
      { status: 500 },
    );
  }
}
