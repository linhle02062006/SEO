"use client";

import { useState } from "react";
import { Loader2, Send, CheckCircle2 } from "lucide-react";
import { useToast } from "@/components/ui/ToastProvider";

type Errors = Record<string, string>;

/** Thông báo chuẩn — phải khớp chính xác với API route. */
const SUCCESS_MESSAGE = "Cảm ơn bạn! Yêu cầu tư vấn đã được gửi thành công.";
const FAILURE_MESSAGE =
  "Không thể gửi yêu cầu lúc này. Vui lòng thử lại sau.";

export function ContactForm() {
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [success, setSuccess] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    setLoading(true);
    setErrors({});
    setSuccess(null);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();

      if (!res.ok || !json.ok) {
        setErrors(json.errors ?? {});
        toast.error(json.message ?? FAILURE_MESSAGE);
      } else {
        setSuccess(json.message ?? SUCCESS_MESSAGE);
        toast.success(json.message ?? SUCCESS_MESSAGE);
        form.reset();
      }
    } catch {
      toast.error(FAILURE_MESSAGE);
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="flex h-full flex-col items-center justify-center rounded-xl border border-emerald-200 bg-emerald-50 p-10 text-center">
        <CheckCircle2 className="size-10 text-emerald-600" />
        <h2 className="mt-4 text-lg font-bold text-emerald-900">
          Gửi thông tin thành công
        </h2>
        <p className="mt-2 max-w-md text-sm text-emerald-800">{success}</p>
        <button
          type="button"
          onClick={() => setSuccess(null)}
          className="mt-6 rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700"
        >
          Gửi tin nhắn khác
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="relative rounded-xl border border-ink-200 bg-white p-6"
      noValidate
    >
      <h2 className="text-base font-semibold text-ink-950">Gửi tin nhắn</h2>
      <p className="mt-1 text-xs text-ink-500">
        Các trường có dấu * là bắt buộc.
      </p>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <Field label="Họ và tên" name="fullName" required error={errors.fullName}>
          <input
            type="text"
            name="fullName"
            required
            placeholder="Nguyễn Văn A"
            className={inputCls(errors.fullName)}
          />
        </Field>

        <Field label="Email" name="email" required error={errors.email}>
          <input
            type="email"
            name="email"
            required
            placeholder="email@example.com"
            className={inputCls(errors.email)}
          />
        </Field>

        <Field label="Số điện thoại (không bắt buộc)" name="phone" error={errors.phone}>
          <input
            type="tel"
            name="phone"
            placeholder="Nhập số điện thoại của bạn (nếu muốn)"
            className={inputCls(errors.phone)}
          />
        </Field>

        <Field label="Tiêu đề" name="subject" required error={errors.subject}>
          <input
            type="text"
            name="subject"
            required
            placeholder="Tư vấn cáp sạc nhanh 20W"
            className={inputCls(errors.subject)}
          />
        </Field>
      </div>

      <div className="mt-4">
        <Field label="Nội dung" name="content" required error={errors.content}>
          <textarea
            name="content"
            required
            rows={6}
            placeholder="Mô tả nhu cầu của bạn để chúng tôi tư vấn chính xác nhất..."
            className={inputCls(errors.content)}
          />
        </Field>
      </div>

      {/* Honeypot — ẩn khỏi người dùng, chống bot */}
      <div className="absolute left-[-9999px]" aria-hidden>
        <label>
          Website
          <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-brand-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
      >
        {loading ? (
          <>
            <Loader2 className="size-4 animate-spin" />
            Đang gửi...
          </>
        ) : (
          <>
            <Send className="size-4" />
            Gửi tin nhắn
          </>
        )}
      </button>
    </form>
  );
}

function Field({
  label,
  name,
  required,
  error,
  children,
}: {
  label: string;
  name: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label
        htmlFor={name}
        className="mb-1.5 block text-xs font-medium text-ink-700"
      >
        {label}
        {required && <span className="text-rose-500"> *</span>}
      </label>
      {children}
      {error && <p className="mt-1 text-xs text-rose-600">{error}</p>}
    </div>
  );
}

function inputCls(error?: string) {
  return [
    "w-full rounded-lg border bg-white px-3 py-2.5 text-sm text-ink-900 outline-none transition placeholder:text-ink-400 focus:ring-2",
    error
      ? "border-rose-300 focus:border-rose-500 focus:ring-rose-100"
      : "border-ink-200 focus:border-brand-500 focus:ring-brand-100",
  ].join(" ");
}
