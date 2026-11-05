import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import {
  Star,
  ShieldCheck,
  Truck,
  RotateCcw,
  Check,
  ChevronRight,
  Package,
  Boxes,
} from "lucide-react";
import { SITE, ROUTES } from "@/lib/site";
import { buildMetadata } from "@/lib/seo";
import { breadcrumbListSchema, productSchema } from "@/lib/schema";
import { formatPrice, percentOff, rawPrice } from "@/lib/format";
import { getProductBySlug, getRelatedProducts } from "@/services/product-service";
import { Breadcrumb } from "@/components/common/Breadcrumb";
import { ProductCard } from "@/components/product/ProductCard";
import { AddToCartButton } from "@/components/product/AddToCartButton";
import { ProductGallery } from "@/components/product/ProductGallery";
import { ProductFaq } from "@/components/product/ProductFaq";
import { ProductSpecTable } from "@/components/product/ProductSpecTable";
import { ShareButtons } from "@/components/common/ShareButtons";
import { ViewItemTracker } from "@/components/analytics/ViewItemTracker";
import type { FaqItem, SpecItem } from "@/types";

type Params = Promise<{ slug: string }>;

export const revalidate = 60;

export async function generateStaticParams() {
  const { getAllActiveProductSlugs } = await import("@/services/product-service");
  const slugs = await getAllActiveProductSlugs().catch(() => []);
  return slugs.slice(0, 100).map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) {
    return buildMetadata({
      title: "Không tìm thấy sản phẩm",
      description: "Sản phẩm bạn tìm kiếm không tồn tại trên TechZone.",
      path: `/san-pham/${slug}`,
      noindex: true,
    });
  }

  const price = rawPrice(product.salePrice ?? product.price);
  const title =
    product.seoTitle ??
    `${product.name} | ${formatPrice(price)} | ${SITE.name}`;
  const description =
    product.seoDescription ??
    product.shortDescription ??
    `Mua ${product.name} chính hãng tại TechZone. Giá ${formatPrice(price)}, bảo hành 12 tháng, giao hàng toàn quốc 24-48h.`;

  return buildMetadata({
    title,
    description,
    path: `/san-pham/${product.slug}`,
    images: product.imageUrl ? [product.imageUrl] : undefined,
    type: "product",
    keywords: [
      product.name.toLowerCase(),
      product.brand?.name ? `${product.brand.name.toLowerCase()} chính hãng` : "",
      product.category?.name ?? "",
    ].filter(Boolean),
  });
}

