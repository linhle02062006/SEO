import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Phone, Mail, MapPin } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { OrderStatusForm } from "@/components/admin/OrderStatusForm";
import { getOrderById } from "@/services/order-service";
import { formatPrice, formatDate } from "@/lib/format";
import {
  ORDER_STATUS_LABEL,
  ORDER_STATUS_TONE,
  PAYMENT_METHOD_LABEL,
  PAYMENT_STATUS_LABEL,
} from "@/lib/constants";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Chi tiết đơn hàng",
  robots: { index: false, follow: false },
};

type Params = Promise<{ id: string }>;

export default async function AdminOrderDetailPage({
  params,
}: {
  params: Params;
}) {
  const { id } = await params;
  const orderId = Number(id);
  if (!Number.isFinite(orderId)) notFound();

  const order = await getOrderById(orderId);
  if (!order) notFound();

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title={`Đơn hàng ${order.orderCode}`}
        description={`Đặt lúc ${formatDate(order.createdAt, true)}`}
        actions={
          <Link
            href="/admin/don-hang"
            className="inline-flex items-center gap-2 rounded-lg border border-ink-200 bg-white px-4 py-2.5 text-sm font-medium text-ink-800 transition hover:bg-ink-50"
          >
            <ArrowLeft className="size-4" />
            Quay lại
          </Link>
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Chi tiết sản phẩm */}
        <div className="lg:col-span-2 space-y-6">
          <div className="overflow-hidden rounded-xl border border-ink-200 bg-white">
            <div className="border-b border-ink-100 px-5 py-4">
              <h2 className="text-base font-semibold text-ink-950">
                Sản phẩm trong đơn ({order.items.length})
              </h2>
            </div>
            <ul className="divide-y divide-ink-100">
              {order.items.map((it) => (
                <li key={it.id} className="flex items-center gap-4 px-5 py-4">
                  {it.productImage ? (
                    <div className="relative size-14 shrink-0 overflow-hidden rounded-lg bg-ink-50">
                      <Image
                        src={it.productImage}
                        alt={it.productName}
                        fill
                        sizes="56px"
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="size-14 shrink-0 rounded-lg bg-ink-100" />
                  )}
                  <div className="min-w-0 flex-1">
                    {it.productSlug ? (
                      <Link
                        href={`/san-pham/${it.productSlug}`}
                        target="_blank"
                        className="font-medium text-ink-950 hover:text-brand-600"
                      >
                        {it.productName}
                      </Link>
                    ) : (
                      <p className="font-medium text-ink-950">{it.productName}</p>
                    )}
                    <p className="mt-0.5 text-xs text-ink-500">
                      SKU {it.sku ?? "—"} · {formatPrice(it.unitPrice)} × {it.quantity}
                    </p>
                  </div>
                  <p className="shrink-0 font-semibold text-ink-950">
                    {formatPrice(it.lineTotal)}
                  </p>
                </li>
              ))}
            </ul>
            <div className="space-y-2 border-t border-ink-100 bg-ink-50 px-5 py-4 text-sm">
              <div className="flex justify-between text-ink-600">
                <span>Tạm tính</span>
                <span>{formatPrice(order.subtotal)}</span>
              </div>
              <div className="flex justify-between text-ink-600">
                <span>Phí vận chuyển</span>
                <span>{formatPrice(order.shippingFee)}</span>
              </div>
              {Number(order.discount) > 0 && (
                <div className="flex justify-between text-ink-600">
                  <span>Giảm giá</span>
                  <span>-{formatPrice(order.discount)}</span>
                </div>
              )}
              <div className="flex justify-between border-t border-ink-200 pt-2 text-base font-bold text-ink-950">
                <span>Tổng cộng</span>
                <span>{formatPrice(order.total)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="rounded-xl border border-ink-200 bg-white p-5">
            <h2 className="text-base font-semibold text-ink-950">Trạng thái</h2>
            <div className="mt-3">
              <span
                className={cn(
                  "inline-block rounded-full px-3 py-1 text-xs font-medium ring-1 ring-inset",
                  ORDER_STATUS_TONE[order.status] ??
                    "bg-ink-100 text-ink-700",
                )}
              >
                {ORDER_STATUS_LABEL[order.status] ?? order.status}
              </span>
            </div>
            <div className="mt-4 border-t border-ink-100 pt-4">
              <OrderStatusForm orderId={order.id} current={order.status} />
            </div>
            <dl className="mt-4 space-y-2 border-t border-ink-100 pt-4 text-xs">
              <div className="flex justify-between">
                <dt className="text-ink-500">Phương thức thanh toán</dt>
                <dd className="font-medium text-ink-900">
                  {PAYMENT_METHOD_LABEL[order.paymentMethod] ??
                    order.paymentMethod}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-ink-500">Trạng thái thanh toán</dt>
                <dd className="font-medium text-ink-900">
                  {PAYMENT_STATUS_LABEL[order.paymentStatus] ??
                    order.paymentStatus}
                </dd>
              </div>
            </dl>
          </div>

          <div className="rounded-xl border border-ink-200 bg-white p-5">
            <h2 className="text-base font-semibold text-ink-950">
              Thông tin giao hàng
            </h2>
            <ul className="mt-3 space-y-3 text-sm">
              <li className="flex items-start gap-2.5">
                <MapPin className="mt-0.5 size-4 shrink-0 text-ink-400" />
                <span className="leading-6 text-ink-700">
                  {order.fullName}
                  <br />
                  {order.address}
                </span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="size-4 shrink-0 text-ink-400" />
                <a
                  href={`tel:${order.phone}`}
                  className="text-ink-700 hover:text-brand-600"
                >
                  {order.phone}
                </a>
              </li>
              {order.email && (
                <li className="flex items-center gap-2.5">
                  <Mail className="size-4 shrink-0 text-ink-400" />
                  <a
                    href={`mailto:${order.email}`}
                    className="truncate text-ink-700 hover:text-brand-600"
                  >
                    {order.email}
                  </a>
                </li>
              )}
            </ul>
            {order.note && (
              <div className="mt-4 rounded-lg bg-ink-50 p-3">
                <p className="text-[11px] font-medium text-ink-500">Ghi chú</p>
                <p className="mt-1 text-xs leading-5 text-ink-700">{order.note}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
