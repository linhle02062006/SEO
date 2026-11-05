import type { Metadata } from "next";
import Link from "next/link";
import { SlidersHorizontal, ChevronRight } from "lucide-react";
import { ROUTES } from "@/lib/site";
import { buildMetadata } from "@/lib/seo";
import { breadcrumbListSchema } from "@/lib/schema";
import { getProducts } from "@/services/product-service";
import {
  getAllBrands,
  getAllCategories,
  getBrandCounts,
  getCategoryCounts,
  getPriceRange,
} from "@/services/catalog-service";
import { Breadcrumb } from "@/components/common/Breadcrumb";
import { ProductGrid } from "@/components/product/ProductGrid";
import { ProductFilters, SortSelect } from "@/components/product/ProductFilters";
import { Pagination } from "@/components/common/Pagination";
import { buildSearchParams } from "@/lib/utils";
import type { SortOption } from "@/types";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export const metadata: Metadata = buildMetadata({
  title: "Sản phẩm phụ kiện điện thoại chính hãng giá tốt",
  description:
    "Mua phụ kiện điện thoại chính hãng tại TechZone: cáp sạc nhanh, củ sạc nhanh, tai nghe Bluetooth, sạc dự phòng, kính cường lực, ốp lưng, giá đỡ điện thoại, phụ kiện laptop và phụ kiện gaming.",
  path: "/san-pham",
  keywords: [
    "phụ kiện điện thoại",
    "mua phụ kiện điện thoại",
    "phụ kiện điện thoại chính hãng",
    "cáp sạc nhanh",
    "củ sạc nhanh",
    "sạc dự phòng",
    "tai nghe bluetooth",
  ],
});

export const revalidate = 60;

