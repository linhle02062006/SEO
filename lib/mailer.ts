import nodemailer, { type Transporter } from "nodemailer";

/**
 * Gửi email qua SMTP.
 *
 * CẤU HÌNH (không hard-code vào source — đặt trong `.env.local`):
 *   SMTP_HOST=smtp.gmail.com
 *   SMTP_PORT=587
 *   SMTP_SECURE=false
 *   SMTP_USER=<tài khoản gmail>
 *   SMTP_PASS=<app password của gmail>
 *   MAIL_FROM="TechZone <your@gmail.com>"
 *   CONTACT_EMAIL=1350080137@sv.hcmunre.edu.vn
 *
 * Nếu thiếu cấu hình hoặc SMTP báo lỗi -> `sendContactEmail` ném lỗi,
 * API route trả về thất bại. TUYỆT ĐỐI không báo "gửi thành công" khi
 * email thực tế chưa được gửi đi.
 */

export type ContactEmailPayload = {
  fullName: string;
  email: string;
  phone?: string | null;
  subject?: string | null;
  content: string;
};

/** Thông tin gửi email xác nhận tài khoản khách hàng. */
export type AccountEmailPayload = {
  fullName: string;
  email: string;
  verifyUrl: string;
  orderCode?: string | null;
};

/** Email nhận yêu cầu tư vấn. */
export function getContactEmail(): string {
  return (
    process.env.CONTACT_EMAIL?.trim() ||
    process.env.NEXT_PUBLIC_CONTACT_EMAIL?.trim() ||
    "1350080137@sv.hcmunre.edu.vn"
  );
}

/** Kiểm tra đủ cấu hình SMTP chưa (không kiểm tra mật khẩu có đúng không). */
export function isMailConfigured(): boolean {
  return Boolean(
    process.env.SMTP_HOST?.trim() &&
      process.env.SMTP_USER?.trim() &&
      process.env.SMTP_PASS?.trim(),
  );
}

let transporter: Transporter | null = null;

function getTransporter(): Transporter {
  if (transporter) return transporter;

  const host = process.env.SMTP_HOST?.trim();
  const user = process.env.SMTP_USER?.trim();
  const pass = process.env.SMTP_PASS?.trim();

  if (!host || !user || !pass) {
    throw new Error(
      "[mailer] Chưa cấu hình SMTP_HOST / SMTP_USER / SMTP_PASS. " +
        "Xem .env.example để thiết lập.",
    );
  }

  const port = Number(process.env.SMTP_PORT?.trim() || 587);
  const secure =
    process.env.SMTP_SECURE?.trim().toLowerCase() === "true" || port === 465;

  transporter = nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass },
    // Timeout ngắn để không treo request khi SMTP không phản hồi.
    connectionTimeout: 10_000,
    greetingTimeout: 10_000,
    socketTimeout: 20_000,
  });

  return transporter;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/**
 * Gửi yêu cầu tư vấn tới email của chủ shop.
 * Trả về `true` khi SMTP xác nhận gửi thành công, ném lỗi khi thất bại.
 */
export async function sendContactEmail(payload: ContactEmailPayload) {
  const to = getContactEmail();
  const from =
    process.env.MAIL_FROM?.trim() ||
    `TechZone <${process.env.SMTP_USER?.trim() || "no-reply@localhost"}>`;

  const subject = payload.subject?.trim()
    ? `[TechZone] ${payload.subject.trim()}`
    : "[TechZone] Yêu cầu tư vấn mới";

  const lines = [
    `Họ tên: ${payload.fullName}`,
    `Email: ${payload.email}`,
    payload.phone?.trim() ? `Số điện thoại: ${payload.phone.trim()}` : null,
    "",
    "Nội dung cần tư vấn:",
    payload.content,
  ].filter((l): l is string => l !== null);

  await getTransporter().sendMail({
    from,
    to,
    replyTo: payload.email,
    subject,
    text: lines.join("\n"),
    html: `
      <div style="font-family:system-ui,-apple-system,'Segoe UI',sans-serif;line-height:1.6;color:#0f172a">
        <h2 style="margin:0 0 12px;font-size:18px">Yêu cầu tư vấn mới</h2>
        <table cellpadding="0" cellspacing="0" style="border-collapse:collapse;font-size:14px">
          <tr><td style="padding:4px 12px 4px 0;color:#64748b">Họ tên</td><td style="padding:4px 0"><strong>${escapeHtml(payload.fullName)}</strong></td></tr>
          <tr><td style="padding:4px 12px 4px 0;color:#64748b">Email</td><td style="padding:4px 0"><a href="mailto:${escapeHtml(payload.email)}" style="color:#1b63f5">${escapeHtml(payload.email)}</a></td></tr>
          ${payload.phone?.trim() ? `<tr><td style="padding:4px 12px 4px 0;color:#64748b">Số điện thoại</td><td style="padding:4px 0">${escapeHtml(payload.phone.trim())}</td></tr>` : ""}
        </table>
        <hr style="border:none;border-top:1px solid #e2e8f0;margin:16px 0" />
        <p style="margin:0 0 8px;color:#64748b;font-size:13px">Nội dung cần tư vấn</p>
        <div style="white-space:pre-wrap;font-size:14px">${escapeHtml(payload.content)}</div>
      </div>
    `,
  });
}

