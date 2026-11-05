import type { Metadata } from "next";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminTable } from "@/components/admin/AdminTable";
import { getOrders } from "@/services/order-service";
import { formatPrice, formatDate } from "@/lib/format";
import {
  ORDER_STATUS_LABEL,
  ORDER_STATUS_TONE,
  PAYMENT_METHOD_LABEL,
  ORDER_STATUS_OPTIONS,
} from "@/lib/constants";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Quản lý đơn hàng",
  robots: { index: false, follow: false },
};

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function first(v: string | string[] | undefined): string | undefined {
  return Array.isArray(v) ? v[0] : v;
}

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const sp = await searchParams;
  const status = first(sp["trang-thai"]);
  const page = first(sp["trang"]) ? Number(first(sp["trang"])) : 1;

  const result = await getOrders({
    status: status as never,
    page,
    limit: 20,
  });

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Quản lý đơn hàng"
        description={`Tổng ${result.total} đơn hàng. Cập nhật trạng thái xác nhận, giao hàng và giao thành công.`}
      />

      <div className="flex flex-wrap gap-2 rounded-xl border border-ink-200 bg-white p-3">
        <Link
          href="/admin/don-hang"
          className={cn(
            "rounded-lg px-3.5 py-2 text-sm font-medium transition",
            !status
              ? "bg-brand-600 text-white"
              : "bg-ink-100 text-ink-700 hover:bg-ink-200",
          )}
        >
          Tất cả
        </Link>
        {ORDER_STATUS_OPTIONS.map((s) => (
          <Link
            key={s.value}
            href={`/admin/don-hang?trang-thai=${s.value}`}
            className={cn(
              "rounded-lg px-3.5 py-2 text-sm font-medium transition",
              status === s.value
                ? "bg-brand-600 text-white"
                : "bg-ink-100 text-ink-700 hover:bg-ink-200",
            )}
          >
            {s.label}
          </Link>
        ))}
      </div>

      {result.items.length === 0 ? (
        <div className="rounded-xl border border-ink-200 bg-white py-16 text-center">
          <ShoppingCart className="mx-auto size-10 text-ink-300" />
          <p className="mt-3 text-sm font-medium text-ink-800">
            Không có đơn hàng nào
          </p>
        </div>
      ) : (
        <AdminTable
          head={
            <>
              <th className="px-5 py-3 text-left font-medium">Mã đơn</th>
              <th className="px-5 py-3 text-left font-medium">Khách hàng</th>
              <th className="px-5 py-3 text-left font-medium">Thanh toán</th>
              <th className="px-5 py-3 text-left font-medium">Tổng tiền</th>
              <th className="px-5 py-3 text-left font-medium">Ngày đặt</th>
              <th className="px-5 py-3 text-left font-medium">Trạng thái</th>
              <th className="px-5 py-3 text-left font-medium">Thao tác</th>
            </>
          }
        >
          {result.items.map((o) => (
            <tr key={o.id} className="transition hover:bg-ink-50">
              <td className="px-5 py-3">
                <Link
                  href={`/admin/don-hang/${o.id}`}
                  className="font-medium text-brand-600 hover:underline"
                >
                  {o.orderCode}
                </Link>
              </td>
              <td className="px-5 py-3">
                <p className="font-medium text-ink-900">{o.fullName}</p>
                <p className="text-[11px] text-ink-500">{o.phone}</p>
              </td>
              <td className="px-5 py-3 text-xs text-ink-600">
                {PAYMENT_METHOD_LABEL[o.paymentMethod] ?? o.paymentMethod}
              </td>
              <td className="px-5 py-3 font-semibold text-ink-950">
                {formatPrice(o.total)}
              </td>
              <td className="px-5 py-3 text-xs text-ink-600">
                {formatDate(o.createdAt)}
              </td>
              <td className="px-5 py-3">
                <span
                  className={cn(
                    "inline-block rounded-full px-2.5 py-0.5 text-[11px] font-medium ring-1 ring-inset",
                    ORDER_STATUS_TONE[o.status] ?? "bg-ink-100 text-ink-700",
                  )}
                >
                  {ORDER_STATUS_LABEL[o.status] ?? o.status}
                </span>
              </td>
              <td className="px-5 py-3">
                <Link
                  href={`/admin/don-hang/${o.id}`}
                  className="text-xs font-medium text-brand-600 hover:underline"
                >
                  Chi tiết
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
                href={`/admin/don-hang?${new URLSearchParams({
                  ...(status ? { "trang-thai": status } : {}),
                  trang: String(result.page - 1),
                })}`}
                className="rounded-lg border border-ink-200 bg-white px-4 py-2 font-medium text-ink-700 transition hover:bg-ink-50"
              >
                Trước
              </Link>
            )}
            {result.page < result.totalPages && (
              <Link
                href={`/admin/don-hang?${new URLSearchParams({
                  ...(status ? { "trang-thai": status } : {}),
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
