"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2, X, ShoppingBag, Truck } from "lucide-react";
import { useCart, FREE_SHIPPING_THRESHOLD } from "@/hooks/useCart";
import { formatPrice } from "@/lib/format";
import { ROUTES } from "@/lib/site";
import { useEffect } from "react";

export function CartDrawer() {
  const {
    items,
    count,
    subtotal,
    shippingFee,
    total,
    isOpen,
    closeCart,
    updateQuantity,
    removeItem,
  } = useCart();

  // Khóa scroll body khi mở
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const progress = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);

  return (
    <>
      {/* Overlay */}
      <div
        onClick={closeCart}
        aria-hidden
        className={`fixed inset-0 z-[80] bg-ink-950/50 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      {/* Drawer */}
      <aside
        aria-label="Giỏ hàng"
        className={`fixed right-0 top-0 z-[85] flex h-full w-full max-w-md flex-col bg-white shadow-2xl transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-ink-100 px-5 py-4">
          <h2 className="flex items-center gap-2 text-base font-semibold text-ink-950">
            <ShoppingBag className="size-5 text-brand-600" />
            Giỏ hàng
            {count > 0 && (
              <span className="rounded-full bg-brand-50 px-2 py-0.5 text-xs font-medium text-brand-700">
                {count}
              </span>
            )}
          </h2>
          <button
            type="button"
            onClick={closeCart}
            className="grid size-9 place-items-center rounded-lg text-ink-500 transition hover:bg-ink-100 hover:text-ink-900"
            aria-label="Đóng giỏ hàng"
          >
            <X className="size-5" />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center">
            <span className="grid size-16 place-items-center rounded-full bg-ink-100">
              <ShoppingBag className="size-7 text-ink-400" />
            </span>
            <p className="text-base font-medium text-ink-900">
              Giỏ hàng của bạn đang trống
            </p>
            <p className="max-w-[16rem] text-sm text-ink-500">
              Hãy khám phá các danh mục phụ kiện điện thoại chính hãng tại
              TechZone.
            </p>
            <Link
              href={ROUTES.products}
              onClick={closeCart}
              className="mt-2 rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-brand-700"
            >
              Mua sắm ngay
            </Link>
          </div>
        ) : (
          <>
            {/* Thanh thông báo miễn phí vận chuyển */}
            <div className="border-b border-ink-100 bg-ink-50 px-5 py-3">
              <p className="flex items-center gap-2 text-xs text-ink-700">
                <Truck className="size-4 shrink-0 text-brand-600" />
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

            {/* Danh sách sản phẩm */}
            <ul className="flex-1 divide-y divide-ink-100 overflow-y-auto px-5">
              {items.map((item) => (
                <li key={item.id} className="flex gap-3 py-4">
                  <Link
                    href={`/san-pham/${item.slug}`}
                    onClick={closeCart}
                    className="relative size-20 shrink-0 overflow-hidden rounded-lg bg-ink-50"
                  >
                    <Image
                      src={item.image ?? "/products/placeholder.svg"}
                      alt={item.name}
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  </Link>

                  <div className="min-w-0 flex-1">
                    <Link
                      href={`/san-pham/${item.slug}`}
                      onClick={closeCart}
                      className="line-clamp-2 text-sm font-medium text-ink-900 transition hover:text-brand-600"
                    >
                      {item.name}
                    </Link>
                    <p className="mt-1 text-sm font-semibold text-accent-600">
                      {formatPrice(item.salePrice ?? item.price)}
                    </p>

                    <div className="mt-2 flex items-center justify-between">
                      <div className="flex items-center rounded-lg border border-ink-200">
                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }
                          className="grid size-8 place-items-center text-ink-600 transition hover:bg-ink-100"
                          aria-label="Giảm số lượng"
                        >
                          <Minus className="size-3.5" />
                        </button>
                        <span className="w-8 text-center text-sm font-medium tabular-nums">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                          disabled={item.quantity >= item.stock}
                          className="grid size-8 place-items-center text-ink-600 transition hover:bg-ink-100 disabled:text-ink-300"
                          aria-label="Tăng số lượng"
                        >
                          <Plus className="size-3.5" />
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        className="grid size-8 place-items-center rounded-lg text-ink-400 transition hover:bg-rose-50 hover:text-rose-600"
                        aria-label={`Xóa ${item.name} khỏi giỏ hàng`}
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            {/* Tổng tiền */}
            <div className="border-t border-ink-100 px-5 py-4">
              <dl className="space-y-1.5 text-sm">
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
                  <dt className="font-semibold text-ink-950">Tổng cộng</dt>
                  <dd className="font-bold text-accent-600">
                    {formatPrice(total)}
                  </dd>
                </div>
              </dl>

              <div className="mt-4 grid gap-2">
                <Link
                  href={ROUTES.checkout}
                  onClick={closeCart}
                  className="rounded-lg bg-brand-600 px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-brand-700"
                >
                  Thanh toán
                </Link>
                <Link
                  href={ROUTES.cart}
                  onClick={closeCart}
                  className="rounded-lg border border-ink-200 px-4 py-2.5 text-center text-sm font-medium text-ink-700 transition hover:bg-ink-50"
                >
                  Xem giỏ hàng
                </Link>
              </div>
            </div>
          </>
        )}
      </aside>
    </>
  );
}
