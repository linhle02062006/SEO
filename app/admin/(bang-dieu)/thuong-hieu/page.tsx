import type { Metadata } from "next";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { TaxonomyManager } from "@/components/admin/TaxonomyManager";
import { getAdminBrands } from "@/services/admin-service";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Quản lý thương hiệu",
  robots: { index: false, follow: false },
};

export default async function AdminBrandsPage() {
  const brands = await getAdminBrands();

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Thương hiệu"
        description="Mỗi thương hiệu là một landing page trong silo, giúp tăng độ phủ từ khóa dạng thương hiệu và hỗ trợ E-E-A-T."
      />

      <TaxonomyManager kind="brand" rows={brands} />
    </div>
  );
}
