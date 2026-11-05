"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, Loader2, UserPlus } from "lucide-react";
import { ROUTES } from "@/lib/site";

type Errors = Record<string, string>;

export function CustomerRegisterForm() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<Errors>({});
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  function update(key: keyof typeof form, value: string) {
    setForm((p) => ({ ...p, [key]: value }));
    setErrors((p) => {
      if (!p[key]) return p;
      const next = { ...p };
      delete next[key];
      return next;
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrors({});
    setMessage("");

    if (form.password !== form.confirmPassword) {
      setErrors({ confirmPassword: "Mật khẩu xác nhận không khớp." });
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch("/api/account/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          password: form.password,
        }),
      });
      const data = await res.json();

      if (!res.ok || !data.ok) {
        setErrors(data.errors ?? {});
        setMessage(data.message ?? "Đăng ký thất bại. Vui lòng thử lại.");
        setSubmitting(false);
        return;
      }

      router.push(`${ROUTES.login}?registered=1`);
    } catch {
      setMessage("Không kết nối được máy chủ, vui lòng thử lại.");
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-5" noValidate>
      {message && (
        <div
          role="alert"
          className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700"
        >
          {message}
        </div>
      )}

      <div>
        <label
          htmlFor="name"
          className="mb-1.5 block text-sm font-medium text-ink-800"
        >
          Họ và tên
        </label>
        <input
          id="name"
          name="name"
          required
          autoComplete="name"
          placeholder="Nguyễn Văn A"
          value={form.name}
          onChange={(e) => update("name", e.target.value)}
          className="h-11 w-full rounded-lg border border-ink-200 px-3.5 text-sm outline-none transition placeholder:text-ink-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
        />
        {errors.name && (
          <p className="mt-1.5 text-xs text-rose-600">{errors.name}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="email"
          className="mb-1.5 block text-sm font-medium text-ink-800"
        >
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="email@example.com"
          value={form.email}
          onChange={(e) => update("email", e.target.value)}
          className="h-11 w-full rounded-lg border border-ink-200 px-3.5 text-sm outline-none transition placeholder:text-ink-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
        />
        {errors.email && (
          <p className="mt-1.5 text-xs text-rose-600">{errors.email}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="phone"
          className="mb-1.5 block text-sm font-medium text-ink-800"
        >
          Số điện thoại (không bắt buộc)
        </label>
        <input
          id="phone"
          name="phone"
          type="tel"
          autoComplete="tel"
          placeholder="0901234567"
          value={form.phone}
          onChange={(e) => update("phone", e.target.value)}
          className="h-11 w-full rounded-lg border border-ink-200 px-3.5 text-sm outline-none transition placeholder:text-ink-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
        />
        {errors.phone && (
          <p className="mt-1.5 text-xs text-rose-600">{errors.phone}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="password"
          className="mb-1.5 block text-sm font-medium text-ink-800"
        >
          Mật khẩu
        </label>
        <div className="relative">
          <input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            required
            minLength={6}
            autoComplete="new-password"
            placeholder="Tối thiểu 6 ký tự"
            value={form.password}
            onChange={(e) => update("password", e.target.value)}
            className="h-11 w-full rounded-lg border border-ink-200 px-3.5 pr-11 text-sm outline-none transition placeholder:text-ink-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-2 top-1/2 grid size-8 -translate-y-1/2 place-items-center rounded-md text-ink-400 transition hover:bg-ink-100 hover:text-ink-700"
            aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
          >
            {showPassword ? (
              <EyeOff className="size-4" />
            ) : (
              <Eye className="size-4" />
            )}
          </button>
        </div>
        {errors.password && (
          <p className="mt-1.5 text-xs text-rose-600">{errors.password}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="confirmPassword"
          className="mb-1.5 block text-sm font-medium text-ink-800"
        >
          Xác nhận mật khẩu
        </label>
        <input
          id="confirmPassword"
          name="confirmPassword"
          type={showPassword ? "text" : "password"}
          required
          autoComplete="new-password"
          placeholder="Nhập lại mật khẩu"
          value={form.confirmPassword}
          onChange={(e) => update("confirmPassword", e.target.value)}
          className="h-11 w-full rounded-lg border border-ink-200 px-3.5 text-sm outline-none transition placeholder:text-ink-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
        />
        {errors.confirmPassword && (
          <p className="mt-1.5 text-xs text-rose-600">{errors.confirmPassword}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-brand-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {submitting ? (
          <>
            <Loader2 className="size-4 animate-spin" />
            Đang đăng ký...
          </>
        ) : (
          <>
            <UserPlus className="size-4" />
            Tạo tài khoản
          </>
        )}
      </button>

      <p className="text-center text-sm text-ink-600">
        Đã có tài khoản?{" "}
        <Link
          href={ROUTES.login}
          className="font-medium text-brand-600 transition hover:text-brand-700 hover:underline"
        >
          Đăng nhập
        </Link>
      </p>
    </form>
  );
}
