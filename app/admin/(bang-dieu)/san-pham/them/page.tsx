import type { Metadata } from "next";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { ProductForm } from "@/components/admin/ProductForm";
import { getAllBrands, getAllCategories } from "@/services/catalog-service";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Thêm sản phẩm",
  robots: { index: false, follow: false },
};

export default async function AdminNewProductPage() {
  const [categories, brands] = await Promise.all([
    getAllCategories(),
    getAllBrands(),
  ]);

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Thêm sản phẩm"
        description="Tạo sản phẩm mới kèm thông số kỹ thuật, FAQ và các trường SEO on-page (title, meta description, slug)."
      />

      <ProductForm categories={categories} brands={brands} />
    </div>
  );
}
