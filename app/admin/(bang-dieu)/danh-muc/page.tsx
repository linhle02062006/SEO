import type { Metadata } from "next";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { TaxonomyManager } from "@/components/admin/TaxonomyManager";
import { getAdminCategories } from "@/services/admin-service";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Quản lý danh mục",
  robots: { index: false, follow: false },
};

export default async function AdminCategoriesPage() {
  const categories = await getAdminCategories();

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Danh mục sản phẩm"
        description="Cấu trúc danh mục là khung xương silo nội dung của website. Mỗi danh mục tạo một URL thân thiện SEO và xuất hiện trong sitemap.xml."
      />

      <TaxonomyManager kind="category" rows={categories} />
    </div>
  );
}
