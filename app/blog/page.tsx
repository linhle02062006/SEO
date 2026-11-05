import type { Metadata } from "next";
import { SITE } from "@/lib/site";
import { buildMetadata } from "@/lib/seo";
import { breadcrumbListSchema } from "@/lib/schema";
import { getPublishedPosts } from "@/services/catalog-service";
import { Breadcrumb } from "@/components/common/Breadcrumb";
import { PostCard } from "@/components/blog/PostCard";
import { CtaBanner } from "@/components/common/CtaBanner";

export const metadata: Metadata = buildMetadata({
  title: "Blog phụ kiện điện thoại — Hướng dẫn chọn & sử dụng",
  description:
    "Blog TechZone chia sẻ hướng dẫn chọn cáp sạc, củ sạc nhanh, tai nghe Bluetooth, kính cường lực, sạc dự phòng cùng kiến thức bảo vệ pin điện thoại.",
  path: "/blog",
  keywords: [
    "blog phụ kiện điện thoại",
    "cách chọn củ sạc nhanh",
    "cách chọn cáp sạc",
    "usb c là gì",
    "pd và qc",
  ],
});

export const revalidate = 300;

export default async function BlogPage() {
  const posts = await getPublishedPosts();

  const crumbs = [
    { name: "Trang chủ", href: "/" },
    { name: "Blog", href: "/blog" },
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
            Blog phụ kiện điện thoại
          </h1>
          <p className="mt-2 text-sm leading-6 text-ink-600">
            Kiến thức thực tế giúp bạn chọn đúng phụ kiện, sử dụng đúng cách và
            kéo dài tuổi thọ pin điện thoại. Cập nhật thường xuyên từ đội ngũ
            {SITE.name}.
          </p>
        </header>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>

        <CtaBanner />
      </div>
    </>
  );
}
