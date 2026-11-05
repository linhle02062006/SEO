import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { PostForm } from "@/components/admin/PostForm";
import { DeletePostButton } from "@/components/admin/DeletePostButton";
import { getPostForEdit } from "@/services/admin-service";
import { getAllCategories } from "@/services/catalog-service";
import { formatDate } from "@/lib/format";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Sửa bài viết",
  robots: { index: false, follow: false },
};

type Params = Promise<{ id: string }>;

export default async function AdminEditPostPage({
  params,
}: {
  params: Params;
}) {
  const { id } = await params;
  const postId = Number(id);
  if (!Number.isFinite(postId)) notFound();

  const [post, categories] = await Promise.all([
    getPostForEdit(postId),
    getAllCategories(),
  ]);

  if (!post) notFound();

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title={post.title}
        description={`Đăng ${formatDate(post.publishedAt)} · ${post.viewCount} lượt xem · ${post.readingTime} phút đọc`}
        actions={<DeletePostButton id={post.id} title={post.title} />}
      />

      <PostForm categories={categories} post={post} />
    </div>
  );
}
