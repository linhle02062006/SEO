"use client";

import { useState } from "react";
import { Minus, Plus, ShoppingCart, Check } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { useToast } from "@/components/ui/ToastProvider";
import { formatPrice } from "@/lib/format";
import { trackClientEvent } from "@/lib/analytics-client";
import { cn } from "@/lib/utils";

type AddToCartProduct = {
  id: number;
  slug: string;
  name: string;
  image: string | null;
  price: number;
  salePrice: number | null;
  stock: number;
};

export function AddToCartButton({ product }: { product: AddToCartProduct }) {
  const { addItem } = useCart();
  const { success, error } = useToast();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const unit = product.salePrice ?? product.price;
  const max = Math.max(1, product.stock);

  function handleAdd() {
    if (product.stock <= 0) {
      error("Sản phẩm hiện tạm hết hàng");
      return;
    }
    addItem(
      {
        id: product.id,
        slug: product.slug,
        name: product.name,
        image: product.image,
        price: product.price,
        salePrice: product.salePrice,
        stock: product.stock,
      },
      qty,
    );
    trackClientEvent("add_to_cart", {
      productId: product.id,
      value: unit * qty,
      label: product.name,
    });
    setAdded(true);
    success(`Đã thêm ${qty} sản phẩm vào giỏ hàng`);
    window.setTimeout(() => setAdded(false), 2000);
  }

  if (product.stock <= 0) {
    return (
      <button
        type="button"
        disabled
        className="w-full cursor-not-allowed rounded-lg bg-ink-100 py-3.5 text-sm font-semibold text-ink-400"
      >
        Tạm hết hàng
      </button>
    );
  }

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <div className="flex h-[52px] items-center rounded-lg border border-ink-200">
        <button
          type="button"
          onClick={() => setQty((q) => Math.max(1, q - 1))}
          disabled={qty <= 1}
          className="grid size-12 place-items-center text-ink-600 transition hover:bg-ink-50 disabled:text-ink-300"
          aria-label="Giảm số lượng"
        >
          <Minus className="size-4" />
        </button>
        <span className="w-10 text-center text-sm font-semibold tabular-nums">
          {qty}
        </span>
        <button
          type="button"
          onClick={() => setQty((q) => Math.min(max, q + 1))}
          disabled={qty >= max}
          className="grid size-12 place-items-center text-ink-600 transition hover:bg-ink-50 disabled:text-ink-300"
          aria-label="Tăng số lượng"
        >
          <Plus className="size-4" />
        </button>
      </div>

      <button
        type="button"
        onClick={handleAdd}
        className={cn(
          "flex h-[52px] flex-1 items-center justify-center gap-2 rounded-lg px-6 text-sm font-semibold text-white transition active:scale-[.99]",
          added ? "bg-emerald-600" : "bg-brand-600 hover:bg-brand-700",
        )}
      >
        {added ? (
          <>
            <Check className="size-4" /> Đã thêm vào giỏ
          </>
        ) : (
          <>
            <ShoppingCart className="size-4" />
            Thêm vào giỏ hàng
          </>
        )}
      </button>
    </div>
  );
}

export function BuyNowButton({ product }: { product: AddToCartProduct }) {
  const { addItem } = useCart();
  return (
    <button
      type="button"
      onClick={() =>
        addItem(
          {
            id: product.id,
            slug: product.slug,
            name: product.name,
            image: product.image,
            price: product.price,
            salePrice: product.salePrice,
            stock: product.stock,
          },
          1,
        )
      }
      className="w-full rounded-lg border border-brand-600 py-3 text-sm font-semibold text-brand-700 transition hover:bg-brand-50"
    >
      Mua ngay — {formatPrice(product.salePrice ?? product.price)}
    </button>
  );
}
