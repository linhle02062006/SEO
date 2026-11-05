import type { Metadata } from "next";
import Link from "next/link";
import {
  Target,
  Eye,
  Heart,
  Award,
  Users,
  Package,
  Truck,
  ShieldCheck,
  Headphones,
} from "lucide-react";
import { ROUTES } from "@/lib/site";
import { buildMetadata } from "@/lib/seo";
import { breadcrumbListSchema } from "@/lib/schema";
import { Breadcrumb } from "@/components/common/Breadcrumb";
import { SectionHeading } from "@/components/common/SectionHeading";
import { CtaBanner } from "@/components/common/CtaBanner";

export const metadata: Metadata = buildMetadata({
  title: "Giới thiệu — Cửa hàng phụ kiện điện thoại chính hãng",
  description:
    "TechZone chuyên phân phối phụ kiện điện thoại và công nghệ chính hãng tại Việt Nam: cáp sạc, củ sạc nhanh, tai nghe Bluetooth, sạc dự phòng, kính cường lực, ốp lưng, phụ kiện laptop và phụ kiện gaming.",
  path: "/gioi-thieu",
  keywords: [
    "giới thiệu techzone",
    "cửa hàng phụ kiện điện thoại",
    "phụ kiện điện thoại chính hãng",
  ],
});

