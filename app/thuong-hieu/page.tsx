import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { SITE } from "@/lib/site";
import { buildMetadata } from "@/lib/seo";
import { breadcrumbListSchema } from "@/lib/schema";
import { getAllBrands, getBrandCounts } from "@/services/catalog-service";
import { Breadcrumb } from "@/components/common/Breadcrumb";
import { CtaBanner } from "@/components/common/CtaBanner";

export const metadata: Metadata = buildMetadata({
  title: "Thương hiệu phụ kiện điện thoại chính hãng",
  description:
    "Các thương hiệu phụ kiện điện thoại uy tín tại TechZone: Anker, Baseus, Samsung, Apple, Ugreen, Logitech, Razer. Sản phẩm chính hãng, bảo hành 12 tháng.",
  path: "/thuong-hieu",
  keywords: [
    "thương hiệu phụ kiện điện thoại",
    "phụ kiện chính hãng",
    "anker",
    "baseus",
  ],
});

export const revalidate = 300;

export default async function BrandsPage() {
  const [brands, counts] = await Promise.all([
    getAllBrands(),
    getBrandCounts(),
  ]);

  const crumbs = [
    { name: "Trang chủ", href: "/" },
    { name: "Thương hiệu", href: "/thuong-hieu" },
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
            Thương hiệu phụ kiện điện thoại
          </h1>
          <p className="mt-2 text-sm leading-6 text-ink-600">
            TechZone chỉ phân phối sản phẩm từ các thương hiệu uy tín, có nguồn
            gốc rõ ràng và chính sách bảo hành chính hãng.
          </p>
        </header>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {brands.map((b) => (
            <Link
              key={b.id}
              href={`/thuong-hieu/${b.slug}`}
              className="group flex flex-col rounded-xl border border-ink-200 bg-white p-5 transition hover:border-brand-300 hover:shadow-lg hover:shadow-ink-900/5"
            >
              <div className="flex items-center justify-between">
                <span className="grid size-12 place-items-center rounded-xl bg-ink-950 text-lg font-bold text-white">
                  {b.name.slice(0, 2).toUpperCase()}
                </span>
                <span className="rounded-full bg-ink-100 px-2.5 py-1 text-xs font-medium text-ink-600">
                  {counts[b.slug] ?? 0} sản phẩm
                </span>
              </div>
              <h2 className="mt-4 text-base font-semibold text-ink-950 transition group-hover:text-brand-600">
                {b.name}
              </h2>
              <p className="mt-1.5 line-clamp-3 flex-1 text-sm leading-6 text-ink-600">
                {b.description}
              </p>
              <p className="mt-3 flex items-center gap-1 text-xs font-medium text-brand-600">
                Xem sản phẩm {b.name}
                <ChevronRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
              </p>
            </Link>
          ))}
        </div>

        <CtaBanner />
      </div>
    </>
  );
}
