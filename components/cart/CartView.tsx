"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, Truck } from "lucide-react";
import { useCart, FREE_SHIPPING_THRESHOLD } from "@/hooks/useCart";
import { formatPrice } from "@/lib/format";
import { ROUTES } from "@/lib/site";
import { useToast } from "@/components/ui/ToastProvider";

export function CartView() {
  const { items, count, subtotal, shippingFee, total, updateQuantity, removeItem, clearCart } =
    useCart();
  const { success } = useToast();

  const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const progress = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);

  if (items.length === 0) {
    return (
      <div className="mt-8 rounded-xl border border-dashed border-ink-300 bg-ink-50 px-6 py-16 text-center">
        <span className="mx-auto grid size-16 place-items-center rounded-full bg-white">
          <ShoppingBag className="size-7 text-ink-400" />
        </span>
        <h2 className="mt-4 text-base font-semibold text-ink-900">
          Giỏ hàng của bạn đang trống
        </h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-ink-600">
          Hãy khám phá danh mục phụ kiện điện thoại chính hãng gồm cáp sạc nhanh,
          củ sạc, tai nghe Bluetooth, sạc dự phòng và nhiều hơn nữa.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link
            href={ROUTES.products}
            className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700"
          >
            Mua sắm ngay
            <ArrowRight className="size-4" />
          </Link>
          <Link
            href={ROUTES.categories}
            className="rounded-lg border border-ink-200 px-5 py-2.5 text-sm font-medium text-ink-700 transition hover:bg-ink-50"
          >
            Xem danh mục
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
      {/* Danh sách */}
      <div>
        <div className="flex items-center justify-between border-b border-ink-100 pb-3">
          <p className="text-sm font-medium text-ink-800">
            {count} sản phẩm trong giỏ
          </p>
          <button
            type="button"
            onClick={() => {
              clearCart();
              success("Đã xóa toàn bộ sản phẩm khỏi giỏ hàng");
            }}
            className="text-xs font-medium text-ink-500 transition hover:text-rose-600"
          >
            Xóa tất cả
          </button>
        </div>

        <ul className="divide-y divide-ink-100">
          {items.map((item) => (
            <li key={item.id} className="flex gap-4 py-5">
              <Link
                href={`/san-pham/${item.slug}`}
                className="relative size-24 shrink-0 overflow-hidden rounded-xl bg-ink-50 sm:size-28"
              >
                <Image
                  src={item.image ?? "/products/placeholder.svg"}
                  alt={item.name}
                  fill
                  sizes="112px"
                  className="object-cover"
                />
              </Link>

              <div className="flex min-w-0 flex-1 flex-col">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h2 className="line-clamp-2 text-sm font-medium text-ink-900">
                      <Link
                        href={`/san-pham/${item.slug}`}
                        className="transition hover:text-brand-600"
                      >
                        {item.name}
                      </Link>
                    </h2>
                    <p className="mt-1 text-xs text-ink-500">
                      Giá: {formatPrice(item.salePrice ?? item.price)}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeItem(item.id)}
                    className="shrink-0 rounded-lg p-2 text-ink-400 transition hover:bg-rose-50 hover:text-rose-600"
                    aria-label={`Xóa ${item.name}`}
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>

                <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-3">
                  <div className="flex items-center rounded-lg border border-ink-200">
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="grid size-9 place-items-center text-ink-600 transition hover:bg-ink-100"
                      aria-label="Giảm số lượng"
                    >
                      <Minus className="size-3.5" />
                    </button>
                    <span className="w-10 text-center text-sm font-semibold tabular-nums">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      disabled={item.quantity >= item.stock}
                      className="grid size-9 place-items-center text-ink-600 transition hover:bg-ink-100 disabled:text-ink-300"
                      aria-label="Tăng số lượng"
                    >
                      <Plus className="size-3.5" />
                    </button>
                  </div>
                  <p className="text-base font-bold text-accent-600">
                    {formatPrice((item.salePrice ?? item.price) * item.quantity)}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>

        <Link
          href={ROUTES.products}
          className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-brand-600 transition hover:text-brand-700"
        >
          ← Tiếp tục mua sắm
        </Link>
      </div>

      {/* Tóm tắt */}
      <aside className="lg:sticky lg:top-24 lg:self-start">
        <div className="rounded-xl border border-ink-200 bg-white p-5">
          <h2 className="text-base font-semibold text-ink-950">
            Tóm tắt đơn hàng
          </h2>

          <div className="mt-4 rounded-lg bg-ink-50 p-3">
            <p className="flex items-start gap-2 text-xs text-ink-700">
              <Truck className="mt-0.5 size-4 shrink-0 text-brand-600" />
              {remaining > 0 ? (
                <span>
                  Mua thêm{" "}
                  <strong className="font-semibold text-brand-700">
                    {formatPrice(remaining)}
                  </strong>{" "}
                  để được miễn phí vận chuyển
                </span>
              ) : (
                <span className="font-medium text-emerald-700">
                  Bạn được miễn phí vận chuyển!
                </span>
              )}
            </p>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-ink-200">
              <div
                className="h-full rounded-full bg-brand-500 transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <dl className="mt-4 space-y-2 text-sm">
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
            <div className="flex justify-between border-t border-ink-100 pt-3 text-base">
              <dt className="font-semibold text-ink-950">Tổng cộng</dt>
              <dd className="font-bold text-accent-600">
                {formatPrice(total)}
              </dd>
            </div>
          </dl>

          <Link
            href={ROUTES.checkout}
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg bg-brand-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-brand-700"
          >
            Tiến hành thanh toán
            <ArrowRight className="size-4" />
          </Link>
          <p className="mt-3 text-center text-[11px] leading-4 text-ink-500">
            Thanh toán COD hoặc chuyển khoản ngân hàng. Đơn hàng được xử lý
            trong 24 giờ.
          </p>
        </div>
      </aside>
    </div>
  );
}
