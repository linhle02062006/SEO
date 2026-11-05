"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Save } from "lucide-react";

type Errors = Record<string, string>;

export function ProfileForm({
  initialName,
  initialPhone,
}: {
  initialName: string;
  initialPhone: string;
}) {
  const router = useRouter();
  const [form, setForm] = useState({ name: initialName, phone: initialPhone });
  const [errors, setErrors] = useState<Errors>({});
  const [message, setMessage] = useState("");
  const [ok, setOk] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setErrors({});
    setMessage("");
    setOk(false);

    try {
      const res = await fetch("/api/account/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (!res.ok || !data.ok) {
        setErrors(data.errors ?? {});
        setMessage(data.message ?? "Cập nhật thất bại. Vui lòng thử lại.");
        setSubmitting(false);
        return;
      }

      setOk(true);
      setMessage(data.message ?? "Cập nhật thông tin thành công.");
      router.refresh();
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
          htmlFor="account-name"
          className="mb-1.5 block text-sm font-medium text-ink-800"
        >
          Họ và tên
        </label>
        <input
          id="account-name"
          name="name"
          required
          autoComplete="name"
          value={form.name}
          onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
          className="h-11 w-full rounded-lg border border-ink-200 px-3.5 text-sm outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
        />
        {errors.name && (
          <p className="mt-1.5 text-xs text-rose-600">{errors.name}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="account-phone"
          className="mb-1.5 block text-sm font-medium text-ink-800"
        >
          Số điện thoại
        </label>
        <input
          id="account-phone"
          name="phone"
          type="tel"
          autoComplete="tel"
          placeholder="0901234567"
          value={form.phone}
          onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
          className="h-11 w-full rounded-lg border border-ink-200 px-3.5 text-sm outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
        />
        {errors.phone && (
          <p className="mt-1.5 text-xs text-rose-600">{errors.phone}</p>
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
          <Save className="size-4" />
        )}
        Lưu thay đổi
      </button>
    </form>
  );
}
