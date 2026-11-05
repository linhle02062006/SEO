import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ExternalLink, Trash2 } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { ProductForm } from "@/components/admin/ProductForm";
import { DeleteProductButton } from "@/components/admin/DeleteProductButton";
import { getProductForEdit } from "@/services/admin-service";
import { getAllBrands, getAllCategories } from "@/services/catalog-service";
import { formatNumber } from "@/lib/format";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Sửa sản phẩm",
  robots: { index: false, follow: false },
};

type Params = Promise<{ id: string }>;

export default async function AdminEditProductPage({
  params,
}: {
  params: Params;
}) {
  const { id } = await params;
  const productId = Number(id);
  if (!Number.isFinite(productId)) notFound();

  const [product, categories, brands] = await Promise.all([
    getProductForEdit(productId),
    getAllCategories(),
    getAllBrands(),
  ]);

  if (!product) notFound();

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title={product.name}
        description={`SKU ${product.sku} · Đã bán ${formatNumber(product.soldCount)} · ${formatNumber(product.viewCount)} lượt xem`}
        actions={
          <>
            <Link
              href={`/san-pham/${product.slug}`}
              target="_blank"
              className="inline-flex items-center gap-2 rounded-lg border border-ink-200 bg-white px-4 py-2.5 text-sm font-medium text-ink-800 transition hover:bg-ink-50"
            >
              <ExternalLink className="size-4" />
              Xem trang
            </Link>
            <DeleteProductButton id={product.id} name={product.name} />
          </>
        }
      />

      <ProductForm
        categories={categories}
        brands={brands}
        product={product}
      />
    </div>
  );
}
