import type { Metadata } from "next";
import Link from "next/link";
import { Plus, FileText, ExternalLink } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminTable } from "@/components/admin/AdminTable";
import { getAdminPosts } from "@/services/admin-service";
import { formatDateShort } from "@/lib/format";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Quản lý blog",
  robots: { index: false, follow: false },
};

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function first(v: string | string[] | undefined): string | undefined {
  return Array.isArray(v) ? v[0] : v;
}

export default async function AdminBlogPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const sp = await searchParams;
  const q = first(sp.q);
  const page = first(sp.trang) ? Number(first(sp.trang)) : 1;

  const result = await getAdminPosts({ q, page, limit: 20 });

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Quản lý Blog (CMS)"
        description={`${result.total} bài viết trong hệ thống. Quản lý tiêu đề, slug, meta description, ảnh cover và nội dung chuẩn SEO.`}
        actions={
          <Link
            href="/admin/blog/them"
            className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700"
          >
            <Plus className="size-4" />
            Viết bài mới
          </Link>
        }
      />

      <form
        method="get"
        className="flex flex-wrap items-center gap-3 rounded-xl border border-ink-200 bg-white p-3"
      >
        <input
          type="search"
          name="q"
          defaultValue={q ?? ""}
          placeholder="Tìm theo tiêu đề hoặc slug..."
          className="h-10 min-w-[240px] flex-1 rounded-lg border border-ink-200 px-3 text-sm outline-none transition placeholder:text-ink-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
          aria-label="Tìm bài viết"
        />
        <button
          type="submit"
          className="h-10 rounded-lg bg-ink-900 px-4 text-sm font-medium text-white transition hover:bg-ink-800"
        >
          Tìm
        </button>
      </form>

      {result.items.length === 0 ? (
        <div className="rounded-xl border border-ink-200 bg-white py-16 text-center">
          <FileText className="mx-auto size-10 text-ink-300" />
          <p className="mt-3 text-sm font-medium text-ink-800">
            Chưa có bài viết nào
          </p>
          <Link
            href="/admin/blog/them"
            className="mt-2 inline-block text-sm text-brand-600 hover:underline"
          >
            Viết bài đầu tiên
          </Link>
        </div>
      ) : (
        <AdminTable
          head={
            <>
              <th className="px-5 py-3 text-left font-medium">Tiêu đề</th>
              <th className="px-5 py-3 text-left font-medium">Slug</th>
              <th className="px-5 py-3 text-left font-medium">Tác giả</th>
              <th className="px-5 py-3 text-left font-medium">Ngày đăng</th>
              <th className="px-5 py-3 text-left font-medium">Lượt xem</th>
              <th className="px-5 py-3 text-left font-medium">Trạng thái</th>
              <th className="px-5 py-3 text-left font-medium">Thao tác</th>
            </>
          }
        >
          {result.items.map((p) => (
            <tr key={p.id} className="transition hover:bg-ink-50">
              <td className="px-5 py-3">
                <Link
                  href={`/admin/blog/${p.id}`}
                  className="font-medium text-ink-950 hover:text-brand-600"
                >
                  {p.title}
                </Link>
              </td>
              <td className="px-5 py-3 text-xs text-ink-500">/{p.slug}</td>
              <td className="px-5 py-3 text-xs text-ink-600">{p.authorName}</td>
              <td className="px-5 py-3 text-xs text-ink-600">
                {formatDateShort(p.publishedAt)}
              </td>
              <td className="px-5 py-3 text-xs text-ink-600">{p.viewCount}</td>
              <td className="px-5 py-3">
                <span
                  className={cn(
                    "inline-block rounded-full px-2.5 py-0.5 text-[11px] font-medium ring-1 ring-inset",
                    p.isPublished
                      ? "bg-emerald-50 text-emerald-700 ring-emerald-600/20"
                      : "bg-ink-100 text-ink-600",
                  )}
                >
                  {p.isPublished ? "Đã xuất bản" : "Nháp"}
                </span>
              </td>
              <td className="px-5 py-3">
                <div className="flex items-center gap-3">
                  <Link
                    href={`/admin/blog/${p.id}`}
                    className="text-xs font-medium text-brand-600 hover:underline"
                  >
                    Sửa
                  </Link>
                  {p.isPublished && (
                    <Link
                      href={`/blog/${p.slug}`}
                      target="_blank"
                      className="text-ink-400 transition hover:text-brand-600"
                      aria-label={`Xem bài ${p.title}`}
                    >
                      <ExternalLink className="size-3.5" />
                    </Link>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </AdminTable>
      )}

      {result.totalPages > 1 && (
        <div className="flex items-center justify-between text-sm">
          <p className="text-ink-600">
            Trang {result.page} / {result.totalPages}
          </p>
          <div className="flex gap-2">
            {result.page > 1 && (
              <Link
                href={`/admin/blog?trang=${result.page - 1}`}
                className="rounded-lg border border-ink-200 bg-white px-4 py-2 font-medium text-ink-700 transition hover:bg-ink-50"
              >
                Trước
              </Link>
            )}
            {result.page < result.totalPages && (
              <Link
                href={`/admin/blog?trang=${result.page + 1}`}
                className="rounded-lg border border-ink-200 bg-white px-4 py-2 font-medium text-ink-700 transition hover:bg-ink-50"
              >
                Sau
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
