import type { Metadata } from "next";
import Link from "next/link";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminTable } from "@/components/admin/AdminTable";
import { getAdminCustomers } from "@/services/admin-service";
import { formatPrice, formatDate } from "@/lib/format";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Khách hàng",
  robots: { index: false, follow: false },
};

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function AdminCustomersPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const sp = await searchParams;
  const q = typeof sp["q"] === "string" ? sp["q"] : undefined;
  const page = typeof sp["page"] === "string" ? Number(sp["page"]) : 1;

  const { items, total, totalPages } = await getAdminCustomers({ q, page });

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Khách hàng"
        description={`${total} khách hàng đã đăng ký. Dữ liệu lịch sử mua hàng giúp đo lường LTV và phân tích chuyển đổi.`}
      />

      <form method="get" className="flex flex-wrap gap-2">
        <input
          name="q"
          defaultValue={q ?? ""}
          placeholder="Tìm theo tên, số điện thoại hoặc email…"
          className="h-10 min-w-[260px] flex-1 rounded-lg border border-ink-200 px-3 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
        />
        <button
          type="submit"
          className="h-10 rounded-lg bg-ink-900 px-5 text-sm font-semibold text-white transition hover:bg-ink-800"
        >
          Tìm kiếm
        </button>
        {q && (
          <Link
            href="/admin/khach-hang"
            className="flex h-10 items-center rounded-lg border border-ink-200 px-4 text-sm text-ink-600 transition hover:bg-ink-50"
          >
            Xóa lọc
          </Link>
        )}
      </form>

      <AdminTable
        head={
          <>
            <th className="px-5 py-3 text-left font-medium">Khách hàng</th>
            <th className="px-5 py-3 text-left font-medium">Liên hệ</th>
            <th className="px-5 py-3 text-left font-medium">Địa chỉ</th>
            <th className="px-5 py-3 text-left font-medium">Đơn hàng</th>
            <th className="px-5 py-3 text-left font-medium">Chi tiêu</th>
            <th className="px-5 py-3 text-left font-medium">Ngày đăng ký</th>
          </>
        }
      >
        {items.length === 0 && (
          <tr>
            <td colSpan={6} className="px-5 py-12 text-center text-sm text-ink-500">
              Không tìm thấy khách hàng nào.
            </td>
          </tr>
        )}
        {items.map((c) => (
          <tr key={c.id} className="transition hover:bg-ink-50">
            <td className="px-5 py-3">
              <p className="font-medium text-ink-950">{c.fullName}</p>
              <p className="text-xs text-ink-400">#{c.id}</p>
            </td>
            <td className="px-5 py-3 text-sm text-ink-700">
              <p>{c.phone}</p>
              {c.email && (
                <p className="text-xs text-ink-500">{c.email}</p>
              )}
            </td>
            <td className="max-w-[260px] px-5 py-3 text-xs text-ink-600">
              <p className="line-clamp-2">{c.address}</p>
              <p className="text-ink-400">
                {[c.ward, c.district, c.city].filter(Boolean).join(", ")}
              </p>
            </td>
            <td className="px-5 py-3 text-sm text-ink-700">{c.totalOrders}</td>
            <td className="px-5 py-3 text-sm font-semibold text-emerald-600">
              {formatPrice(Number(c.totalSpent))}
            </td>
            <td className="px-5 py-3 text-xs text-ink-500">
              {formatDate(c.createdAt)}
            </td>
          </tr>
        ))}
      </AdminTable>

      {totalPages > 1 && (
        <nav className="flex items-center justify-between text-sm">
          <span className="text-ink-500">
            Trang {page} / {totalPages}
          </span>
          <div className="flex gap-2">
            <Link
              href={`/admin/khach-hang?page=${Math.max(1, page - 1)}${q ? `&q=${encodeURIComponent(q)}` : ""}`}
              className="rounded-lg border border-ink-200 px-3 py-1.5 text-ink-700 transition hover:bg-ink-50"
            >
              Trước
            </Link>
            <Link
              href={`/admin/khach-hang?page=${Math.min(totalPages, page + 1)}${q ? `&q=${encodeURIComponent(q)}` : ""}`}
              className="rounded-lg border border-ink-200 px-3 py-1.5 text-ink-700 transition hover:bg-ink-50"
            >
              Sau
            </Link>
          </div>
        </nav>
      )}
    </div>
  );
}
