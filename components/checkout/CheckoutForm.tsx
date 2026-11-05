"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Banknote,
  Landmark,
  ShoppingBag,
  ArrowLeft,
  Loader2,
  ShieldCheck,
  Truck,
  UserPlus,
} from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { formatPrice } from "@/lib/format";
import { ROUTES } from "@/lib/site";
import { cn } from "@/lib/utils";
import { trackClientEvent } from "@/lib/analytics-client";
import { useToast } from "@/components/ui/ToastProvider";

type Errors = Record<string, string>;

export function CheckoutForm({ siteName }: { siteName: string }) {
  const router = useRouter();
  const { items, subtotal, shippingFee, total, clearCart } = useCart();
  const { error: toastError, success: toastSuccess } = useToast();

  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    email: "",
    address: "",
    note: "",
    paymentMethod: "cod" as "cod" | "bank_transfer",
  });
  const [createAccount, setCreateAccount] = useState(true);
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  // Kiểm tra khách đã đăng nhập chưa (session server-side).
  useEffect(() => {
    let cancelled = false;
    fetch("/api/account/session")
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return;
        if (data?.authenticated) {
          setIsLoggedIn(true);
          setCreateAccount(false);
          // Tự điền thông tin đã biết.
          setForm((p) => ({
            ...p,
            fullName: p.fullName || data.user?.name || "",
            email: p.email || data.user?.email || "",
            phone: p.phone || data.user?.phone || "",
          }));
        }
      })
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (items.length > 0) {
      trackClientEvent("begin_checkout", { value: total });
    }
  }, [items.length, total]);

  function update<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((p) => ({ ...p, [key]: value }));
    setErrors((p) => {
      if (!p[key as string]) return p;
      const next = { ...p };
      delete next[key as string];
      return next;
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (items.length === 0) return;
    setSubmitting(true);
    setErrors({});

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          createAccount: !isLoggedIn && createAccount,
          password: !isLoggedIn && createAccount ? password : undefined,
          isLoggedIn,
          items: items.map((i) => ({
            productId: i.id,
            quantity: i.quantity,
          })),
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.ok) {
        setErrors(data.errors ?? {});
        toastError(data.message ?? "Đặt hàng thất bại, vui lòng thử lại.");
        setSubmitting(false);
        return;
      }

      clearCart();
      if (data.accountCreated) {
        toastSuccess(
          "Đơn hàng đã được tạo. Vui lòng kiểm tra email để xác nhận tài khoản.",
        );
      }
      router.push(`${ROUTES.orderSuccess}/${data.orderCode}`);
    } catch {
      toastError("Không kết nối được máy chủ, vui lòng thử lại.");
      setSubmitting(false);
    }
  }

  if (!mounted) {
    return (
      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_380px]">
        <div className="skeleton h-96 rounded-xl" />
        <div className="skeleton h-72 rounded-xl" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="mt-8 rounded-xl border border-dashed border-ink-300 bg-ink-50 px-6 py-16 text-center">
        <span className="mx-auto grid size-16 place-items-center rounded-full bg-white">
          <ShoppingBag className="size-7 text-ink-400" />
        </span>
        <h2 className="mt-4 text-base font-semibold text-ink-900">
          Không có sản phẩm để thanh toán
        </h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-ink-600">
          Giỏ hàng của bạn đang trống. Hãy thêm sản phẩm trước khi đặt hàng.
        </p>
        <Link
          href={ROUTES.products}
          className="mt-6 inline-block rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700"
        >
          Mua sắm ngay
        </Link>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-8 grid gap-8 lg:grid-cols-[1fr_380px]"
      noValidate
    >
      <div className="space-y-6">
        {/* Thông tin người nhận */}
        <section className="rounded-xl border border-ink-200 bg-white p-5">
          <h2 className="text-base font-semibold text-ink-950">
            Thông tin người nhận
          </h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <Field
              label="Họ và tên *"
              name="fullName"
              value={form.fullName}
              onChange={(v) => update("fullName", v)}
              error={errors.fullName}
              placeholder="Nguyễn Văn A"
              autoComplete="name"
            />
            <Field
              label="Số điện thoại *"
              name="phone"
              type="tel"
              value={form.phone}
              onChange={(v) => update("phone", v)}
              error={errors.phone}
              placeholder="0901234567"
              autoComplete="tel"
            />
            <div className="sm:col-span-2">
              <Field
                label="Email (không bắt buộc)"
                name="email"
                type="email"
                value={form.email}
                onChange={(v) => update("email", v)}
                error={errors.email}
                placeholder="email@example.com"
                autoComplete="email"
              />
            </div>

            {/* Tạo tài khoản khách hàng */}
            {!isLoggedIn && (
              <div className="sm:col-span-2">
                <label
                  htmlFor="createAccount"
                  className="flex cursor-pointer items-start gap-3 rounded-lg border border-ink-200 bg-ink-50 p-3.5 transition hover:border-brand-300"
                >
                  <input
                    id="createAccount"
                    type="checkbox"
                    checked={createAccount}
                    onChange={(e) => setCreateAccount(e.target.checked)}
                    className="mt-0.5 size-4 shrink-0 border-ink-300 text-brand-600 focus:ring-brand-500"
                  />
                  <span className="min-w-0">
                    <span className="flex items-center gap-1.5 text-sm font-medium text-ink-900">
                      <UserPlus className="size-4 text-brand-600" />
                      Tạo tài khoản để theo dõi đơn hàng
                    </span>
                    <span className="mt-0.5 block text-xs leading-5 text-ink-500">
                      Xem lịch sử đơn hàng, lưu sổ địa chỉ và danh sách yêu
                      thích. Chúng tôi sẽ gửi email xác nhận để kích hoạt.
                    </span>
                  </span>
                </label>

                {createAccount && (
                  <div className="mt-3">
                    <Field
                      label="Mật khẩu tài khoản *"
                      name="password"
                      type="password"
                      value={password}
                      onChange={(v) => {
                        setPassword(v);
                        setErrors((p) => {
                          if (!p.password) return p;
                          const next = { ...p };
                          delete next.password;
                          return next;
                        });
                      }}
                      error={errors.password}
                      placeholder="Tối thiểu 6 ký tự"
                      autoComplete="new-password"
                    />
                  </div>
                )}
              </div>
            )}

            {isLoggedIn && (
              <p className="sm:col-span-2 rounded-lg border border-emerald-200 bg-emerald-50 px-3.5 py-2.5 text-xs text-emerald-800">
                Bạn đang đăng nhập. Đơn hàng sẽ được lưu vào tài khoản của bạn.
              </p>
            )}
            <div className="sm:col-span-2">
              <Field
                label="Địa chỉ nhận hàng *"
                name="address"
                value={form.address}
                onChange={(v) => update("address", v)}
                error={errors.address}
                placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành phố"
                autoComplete="street-address"
                textarea
              />
            </div>
            <div className="sm:col-span-2">
              <Field
                label="Ghi chú cho đơn hàng (không bắt buộc)"
                name="note"
                value={form.note}
                onChange={(v) => update("note", v)}
                error={errors.note}
                placeholder="Ví dụ: gọi trước khi giao, giao sau 18h"
                textarea
              />
            </div>
          </div>
        </section>

        {/* Phương thức thanh toán */}
        <section className="rounded-xl border border-ink-200 bg-white p-5">
          <h2 className="text-base font-semibold text-ink-950">
            Phương thức thanh toán
          </h2>
          <div className="mt-4 space-y-3">
            <PaymentOption
              id="cod"
              checked={form.paymentMethod === "cod"}
              onChange={() => update("paymentMethod", "cod")}
              icon={<Banknote className="size-5 text-brand-600" />}
              title="Thanh toán khi nhận hàng (COD)"
              desc="Bạn kiểm tra hàng rồi thanh toán cho shipper. Áp dụng toàn quốc."
            />
            <PaymentOption
              id="bank_transfer"
              checked={form.paymentMethod === "bank_transfer"}
              onChange={() => update("paymentMethod", "bank_transfer")}
              icon={<Landmark className="size-5 text-brand-600" />}
              title="Chuyển khoản ngân hàng"
              desc="Thông tin tài khoản sẽ hiển thị ở trang xác nhận đơn hàng."
            />
          </div>
          {errors.paymentMethod && (
            <p className="mt-2 text-xs text-rose-600">{errors.paymentMethod}</p>
          )}
        </section>

        {/* Cam kết */}
        <ul className="grid gap-3 sm:grid-cols-2">
          {[
            { icon: ShieldCheck, label: "Thanh toán an toàn" },
            { icon: Truck, label: "Giao hàng 24-48h toàn quốc" },
          ].map((w) => (
            <li
              key={w.label}
              className="flex items-center gap-2 rounded-lg border border-ink-200 px-3 py-2.5 text-xs text-ink-700"
            >
              <w.icon className="size-4 shrink-0 text-brand-600" />
              {w.label}
            </li>
          ))}
        </ul>
      </div>

      {/* Tóm tắt */}
      <aside className="lg:sticky lg:top-24 lg:self-start">
        <div className="rounded-xl border border-ink-200 bg-white p-5">
          <h2 className="text-base font-semibold text-ink-950">
            Đơn hàng của bạn ({items.length})
          </h2>

          <ul className="mt-4 max-h-72 space-y-3 overflow-y-auto pr-1">
            {items.map((item) => (
              <li key={item.id} className="flex gap-3">
                <div className="relative size-14 shrink-0 overflow-hidden rounded-lg bg-ink-50">
                  <Image
                    src={item.image ?? "/products/placeholder.svg"}
                    alt={item.name}
                    fill
                    sizes="56px"
                    className="object-cover"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="line-clamp-2 text-xs font-medium text-ink-800">
                    {item.name}
                  </p>
                  <p className="mt-0.5 text-xs text-ink-500">
                    {item.quantity} × {formatPrice(item.salePrice ?? item.price)}
                  </p>
                </div>
                <p className="shrink-0 text-xs font-semibold text-ink-900">
                  {formatPrice((item.salePrice ?? item.price) * item.quantity)}
                </p>
              </li>
            ))}
          </ul>

          <dl className="mt-4 space-y-2 border-t border-ink-100 pt-4 text-sm">
            <div className="flex justify-between">
              <dt className="text-ink-600">Tạm tính</dt>
              <dd className="font-medium text-ink-900">
                {formatPrice(subtotal)}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-ink-600">Phí vận chuyển</dt>
              <dd className="font-medium text-ink-900">
                {shippingFee === 0 ? (
                  <span className="text-emerald-600">Miễn phí</span>
                ) : (
                  formatPrice(shippingFee)
                )}
              </dd>
            </div>
            <div className="flex justify-between border-t border-ink-100 pt-2 text-base">
              <dt className="font-semibold text-ink-950">Tổng thanh toán</dt>
              <dd className="font-bold text-accent-600">
                {formatPrice(total)}
              </dd>
            </div>
          </dl>

          <button
            type="submit"
            disabled={submitting}
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg bg-brand-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {submitting ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Đang xử lý...
              </>
            ) : (
              "Đặt hàng"
            )}
          </button>

          <Link
            href={ROUTES.cart}
            className="mt-3 flex items-center justify-center gap-1.5 text-xs font-medium text-ink-500 transition hover:text-brand-600"
          >
            <ArrowLeft className="size-3.5" />
            Quay lại giỏ hàng
          </Link>

          <p className="mt-4 border-t border-ink-100 pt-4 text-[11px] leading-5 text-ink-500">
            Bằng việc đặt hàng, bạn đồng ý với{" "}
            <Link
              href={`${ROUTES.policies}/dieu-khoan-su-dung`}
              className="text-brand-600 hover:underline"
            >
              Điều khoản sử dụng
            </Link>{" "}
            và{" "}
            <Link
              href={`${ROUTES.policies}/chinh-sach-doi-tra`}
              className="text-brand-600 hover:underline"
            >
              Chính sách đổi trả
            </Link>{" "}
            của {siteName}.
          </p>
        </div>
      </aside>
    </form>
  );
}