function first(v: string | string[] | undefined): string | undefined {
  return Array.isArray(v) ? v[0] : v;
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const sp = await searchParams;

  const q = first(sp.q)?.trim();
  const category = first(sp["danh-muc"]);
  const brand = first(sp["thuong-hieu"]);
  const minPrice = first(sp.gia_min) ? Number(first(sp.gia_min)) : undefined;
  const maxPrice = first(sp.gia_max) ? Number(first(sp.gia_max)) : undefined;
  const sort = (first(sp["sap-xep"]) as SortOption | undefined) ?? "newest";
  const page = first(sp.trang) ? Math.max(1, Number(first(sp.trang))) : 1;
  const inStock = first(sp["trong-kho"]) === "true";
  const onSale = first(sp["khuyen-mai"]) === "true";
  const rating = first(sp["danh-gia"]) ? Number(first(sp["danh-gia"])) : undefined;

  const [result, categories, brands, categoryCounts, brandCounts, priceRange] =
    await Promise.all([
      getProducts({
        q,
        category,
        brand,
        minPrice: Number.isFinite(minPrice) ? minPrice : undefined,
        maxPrice: Number.isFinite(maxPrice) ? maxPrice : undefined,
        sort,
        page,
        limit: 12,
        inStock,
        onSale,
        rating,
      }),
      getAllCategories(),
      getAllBrands(),
      getCategoryCounts(),
      getBrandCounts(),
      getPriceRange(),
    ]);

  const crumb = breadcrumbListSchema([
    { name: "Trang chủ", href: "/" },
    { name: "Sản phẩm", href: "/san-pham" },
  ]);

  const activeCategory = categories.find((c) => c.slug === category);
  const activeBrand = brands.find((b) => b.slug === brand);
  const heading = activeCategory
    ? `${activeCategory.name} chính hãng`
    : activeBrand
      ? `Phụ kiện thương hiệu ${activeBrand.name}`
      : q
        ? `Kết quả tìm kiếm: ${q}`
        : "Phụ kiện điện thoại và công nghệ chính hãng";

  const description = activeCategory
    ? activeCategory.description ?? undefined
    : activeBrand
      ? activeBrand.description ?? undefined
      : "Khám phá toàn bộ phụ kiện điện thoại và công nghệ chính hãng tại TechZone với giá tốt, bảo hành 12 tháng và giao hàng toàn quốc.";

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: crumb }}
      />

      {/* Breadcrumb */}
      <div className="border-b border-ink-100 bg-ink-50">
        <div className="container-x py-3">
          <Breadcrumb
            items={[
              { name: "Trang chủ", href: "/" },
              ...(activeCategory
                ? [{ name: "Sản phẩm", href: "/san-pham" }]
                : []),
              ...(activeCategory
                ? [
                    {
                      name: activeCategory.name,
                      href: `/danh-muc/${activeCategory.slug}`,
                    },
                  ]
                : []),
              ...(!activeCategory && activeBrand
                ? [{ name: "Sản phẩm", href: "/san-pham" }]
                : []),
              ...(!activeCategory && activeBrand
                ? [
                    {
                      name: activeBrand.name,
                      href: `/thuong-hieu/${activeBrand.slug}`,
                    },
                  ]
                : []),
              ...(!activeCategory && !activeBrand && q
                ? [{ name: "Tìm kiếm", href: `/tim-kiem?q=${encodeURIComponent(q)}` }]
                : []),
            ]}
          />
        </div>
      </div>

      <div className="container-x py-6 lg:py-8">
        <header className="max-w-3xl">
          <h1 className="text-2xl font-bold tracking-tight text-ink-950 lg:text-3xl">
            {heading}
          </h1>
          {description && (
            <p className="mt-2 text-sm leading-6 text-ink-600">{description}</p>
          )}
          <p className="mt-2 text-sm text-ink-500">
            Tìm thấy{" "}
            <strong className="font-semibold text-ink-800">
              {result.total} sản phẩm
            </strong>
            {activeCategory && categoryCounts[activeCategory.slug]
              ? ` trong danh mục ${activeCategory.name}`
              : ""}
          </p>
        </header>

        <div className="mt-8 grid gap-8 lg:grid-cols-[260px_1fr]">
          {/* Bộ lọc (sidebar desktop) */}
          <ProductFilters
            categories={categories}
            brands={brands}
            categoryCounts={categoryCounts}
            brandCounts={brandCounts}
            priceRange={priceRange}
            current={{
              category,
              brand,
              minPrice,
              maxPrice,
              sort,
              inStock,
              onSale,
              rating,
            }}
            basePath="/san-pham"
          />

          {/* Kết quả */}
          <div className="min-w-0">
            {/* Thanh sắp xếp (desktop) */}
            <div className="hidden items-center justify-between border-b border-ink-100 pb-3 sm:flex">
              <p className="text-sm text-ink-600">
                Hiển thị {result.items.length} / {result.total} sản phẩm
              </p>
              <SortSelect current={sort} />
            </div>

            {/* Bộ lọc mobile */}
            <div className="mt-4 sm:hidden">
              <ProductFilters
                mobile
                categories={categories}
                brands={brands}
                categoryCounts={categoryCounts}
                brandCounts={brandCounts}
                priceRange={priceRange}
                current={{
                  category,
                  brand,
                  minPrice,
                  maxPrice,
                  sort,
                  inStock,
                  onSale,
                  rating,
                }}
                basePath="/san-pham"
              />
            </div>

            <ProductGrid products={result.items} columns={3} priorityCount={3} />

            {result.totalPages > 1 && (
              <Pagination
                page={result.page}
                totalPages={result.totalPages}
                basePath="/san-pham"
                params={buildSearchParams({
                  q,
                  danh_muc: category,
                  thuong_hieu: brand,
                  gia_min: minPrice ? String(minPrice) : undefined,
                  gia_max: maxPrice ? String(maxPrice) : undefined,
                  sap_xep: sort !== "newest" ? sort : undefined,
                  trong_kho: inStock ? "true" : undefined,
                  khuyen_mai: onSale ? "true" : undefined,
                  danh_gia: rating ? String(rating) : undefined,
                })}
              />
            )}

            {/* Link nội bộ tới danh mục */}
            <aside className="mt-12 rounded-xl border border-ink-200 bg-ink-50 p-5">
              <h2 className="text-sm font-semibold text-ink-950">
                Mua theo danh mục phụ kiện
              </h2>
              <ul className="mt-3 flex flex-wrap gap-2">
                {categories.map((c) => (
                  <li key={c.id}>
                    <Link
                      href={`${ROUTES.categories}/${c.slug}`}
                      className="inline-flex items-center gap-1 rounded-full border border-ink-200 bg-white px-3 py-1.5 text-xs text-ink-700 transition hover:border-brand-300 hover:text-brand-600"
                    >
                      {c.name}
                      <ChevronRight className="size-3" />
                    </Link>
                  </li>
                ))}
              </ul>
            </aside>
          </div>
        </div>
      </div>
    </>
  );
}
