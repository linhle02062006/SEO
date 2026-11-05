import { NextResponse } from "next/server";
import { z } from "zod";
import { getDb } from "@/database/db";
import { contactMessages } from "@/database/schema";
import { sendContactEmail } from "@/lib/mailer";

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

const SUCCESS_MESSAGE = "Cảm ơn bạn! Yêu cầu tư vấn đã được gửi thành công.";
const FAILURE_MESSAGE =
  "Không thể gửi yêu cầu lúc này. Vui lòng thử lại sau.";

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

    // Honeypot bị kích hoạt -> trả về thành công nhưng không lưu/không gửi
    if (parsed.data.website) {
      return NextResponse.json({ ok: true, message: SUCCESS_MESSAGE });
    }

    const { fullName, email, phone, subject, content } = parsed.data;

    // 1) Gửi email thật. Nếu SMTP lỗi -> KHÔNG được báo "gửi thành công".
    try {
      await sendContactEmail({
        fullName,
        email,
        phone: phone || null,
        subject,
        content,
      });
    } catch (mailErr) {
      console.error("[api/contact] Gửi email thất bại:", mailErr);
      // Vẫn lưu vào DB để không mất yêu cầu của khách — có thể xử lý lại sau.
      await saveMessage({ fullName, email, phone, subject, content }).catch(
        (dbErr) => console.error("[api/contact] Lưu DB thất bại:", dbErr),
      );
      return NextResponse.json(
        { ok: false, message: FAILURE_MESSAGE },
        { status: 502 },
      );
    }

    // 2) Lưu vào DB để lưu lịch sử (sau khi email đã gửi thành công).
    await saveMessage({ fullName, email, phone, subject, content }).catch(
      (dbErr) => console.error("[api/contact] Lưu DB thất bại:", dbErr),
    );

    return NextResponse.json({ ok: true, message: SUCCESS_MESSAGE });
  } catch (err) {
    console.error("[api/contact] Lỗi:", err);
    return NextResponse.json(
      { ok: false, message: FAILURE_MESSAGE },
      { status: 500 },
    );
  }
}

async function saveMessage(data: {
  fullName: string;
  email: string;
  phone?: string | null;
  subject: string;
  content: string;
}) {
  const db = await getDb();
  await db.insert(contactMessages).values({
    fullName: data.fullName,
    email: data.email,
    phone: data.phone || null,
    subject: data.subject,
    content: data.content,
  });
}
