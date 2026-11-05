import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { SITE } from "@/lib/site";
import { buildMetadata } from "@/lib/seo";
import { breadcrumbListSchema } from "@/lib/schema";
import {
  getAllCategories,
  getCategoryBySlugWithCount,
  getCategoryCounts,
} from "@/services/catalog-service";
import { Breadcrumb } from "@/components/common/Breadcrumb";
import { SectionHeading } from "@/components/common/SectionHeading";
import { CtaBanner } from "@/components/common/CtaBanner";

export const metadata: Metadata = buildMetadata({
  title: "Danh mục phụ kiện điện thoại và công nghệ",
  description:
    "Danh mục phụ kiện điện thoại tại TechZone: ốp lưng, cáp sạc, củ sạc, tai nghe, sạc dự phòng, kính cường lực, giá đỡ điện thoại, phụ kiện laptop và phụ kiện gaming.",
  path: "/danh-muc",
  keywords: [
    "danh mục phụ kiện điện thoại",
    "phụ kiện điện thoại",
    "phụ kiện công nghệ",
  ],
});

export const revalidate = 300;

export default async function CategoriesPage() {
  const [categories, counts] = await Promise.all([
    getAllCategories(),
    getCategoryCounts(),
  ]);

  const crumbs = [
    { name: "Trang chủ", href: "/" },
    { name: "Danh mục", href: "/danh-muc" },
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
            Danh mục phụ kiện điện thoại
          </h1>
          <p className="mt-2 text-sm leading-6 text-ink-600">
            Chọn danh mục để xem các mẫu phụ kiện điện thoại và công nghệ
            chính hãng đang có sẵn tại TechZone. Tất cả sản phẩm đều được bảo
            hành 12 tháng và giao hàng toàn quốc.
          </p>
        </header>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((c) => (
            <Link
              key={c.id}
              href={`/danh-muc/${c.slug}`}
              className="group flex flex-col overflow-hidden rounded-xl border border-ink-200 bg-white transition hover:border-brand-300 hover:shadow-lg hover:shadow-ink-900/5"
            >
              <div className="relative aspect-[16/9] overflow-hidden bg-gradient-to-br from-brand-500 to-brand-700">
                {c.imageUrl ? (
                  <Image
                    src={c.imageUrl}
                    alt={c.name}
                    fill
                    sizes="(max-width: 640px) 100vw, 400px"
                    className="object-cover"
                  />
                ) : (
                  <div className="grid h-full place-items-center">
                    <span className="text-4xl font-bold text-white/25">
                      {c.name.slice(0, 2).toUpperCase()}
                    </span>
                  </div>
                )}
              </div>
              <div className="flex flex-1 flex-col p-4">
                <h2 className="text-base font-semibold text-ink-950 transition group-hover:text-brand-600">
                  {c.name}
                </h2>
                <p className="mt-1.5 line-clamp-2 flex-1 text-sm leading-6 text-ink-600">
                  {c.description}
                </p>
                <p className="mt-3 flex items-center gap-1 text-xs font-medium text-brand-600">
                  {counts[c.slug] ?? 0} sản phẩm
                  <ChevronRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
                </p>
              </div>
            </Link>
          ))}
        </div>

        <CtaBanner />
      </div>
    </>
  );
}
