import type { Metadata } from "next";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { PostForm } from "@/components/admin/PostForm";
import { getAllCategories } from "@/services/catalog-service";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Viết bài mới",
  robots: { index: false, follow: false },
};

export default async function AdminNewPostPage() {
  const categories = await getAllCategories();

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Viết bài mới"
        description="Soạn nội dung chuẩn SEO với cấu trúc H2/H3, internal link và CTA. Xuất bản sẽ tự động thêm URL vào sitemap."
      />

      <PostForm categories={categories} />
    </div>
  );
}
