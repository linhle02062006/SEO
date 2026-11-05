import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  CheckCircle2,
  Package,
  Truck,
  Landmark,
  Phone,
  Copy,
  Check,
} from "lucide-react";
import { SITE, ROUTES } from "@/lib/site";
import { buildMetadata } from "@/lib/seo";
import { breadcrumbListSchema } from "@/lib/schema";
import { getOrderByCode } from "@/services/order-service";
import { formatPrice } from "@/lib/format";
import { ORDER_STATUS_LABEL } from "@/lib/constants";
import { Breadcrumb } from "@/components/common/Breadcrumb";
import { CopyButton } from "@/components/common/CopyButton";
import { PurchaseTracker } from "@/components/analytics/PurchaseTracker";

type Params = Promise<{ code: string }>;

export const metadata: Metadata = buildMetadata({
  title: "Đặt hàng thành công",
  description: "Thông tin đơn hàng của bạn tại TechZone.",
  path: "/dat-hang/thanh-cong",
  noindex: true,
});

export const dynamic = "force-dynamic";

export default async function OrderSuccessPage({
  params,
}: {
  params: Params;
}) {
  const { code } = await params;
  const order = await getOrderByCode(code);
  if (!order) notFound();

  const crumbs = [
    { name: "Trang chủ", href: "/" },
    { name: "Đặt hàng", href: "/dat-hang" },
    { name: "Đặt hàng thành công", href: `/dat-hang/thanh-cong/${code}` },
  ];

  const isBankTransfer = order.paymentMethod === "bank_transfer";

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: breadcrumbListSchema(crumbs) }}
      />

      <PurchaseTracker
        orderCode={order.orderCode}
        value={Number(order.total)}
        items={order.items.map((item) => ({
          id: item.productId ?? 0,
          name: item.productName,
          quantity: item.quantity,
        }))}
      />

      <div className="border-b border-ink-100 bg-ink-50">
        <div className="container-x py-3">
          <Breadcrumb items={crumbs} />
        </div>
      </div>

      <div className="container-x py-10 lg:py-14">
        <div className="mx-auto max-w-3xl">
          {/* Header thành công */}
          <div className="text-center">
            <span className="mx-auto grid size-16 place-items-center rounded-full bg-emerald-50">
              <CheckCircle2 className="size-9 text-emerald-600" />
            </span>
            <h1 className="mt-5 text-2xl font-bold tracking-tight text-ink-950 lg:text-3xl">
              Đặt hàng thành công!
            </h1>
            <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-ink-600">
              Cảm ơn bạn đã đặt hàng tại {SITE.name}. Chúng tôi sẽ liên hệ xác
              nhận đơn hàng trong thời gian sớm nhất.
            </p>

            <div className="mt-5 inline-flex items-center gap-2 rounded-lg border border-ink-200 bg-white px-4 py-2.5">
              <span className="text-xs text-ink-500">Mã đơn hàng:</span>
              <span className="font-mono text-sm font-bold text-ink-900">
                {order.orderCode}
              </span>
              <CopyButton value={order.orderCode} />
            </div>

            {/* Đơn hàng đã gắn vào tài khoản khách hàng */}
            {order.userId && (
              <div className="mt-5 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
                Đơn hàng đã được lưu vào tài khoản của bạn.{" "}
                <Link
                  href={ROUTES.account}
                  className="font-semibold underline underline-offset-2"
                >
                  Xem tài khoản
                </Link>
              </div>
            )}
          </div>

          {/* Thông tin đơn hàng */}
          <section className="mt-8 rounded-xl border border-ink-200 bg-white p-5">
            <h2 className="text-base font-semibold text-ink-950">
              Thông tin đơn hàng
            </h2>

            <dl className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <dt className="text-xs text-ink-500">Người nhận</dt>
                <dd className="mt-0.5 text-sm font-medium text-ink-900">
                  {order.fullName}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-ink-500">Số điện thoại</dt>
                <dd className="mt-0.5 text-sm font-medium text-ink-900">
                  {order.phone}
                </dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-xs text-ink-500">Địa chỉ giao hàng</dt>
                <dd className="mt-0.5 text-sm font-medium text-ink-900">
                  {order.address}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-ink-500">Phương thức thanh toán</dt>
                <dd className="mt-0.5 text-sm font-medium text-ink-900">
                  {isBankTransfer
                    ? "Chuyển khoản ngân hàng"
                    : "Thanh toán khi nhận hàng (COD)"}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-ink-500">Trạng thái đơn hàng</dt>
                <dd className="mt-0.5">
                  <span className="inline-flex rounded-md bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700 ring-1 ring-amber-600/20">
                    {ORDER_STATUS_LABEL[order.status] ?? order.status}
                  </span>
                </dd>
              </div>
              {order.note && (
                <div className="sm:col-span-2">
                  <dt className="text-xs text-ink-500">Ghi chú</dt>
                  <dd className="mt-0.5 text-sm text-ink-800">{order.note}</dd>
                </div>
              )}
            </dl>

            {isBankTransfer && (
              <div className="mt-5 rounded-lg border border-brand-200 bg-brand-50 p-4">
                <h3 className="flex items-center gap-2 text-sm font-semibold text-brand-800">
                  <Landmark className="size-4" />
                  Thông tin chuyển khoản
                </h3>
                <dl className="mt-3 space-y-1.5 text-sm text-brand-900">
                  <div className="flex gap-2">
                    <dt className="w-28 shrink-0 text-brand-700">Ngân hàng</dt>
                    <dd className="font-medium">Ngân hàng TMCP Ngoại thương (Vietcombank)</dd>
                  </div>
                  <div className="flex gap-2">
                    <dt className="w-28 shrink-0 text-brand-700">Số tài khoản</dt>
                    <dd className="font-mono font-medium">1020 2020 2020</dd>
                  </div>
                  <div className="flex gap-2">
                    <dt className="w-28 shrink-0 text-brand-700">Chủ tài khoản</dt>
                    <dd className="font-medium">Công ty TNHH TechZone</dd>
                  </div>
                  <div className="flex gap-2">
                    <dt className="w-28 shrink-0 text-brand-700">Nội dung</dt>
                    <dd className="font-mono font-medium">{order.orderCode}</dd>
                  </div>
                </dl>
                <p className="mt-3 text-xs text-brand-700">
                  Vui lòng chuyển khoản đúng số tiền và ghi mã đơn hàng{" "}
                  <strong>{order.orderCode}</strong> trong nội dung để được xử lý
                  nhanh nhất.
                </p>
              </div>
            )}
          </section>

          {/* Sản phẩm đã đặt */}
          <section className="mt-5 rounded-xl border border-ink-200 bg-white p-5">
            <h2 className="text-base font-semibold text-ink-950">
              Sản phẩm đã đặt ({order.items.length})
            </h2>
            <ul className="mt-4 divide-y divide-ink-100">
              {order.items.map((item) => (
                <li key={item.id} className="flex gap-3 py-3">
                  <div className="relative size-16 shrink-0 overflow-hidden rounded-lg bg-ink-50">
                    {item.productImage && (
                      <Image
                        src={item.productImage}
                        alt={item.productName}
                        fill
                        sizes="64px"
                        className="object-cover"
                      />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    {item.productSlug ? (
                      <Link
                        href={`/san-pham/${item.productSlug}`}
                        className="line-clamp-2 text-sm font-medium text-ink-900 transition hover:text-brand-600"
                      >
                        {item.productName}
                      </Link>
                    ) : (
                      <p className="line-clamp-2 text-sm font-medium text-ink-900">
                        {item.productName}
                      </p>
                    )}
                    <p className="mt-0.5 text-xs text-ink-500">
                      {item.quantity} × {formatPrice(Number(item.unitPrice))}
                    </p>
                  </div>
                  <p className="shrink-0 text-sm font-semibold text-ink-900">
                    {formatPrice(Number(item.lineTotal))}
                  </p>
                </li>
              ))}
            </ul>

            <dl className="mt-4 space-y-2 border-t border-ink-100 pt-4 text-sm">
              <div className="flex justify-between">
                <dt className="text-ink-600">Tạm tính</dt>
                <dd className="font-medium text-ink-900">
                  {formatPrice(Number(order.subtotal))}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-ink-600">Phí vận chuyển</dt>
                <dd className="font-medium text-ink-900">
                  {Number(order.shippingFee) === 0 ? (
                    <span className="text-emerald-600">Miễn phí</span>
                  ) : (
                    formatPrice(Number(order.shippingFee))
                  )}
                </dd>
              </div>
              <div className="flex justify-between border-t border-ink-100 pt-2 text-base">
                <dt className="font-semibold text-ink-950">Tổng thanh toán</dt>
                <dd className="font-bold text-accent-600">
                  {formatPrice(Number(order.total))}
                </dd>
              </div>
            </dl>
          </section>

          {/* Hướng dẫn tiếp theo */}
          <section className="mt-5 rounded-xl border border-ink-200 bg-ink-50 p-5">
            <h2 className="text-base font-semibold text-ink-950">
              Bước tiếp theo
            </h2>
            <ol className="mt-4 space-y-3">
              {[
                {
                  icon: Phone,
                  title: "Chúng tôi sẽ gọi xác nhận đơn hàng",
                  desc: "Trong vòng 24 giờ làm việc tại số bạn đã cung cấp.",
                },
                {
                  icon: Package,
                  title: "Đóng gói và chuẩn bị giao hàng",
                  desc: "Sản phẩm được kiểm tra trước khi gửi đi.",
                },
                {
                  icon: Truck,
                  title: "Giao hàng trong 24-48 giờ",
                  desc: "Bạn có thể kiểm tra hàng trước khi thanh toán (COD).",
                },
              ].map((s, i) => (
                <li key={s.title} className="flex gap-3">
                  <span className="grid size-8 shrink-0 place-items-center rounded-full bg-brand-600 text-xs font-bold text-white">
                    {i + 1}
                  </span>
                  <div>
                    <p className="flex items-center gap-2 text-sm font-medium text-ink-900">
                      <s.icon className="size-4 text-brand-600" />
                      {s.title}
                    </p>
                    <p className="mt-0.5 text-xs text-ink-600">{s.desc}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href={ROUTES.products}
              className="rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700"
            >
              Tiếp tục mua sắm
            </Link>
            <Link
              href={ROUTES.contact}
              className="rounded-lg border border-ink-200 px-5 py-2.5 text-sm font-medium text-ink-700 transition hover:bg-ink-50"
            >
              Liên hệ hỗ trợ
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
