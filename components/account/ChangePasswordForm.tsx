"use client";

import { useState } from "react";
import { Loader2, KeyRound } from "lucide-react";

type Errors = Record<string, string>;

export function ChangePasswordForm() {
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<Errors>({});
  const [message, setMessage] = useState("");
  const [ok, setOk] = useState(false);
  const [submitting, setSubmitting] = useState(false);

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
    setOk(false);

    if (form.newPassword !== form.confirmPassword) {
      setErrors({ confirmPassword: "Mật khẩu xác nhận không khớp." });
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch("/api/account/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "change-password",
          currentPassword: form.currentPassword,
          newPassword: form.newPassword,
        }),
      });
      const data = await res.json();

      if (!res.ok || !data.ok) {
        setErrors(data.errors ?? {});
        setMessage(data.message ?? "Đổi mật khẩu thất bại. Vui lòng thử lại.");
        setSubmitting(false);
        return;
      }

      setOk(true);
      setMessage(data.message ?? "Đổi mật khẩu thành công.");
      setForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch {
      setMessage("Không kết nối được máy chủ, vui lòng thử lại.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      {message && (
        <div
          role="alert"
          className={`rounded-lg border px-4 py-3 text-sm ${
            ok
              ? "border-emerald-200 bg-emerald-50 text-emerald-800"
              : "border-rose-200 bg-rose-50 text-rose-700"
          }`}
        >
          {message}
        </div>
      )}

      <div>
        <label
          htmlFor="current-password"
          className="mb-1.5 block text-sm font-medium text-ink-800"
        >
          Mật khẩu hiện tại
        </label>
        <input
          id="current-password"
          name="currentPassword"
          type="password"
          required
          autoComplete="current-password"
          value={form.currentPassword}
          onChange={(e) => update("currentPassword", e.target.value)}
          className="h-11 w-full rounded-lg border border-ink-200 px-3.5 text-sm outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
        />
        {errors.currentPassword && (
          <p className="mt-1.5 text-xs text-rose-600">{errors.currentPassword}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="new-password"
          className="mb-1.5 block text-sm font-medium text-ink-800"
        >
          Mật khẩu mới
        </label>
        <input
          id="new-password"
          name="newPassword"
          type="password"
          required
          minLength={6}
          autoComplete="new-password"
          placeholder="Tối thiểu 6 ký tự"
          value={form.newPassword}
          onChange={(e) => update("newPassword", e.target.value)}
          className="h-11 w-full rounded-lg border border-ink-200 px-3.5 text-sm outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
        />
        {errors.newPassword && (
          <p className="mt-1.5 text-xs text-rose-600">{errors.newPassword}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="confirm-password"
          className="mb-1.5 block text-sm font-medium text-ink-800"
        >
          Xác nhận mật khẩu mới
        </label>
        <input
          id="confirm-password"
          name="confirmPassword"
          type="password"
          required
          autoComplete="new-password"
          value={form.confirmPassword}
          onChange={(e) => update("confirmPassword", e.target.value)}
          className="h-11 w-full rounded-lg border border-ink-200 px-3.5 text-sm outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
        />
        {errors.confirmPassword && (
          <p className="mt-1.5 text-xs text-rose-600">{errors.confirmPassword}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {submitting ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <KeyRound className="size-4" />
        )}
        Đổi mật khẩu
      </button>
    </form>
  );
}
