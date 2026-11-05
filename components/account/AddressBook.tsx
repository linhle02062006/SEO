"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, MapPin, Plus, Star, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/lib/format";
import { ROUTES } from "@/lib/site";

type Address = {
  id: number;
  label: string;
  fullName: string;
  phone: string;
  address: string;
  ward: string | null;
  district: string | null;
  city: string | null;
  isDefault: boolean;
};

type WishlistProduct = {
  id: number;
  name: string;
  slug: string;
  imageUrl: string | null;
  price: string | number;
  salePrice: string | number | null;
  stock: number;
};

export function AddressBook({ initialAddresses }: { initialAddresses: Address[] }) {
  const router = useRouter();
  const [addresses, setAddresses] = useState<Address[]>(initialAddresses);
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [ok, setOk] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [form, setForm] = useState({
    label: "Mặc định",
    fullName: "",
    phone: "",
    address: "",
    ward: "",
    district: "",
    city: "",
  });

  function update(key: keyof typeof form, value: string) {
    setForm((p) => ({ ...p, [key]: value }));
    setErrors((p) => {
      if (!p[key]) return p;
      const next = { ...p };
      delete next[key];
      return next;
    });
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setErrors({});
    setMessage("");
    setOk(false);

    try {
      const res = await fetch("/api/account/addresses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (!res.ok || !data.ok) {
        setErrors(data.errors ?? {});
        setMessage(data.message ?? "Không lưu được địa chỉ.");
        setSubmitting(false);
        return;
      }

      setAddresses(data.addresses ?? []);
      setForm({
        label: "Mặc định",
        fullName: "",
        phone: "",
        address: "",
        ward: "",
        district: "",
        city: "",
      });
      setOpen(false);
      setOk(true);
      setMessage(data.message ?? "Thêm địa chỉ thành công.");
      router.refresh();
    } catch {
      setMessage("Không kết nối được máy chủ, vui lòng thử lại.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Bạn có chắc muốn xoá địa chỉ này?")) return;

    try {
      const res = await fetch("/api/account/addresses", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setMessage(data.message ?? "Không xoá được địa chỉ.");
        return;
      }
      setAddresses(data.addresses ?? []);
      setOk(true);
      setMessage(data.message ?? "Đã xoá địa chỉ.");
      router.refresh();
    } catch {
      setMessage("Không kết nối được máy chủ, vui lòng thử lại.");
    }
  }

  async function handleSetDefault(id: number) {
    try {
      const res = await fetch("/api/account/addresses", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setMessage(data.message ?? "Không cập nhật được địa chỉ.");
        return;
      }
      setAddresses(data.addresses ?? []);
      setOk(true);
      setMessage(data.message ?? "Đã đặt địa chỉ mặc định.");
      router.refresh();
    } catch {
      setMessage("Không kết nối được máy chủ, vui lòng thử lại.");
    }
  }

  return (
    <div>
      {message && (
        <div
          role="alert"
          className={`mb-4 rounded-lg border px-4 py-3 text-sm ${
            ok
              ? "border-emerald-200 bg-emerald-50 text-emerald-800"
              : "border-rose-200 bg-rose-50 text-rose-700"
          }`}
        >
          {message}
        </div>
      )}

      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-ink-950">Sổ địa chỉ</h2>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="inline-flex items-center gap-1.5 rounded-lg border border-ink-200 px-3 py-1.5 text-xs font-medium text-ink-700 transition hover:bg-ink-50"
        >
          <Plus className="size-3.5" />
          Thêm địa chỉ
        </button>
      </div>

      {open && (
        <form
          onSubmit={handleAdd}
          className="mt-4 space-y-3 rounded-xl border border-ink-200 bg-ink-50 p-4"
          noValidate
        >
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label
                htmlFor="addr-label"
                className="mb-1.5 block text-xs font-medium text-ink-700"
              >
                Nhãn
              </label>
              <input
                id="addr-label"
                value={form.label}
                onChange={(e) => update("label", e.target.value)}
                placeholder="Nhà, Văn phòng…"
                className="h-10 w-full rounded-lg border border-ink-200 bg-white px-3 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
              />
            </div>
            <div>
              <label
                htmlFor="addr-name"
                className="mb-1.5 block text-xs font-medium text-ink-700"
              >
                Họ tên
              </label>
              <input
                id="addr-name"
                required
                value={form.fullName}
                onChange={(e) => update("fullName", e.target.value)}
                className="h-10 w-full rounded-lg border border-ink-200 bg-white px-3 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
              />
              {errors.fullName && (
                <p className="mt-1 text-xs text-rose-600">{errors.fullName}</p>
              )}
            </div>
            <div className="sm:col-span-2">
              <label
                htmlFor="addr-phone"
                className="mb-1.5 block text-xs font-medium text-ink-700"
              >
                Số điện thoại
              </label>
              <input
                id="addr-phone"
                type="tel"
                required
                value={form.phone}
                onChange={(e) => update("phone", e.target.value)}
                className="h-10 w-full rounded-lg border border-ink-200 bg-white px-3 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
              />
              {errors.phone && (
                <p className="mt-1 text-xs text-rose-600">{errors.phone}</p>
              )}
            </div>
            <div className="sm:col-span-2">
              <label
                htmlFor="addr-address"
                className="mb-1.5 block text-xs font-medium text-ink-700"
              >
                Địa chỉ
              </label>
              <textarea
                id="addr-address"
                rows={2}
                required
                value={form.address}
                onChange={(e) => update("address", e.target.value)}
                placeholder="Số nhà, đường…"
                className="w-full rounded-lg border border-ink-200 bg-white px-3 py-2 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
              />
              {errors.address && (
                <p className="mt-1 text-xs text-rose-600">{errors.address}</p>
              )}
            </div>
            <div>
              <label
                htmlFor="addr-ward"
                className="mb-1.5 block text-xs font-medium text-ink-700"
              >
                Phường/Xã
              </label>
              <input
                id="addr-ward"
                value={form.ward}
                onChange={(e) => update("ward", e.target.value)}
                className="h-10 w-full rounded-lg border border-ink-200 bg-white px-3 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
              />
            </div>
            <div>
              <label
                htmlFor="addr-district"
                className="mb-1.5 block text-xs font-medium text-ink-700"
              >
                Quận/Huyện
              </label>
              <input
                id="addr-district"
                value={form.district}
                onChange={(e) => update("district", e.target.value)}
                className="h-10 w-full rounded-lg border border-ink-200 bg-white px-3 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
              />
            </div>
            <div className="sm:col-span-2">
              <label
                htmlFor="addr-city"
                className="mb-1.5 block text-xs font-medium text-ink-700"
              >
                Tỉnh/Thành phố
              </label>
              <input
                id="addr-city"
                value={form.city}
                onChange={(e) => update("city", e.target.value)}
                className="h-10 w-full rounded-lg border border-ink-200 bg-white px-3 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? (
              <Loader2 className="size-3.5 animate-spin" />
            ) : (
              <MapPin className="size-3.5" />
            )}
            Lưu địa chỉ
          </button>
        </form>
      )}

      {addresses.length === 0 ? (
        <div className="mt-4 rounded-xl border border-dashed border-ink-300 bg-ink-50 px-4 py-8 text-center text-sm text-ink-500">
          Chưa có địa chỉ nào. Thêm địa chỉ để đặt hàng nhanh hơn lần sau.
        </div>
      ) : (
        <ul className="mt-4 space-y-3">
          {addresses.map((a) => (
            <li
              key={a.id}
              className="rounded-xl border border-ink-200 bg-white p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="flex items-center gap-2 text-sm font-semibold text-ink-950">
                    {a.label}
                    {a.isDefault && (
                      <span className="rounded-md bg-brand-50 px-2 py-0.5 text-[11px] font-medium text-brand-700 ring-1 ring-brand-200">
                        Mặc định
                      </span>
                    )}
                  </p>
                  <p className="mt-1 text-sm text-ink-800">
                    {a.fullName} · {a.phone}
                  </p>
                  <p className="mt-0.5 text-xs leading-5 text-ink-500">
                    {a.address}
                    {[a.ward, a.district, a.city].filter(Boolean).length > 0
                      ? `, ${[a.ward, a.district, a.city].filter(Boolean).join(", ")}`
                      : ""}
                  </p>
                </div>
                <div className="flex shrink-0 gap-1">
                  {!a.isDefault && (
                    <button
                      type="button"
                      onClick={() => handleSetDefault(a.id)}
                      className="rounded-lg border border-ink-200 px-2.5 py-1.5 text-[11px] font-medium text-ink-600 transition hover:bg-ink-50"
                    >
                      Đặt mặc định
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => handleDelete(a.id)}
                    aria-label="Xoá địa chỉ"
                    className="rounded-lg border border-ink-200 p-1.5 text-ink-400 transition hover:border-rose-300 hover:bg-rose-50 hover:text-rose-600"
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function WishlistGrid({ products }: { products: WishlistProduct[] }) {
  if (products.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-ink-300 bg-ink-50 px-4 py-10 text-center">
        <span className="mx-auto grid size-12 place-items-center rounded-full bg-white">
          <Star className="size-5 text-ink-400" />
        </span>
        <p className="mt-3 text-sm font-medium text-ink-900">
          Danh sách yêu thích còn trống
        </p>
        <p className="mt-1 text-xs text-ink-500">
          Nhấn biểu tượng trái tim trên sản phẩm để lưu lại.
        </p>
        <Link
          href={ROUTES.products}
          className="mt-4 inline-block rounded-lg bg-brand-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-brand-700"
        >
          Xem sản phẩm
        </Link>
      </div>
    );
  }

  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((p) => {
        const price = Number(p.price);
        const sale = p.salePrice != null ? Number(p.salePrice) : null;
        const finalPrice = sale != null && sale < price ? sale : price;

        return (
          <li
            key={p.id}
            className="overflow-hidden rounded-xl border border-ink-200 bg-white"
          >
            <Link
              href={`${ROUTES.products}/${p.slug}`}
              className="block aspect-square bg-ink-50"
            >
              {p.imageUrl && (
                <Image
                  src={p.imageUrl}
                  alt={p.name}
                  fill
                  sizes="(max-width: 640px) 100vw, 33vw"
                  className="object-cover"
                />
              )}
            </Link>
            <div className="p-3">
              <Link
                href={`${ROUTES.products}/${p.slug}`}
                className="line-clamp-2 text-sm font-medium text-ink-900 transition hover:text-brand-600"
              >
                {p.name}
              </Link>
              <p className="mt-1.5 text-sm font-bold text-accent-600">
                {formatPrice(finalPrice)}
              </p>
              {p.stock <= 0 && (
                <p className="mt-1 text-xs font-medium text-rose-600">
                  Hết hàng
                </p>
              )}
            </div>
          </li>
        );
      })}
    </ul>
  );
}