export default function AboutPage() {
  const crumbs = [
    { name: "Trang chủ", href: "/" },
    { name: "Giới thiệu", href: "/gioi-thieu" },
  ];

  const values = [
    {
      icon: Target,
      title: "Cam kết chính hãng",
      desc: "Mọi sản phẩm đều có nguồn gốc rõ ràng từ nhà phân phối ủy quyền, kèm tem bảo hành và hóa đơn VAT.",
    },
    {
      icon: Eye,
      title: "Thông tin minh bạch",
      desc: "Mô tả, thông số kỹ thuật và hình ảnh sản phẩm được cập nhật chính xác từ thông tin nhà sản xuất.",
    },
    {
      icon: Heart,
      title: "Tư vấn trung thực",
      desc: "Đội ngũ tư vấn sẵn sàng nói rõ điểm mạnh và điểm yếu của từng mẫu để bạn chọn đúng nhu cầu.",
    },
    {
      icon: Award,
      title: "Chất lượng nhất quán",
      desc: "Quy trình kiểm tra hàng trước khi gửi giúp mỗi đơn hàng đều đạt chất lượng như cam kết.",
    },
  ];

  const stats = [
    { value: "38+", label: "Sản phẩm chính hãng" },
    { value: "9", label: "Danh mục phụ kiện" },
    { value: "7", label: "Thương hiệu uy tín" },
    { value: "24-48h", label: "Giao hàng toàn quốc" },
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

      {/* Hero */}
      <section className="relative overflow-hidden bg-ink-950">
        <div
          className="absolute inset-0 bg-[radial-gradient(60%_60%_at_30%_20%,rgba(51,132,255,0.3),transparent)]"
          aria-hidden
        />
        <div className="container-x relative py-14 lg:py-20">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-brand-200 ring-1 ring-white/15">
              Về TechZone
            </span>
            <h1 className="mt-5 text-3xl font-bold leading-tight tracking-tight text-white lg:text-4xl">
              Cửa hàng phụ kiện điện thoại và công nghệ
              <br />
              <span className="text-brand-400">đáng tin cậy tại Việt Nam</span>
            </h1>
            <p className="mt-5 text-base leading-7 text-ink-300">
              TechZone ra đời từ một câu hỏi đơn giản: người dùng Việt Nam
              thường xuyên gặp khó khăn khi tìm phụ kiện điện thoại chính hãng
              với giá hợp lý, được bảo hành đúng cam kết và có thông tin sản
              phẩm đầy đủ trước khi mua.
            </p>
          </div>

          <dl className="mt-10 grid grid-cols-2 gap-6 border-t border-white/10 pt-8 sm:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label}>
                <dt className="text-2xl font-bold text-white">{s.value}</dt>
                <dd className="mt-1 text-xs text-ink-400">{s.label}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Sứ mệnh */}
      <section className="container-x py-12 lg:py-16">
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-ink-950">
              Sứ mệnh của TechZone
            </h2>
            <div className="mt-4 space-y-4 text-sm leading-7 text-ink-700">
              <p>
                Chúng tôi tin rằng việc mua phụ kiện điện thoại không nên là
                một trải nghiệm đầy may mắn. Một chiếc cáp sạc 20W giá 129.000
                đồng hay một chiếc cáp &quot;siêu nhanh&quot; nhưng không có thông số — sự
                khác biệt đó tạo ra hậu quả hoàn toàn khác nhau cho thiết bị và
                túi tiền của bạn.
              </p>
              <p>
                Vì vậy, mỗi sản phẩm trên TechZone đều có đủ thông tin: công
                suất thực tế, chuẩn sạc hỗ trợ (PD, QC), chất liệu, độ bền, và
                bảo hành. Chúng tôi cũng viết blog hướng dẫn chi tiết để bạn
                hiểu rõ công nghệ trước khi quyết định.
              </p>
              <p>
                Ngoài ra, mỗi trang sản phẩm đều có thông số kỹ thuật đầy đủ,
                chính sách đổi trả 7 ngày rõ ràng và kênh tư vấn trực tuyến hoạt
                động 8:00-22:00 hằng ngày.
              </p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {values.map((v) => (
              <div
                key={v.title}
                className="rounded-xl border border-ink-200 bg-white p-5"
              >
                <span className="grid size-10 place-items-center rounded-lg bg-brand-50 text-brand-600">
                  <v.icon className="size-5" />
                </span>
                <h3 className="mt-3.5 text-sm font-semibold text-ink-950">
                  {v.title}
                </h3>
                <p className="mt-1.5 text-xs leading-5 text-ink-600">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quy trình */}
      <section className="bg-ink-50 py-12 lg:py-16">
        <div className="container-x">
          <SectionHeading
            eyebrow="Quy trình"
            title="Từ đặt hàng đến khi nhận hàng"
            description="Quy trình rõ ràng giúp bạn an tâm với mỗi đơn hàng tại TechZone."
          />
          <ol className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: Package,
                title: "Đặt hàng",
                desc: "Chọn sản phẩm, điền thông tin giao hàng và chọn COD hoặc chuyển khoản.",
              },
              {
                icon: Users,
                title: "Xác nhận đơn",
                desc: "Chúng tôi gọi điện xác nhận trong vòng 24 giờ làm việc.",
              },
              {
                icon: ShieldCheck,
                title: "Kiểm tra & đóng gói",
                desc: "Hàng được kiểm tra chính hãng, tem bảo hành và phụ kiện đầy đủ.",
              },
              {
                icon: Truck,
                title: "Giao hàng",
                desc: "Giao toàn quốc 24-48h, bạn kiểm tra hàng trước khi thanh toán.",
              },
            ].map((s, i) => (
              <li key={s.title} className="rounded-xl bg-white p-5 shadow-sm">
                <div className="flex items-center gap-3">
                  <span className="grid size-9 place-items-center rounded-lg bg-brand-600 text-sm font-bold text-white">
                    {i + 1}
                  </span>
                  <s.icon className="size-5 text-brand-600" />
                </div>
                <h3 className="mt-3.5 text-sm font-semibold text-ink-950">
                  {s.title}
                </h3>
                <p className="mt-1.5 text-xs leading-5 text-ink-600">{s.desc}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Cam kết dịch vụ */}
      <section className="container-x py-12 lg:py-16">
        <SectionHeading
          eyebrow="Cam kết"
          title="Cam kết dịch vụ của chúng tôi"
        />
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              icon: ShieldCheck,
              title: "Bảo hành 12 tháng",
              desc: "Sản phẩm lỗi được đổi mới trong thời gian bảo hành.",
            },
            {
              icon: Truck,
              title: "Miễn phí vận chuyển",
              desc: "Đơn từ 300.000 ₫ được miễn phí vận chuyển toàn quốc.",
            },
            {
              icon: Package,
              title: "Đổi trả 7 ngày",
              desc: "Sản phẩm chưa sử dụng đổi trả trong 7 ngày không cần lý do.",
            },
            {
              icon: Headphones,
              title: "Hỗ trợ 8:00-22:00",
              desc: "Tư vấn nhiệt tình qua chat trực tuyến.",
            },
          ].map((w) => (
            <div
              key={w.title}
              className="rounded-xl border border-ink-200 bg-white p-5"
            >
              <w.icon className="size-6 text-brand-600" />
              <h3 className="mt-3 text-sm font-semibold text-ink-950">
                {w.title}
              </h3>
              <p className="mt-1.5 text-xs leading-5 text-ink-600">{w.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <CtaBanner />

      {/* Link nội bộ */}
      <section className="container-x pb-14">
        <h2 className="text-lg font-bold text-ink-950">Khám phá thêm</h2>
        <ul className="mt-4 flex flex-wrap gap-2">
          {[
            { href: ROUTES.products, label: "Tất cả sản phẩm" },
            { href: ROUTES.categories, label: "Danh mục phụ kiện" },
            { href: ROUTES.brands, label: "Thương hiệu" },
            { href: ROUTES.blog, label: "Blog hướng dẫn" },
            { href: ROUTES.contact, label: "Liên hệ" },
          ].map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                className="inline-block rounded-full border border-ink-200 px-4 py-2 text-sm text-ink-700 transition hover:border-brand-300 hover:text-brand-600"
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
