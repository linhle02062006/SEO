import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  ChevronRight,
  Flame,
  Sparkles,
  Clock,
  ShieldCheck,
  Truck,
  Headphones,
  Tag,
} from "lucide-react";
import { SITE, ROUTES } from "@/lib/site";
import { buildMetadata } from "@/lib/seo";
import { breadcrumbListSchema } from "@/lib/schema";
import {
  getBestSellers,
  getFeaturedProducts,
  getLatestProducts,
  getOnSaleProducts,
} from "@/services/product-service";
import {
  getAllCategories,
  getFeaturedCategories,
  getPublishedPosts,
} from "@/services/catalog-service";
import { ProductCard } from "@/components/product/ProductCard";
import { ProductGrid } from "@/components/product/ProductGrid";
import { SectionHeading } from "@/components/common/SectionHeading";
import { CtaBanner } from "@/components/common/CtaBanner";
import { PostCard } from "@/components/blog/PostCard";
import { formatPrice } from "@/lib/format";

export const metadata: Metadata = buildMetadata({
  title: SITE.tagline,
  description: SITE.description,
  path: "/",
  keywords: [
    "phụ kiện điện thoại",
    "phụ kiện điện thoại chính hãng",
    "mua phụ kiện điện thoại",
    "cáp sạc nhanh",
    "củ sạc nhanh",
    "sạc dự phòng",
    "tai nghe bluetooth",
    "kính cường lực",
    "ốp lưng điện thoại",
  ],
});

export const revalidate = 60;