/**
 * Gửi email xác nhận tài khoản cho khách hàng vừa đặt hàng (hoặc đăng ký).
 *
 * Email được gửi TỚI khách hàng (`to` = email của họ), khác với
 * `sendContactEmail` gửi tới chủ shop.
 */
export async function sendAccountVerificationEmail(
  payload: AccountEmailPayload,
) {
  const from =
    process.env.MAIL_FROM?.trim() ||
    `TechZone <${process.env.SMTP_USER?.trim() || "no-reply@localhost"}>`;

  const subject = payload.orderCode
    ? `[TechZone] Xác nhận tài khoản cho đơn hàng ${payload.orderCode}`
    : "[TechZone] Xác nhận tài khoản TechZone";

  const orderLine = payload.orderCode
    ? `<tr><td style="padding:4px 12px 4px 0;color:#64748b">Mã đơn hàng</td><td style="padding:4px 0"><strong>${escapeHtml(payload.orderCode)}</strong></td></tr>`
    : "";

  await getTransporter().sendMail({
    from,
    to: payload.email,
    subject,
    text: [
      `Chào ${payload.fullName},`,
      "",
      "Cảm ơn bạn đã đặt hàng tại TechZone. Tài khoản khách hàng của bạn đã được tạo.",
      "Vui lòng nhấn vào đường dẫn dưới đây để xác nhận email và kích hoạt tài khoản:",
      "",
      payload.verifyUrl,
      "",
      "Sau khi xác nhận, bạn có thể đăng nhập để xem lịch sử đơn hàng, quản lý sổ địa chỉ và danh sách yêu thích.",
      "",
      "Nếu bạn không yêu cầu tạo tài khoản, hãy bỏ qua email này.",
      "",
      "Trân trọng,",
      "TechZone",
    ].join("\n"),
    html: `
      <div style="font-family:system-ui,-apple-system,'Segoe UI',sans-serif;line-height:1.6;color:#0f172a">
        <h2 style="margin:0 0 12px;font-size:18px">Xác nhận tài khoản TechZone</h2>
        <p style="margin:0 0 12px;font-size:14px">Chào ${escapeHtml(payload.fullName)},</p>
        <p style="margin:0 0 12px;font-size:14px">
          Cảm ơn bạn đã đặt hàng tại TechZone. Tài khoản khách hàng của bạn đã được tạo với email
          <strong>${escapeHtml(payload.email)}</strong>.
        </p>
        <table cellpadding="0" cellspacing="0" style="border-collapse:collapse;font-size:14px">
          ${orderLine}
        </table>
        <p style="margin:16px 0 8px;font-size:14px">Nhấn nút bên dưới để xác nhận email và kích hoạt tài khoản:</p>
        <p style="margin:0 0 16px">
          <a href="${escapeHtml(payload.verifyUrl)}" style="display:inline-block;background:#1b63f5;color:#ffffff;text-decoration:none;padding:11px 22px;border-radius:8px;font-weight:600;font-size:14px">Xác nhận tài khoản</a>
        </p>
        <p style="margin:0 0 8px;font-size:13px;color:#64748b">Nếu nút không hoạt động, copy đường dẫn sau vào trình duyệt:</p>
        <p style="margin:0 0 16px;font-size:12px;word-break:break-all;color:#1b63f5">${escapeHtml(payload.verifyUrl)}</p>
        <p style="margin:0 0 8px;font-size:13px;color:#64748b">
          Sau khi xác nhận, bạn có thể đăng nhập để xem lịch sử đơn hàng, quản lý sổ địa chỉ và danh sách yêu thích.
        </p>
        <p style="margin:0;font-size:13px;color:#64748b">Nếu bạn không yêu cầu tạo tài khoản, hãy bỏ qua email này.</p>
      </div>
    `,
  });
}