function Field({
  label,
  name,
  value,
  onChange,
  error,
  placeholder,
  type = "text",
  textarea = false,
  autoComplete,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  placeholder?: string;
  type?: string;
  textarea?: boolean;
  autoComplete?: string;
}) {
  const id = `field-${name}`;
  const base = cn(
    "w-full rounded-lg border px-3 py-2.5 text-sm outline-none transition placeholder:text-ink-400",
    error
      ? "border-rose-400 focus:border-rose-500 focus:ring-2 focus:ring-rose-100"
      : "border-ink-200 focus:border-brand-400 focus:ring-2 focus:ring-brand-100",
  );

  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-ink-800">
        {label}
      </label>
      {textarea ? (
        <textarea
          id={id}
          name={name}
          rows={3}
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
          className={cn(base, "resize-y")}
        />
      ) : (
        <input
          id={id}
          name={name}
          type={type}
          value={value}
          placeholder={placeholder}
          autoComplete={autoComplete}
          onChange={(e) => onChange(e.target.value)}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
          className={base}
        />
      )}
      {error && (
        <p id={`${id}-error`} className="mt-1.5 text-xs text-rose-600">
          {error}
        </p>
      )}
    </div>
  );
}

function PaymentOption({
  id,
  checked,
  onChange,
  icon,
  title,
  desc,
}: {
  id: string;
  checked: boolean;
  onChange: () => void;
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <label
      htmlFor={id}
      className={cn(
        "flex cursor-pointer items-start gap-3 rounded-lg border p-4 transition",
        checked
          ? "border-brand-500 bg-brand-50/50 ring-1 ring-brand-200"
          : "border-ink-200 hover:border-ink-300",
      )}
    >
      <input
        id={id}
        type="radio"
        name="paymentMethod"
        checked={checked}
        onChange={onChange}
        className="mt-1 size-4 shrink-0 border-ink-300 text-brand-600 focus:ring-brand-500"
      />
      <span className="shrink-0">{icon}</span>
      <span className="min-w-0">
        <span className="block text-sm font-medium text-ink-900">{title}</span>
        <span className="mt-0.5 block text-xs leading-5 text-ink-500">
          {desc}
        </span>
      </span>
    </label>
  );
}
