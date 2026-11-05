import type { Metadata } from "next";
import { SITE } from "@/lib/site";
import { buildMetadata } from "@/lib/seo";
import { breadcrumbListSchema } from "@/lib/schema";
import { Breadcrumb } from "@/components/common/Breadcrumb";
import { CheckoutForm } from "@/components/checkout/CheckoutForm";

export const metadata: Metadata = buildMetadata({
  title: "Đặt hàng phụ kiện điện thoại",
  description:
    "Hoàn tất đặt hàng phụ kiện điện thoại tại TechZone. Thanh toán COD hoặc chuyển khoản ngân hàng, giao hàng toàn quốc 24-48h.",
  path: "/dat-hang",
  noindex: true,
});

export default function CheckoutPage() {
  const crumbs = [
    { name: "Trang chủ", href: "/" },
    { name: "Giỏ hàng", href: "/gio-hang" },
    { name: "Đặt hàng", href: "/dat-hang" },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: breadcrumbListSchema(crumbs) }}
      />
      <div className="border-b border-ink-100 bg-ink-50">
        <div className="container-x py-3">
          <Breadcrumb items={crumbs} />
        </div>
      </div>

      <div className="container-x py-8 lg:py-12">
        <header className="max-w-3xl">
          <h1 className="text-2xl font-bold tracking-tight text-ink-950 lg:text-3xl">
            Đặt hàng
          </h1>
          <p className="mt-2 text-sm text-ink-600">
            Điền thông tin giao hàng để hoàn tất đơn hàng. Bạn có thể thanh toán
            khi nhận hàng (COD) hoặc chuyển khoản ngân hàng.
          </p>
        </header>

        <CheckoutForm siteName={SITE.name} />
      </div>
    </>
  );
}