export default async function ProductDetailPage({
  params,
}: {
  params: Params;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const related = await getRelatedProducts(product.id, product.categoryId, 8);

  const price = rawPrice(product.price);
  const salePrice = product.salePrice != null ? rawPrice(product.salePrice) : null;
  const finalPrice = salePrice && salePrice < price ? salePrice : price;
  const discount = percentOff(price, salePrice);

  let specs: SpecItem[] = [];
  try {
    specs = product.specs ? (JSON.parse(product.specs) as SpecItem[]) : [];
  } catch {
    specs = [];
  }

  let faq: FaqItem[] = [];
  try {
    faq = product.faq ? (JSON.parse(product.faq) as FaqItem[]) : [];
  } catch {
    faq = [];
  }

  const crumbs = [
    { name: "Trang chủ", href: "/" },
    { name: "Phụ kiện điện thoại", href: "/san-pham" },
    ...(product.category
      ? [
          {
            name: product.category.name,
            href: `/danh-muc/${product.category.slug}`,
          },
        ]
      : []),
    { name: product.name, href: `/san-pham/${product.slug}` },
  ];

  const schema = productSchema({
    name: product.name,
    slug: product.slug,
    image: product.imageUrl,
    images: product.gallery,
    description:
      product.shortDescription ?? product.description ?? product.name,
    sku: product.sku,
    price: finalPrice,
    salePrice: salePrice && salePrice < price ? salePrice : null,
    availability: product.stock > 0 ? "InStock" : "OutOfStock",
    brandName: product.brand?.name,
    categoryName: product.category?.name,
    ratingValue: Number(product.ratingAverage),
    reviewCount: product.ratingCount,
  });

  const faqSchema =
    faq.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faq.map((f) => ({
            "@type": "Question",
            name: f.question,
            acceptedAnswer: { "@type": "Answer", text: f.answer },
          })),
        }
      : null;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: breadcrumbListSchema(crumbs) }}
      />

      <ViewItemTracker
        productId={product.id}
        productName={product.name}
        price={finalPrice}
      />

      <div className="border-b border-ink-100 bg-ink-50">
        <div className="container-x py-3">
          <Breadcrumb items={crumbs} />
        </div>
      </div>

      <article className="container-x py-6 lg:py-10">
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Gallery */}
          <ProductGallery
            images={product.gallery?.length ? product.gallery : [product.imageUrl ?? "/products/placeholder.svg"]}
            alt={product.name}
            badge={discount > 0 ? `-${discount}%` : product.badge}
          />

          {/* Thông tin */}
          <div>
            {product.brand && (
              <Link
                href={`${ROUTES.brands}/${product.brand.slug}`}
                className="text-xs font-semibold uppercase tracking-wide text-brand-600 hover:underline"
              >
                {product.brand.name}
              </Link>
            )}

            <h1 className="mt-2 text-2xl font-bold leading-tight tracking-tight text-ink-950 lg:text-3xl">
              {product.name}
            </h1>

            <div className="mt-3 flex flex-wrap items-center gap-4 text-sm">
              {/*
                Chỉ hiển thị rating / số lượt bán khi có dữ liệu THẬT
                (đánh giá trong `product_reviews` hoặc đơn hàng đã đặt).
                Không có dữ liệu -> ẩn hoàn toàn, không điền số giả.
              */}
              {product.ratingCount > 0 && (
                <span className="flex items-center gap-1.5">
                  <span className="flex">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star
                        key={i}
                        className={
                          i <= Math.round(Number(product.ratingAverage))
                            ? "size-4 fill-amber-400 text-amber-400"
                            : "size-4 fill-ink-200 text-ink-200"
                        }
                      />
                    ))}
                  </span>
                  <strong className="font-medium text-ink-800">
                    {Number(product.ratingAverage).toFixed(1)}
                  </strong>
                  <span className="text-ink-500">
                    ({product.ratingCount} đánh giá)
                  </span>
                </span>
              )}
              {product.soldCount > 0 && (
                <span className="flex items-center gap-1.5 text-ink-500">
                  <Package className="size-4" />
                  Đã bán {product.soldCount}
                </span>
              )}
              {product.ratingCount === 0 && product.soldCount === 0 && (
                <span className="text-ink-500">Chưa có đánh giá</span>
              )}
              <span className="text-ink-500">SKU: {product.sku}</span>
            </div>

            {/* Giá */}
            <div className="mt-5 rounded-xl border border-ink-200 bg-ink-50 p-4">
              <div className="flex flex-wrap items-baseline gap-3">
                <span className="text-3xl font-bold text-accent-600">
                  {formatPrice(finalPrice)}
                </span>
                {salePrice && salePrice < price && (
                  <>
                    <span className="text-lg text-ink-400 line-through">
                      {formatPrice(price)}
                    </span>
                    <span className="rounded-md bg-accent-500 px-2 py-0.5 text-xs font-semibold text-white">
                      Tiết kiệm {formatPrice(price - finalPrice)}
                    </span>
                  </>
                )}
              </div>
              <p className="mt-1.5 text-xs text-ink-500">
                Đã bao gồm VAT. Phí vận chuyển được tính ở bước thanh toán.
              </p>
            </div>

            {/* Tồn kho */}
            <div className="mt-4 flex items-center gap-2 text-sm">
              {product.stock > 0 ? (
                <>
                  <span className="inline-flex items-center gap-1.5 rounded-md bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
                    <Check className="size-3.5" />
                    Còn hàng ({product.stock} sản phẩm)
                  </span>
                </>
              ) : (
                <span className="inline-flex items-center gap-1.5 rounded-md bg-rose-50 px-2.5 py-1 text-xs font-medium text-rose-700">
                  Tạm hết hàng
                </span>
              )}
            </div>

            {/* Mô tả ngắn */}
            {product.shortDescription && (
              <p className="mt-4 text-sm leading-6 text-ink-700">
                {product.shortDescription}
              </p>
            )}

            {/* Thêm giỏ */}
            <div className="mt-6">
              <AddToCartButton
                product={{
                  id: product.id,
                  slug: product.slug,
                  name: product.name,
                  image: product.imageUrl,
                  price,
                  salePrice: salePrice && salePrice < price ? salePrice : null,
                  stock: product.stock,
                }}
              />
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-2">
              <ShareButtons
                title={product.name}
                url={`${process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"}/san-pham/${product.slug}`}
              />
            </div>

            {/* Bảo hành */}
            <ul className="mt-6 grid gap-3 sm:grid-cols-3">
              {[
                { icon: ShieldCheck, label: "Bảo hành 12 tháng" },
                { icon: Truck, label: "Giao hàng 24-48h" },
                { icon: RotateCcw, label: "Đổi trả 7 ngày" },
              ].map((w) => (
                <li
                  key={w.label}
                  className="flex items-center gap-2 rounded-lg border border-ink-200 px-3 py-2 text-xs text-ink-700"
                >
                  <w.icon className="size-4 shrink-0 text-brand-600" />
                  {w.label}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Mô tả chi tiết */}
        {product.description && (
          <section className="mt-12">
            <h2 className="text-xl font-bold tracking-tight text-ink-950">
              Mô tả sản phẩm
            </h2>
            <div className="prose mt-4 max-w-3xl text-sm leading-7 text-ink-700">
              {product.description.split("\n").map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </section>
        )}

        {/* Thông số kỹ thuật */}
        {specs.length > 0 && (
          <section className="mt-10">
            <h2 className="text-xl font-bold tracking-tight text-ink-950">
              Thông số kỹ thuật
            </h2>
            <ProductSpecTable specs={specs} />
          </section>
        )}

        {/* FAQ */}
        {faq.length > 0 && (
          <section className="mt-10">
            <h2 className="text-xl font-bold tracking-tight text-ink-950">
              Câu hỏi thường gặp về {product.name.toLowerCase()}
            </h2>
            <ProductFaq items={faq} />
          </section>
        )}

        {/* Sản phẩm liên quan */}
        {related.length > 0 && (
          <section className="mt-12">
            <h2 className="text-xl font-bold tracking-tight text-ink-950">
              Sản phẩm liên quan
            </h2>
            <p className="mt-1 text-sm text-ink-600">
              Nếu bạn thích {product.name.toLowerCase()}, bạn cũng có thể quan tâm
              các mẫu{" "}
              {product.category?.name.toLowerCase() ?? "phụ kiện"} khác trong
              danh mục.
            </p>
            <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
            {product.category && (
              <Link
                href={`${ROUTES.categories}/${product.category.slug}`}
                className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-brand-600 hover:underline"
              >
                Xem tất cả {product.category.name.toLowerCase()}
                <ChevronRight className="size-4" />
              </Link>
            )}
          </section>
        )}

        {/* Link nội bộ tới blog liên quan */}
        <section className="mt-12 rounded-xl border border-ink-200 bg-ink-50 p-6">
          <h2 className="flex items-center gap-2 text-base font-semibold text-ink-950">
            <Boxes className="size-5 text-brand-600" />
            Hướng dẫn liên quan
          </h2>
          <ul className="mt-4 grid gap-2 sm:grid-cols-2">
            {[
              {
                href: "/blog/cach-chon-cu-sac-nhanh",
                label: "Cách chọn củ sạc nhanh phù hợp",
              },
              {
                href: "/blog/cach-chon-cap-sac",
                label: "Cách chọn cáp sạc tốt và bền",
              },
              {
                href: "/blog/co-nen-dung-sac-nhanh",
                label: "Có nên sử dụng sạc nhanh không?",
              },
              {
                href: "/blog/nhung-phu-kien-dien-thoai-can-thiet",
                label: "Những phụ kiện điện thoại cần thiết",
              },
            ].map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="flex items-center gap-1.5 text-sm text-ink-700 transition hover:text-brand-600"
                >
                  <ChevronRight className="size-3.5 text-ink-400" />
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </article>
    </>
  );
}
