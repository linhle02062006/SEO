import type { Metadata } from "next";
import Link from "next/link";
import { Search as SearchIcon } from "lucide-react";
import { SITE } from "@/lib/site";
import { buildMetadata } from "@/lib/seo";
import { breadcrumbListSchema } from "@/lib/schema";
import { getProducts } from "@/services/product-service";
import { Breadcrumb } from "@/components/common/Breadcrumb";
import { ProductGrid } from "@/components/product/ProductGrid";
import { SearchBar } from "@/components/search/SearchBar";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export const metadata: Metadata = buildMetadata({
  title: "Tìm kiếm phụ kiện điện thoại",
  description:
    "Tìm kiếm phụ kiện điện thoại tại TechZone: cáp sạc, củ sạc, tai nghe, sạc dự phòng, kính cường lực và phụ kiện công nghệ.",
  path: "/tim-kiem",
  noindex: true, // trang kết quả tìm kiếm không nên index
});

export const dynamic = "force-dynamic";

function first(v: string | string[] | undefined): string | undefined {
  return Array.isArray(v) ? v[0] : v;
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const sp = await searchParams;
  const q = first(sp.q)?.trim() ?? "";

  const result = q
    ? await getProducts({ q, limit: 24 })
    : {
        items: [],
        total: 0,
        page: 1,
        pageSize: 24,
        totalPages: 1,
        hasPrev: false,
        hasNext: false,
      };

  const crumbs = [
    { name: "Trang chủ", href: "/" },
    { name: "Tìm kiếm", href: "/tim-kiem" },
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
            {q ? `Kết quả tìm kiếm: "${q}"` : "Tìm kiếm sản phẩm"}
          </h1>
          <p className="mt-2 text-sm text-ink-600">
            {q
              ? `Tìm thấy ${result.total} sản phẩm phù hợp với từ khóa "${q}".`
              : "Nhập từ khóa để tìm phụ kiện điện thoại và công nghệ tại TechZone."}
          </p>
        </header>

        <div className="mt-6 max-w-2xl">
          <SearchBar autoFocus defaultValue={q} />
        </div>

        {q ? (
          result.items.length > 0 ? (
            <>
              <ProductGrid products={result.items} columns={4} />
              <div className="mt-10 rounded-xl border border-ink-200 bg-ink-50 p-5">
                <h2 className="text-sm font-semibold text-ink-950">
                  Gợi ý tìm kiếm phổ biến
                </h2>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {[
                    "cáp sạc nhanh",
                    "củ sạc nhanh 20w",
                    "sạc dự phòng",
                    "tai nghe bluetooth",
                    "kính cường lực",
                    "ốp lưng iphone",
                  ].map((k) => (
                    <li key={k}>
                      <Link
                        href={`/tim-kiem?q=${encodeURIComponent(k)}`}
                        className="inline-block rounded-full border border-ink-200 bg-white px-3 py-1.5 text-xs text-ink-700 transition hover:border-brand-300 hover:text-brand-600"
                      >
                        {k}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </>
          ) : (
            <div className="mt-8 rounded-xl border border-dashed border-ink-300 bg-ink-50 px-6 py-16 text-center">
              <span className="mx-auto grid size-16 place-items-center rounded-full bg-white">
                <SearchIcon className="size-7 text-ink-400" />
              </span>
              <h2 className="mt-4 text-base font-semibold text-ink-900">
                Không tìm thấy sản phẩm phù hợp
              </h2>
              <p className="mx-auto mt-2 max-w-md text-sm text-ink-600">
                Không có sản phẩm nào khớp với từ khóa "{q}". Hãy thử từ khóa
                khác hoặc khám phá danh mục sản phẩm của TechZone.
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <Link
                  href="/san-pham"
                  className="rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700"
                >
                  Xem tất cả sản phẩm
                </Link>
                <Link
                  href="/lien-he"
                  className="rounded-lg border border-ink-200 px-5 py-2.5 text-sm font-medium text-ink-700 transition hover:bg-ink-50"
                >
                  Liên hệ tư vấn
                </Link>
              </div>
            </div>
          )
        ) : (
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { href: "/danh-muc/cap-sac", label: "Cáp sạc nhanh", desc: "USB-C, Lightning, 3-in-1" },
              { href: "/danh-muc/cu-sac", label: "Củ sạc nhanh", desc: "20W, 33W, 65W GaN" },
              { href: "/danh-muc/sac-du-phong", label: "Sạc dự phòng", desc: "10000mAh, 20000mAh" },
              { href: "/danh-muc/tai-nghe", label: "Tai nghe Bluetooth", desc: "In-ear, gaming, chống nước" },
            ].map((c) => (
              <Link
                key={c.href}
                href={c.href}
                className="rounded-xl border border-ink-200 bg-white p-5 transition hover:border-brand-300 hover:shadow-md"
              >
                <h2 className="text-sm font-semibold text-ink-950">{c.label}</h2>
                <p className="mt-1 text-xs text-ink-500">{c.desc}</p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