export default async function HomePage() {
  const [featured, bestSellers, latest, onSale, categories, featuredCategories, posts] =
    await Promise.all([
      getFeaturedProducts(8),
      getBestSellers(8),
      getLatestProducts(8),
      getOnSaleProducts(4),
      getAllCategories(),
      getFeaturedCategories(),
      getPublishedPosts(3),
    ]);

  const breadcrumb = breadcrumbListSchema([
    { name: "Trang chủ", href: "/" },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: breadcrumb }}
      />

      {/* ---------------- HERO ---------------- */}
      <section className="relative overflow-hidden bg-ink-950">
        <div
          className="absolute inset-0 bg-[radial-gradient(60%_60%_at_70%_20%,rgba(51,132,255,0.35),transparent)]"
          aria-hidden
        />
        <div className="container-x relative grid items-center gap-10 py-14 lg:grid-cols-2 lg:py-20">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-brand-200 ring-1 ring-white/15">
              <Sparkles className="size-3.5" />
              Phụ kiện điện thoại & công nghệ chính hãng
            </span>
            <h1 className="mt-5 text-3xl font-bold leading-tight text-white sm:text-4xl lg:text-5xl">
              TechZone — Phụ kiện điện thoại
              <br />
              <span className="text-brand-400">chính hãng giá tốt</span>
            </h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-ink-300">
              Cáp sạc nhanh, củ sạc, tai nghe Bluetooth, sạc dự phòng, kính cường
              lực và các phụ kiện điện thoại chính hãng. Bảo hành 12 tháng, giao
              hàng toàn quốc 24-48h, đổi trả 7 ngày không cần lý do.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href={ROUTES.products}
                className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-700"
              >
                Mua sắm ngay
                <ArrowRight className="size-4" />
              </Link>
              <Link
                href={ROUTES.categories}
                className="inline-flex items-center gap-2 rounded-lg border border-white/20 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Khám phá danh mục
              </Link>
            </div>
            <dl className="mt-10 grid max-w-lg grid-cols-3 gap-6 border-t border-white/10 pt-6">
              {[
                { value: "38+", label: "Sản phẩm chính hãng" },
                { value: "12 tháng", label: "Bảo hành" },
                { value: "24-48h", label: "Giao toàn quốc" },
              ].map((s) => (
                <div key={s.label}>
                  <dt className="text-xl font-bold text-white">{s.value}</dt>
                  <dd className="mt-0.5 text-xs text-ink-400">{s.label}</dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Ảnh minh họa */}
          <div className="relative hidden lg:block">
            <div className="grid grid-cols-2 gap-4">
              {(bestSellers.length > 0 ? bestSellers : featured)
                .slice(0, 4)
                .map((p, i) => (
                  <Link
                    key={p.id}
                    href={`/san-pham/${p.slug}`}
                    className={`group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 ${
                      i % 2 === 1 ? "translate-y-6" : ""
                    }`}
                  >
                    <div className="relative aspect-square">
                      <Image
                        src={p.imageUrl ?? "/products/placeholder.svg"}
                        alt={p.name}
                        fill
                        sizes="240px"
                        className="object-cover transition duration-500 group-hover:scale-105"
                        priority={i < 2}
                      />
                    </div>
                  </Link>
                ))}
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- LỢI ÍCH ---------------- */}
      <section className="border-b border-ink-100 bg-white">
        <div className="container-x grid grid-cols-2 gap-6 py-8 lg:grid-cols-4">
          {[
            {
              icon: ShieldCheck,
              title: "Chính hãng 100%",
              desc: "Nguồn gốc rõ ràng, bảo hành 12 tháng",
            },
            {
              icon: Truck,
              title: "Giao nhanh 24-48h",
              desc: "Miễn phí vận chuyển từ 300.000 ₫",
            },
            {
              icon: Tag,
              title: "Giá tốt nhất",
              desc: "Không mức phí ẩn, thanh toán COD",
            },
            {
              icon: Headphones,
              title: "Tư vấn 8:00-22:00",
              desc: "Hỗ trợ chọn phụ kiện phù hợp",
            },
          ].map((f) => (
            <div key={f.title} className="flex items-start gap-3">
              <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-brand-50 text-brand-600">
                <f.icon className="size-5" />
              </span>
              <div>
                <h2 className="text-sm font-semibold text-ink-950">{f.title}</h2>
                <p className="mt-0.5 text-xs leading-5 text-ink-500">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ---------------- DANH MỤC ---------------- */}
      <section className="container-x py-12 lg:py-16">
        <SectionHeading
          eyebrow="Danh mục"
          title="Mua phụ kiện điện thoại theo danh mục"
          description="Chọn danh mục sản phẩm bạn cần để xem nhanh các mẫu đang bán tại TechZone."
          href={ROUTES.categories}
          linkLabel="Xem tất cả danh mục"
        />

        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {featuredCategories.map((c) => {
            const count = categories.find((x) => x.id === c.id);
            return (
              <Link
                key={c.id}
                href={`${ROUTES.categories}/${c.slug}`}
                className="group flex flex-col items-center gap-2 rounded-xl border border-ink-200 bg-white p-5 text-center transition hover:border-brand-300 hover:shadow-md hover:shadow-ink-900/5"
              >
                <span className="grid size-12 place-items-center rounded-xl bg-brand-50 text-brand-600 transition group-hover:bg-brand-600 group-hover:text-white">
                  <SmartphoneIcon />
                </span>
                <span className="text-sm font-medium text-ink-900">
                  {c.name}
                </span>
                <span className="text-xs text-ink-400">
                  {count ? "Xem sản phẩm" : ""}
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ---------------- SẢN PHẨM NỔI BẬT ---------------- */}
      <section className="bg-ink-50 py-12 lg:py-16">
        <div className="container-x">
          <SectionHeading
            eyebrow="Nổi bật"
            title="Sản phẩm nổi bật"
            description="Những mẫu phụ kiện chính hãng đang được TechZone giới thiệu."
            href={ROUTES.products}
            linkLabel="Xem tất cả"
          />
          <ProductGrid products={featured} columns={4} priorityCount={4} />
        </div>
      </section>

      {/* ---------------- KHUYẾN MÃI ---------------- */}
      {onSale.length > 0 && (
        <section className="container-x py-12 lg:py-16">
          <SectionHeading
            eyebrow="Khuyến mãi"
            title="Sản phẩm đang giảm giá"
            description="Ưu đãi có thời hạn, số lượng có hạn."
            href={`${ROUTES.products}?onSale=true`}
            linkLabel="Xem tất cả khuyến mãi"
          />
          <ProductGrid products={onSale} columns={4} />
        </section>
      )}

      {/* ---------------- BÁN CHẠY ---------------- */}
      {bestSellers.length > 0 && bestSellers.some((p) => p.soldCount > 0) && (
        <section className="container-x pb-12 lg:pb-16">
          <SectionHeading
            eyebrow="Bán chạy"
            title="Sản phẩm bán chạy nhất"
            description="Top sản phẩm có số lượng bán ra cao nhất tại TechZone."
            href={`${ROUTES.products}?sort=popular`}
            linkLabel="Xem tất cả"
          />
          <ProductGrid products={bestSellers} columns={4} />
        </section>
      )}

      {/* ---------------- CTA ---------------- */}
      <CtaBanner />

      {/* ---------------- SẢN PHẨM MỚI ---------------- */}
      <section className="container-x py-12 lg:py-16">
        <SectionHeading
          eyebrow="Mới về"
          title="Sản phẩm mới"
          description="Cập nhật mới nhất trong danh mục phụ kiện điện thoại và công nghệ."
          href={`${ROUTES.products}?sort=newest`}
          linkLabel="Xem tất cả"
        />
        <ProductGrid products={latest} columns={4} />
      </section>

      {/* ---------------- BLOG ---------------- */}
      <section className="bg-ink-50 py-12 lg:py-16">
        <div className="container-x">
          <SectionHeading
            eyebrow="Blog"
            title="Bài viết mới nhất"
            description="Kiến thức hữu ích giúp bạn chọn và sử dụng phụ kiện điện thoại đúng cách."
            href={ROUTES.blog}
            linkLabel="Xem tất cả bài viết"
          />
          <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- DANH MỤC SEO (internal linking) ---------------- */}
      <section className="container-x py-12 lg:py-16">
        <h2 className="text-2xl font-bold tracking-tight text-ink-950">
          Duyệt theo danh mục phụ kiện
        </h2>
        <p className="mt-2 max-w-2xl text-sm text-ink-600">
          Tìm nhanh các dòng sản phẩm theo nhu cầu sử dụng của bạn.
        </p>
        <ul className="mt-6 grid grid-cols-1 gap-x-8 gap-y-2 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((c) => (
            <li key={c.id}>
              <Link
                href={`${ROUTES.categories}/${c.slug}`}
                className="group flex items-center justify-between rounded-lg px-3 py-2 text-sm text-ink-700 transition hover:bg-ink-50 hover:text-brand-600"
              >
                <span>{c.name}</span>
                <ChevronRight className="size-4 text-ink-300 transition group-hover:translate-x-0.5 group-hover:text-brand-500" />
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}

function SmartphoneIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="size-6"
      aria-hidden
    >
      <rect x="6" y="2" width="12" height="20" rx="3" />
      <path d="M11 18h2" />
    </svg>
  );
}
