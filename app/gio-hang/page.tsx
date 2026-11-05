import type { Metadata } from "next";
import { SITE } from "@/lib/site";
import { buildMetadata } from "@/lib/seo";
import { breadcrumbListSchema } from "@/lib/schema";
import { Breadcrumb } from "@/components/common/Breadcrumb";
import { CartView } from "@/components/cart/CartView";

export const metadata: Metadata = buildMetadata({
  title: "Giỏ hàng",
  description:
    "Giỏ hàng của bạn tại TechZone. Kiểm tra và tiến hành đặt hàng phụ kiện điện thoại chính hãng.",
  path: "/gio-hang",
  noindex: true,
});

export default function CartPage() {
  const crumbs = [
    { name: "Trang chủ", href: "/" },
    { name: "Giỏ hàng", href: "/gio-hang" },
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
            Giỏ hàng
          </h1>
          <p className="mt-2 text-sm text-ink-600">
            Kiểm tra lại các sản phẩm trước khi tiến hành đặt hàng tại {SITE.name}.
          </p>
        </header>

        <CartView />
      </div>
    </>
  );
}
