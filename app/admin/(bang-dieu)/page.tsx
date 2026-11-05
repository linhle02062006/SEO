import Link from "next/link";
import {
  TrendingUp,
  ShoppingCart,
  Users,
  Package,
  FileText,
  Wallet,
  Clock,
  ArrowRight,
  Eye,
  Plus,
} from "lucide-react";
import { formatPrice, formatNumber } from "@/lib/format";
import { ORDER_STATUS_LABEL, ORDER_STATUS_TONE } from "@/lib/constants";
import { getDashboardStats, getRecentOrders } from "@/services/order-service";
import { getAnalyticsSummary } from "@/services/seo-service";
import { StatCard } from "@/components/admin/StatCard";
import { RangeFilter } from "@/components/admin/RangeFilter";
import { RevenueChart } from "@/components/admin/RevenueChart";
import { EventsTable } from "@/components/admin/EventsTable";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";

export const dynamic = "force-dynamic";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function first(v: string | string[] | undefined): string | undefined {
  return Array.isArray(v) ? v[0] : v;
}

/** Khoảng thời gian theo bộ lọc: ngày / tuần / tháng */
function resolveRange(range: string) {
  const now = new Date();
  const to = now;
  switch (range) {
    case "day": {
      const from = new Date(now);
      from.setHours(0, 0, 0, 0);
      return { from, to, label: "Hôm nay" };
    }
    case "week": {
      const from = new Date(now);
      from.setDate(from.getDate() - 6);
      from.setHours(0, 0, 0, 0);
      return { from, to, label: "7 ngày gần nhất" };
    }
    case "month":
    default: {
      const from = new Date(now);
      from.setDate(1);
      from.setHours(0, 0, 0, 0);
      return { from, to, label: "Tháng này" };
    }
  }
}

