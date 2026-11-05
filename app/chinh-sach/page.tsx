import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, FileText } from "lucide-react";
import { buildMetadata } from "@/lib/seo";
import { breadcrumbListSchema } from "@/lib/schema";
import { POLICIES } from "@/lib/policies";
import { Breadcrumb } from "@/components/common/Breadcrumb";
import { CtaBanner } from "@/components/common/CtaBanner";

export const metadata: Metadata = buildMetadata({
  title: "Chính sách & Điều khoản",
  description:
    "Các chính sách của TechZone: bảo hành, đổi trả 7 ngày, vận chuyển, bảo mật thông tin và điều khoản sử dụng website.",
  path: "/chinh-sach",
  keywords: ["chính sách techzone", "chính sách bảo hành", "chính sách đổi trả"],
});

export default function PoliciesPage() {
  const crumbs = [
    { name: "Trang chủ", href: "/" },
    { name: "Chính sách", href: "/chinh-sach" },
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
            Chính sách & Điều khoản
          </h1>
          <p className="mt-2 text-sm leading-6 text-ink-600">
            Chính sách minh bạch giúp bạn yên tâm mua sắm tại TechZone. Chúng tôi
            luôn cập nhật để phản ánh đúng cách chúng tôi vận hành.
          </p>
        </header>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {POLICIES.map((p) => (
            <Link
              key={p.slug}
              href={`/chinh-sach/${p.slug}`}
              className="group flex items-start gap-4 rounded-xl border border-ink-200 bg-white p-5 transition hover:border-brand-300 hover:shadow-md"
            >
              <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-brand-50 text-brand-600">
                <FileText className="size-5" />
              </span>
              <div className="min-w-0 flex-1">
                <h2 className="text-sm font-semibold text-ink-950 transition group-hover:text-brand-600">
                  {p.title}
                </h2>
                <p className="mt-1.5 line-clamp-2 text-xs leading-5 text-ink-600">
                  {p.intro}
                </p>
                <span className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-brand-600">
                  Xem chi tiết
                  <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <CtaBanner />
    </>
  );
}
