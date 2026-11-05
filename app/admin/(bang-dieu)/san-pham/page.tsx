import type { Metadata } from "next";
import Link from "next/link";
import { Plus, Package } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminTable } from "@/components/admin/AdminTable";
import { getAdminProducts } from "@/services/admin-service";
import { getAllBrands, getAllCategories } from "@/services/catalog-service";
import { formatPrice, formatNumber } from "@/lib/format";
import { PRODUCT_STATUS_LABEL } from "@/lib/constants";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Quản lý sản phẩm",
  robots: { index: false, follow: false },
};

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function first(v: string | string[] | undefined): string | undefined {
  return Array.isArray(v) ? v[0] : v;
}

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const sp = await searchParams;
  const q = first(sp.q);
  const status = first(sp["trang-thai"]);
  const categoryId = first(sp["danh-muc"])
    ? Number(first(sp["danh-muc"]))
    : undefined;
  const page = first(sp["trang"]) ? Number(first(sp["trang"])) : 1;

  const [result, categories, brands] = await Promise.all([
    getAdminProducts({
      q,
      status: status as never,
      categoryId: Number.isFinite(categoryId) ? categoryId : undefined,
      page,
      limit: 20,
    }),
    getAllCategories(),
    getAllBrands(),
  ]);

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Quản lý sản phẩm"
        description={`Tổng ${result.total} sản phẩm trong hệ thống. Thêm, sửa, ẩn sản phẩm và cập nhật trường SEO on-page.`}
        actions={
          <Link
            href="/admin/san-pham/them"
            className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700"
          >
            <Plus className="size-4" />
            Thêm sản phẩm
          </Link>
        }
      />

      {/* Bộ lọc */}
      <form
        method="get"
        className="flex flex-wrap items-center gap-3 rounded-xl border border-ink-200 bg-white p-3"
      >
        <input
          type="search"
          name="q"
          defaultValue={q ?? ""}
          placeholder="Tìm theo tên, SKU, slug..."
          className="h-10 min-w-[220px] flex-1 rounded-lg border border-ink-200 px-3 text-sm outline-none transition placeholder:text-ink-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
          aria-label="Tìm sản phẩm"
        />
        <select
          name="danh-muc"
          defaultValue={categoryId ?? ""}
          className="h-10 rounded-lg border border-ink-200 px-3 text-sm outline-none focus:border-brand-500"
          aria-label="Lọc theo danh mục"
        >
          <option value="">Tất cả danh mục</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        <select
          name="trang-thai"
          defaultValue={status ?? ""}
          className="h-10 rounded-lg border border-ink-200 px-3 text-sm outline-none focus:border-brand-500"
          aria-label="Lọc theo trạng thái"
        >
          <option value="">Tất cả trạng thái</option>
          <option value="active">Đang bán</option>
          <option value="hidden">Đã ẩn</option>
          <option value="draft">Nháp</option>
        </select>
        <button
          type="submit"
          className="h-10 rounded-lg bg-ink-900 px-4 text-sm font-medium text-white transition hover:bg-ink-800"
        >
          Lọc
        </button>
      </form>

      {result.items.length === 0 ? (
        <div className="rounded-xl border border-ink-200 bg-white py-16 text-center">
          <Package className="mx-auto size-10 text-ink-300" />
          <p className="mt-3 text-sm font-medium text-ink-800">
            Không tìm thấy sản phẩm nào
          </p>
          <p className="mt-1 text-xs text-ink-500">
            Thử đổi bộ lọc hoặc thêm sản phẩm mới.
          </p>
        </div>
      ) : (
        <AdminTable
          head={
            <>
              <th className="px-5 py-3 text-left font-medium">Sản phẩm</th>
              <th className="px-5 py-3 text-left font-medium">SKU</th>
              <th className="px-5 py-3 text-left font-medium">Danh mục</th>
              <th className="px-5 py-3 text-left font-medium">Giá</th>
              <th className="px-5 py-3 text-left font-medium">Tồn</th>
              <th className="px-5 py-3 text-left font-medium">Đã bán</th>
              <th className="px-5 py-3 text-left font-medium">Trạng thái</th>
              <th className="px-5 py-3 text-left font-medium">Thao tác</th>
            </>
          }
        >
          {result.items.map((p) => (
            <tr key={p.id} className="transition hover:bg-ink-50">
              <td className="px-5 py-3">
                <Link
                  href={`/admin/san-pham/${p.id}`}
                  className="font-medium text-ink-950 hover:text-brand-600"
                >
                  {p.name}
                </Link>
                <p className="mt-0.5 text-[11px] text-ink-400">/{p.slug}</p>
              </td>
              <td className="px-5 py-3 text-xs text-ink-600">{p.sku}</td>
              <td className="px-5 py-3 text-xs text-ink-600">
                {p.category?.name ?? "—"}
              </td>
              <td className="px-5 py-3 text-ink-800">
                {p.salePrice ? (
                  <>
                    <span className="font-medium text-rose-600">
                      {formatPrice(p.salePrice)}
                    </span>
                    <span className="ml-1.5 text-xs text-ink-400 line-through">
                      {formatPrice(p.price)}
                    </span>
                  </>
                ) : (
                  <span className="font-medium">{formatPrice(p.price)}</span>
                )}
              </td>
              <td className="px-5 py-3 text-ink-700">{p.stock}</td>
              <td className="px-5 py-3 text-ink-700">
                {formatNumber(p.soldCount)}
              </td>
              <td className="px-5 py-3">
                <span className="inline-block rounded-full bg-ink-100 px-2.5 py-0.5 text-[11px] font-medium text-ink-700">
                  {PRODUCT_STATUS_LABEL[p.status] ?? p.status}
                </span>
              </td>
              <td className="px-5 py-3">
                <Link
                  href={`/admin/san-pham/${p.id}`}
                  className="text-xs font-medium text-brand-600 hover:underline"
                >
                  Sửa
                </Link>
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
                href={`/admin/san-pham?${new URLSearchParams({
                  ...(q ? { q } : {}),
                  ...(status ? { "trang-thai": status } : {}),
                  ...(categoryId ? { "danh-muc": String(categoryId) } : {}),
                  trang: String(result.page - 1),
                })}`}
                className="rounded-lg border border-ink-200 bg-white px-4 py-2 font-medium text-ink-700 transition hover:bg-ink-50"
              >
                Trước
              </Link>
            )}
            {result.page < result.totalPages && (
              <Link
                href={`/admin/san-pham?${new URLSearchParams({
                  ...(q ? { q } : {}),
                  ...(status ? { "trang-thai": status } : {}),
                  ...(categoryId ? { "danh-muc": String(categoryId) } : {}),
                  trang: String(result.page + 1),
                })}`}
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
