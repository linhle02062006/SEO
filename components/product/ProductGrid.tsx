import Link from "next/link";
import type { ProductWithRelations } from "@/database/schema";
import { ProductCard } from "./ProductCard";

export function ProductGrid({
  products,
  columns = 4,
  priorityCount = 0,
}: {
  products: ProductWithRelations[];
  columns?: 3 | 4;
  priorityCount?: number;
}) {
  if (!products.length) {
    return (
      <div className="mt-8 rounded-xl border border-dashed border-ink-200 bg-white p-12 text-center">
        <p className="text-sm text-ink-500">
          Chưa có sản phẩm nào trong danh mục này.
        </p>
        <Link
          href="/san-pham"
          className="mt-3 inline-block text-sm font-medium text-brand-600 hover:underline"
        >
          Xem tất cả sản phẩm
        </Link>
      </div>
    );
  }

  const gridClass =
    columns === 3
      ? "grid grid-cols-2 gap-4 md:grid-cols-3"
      : "grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4";

  return (
    <div className={`mt-8 ${gridClass}`}>
      {products.map((p, i) => (
        <ProductCard key={p.id} product={p} priority={i < priorityCount} />
      ))}
    </div>
  );
}
