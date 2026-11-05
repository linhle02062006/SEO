import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Clock,
  Calendar,
  User,
  ArrowRight,
  Phone,
  ShoppingBag,
} from "lucide-react";
import { SITE, ROUTES } from "@/lib/site";
import { buildMetadata } from "@/lib/seo";
import { articleSchema, breadcrumbListSchema } from "@/lib/schema";
import { formatDate } from "@/lib/format";
import { getPostBySlug, getRelatedPosts } from "@/services/catalog-service";
import { Breadcrumb } from "@/components/common/Breadcrumb";
import { PostCard } from "@/components/blog/PostCard";
import { ShareButtons } from "@/components/common/ShareButtons";

type Params = Promise<{ slug: string }>;

export const revalidate = 300;

export async function generateStaticParams() {
  const { getAllPostSlugs } = await import("@/services/catalog-service");
  const posts = await getAllPostSlugs().catch(() => []);
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) {
    return buildMetadata({
      title: "Bài viết không tồn tại",
      description: "Bài viết bạn tìm không tồn tại trên TechZone.",
      path: `/blog/${slug}`,
      noindex: true,
    });
  }

  return buildMetadata({
    title: post.seoTitle ?? post.title,
    description: post.seoDescription ?? post.excerpt ?? post.title,
    path: `/blog/${post.slug}`,
    images: post.coverImage ? [post.coverImage] : undefined,
    type: "article",
    keywords: post.tags,
    publishedTime: post.publishedAt.toISOString(),
    modifiedTime: post.updatedAt.toISOString(),
    authors: [post.authorName],
    section: "Blog",
    tags: post.tags,
  });
}

export default async function BlogPostPage({
  params,
}: {
  params: Params;
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const related = await getRelatedPosts(post.id, 3);

  const crumbs = [
    { name: "Trang chủ", href: "/" },
    { name: "Blog", href: "/blog" },
    { name: post.title, href: `/blog/${post.slug}` },
  ];

  const schema = articleSchema({
    title: post.title,
    slug: post.slug,
    description: post.seoDescription ?? post.excerpt ?? post.title,
    image: post.coverImage,
    publishedAt: post.publishedAt,
    updatedAt: post.updatedAt,
    authorName: post.authorName,
    readingTime: post.readingTime,
    keywords: post.tags,
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: breadcrumbListSchema(crumbs) }}
      />

      <div className="border-b border-ink-100 bg-ink-50">
        <div className="container-x py-3">
          <Breadcrumb items={crumbs} />
        </div>
      </div>

      <article className="container-x py-8 lg:py-12">
        <div className="mx-auto max-w-3xl">
          <header>
            <h1 className="text-2xl font-bold leading-tight tracking-tight text-ink-950 lg:text-4xl">
              {post.title}
            </h1>

            <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-ink-500">
              <span className="flex items-center gap-1.5">
                <User className="size-4" />
                {post.authorName}
              </span>
              <time
                dateTime={post.publishedAt.toISOString()}
                className="flex items-center gap-1.5"
              >
                <Calendar className="size-4" />
                {formatDate(post.publishedAt)}
              </time>
              <span className="flex items-center gap-1.5">
                <Clock className="size-4" />
                {post.readingTime} phút đọc
              </span>
            </div>
          </header>

          {post.coverImage && (
            <div className="relative mt-6 aspect-[16/9] overflow-hidden rounded-2xl bg-ink-50">
              <Image
                src={post.coverImage}
                alt={post.coverAlt ?? post.title}
                fill
                sizes="(max-width: 768px) 100vw, 768px"
                className="object-cover"
                priority
              />
            </div>
          )}

          {/* Nội dung bài viết */}
          <div className="mt-8">
            <ArticleContent html={post.content} />
          </div>

          {/* Chia sẻ */}
          <div className="mt-8 flex flex-wrap items-center gap-3 border-y border-ink-100 py-5">
            <ShareButtons
              title={post.title}
              url={`${process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"}/blog/${post.slug}`}
            />
          </div>

          {/* CTA */}
          <section className="mt-8 rounded-2xl bg-brand-600 p-6">
            <h2 className="text-lg font-bold text-white">
              Mua phụ kiện điện thoại chính hãng tại {SITE.name}
            </h2>
            <p className="mt-2 text-sm text-brand-50/90">
              Hơn 38 sản phẩm phụ kiện điện thoại và công nghệ chính hãng, bảo
              hành 12 tháng, giao hàng toàn quốc 24-48h, thanh toán COD tiện lợi.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link
                href={ROUTES.products}
                className="inline-flex items-center gap-2 rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-brand-700 transition hover:bg-brand-50"
              >
                <ShoppingBag className="size-4" />
                Mua ngay
              </Link>
              <a
                href={`tel:${SITE.phone.replace(/\s/g, "")}`}
                className="inline-flex items-center gap-2 rounded-lg border border-white/40 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                <Phone className="size-4" />
                {SITE.phone}
              </a>
            </div>
          </section>

          {/* Bài viết liên quan */}
          {related.length > 0 && (
            <section className="mt-12">
              <h2 className="text-xl font-bold tracking-tight text-ink-950">
                Bài viết liên quan
              </h2>
              <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {related.map((p) => (
                  <PostCard key={p.id} post={p} />
                ))}
              </div>
            </section>
          )}
        </div>
      </article>
    </>
  );
}

/**
 * Render nội dung HTML của bài viết (được seed với thẻ h2/h3/p/ul/table).
 * Chỉ các thẻ an toàn được giữ lại.
 */
function ArticleContent({ html }: { html: string }) {
  const blocks = html
    .split(/(?=<h2|<h3|<p|<ul|<table)/g)
    .map((b) => b.trim())
    .filter(Boolean);

  return (
    <div className="space-y-4 text-[15px] leading-7 text-ink-700">
      {blocks.map((block, i) => {
        if (block.startsWith("<h2")) {
          return (
            <h2
              key={i}
              className="mt-8 text-xl font-bold tracking-tight text-ink-950"
              dangerouslySetInnerHTML={{ __html: block }}
            />
          );
        }
        if (block.startsWith("<h3")) {
          return (
            <h3
              key={i}
              className="mt-6 text-lg font-semibold text-ink-900"
              dangerouslySetInnerHTML={{ __html: block }}
            />
          );
        }
        if (block.startsWith("<ul")) {
          return (
            <ul
              key={i}
              className="ml-5 list-disc space-y-1.5 marker:text-brand-500"
              dangerouslySetInnerHTML={{ __html: block }}
            />
          );
        }
        if (block.startsWith("<table")) {
          return (
            <div
              key={i}
              className="my-6 overflow-x-auto rounded-xl border border-ink-200"
              dangerouslySetInnerHTML={{ __html: block }}
            />
          );
        }
        return (
          <p key={i} dangerouslySetInnerHTML={{ __html: block }} />
        );
      })}
    </div>
  );
}
