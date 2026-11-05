"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ShoppingCart, Check, Star, Eye } from "lucide-react";
import type { ProductWithRelations } from "@/database/schema";
import { formatPrice, percentOff } from "@/lib/format";
import { cn } from "@/lib/utils";
import { useCart } from "@/hooks/useCart";
import { useToast } from "@/components/ui/ToastProvider";
import { trackClientEvent } from "@/lib/analytics-client";

export function ProductCard({
  product,
  priority = false,
}: {
  product: ProductWithRelations;
  priority?: boolean;
}) {
  const { addItem } = useCart();
  const { success } = useToast();
  const [adding, setAdding] = useState(false);

  const price = Number(product.price);
  const salePrice = product.salePrice != null ? Number(product.salePrice) : null;
  const discount = percentOff(price, salePrice);
  const image = product.imageUrl ?? "/products/placeholder.svg";

  function handleAdd() {
    setAdding(true);
    addItem(
      {
        id: product.id,
        slug: product.slug,
        name: product.name,
        image: product.imageUrl,
        price,
        salePrice,
        stock: product.stock,
      },
      1,
    );
    trackClientEvent("add_to_cart", {
      productId: product.id,
      value: salePrice ?? price,
      label: product.name,
    });
    success(`Đã thêm "${product.name}" vào giỏ hàng`);
    window.setTimeout(() => setAdding(false), 400);
  }

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-xl border border-ink-200 bg-white transition hover:border-brand-300 hover:shadow-lg hover:shadow-ink-900/5">
      {discount > 0 && (
        <span className="absolute left-3 top-3 z-10 rounded-md bg-accent-500 px-2 py-0.5 text-xs font-semibold text-white">
          -{discount}%
        </span>
      )}
      {product.badge && discount === 0 && (
        <span className="absolute left-3 top-3 z-10 rounded-md bg-ink-900 px-2 py-0.5 text-xs font-semibold text-white">
          {product.badge}
        </span>
      )}
      {product.stock <= 0 && (
        <span className="absolute right-3 top-3 z-10 rounded-md bg-ink-800/90 px-2 py-0.5 text-xs font-medium text-white">
          Hết hàng
        </span>
      )}

      <Link
        href={`/san-pham/${product.slug}`}
        className="relative block aspect-square overflow-hidden bg-ink-50"
        aria-label={product.name}
      >
        <Image
          src={image}
          alt={`${product.name} - ${product.brand?.name ?? "phụ kiện"}`}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover transition duration-500 group-hover:scale-105"
          priority={priority}
          loading={priority ? undefined : "lazy"}
        />
      </Link>

      <div className="flex flex-1 flex-col p-3.5">
        {product.brand && (
          <p className="mb-1 text-[11px] font-medium uppercase tracking-wide text-ink-400">
            {product.brand.name}
          </p>
        )}
        <h3 className="line-clamp-2 text-sm font-medium leading-snug text-ink-900">
          <Link
            href={`/san-pham/${product.slug}`}
            className="transition hover:text-brand-600"
          >
            {product.name}
          </Link>
        </h3>

        <div className="mt-1 flex items-center gap-2">
          {product.ratingCount > 0 && (
            <span className="flex items-center gap-0.5 text-xs text-amber-500">
              <Star className="size-3 fill-current" />
              {Number(product.ratingAverage).toFixed(1)}
              <span className="text-ink-400">({product.ratingCount})</span>
            </span>
          )}
          <span className="flex items-center gap-0.5 text-xs text-ink-400">
            <Eye className="size-3" />
            {product.viewCount}
          </span>
        </div>

        <div className="mt-auto pt-3">
          <div className="flex flex-wrap items-baseline gap-2">
            <span className="text-base font-bold text-accent-600">
              {formatPrice(salePrice ?? price)}
            </span>
            {salePrice != null && salePrice < price && (
              <span className="text-xs text-ink-400 line-through">
                {formatPrice(price)}
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={handleAdd}
            disabled={product.stock <= 0 || adding}
            className={cn(
              "mt-3 flex w-full items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition",
              product.stock <= 0
                ? "cursor-not-allowed bg-ink-100 text-ink-400"
                : "bg-brand-600 text-white hover:bg-brand-700 active:scale-[.98]",
            )}
          >
            {adding ? (
              <>
                <Check className="size-4" /> Đã thêm
              </>
            ) : (
              <>
                <ShoppingCart className="size-4" />
                {product.stock > 0 ? "Thêm vào giỏ" : "Hết hàng"}
              </>
            )}
          </button>
        </div>
      </div>
    </article>
  );
}
