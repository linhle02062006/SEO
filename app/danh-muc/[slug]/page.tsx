import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { SITE } from "@/lib/site";
import { buildMetadata } from "@/lib/seo";
import { breadcrumbListSchema } from "@/lib/schema";
import {
  getAllCategories,
  getCategoryBySlugWithCount,
  getCategoryCounts,
} from "@/services/catalog-service";
import { getProducts } from "@/services/product-service";
import { Breadcrumb } from "@/components/common/Breadcrumb";
import { ProductGrid } from "@/components/product/ProductGrid";
import { ProductFilters } from "@/components/product/ProductFilters";
import { SortSelect } from "@/components/product/ProductFilters";
import { Pagination } from "@/components/common/Pagination";
import { SectionHeading } from "@/components/common/SectionHeading";

type Params = Promise<{ slug: string }>;
type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export const revalidate = 60;

export async function generateStaticParams() {
  const { getAllCategories } = await import("@/services/catalog-service");
  const categories = await getAllCategories().catch(() => []);
  return categories.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryBySlugWithCount(slug);
  if (!category) {
    return buildMetadata({
      title: "Danh mục không tồn tại",
      description: "Danh mục sản phẩm bạn tìm không tồn tại.",
      path: `/danh-muc/${slug}`,
      noindex: true,
    });
  }

  return buildMetadata({
    title:
      category.seoTitle ??
      `${category.name} chính hãng giá tốt | ${SITE.name}`,
    description:
      category.seoDescription ??
      category.description ??
      `Mua ${category.name.toLowerCase()} chính hãng tại ${SITE.name}. ${category.productCount} sản phẩm, bảo hành 12 tháng, giao hàng toàn quốc 24-48h.`,
    path: `/danh-muc/${category.slug}`,
    keywords: [
      category.name.toLowerCase(),
      `mua ${category.name.toLowerCase()}`,
      `${category.name.toLowerCase()} chính hãng`,
    ],
  });
}

function first(v: string | string[] | undefined): string | undefined {
  return Array.isArray(v) ? v[0] : v;
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Params;
  searchParams: SearchParams;
}) {
  const { slug } = await params;
  const sp = await searchParams;

  const category = await getCategoryBySlugWithCount(slug);
  if (!category) notFound();

  const brand = first(sp["thuong-hieu"]);
  const minPrice = first(sp.gia_min) ? Number(first(sp.gia_min)) : undefined;
  const maxPrice = first(sp.gia_max) ? Number(first(sp.gia_max)) : undefined;
  const sort = first(sp["sap-xep"]) ?? "newest";
  const page = first(sp.trang) ? Math.max(1, Number(first(sp.trang))) : 1;
  const inStock = first(sp["trong-kho"]) === "true";
  const onSale = first(sp["khuyen-mai"]) === "true";
  const rating = first(sp["danh-gia"]) ? Number(first(sp["danh-gia"])) : undefined;

  const [result, categories, categoryCounts, brands, brandCounts, priceRange] =
    await Promise.all([
      getProducts({
        category: slug,
        brand,
        minPrice: Number.isFinite(minPrice) ? minPrice : undefined,
        maxPrice: Number.isFinite(maxPrice) ? maxPrice : undefined,
        sort: sort as never,
        page,
        limit: 12,
        inStock,
        onSale,
        rating,
      }),
      getAllCategories(),
      getCategoryCounts(),
      import("@/services/catalog-service").then((m) => m.getAllBrands()),
      import("@/services/catalog-service").then((m) => m.getBrandCounts()),
      import("@/services/catalog-service").then((m) => m.getPriceRange()),
    ]);

  const crumbs = [
    { name: "Trang chủ", href: "/" },
    { name: "Phụ kiện điện thoại", href: "/san-pham" },
    { name: category.name, href: `/danh-muc/${category.slug}` },
  ];

  const others = categories.filter((c) => c.id !== category.id);

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
          <h1 className="text-2xl font-bold tracking-tight text-ink-950 lg:text-3xl">
            {category.name} chính hãng
          </h1>
          {category.description && (
            <p className="mt-2 text-sm leading-6 text-ink-600">
              {category.description}
            </p>
          )}
          <p className="mt-2 text-sm text-ink-500">
            <strong className="font-semibold text-ink-800">
              {result.total} sản phẩm
            </strong>{" "}
            đang bán trong danh mục {category.name.toLowerCase()}
          </p>
        </header>

        <div className="mt-8 grid gap-8 lg:grid-cols-[260px_1fr]">
          <ProductFilters
            categories={categories}
            brands={brands}
            categoryCounts={categoryCounts}
            brandCounts={brandCounts}
            priceRange={priceRange}
            current={{
              category: slug,
              brand,
              minPrice,
              maxPrice,
              sort: sort as never,
              inStock,
              onSale,
              rating,
            }}
            basePath={`/danh-muc/${slug}`}
          />

          <div className="min-w-0">
            <div className="hidden items-center justify-between border-b border-ink-100 pb-3 sm:flex">
              <p className="text-sm text-ink-600">
                Hiển thị {result.items.length} / {result.total} sản phẩm
              </p>
              <SortSelect current={sort as never} />
            </div>

            <div className="mt-4 sm:hidden">
              <ProductFilters
                mobile
                categories={categories}
                brands={brands}
                categoryCounts={categoryCounts}
                brandCounts={brandCounts}
                priceRange={priceRange}
                current={{
                  category: slug,
                  brand,
                  minPrice,
                  maxPrice,
                  sort: sort as never,
                  inStock,
                  onSale,
                  rating,
                }}
                basePath={`/danh-muc/${slug}`}
              />
            </div>

            <ProductGrid products={result.items} columns={3} priorityCount={3} />

            {result.totalPages > 1 && (
              <Pagination
                page={result.page}
                totalPages={result.totalPages}
                basePath={`/danh-muc/${slug}`}
                params={{
                  ...(brand ? { thuong_hieu: brand } : {}),
                  ...(minPrice ? { gia_min: String(minPrice) } : {}),
                  ...(maxPrice ? { gia_max: String(maxPrice) } : {}),
                  ...(sort !== "newest" ? { sap_xep: sort } : {}),
                  ...(inStock ? { trong_kho: "true" } : {}),
                  ...(onSale ? { khuyen_mai: "true" } : {}),
                  ...(rating ? { danh_gia: String(rating) } : {}),
                }}
              />
            )}

            {others.length > 0 && (
              <aside className="mt-12 rounded-xl border border-ink-200 bg-ink-50 p-5">
                <h2 className="text-sm font-semibold text-ink-950">
                  Xem thêm danh mục khác
                </h2>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {others.map((c) => (
                    <li key={c.id}>
                      <Link
                        href={`/danh-muc/${c.slug}`}
                        className="inline-block rounded-full border border-ink-200 bg-white px-3 py-1.5 text-xs text-ink-700 transition hover:border-brand-300 hover:text-brand-600"
                      >
                        {c.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </aside>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
