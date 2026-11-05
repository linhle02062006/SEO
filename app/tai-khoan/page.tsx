import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  Heart,
  LogOut,
  MapPin,
  Package,
  Star,
  UserRound,
} from "lucide-react";
import { getCurrentUser } from "@/lib/auth";
import { formatPrice, formatDate } from "@/lib/format";
import { ORDER_STATUS_LABEL, ORDER_STATUS_TONE } from "@/lib/constants";
import { ROUTES, SITE } from "@/lib/site";
import {
  getAccountSummary,
  listAddresses,
  listCustomerOrders,
  listWishlist,
} from "@/services/account-service";
import { ProfileForm } from "@/components/account/ProfileForm";
import { ChangePasswordForm } from "@/components/account/ChangePasswordForm";
import { AddressBook, WishlistGrid } from "@/components/account/AddressBook";
import { LogoutButton } from "@/components/account/LogoutButton";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: { absolute: `Tài khoản của tôi | ${SITE.name}` },
  robots: { index: false, follow: false },
};

export default async function AccountPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect(`${ROUTES.login}?next=${encodeURIComponent(ROUTES.account)}`);
  }

  // Tài khoản quản trị dùng khu vực quản trị riêng.
  if (user!.role !== "customer") {
    redirect(ROUTES.admin);
  }

  const [summary, orders, addresses, wishlist] = await Promise.all([
    getAccountSummary(user!.id),
    listCustomerOrders(user!.id),
    listAddresses(user!.id),
    listWishlist(user!.id),
  ]);

  const tabs = [
    { id: "tong-quan", label: "Tổng quan", icon: UserRound },
    { id: "don-hang", label: "Đơn hàng", icon: Package },
    { id: "yeu-thich", label: "Yêu thích", icon: Heart },
    { id: "dia-chi", label: "Địa chỉ", icon: MapPin },
  ];

  return (
    <div className="container-x py-8 lg:py-12">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-ink-200 pb-6">
        <div className="flex items-center gap-4">
          <span className="grid size-14 place-items-center rounded-2xl bg-brand-600 text-lg font-bold text-white">
            {user!.name.trim().charAt(0).toUpperCase() || "K"}
          </span>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-ink-950">
              Chào {user!.name}
            </h1>
            <p className="mt-0.5 text-sm text-ink-600">{user!.email}</p>
          </div>
        </div>
        <LogoutButton />
      </div>

      {/* Tổng quan nhanh */}
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {[
          {
            label: "Tổng đơn hàng",
            value: String(summary.orderCount),
            icon: Package,
            tone: "text-brand-600 bg-brand-50",
          },
          {
            label: "Tổng chi tiêu",
            value: formatPrice(summary.totalSpent),
            icon: Package,
            tone: "text-emerald-600 bg-emerald-50",
          },
          {
            label: "Sản phẩm yêu thích",
            value: String(summary.wishlistCount),
            icon: Star,
            tone: "text-amber-600 bg-amber-50",
          },
        ].map((s) => (
          <div
            key={s.label}
            className="flex items-center gap-3 rounded-xl border border-ink-200 bg-white p-4"
          >
            <span className={`grid size-11 place-items-center rounded-xl ${s.tone}`}>
              <s.icon className="size-5" />
            </span>
            <div className="min-w-0">
              <p className="text-xs text-ink-500">{s.label}</p>
              <p className="truncate text-lg font-bold text-ink-950">{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs (anchor links) */}
      <nav className="mt-8 flex flex-wrap gap-2 border-b border-ink-200" aria-label="Mục tài khoản">
        {tabs.map((t) => (
          <a
            key={t.id}
            href={`#${t.id}`}
            className="flex items-center gap-1.5 border-b-2 border-transparent px-3 py-2.5 text-sm font-medium text-ink-600 transition hover:border-brand-500 hover:text-brand-600"
          >
            <t.icon className="size-4" />
            {t.label}
          </a>
        ))}
      </nav>

      {/* Thông tin cá nhân */}
      <section id="tong-quan" className="mt-8 scroll-mt-24">
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-xl border border-ink-200 bg-white p-5">
            <h2 className="text-base font-semibold text-ink-950">
              Thông tin cá nhân
            </h2>
            <p className="mt-1 text-xs text-ink-500">
              Cập nhật tên và số điện thoại để giao hàng nhanh hơn.
            </p>
            <div className="mt-4">
              <ProfileForm
                initialName={user!.name}
                initialPhone={user!.phone ?? ""}
              />
            </div>
            <div className="mt-4 border-t border-ink-100 pt-4">
              <p className="text-xs text-ink-500">
                Email:{" "}
                <span className="font-medium text-ink-800">{user!.email}</span>
                {user!.emailVerifiedAt ? (
                  <span className="ml-2 rounded-md bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700">
                    Đã xác nhận
                  </span>
                ) : (
                  <span className="ml-2 rounded-md bg-amber-50 px-2 py-0.5 text-[11px] font-medium text-amber-700">
                    Chưa xác nhận
                  </span>
                )}
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-ink-200 bg-white p-5">
            <h2 className="text-base font-semibold text-ink-950">Đổi mật khẩu</h2>
            <p className="mt-1 text-xs text-ink-500">
              Nên dùng mật khẩu riêng, không trùng với tài khoản khác.
            </p>
            <div className="mt-4">
              <ChangePasswordForm />
            </div>
          </div>
        </div>
      </section>

      {/* Đơn hàng */}
      <section id="don-hang" className="mt-10 scroll-mt-24">
        <h2 className="text-base font-semibold text-ink-950">
          Lịch sử đơn hàng ({orders.length})
        </h2>

        {orders.length === 0 ? (
          <div className="mt-4 rounded-xl border border-dashed border-ink-300 bg-ink-50 px-4 py-10 text-center">
            <span className="mx-auto grid size-12 place-items-center rounded-full bg-white">
              <Package className="size-5 text-ink-400" />
            </span>
            <p className="mt-3 text-sm font-medium text-ink-900">
              Bạn chưa có đơn hàng nào
            </p>
            <p className="mt-1 text-xs text-ink-500">
              Đơn hàng của bạn sẽ xuất hiện tại đây sau khi mua.
            </p>
            <Link
              href={ROUTES.products}
              className="mt-4 inline-block rounded-lg bg-brand-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-brand-700"
            >
              Mua sắm ngay
            </Link>
          </div>
        ) : (
          <ul className="mt-4 space-y-3">
            {orders.map((o) => (
              <li
                key={o.id}
                className="rounded-xl border border-ink-200 bg-white p-4"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="flex items-center gap-2 text-sm font-semibold text-ink-950">
                      <span className="font-mono">{o.orderCode}</span>
                      <span
                        className={`rounded-md px-2 py-0.5 text-[11px] font-medium ring-1 ${
                          ORDER_STATUS_TONE[o.status] ?? "bg-ink-50 text-ink-700 ring-ink-200"
                        }`}
                      >
                        {ORDER_STATUS_LABEL[o.status] ?? o.status}
                      </span>
                    </p>
                    <p className="mt-1 text-xs text-ink-500">
                      Đặt lúc {formatDate(o.createdAt)} ·{" "}
                      {o.paymentMethod === "cod"
                        ? "Thanh toán khi nhận hàng"
                        : "Chuyển khoản ngân hàng"}
                    </p>
                    <p className="mt-1 text-xs text-ink-500">
                      {o.fullName} · {o.phone}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-base font-bold text-accent-600">
                      {formatPrice(Number(o.total))}
                    </p>
                    <Link
                      href={`${ROUTES.orderSuccess}/${o.orderCode}`}
                      className="mt-1 inline-block text-xs font-medium text-brand-600 transition hover:underline"
                    >
                      Xem chi tiết →
                    </Link>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Yêu thích */}
      <section id="yeu-thich" className="mt-10 scroll-mt-24">
        <h2 className="text-base font-semibold text-ink-950">
          Sản phẩm yêu thích ({wishlist.length})
        </h2>
        <div className="mt-4">
          <WishlistGrid
            products={wishlist.map((w) => ({
              id: w.product.id,
              name: w.product.name,
              slug: w.product.slug,
              imageUrl: w.product.imageUrl,
              price: w.product.price,
              salePrice: w.product.salePrice,
              stock: w.product.stock,
            }))}
          />
        </div>
      </section>

      {/* Địa chỉ */}
      <section id="dia-chi" className="mt-10 scroll-mt-24">
        <AddressBook initialAddresses={addresses} />
      </section>
    </div>
  );
}
