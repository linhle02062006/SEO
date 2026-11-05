import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CalendarDays } from "lucide-react";
import { buildMetadata } from "@/lib/seo";
import { breadcrumbListSchema } from "@/lib/schema";
import { POLICIES, getPolicy } from "@/lib/policies";
import { Breadcrumb } from "@/components/common/Breadcrumb";
import { FaqSection } from "@/components/common/FaqSection";
import { CtaBanner } from "@/components/common/CtaBanner";

type Params = Promise<{ slug: string }>;

export function generateStaticParams() {
  return POLICIES.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { slug } = await params;
  const policy = getPolicy(slug);

  if (!policy) {
    return buildMetadata({
      title: "Không tìm thấy chính sách",
      description: "Trang chính sách không tồn tại trên TechZone.",
      path: `/chinh-sach/${slug}`,
      noindex: true,
    });
  }

  return buildMetadata({
    title: policy.seoTitle,
    description: policy.seoDescription,
    path: `/chinh-sach/${policy.slug}`,
    keywords: [policy.title.toLowerCase(), "techzone", "chính sách"],
  });
}

export default async function PolicyDetailPage({ params }: { params: Params }) {
  const { slug } = await params;
  const policy = getPolicy(slug);
  if (!policy) notFound();

  const crumbs = [
    { name: "Trang chủ", href: "/" },
    { name: "Chính sách", href: "/chinh-sach" },
    { name: policy.title, href: `/chinh-sach/${policy.slug}` },
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
        <div className="grid gap-10 lg:grid-cols-[240px_1fr]">
          {/* Sidebar: danh sách chính sách (internal link) */}
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-ink-500">
              Tất cả chính sách
            </h2>
            <ul className="mt-3 space-y-1">
              {POLICIES.map((p) => {
                const active = p.slug === policy.slug;
                return (
                  <li key={p.slug}>
                    <Link
                      href={`/chinh-sach/${p.slug}`}
                      className={
                        active
                          ? "block rounded-lg bg-brand-50 px-3 py-2 text-sm font-medium text-brand-700"
                          : "block rounded-lg px-3 py-2 text-sm text-ink-700 transition hover:bg-ink-50 hover:text-ink-950"
                      }
                      aria-current={active ? "page" : undefined}
                    >
                      {p.title}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </aside>

          <article className="max-w-3xl">
            <header>
              <h1 className="text-2xl font-bold tracking-tight text-ink-950 lg:text-3xl">
                {policy.title}
              </h1>
              <p className="mt-3 flex items-center gap-1.5 text-xs text-ink-500">
                <CalendarDays className="size-3.5" />
                Cập nhật lần cuối:{" "}
                {new Date(policy.updatedAt).toLocaleDateString("vi-VN")}
              </p>
              <p className="mt-4 rounded-xl border-l-4 border-brand-500 bg-brand-50/60 p-4 text-sm leading-6 text-ink-700">
                {policy.intro}
              </p>
            </header>

            <div className="mt-8 space-y-8">
              {policy.sections.map((section) => (
                <section key={section.heading}>
                  <h2 className="text-xl font-bold tracking-tight text-ink-950">
                    {section.heading}
                  </h2>
                  <div className="mt-3 space-y-3 text-sm leading-7 text-ink-700">
                    {section.body.map((p, i) => (
                      <p key={i}>{p}</p>
                    ))}
                  </div>
                  {section.list && (
                    <ul className="mt-3 space-y-2 text-sm leading-6 text-ink-700">
                      {section.list.map((item, i) => (
                        <li key={i} className="flex gap-2.5">
                          <span
                            className="mt-2 size-1.5 shrink-0 rounded-full bg-brand-500"
                            aria-hidden
                          />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </section>
              ))}
            </div>

            <FaqSection
              title="Câu hỏi thường gặp về chính sách này"
              items={policy.faq}
              className="mt-12"
            />
          </article>
        </div>
      </div>

      <CtaBanner />
    </>
  );
}