export default async function AdminDashboard({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const sp = await searchParams;
  const range = first(sp.range) ?? "month";
  const { from, to, label } = resolveRange(range);

  const [stats, analytics, recentOrders] = await Promise.all([
    getDashboardStats({ from, to }),
    getAnalyticsSummary({ from, to }),
    getRecentOrders(8),
  ]);

  const conversion =
    analytics.events.page_view.count > 0
      ? (
          (analytics.events.purchase.count / analytics.events.page_view.count) *
          100
        ).toFixed(2)
      : "0.00";

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Dashboard"
        description={`Tổng quan hoạt động ${label.toLowerCase()} — doanh thu, đơn hàng, sản phẩm và khách hàng.`}
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

      <RangeFilter current={range} />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          icon={Wallet}
          label="Doanh thu"
          value={formatPrice(stats.revenue)}
          hint={`Tổng tích lũy ${formatPrice(stats.totalRevenue)}`}
          tone="brand"
        />
        <StatCard
          icon={ShoppingCart}
          label="Đơn hàng"
          value={formatNumber(stats.orderCount)}
          hint={`${formatNumber(stats.totalOrders)} đơn tổng cộng`}
          tone="blue"
        />
        <StatCard
          icon={Users}
          label="Khách hàng"
          value={formatNumber(stats.customerCount)}
          hint={`${stats.pendingOrderCount} đơn đang chờ xác nhận`}
          tone="violet"
        />
        <StatCard
          icon={Package}
          label="Sản phẩm đang bán"
          value={formatNumber(stats.productCount)}
          hint={`${stats.postCount} bài viết blog đã xuất bản`}
          tone="emerald"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RevenueChart data={stats.dailyRevenue} />
        </div>

        <div className="rounded-xl border border-ink-200 bg-white p-5">
          <h2 className="text-base font-semibold text-ink-950">
            Lưu lượng khách hàng
          </h2>
          <p className="mt-1 text-xs text-ink-500">
            Lượt xem, tìm kiếm và thao tác giỏ hàng ({label.toLowerCase()})
          </p>
          <EventsTable events={analytics.events} />
          <div className="mt-4 rounded-lg bg-ink-50 p-3">
            <p className="text-xs text-ink-600">
              Tỷ lệ chuyển đổi (purchase / page_view)
            </p>
            <p className="mt-1 text-xl font-bold text-brand-600">{conversion}%</p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-ink-200 bg-white">
          <div className="flex items-center justify-between border-b border-ink-100 px-5 py-4">
            <h2 className="flex items-center gap-2 text-base font-semibold text-ink-950">
              <Eye className="size-4 text-brand-600" />
              Sản phẩm được xem nhiều
            </h2>
          </div>
          {analytics.topViewed.length === 0 ? (
            <p className="px-5 py-10 text-center text-sm text-ink-500">
              Chưa có dữ liệu lượt xem sản phẩm.
            </p>
          ) : (
            <ul className="divide-y divide-ink-100">
              {analytics.topViewed.map((p, i) => (
                <li
                  key={p.productId ?? i}
                  className="flex items-center gap-3 px-5 py-3"
                >
                  <span className="grid size-6 shrink-0 place-items-center rounded-md bg-ink-100 text-xs font-semibold text-ink-600">
                    {i + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-ink-900">
                      {p.label}
                    </p>
                  </div>
                  <span className="shrink-0 text-sm font-semibold text-brand-600">
                    {formatNumber(p.total)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="rounded-xl border border-ink-200 bg-white">
          <div className="flex items-center justify-between border-b border-ink-100 px-5 py-4">
            <h2 className="flex items-center gap-2 text-base font-semibold text-ink-950">
              <Clock className="size-4 text-brand-600" />
              Đơn hàng gần đây
            </h2>
            <Link
              href="/admin/don-hang"
              className="inline-flex items-center gap-1 text-xs font-medium text-brand-600 hover:underline"
            >
              Tất cả
              <ArrowRight className="size-3" />
            </Link>
          </div>
          {recentOrders.length === 0 ? (
            <p className="px-5 py-10 text-center text-sm text-ink-500">
              Chưa có đơn hàng nào.
            </p>
          ) : (
            <ul className="divide-y divide-ink-100">
              {recentOrders.map((o) => (
                <li key={o.id}>
                  <Link
                    href={`/admin/don-hang/${o.id}`}
                    className="flex items-center gap-3 px-5 py-3 transition hover:bg-ink-50"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-ink-900">
                        {o.orderCode}
                      </p>
                      <p className="truncate text-xs text-ink-500">
                        {o.fullName} · {o.phone}
                      </p>
                    </div>
                    <span
                      className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-medium ring-1 ring-inset ${
                        ORDER_STATUS_TONE[o.status] ?? "bg-ink-100 text-ink-700"
                      }`}
                    >
                      {ORDER_STATUS_LABEL[o.status] ?? o.status}
                    </span>
                    <span className="shrink-0 text-sm font-semibold text-ink-950">
                      {formatPrice(o.total)}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="rounded-xl border border-ink-200 bg-white">
        <div className="flex items-center justify-between border-b border-ink-100 px-5 py-4">
          <h2 className="flex items-center gap-2 text-base font-semibold text-ink-950">
            <TrendingUp className="size-4 text-brand-600" />
            Sản phẩm bán chạy nhất
          </h2>
          <Link
            href="/admin/san-pham"
            className="inline-flex items-center gap-1 text-xs font-medium text-brand-600 hover:underline"
          >
            Quản lý sản phẩm
            <ArrowRight className="size-3" />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-sm">
            <thead>
              <tr className="border-b border-ink-100 text-left text-xs uppercase tracking-wide text-ink-500">
                <th className="px-5 py-3 font-medium">Sản phẩm</th>
                <th className="px-5 py-3 font-medium">Giá</th>
                <th className="px-5 py-3 font-medium">Tồn kho</th>
                <th className="px-5 py-3 font-medium">Đã bán</th>
                <th className="px-5 py-3 font-medium">Lượt xem</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-100">
              {stats.topProducts.map((p) => (
                <tr key={p.id} className="transition hover:bg-ink-50">
                  <td className="px-5 py-3">
                    <Link
                      href={`/admin/san-pham/${p.id}`}
                      className="font-medium text-ink-900 hover:text-brand-600"
                    >
                      {p.name}
                    </Link>
                  </td>
                  <td className="px-5 py-3 text-ink-700">
                    {formatPrice(p.salePrice ?? p.price)}
                  </td>
                  <td className="px-5 py-3 text-ink-700">{p.stock}</td>
                  <td className="px-5 py-3 font-medium text-ink-900">
                    {formatNumber(p.soldCount)}
                  </td>
                  <td className="px-5 py-3 text-ink-700">
                    {formatNumber(p.viewCount)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="rounded-xl border border-ink-200 bg-white p-5">
        <div className="flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-base font-semibold text-ink-950">
            <FileText className="size-4 text-brand-600" />
            Quản lý nội dung
          </h2>
          <Link
            href="/admin/blog"
            className="inline-flex items-center gap-1 text-xs font-medium text-brand-600 hover:underline"
          >
            Mở CMS Blog
            <ArrowRight className="size-3" />
          </Link>
        </div>
        <p className="mt-2 text-sm text-ink-600">
          {stats.postCount} bài viết đang xuất bản. Quản lý tiêu đề, ảnh cover
          và nội dung bài viết tại{" "}
          <Link
            href="/admin/blog"
            className="font-medium text-brand-600 hover:underline"
          >
            /admin/blog
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
