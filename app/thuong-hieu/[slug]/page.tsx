import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SITE } from "@/lib/site";
import { buildMetadata } from "@/lib/seo";
import { breadcrumbListSchema } from "@/lib/schema";
import { getAllBrands, getBrandBySlug, getBrandCounts } from "@/services/catalog-service";
import {
  getProducts,
  hasSalesData,
  hasReviewsData,
} from "@/services/product-service";
import { Breadcrumb } from "@/components/common/Breadcrumb";
import { ProductGrid } from "@/components/product/ProductGrid";
import { ProductFilters } from "@/components/product/ProductFilters";
import { SortSelect } from "@/components/product/ProductFilters";
import { Pagination } from "@/components/common/Pagination";

type Params = Promise<{ slug: string }>;
type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export const revalidate = 60;

export async function generateStaticParams() {
  const { getAllBrands } = await import("@/services/catalog-service");
  const brands = await getAllBrands().catch(() => []);
  return brands.map((b) => ({ slug: b.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { slug } = await params;
  const brand = await getBrandBySlug(slug);
  if (!brand) {
    return buildMetadata({
      title: "Thương hiệu không tồn tại",
      description: "Thương hiệu phụ kiện bạn tìm không tồn tại.",
      path: `/thuong-hieu/${slug}`,
      noindex: true,
    });
  }
  return buildMetadata({
    title: brand.seoTitle ?? `Phụ kiện ${brand.name} chính hãng | ${SITE.name}`,
    description:
      brand.seoDescription ??
      brand.description ??
      `Mua phụ kiện ${brand.name} chính hãng tại ${SITE.name}. Bảo hành chính hãng, giao hàng toàn quốc 24-48h.`,
    path: `/thuong-hieu/${brand.slug}`,
    keywords: [
      `phụ kiện ${brand.name.toLowerCase()}`,
      `${brand.name.toLowerCase()} chính hãng`,
      brand.name.toLowerCase(),
    ],
  });
}

function first(v: string | string[] | undefined): string | undefined {
  return Array.isArray(v) ? v[0] : v;
}

export default async function BrandPage({
  params,
  searchParams,
}: {
  params: Params;
  searchParams: SearchParams;
}) {
  const { slug } = await params;
  const sp = await searchParams;

  const brand = await getBrandBySlug(slug);
  if (!brand) notFound();

  const category = first(sp["danh-muc"]);
  const minPrice = first(sp.gia_min) ? Number(first(sp.gia_min)) : undefined;
  const maxPrice = first(sp.gia_max) ? Number(first(sp.gia_max)) : undefined;
  const sort = first(sp["sap-xep"]) ?? "newest";
  const page = first(sp.trang) ? Math.max(1, Number(first(sp.trang))) : 1;

  const [
    result,
    categories,
    categoryCounts,
    brands,
    brandCounts,
    priceRange,
    hasSales,
    hasReviews,
  ] = await Promise.all([
    getProducts({
      brand: slug,
      category,
      minPrice: Number.isFinite(minPrice) ? minPrice : undefined,
      maxPrice: Number.isFinite(maxPrice) ? maxPrice : undefined,
      sort: sort as never,
      page,
      limit: 12,
    }),
    import("@/services/catalog-service").then((m) => m.getAllCategories()),
    import("@/services/catalog-service").then((m) => m.getCategoryCounts()),
    getAllBrands(),
    getBrandCounts(),
    import("@/services/catalog-service").then((m) => m.getPriceRange()),
    hasSalesData(),
    hasReviewsData(),
  ]);

  const crumbs = [
    { name: "Trang chủ", href: "/" },
    { name: "Thương hiệu", href: "/thuong-hieu" },
    { name: brand.name, href: `/thuong-hieu/${brand.slug}` },
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

      <div className="container-x py-6 lg:py-8">
        <header className="max-w-3xl">
          <div className="flex items-center gap-4">
            <span className="grid size-14 place-items-center rounded-xl bg-ink-950 text-xl font-bold text-white">
              {brand.name.slice(0, 2).toUpperCase()}
            </span>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-ink-950 lg:text-3xl">
                Phụ kiện {brand.name}
              </h1>
              <p className="mt-1 text-sm text-ink-500">
                {result.total} sản phẩm đang bán
              </p>
            </div>
          </div>
          {brand.description && (
            <p className="mt-4 text-sm leading-6 text-ink-600">
              {brand.description}
            </p>
          )}
        </header>

        <div className="mt-8 grid gap-8 lg:grid-cols-[260px_1fr]">
          <ProductFilters
            categories={categories}
            brands={brands}
            categoryCounts={categoryCounts}
            brandCounts={brandCounts}
            priceRange={priceRange}
            hasReviews={hasReviews}
            current={{ brand: slug, category, minPrice, maxPrice, sort: sort as never }}
            basePath={`/thuong-hieu/${slug}`}
          />

          <div className="min-w-0">
            <div className="hidden items-center justify-between border-b border-ink-100 pb-3 sm:flex">
              <p className="text-sm text-ink-600">
                Hiển thị {result.items.length} / {result.total} sản phẩm
              </p>
              <SortSelect
                current={sort as never}
                hasSales={hasSales}
                hasReviews={hasReviews}
              />
            </div>

            <div className="mt-4 sm:hidden">
              <ProductFilters
                mobile
                categories={categories}
                brands={brands}
                categoryCounts={categoryCounts}
                brandCounts={brandCounts}
                priceRange={priceRange}
                hasReviews={hasReviews}
                current={{ brand: slug, category, minPrice, maxPrice, sort: sort as never }}
                basePath={`/thuong-hieu/${slug}`}
              />
            </div>

            <ProductGrid products={result.items} columns={3} priorityCount={3} />

            {result.totalPages > 1 && (
              <Pagination
                page={result.page}
                totalPages={result.totalPages}
                basePath={`/thuong-hieu/${slug}`}
                params={{
                  ...(category ? { danh_muc: category } : {}),
                  ...(minPrice ? { gia_min: String(minPrice) } : {}),
                  ...(maxPrice ? { gia_max: String(maxPrice) } : {}),
                  ...(sort !== "newest" ? { sap_xep: sort } : {}),
                }}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
}
