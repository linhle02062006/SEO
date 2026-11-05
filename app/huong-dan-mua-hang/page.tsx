import type { Metadata } from "next";
import Link from "next/link";
import {
  ShoppingCart,
  CreditCard,
  Truck,
  PackageCheck,
  Headphones,
  ArrowRight,
} from "lucide-react";
import { buildMetadata } from "@/lib/seo";
import { breadcrumbListSchema } from "@/lib/schema";
import { ROUTES } from "@/lib/site";
import { Breadcrumb } from "@/components/common/Breadcrumb";
import { SectionHeading } from "@/components/common/SectionHeading";
import { FaqSection } from "@/components/common/FaqSection";
import { CtaBanner } from "@/components/common/CtaBanner";

export const metadata: Metadata = buildMetadata({
  title: "Hướng dẫn mua hàng chi tiết",
  description:
    "Hướng dẫn mua hàng tại TechZone: các bước đặt hàng, phương thức thanh toán COD và chuyển khoản, quy trình giao hàng, tra cứu đơn và đổi trả.",
  path: "/huong-dan-mua-hang",
  keywords: [
    "hướng dẫn mua hàng",
    "cách đặt hàng trực tuyến",
    "thanh toán cod",
    "phí vận chuyển techzone",
  ],
});

const steps = [
  {
    icon: ShoppingCart,
    title: "Bước 1 — Chọn sản phẩm",
    desc: "Duyệt danh mục phụ kiện, lọc theo thương hiệu, giá hoặc tìm kiếm theo tên. Mỗi sản phẩm đều có thông số kỹ thuật, hình ảnh thật và FAQ.",
    tips: [
      "Kiểm tra thông số công suất (W) và chuẩn sạc (PD/QC) trước khi mua",
      "Tham khảo mô tả chi tiết và hình ảnh thực tế của sản phẩm",
      "Sản phẩm nào có badge “Mới” hoặc “Nổi bật” thường là lựa chọn an toàn",
    ],
  },
  {
    icon: ShoppingCart,
    title: "Bước 2 — Thêm vào giỏ hàng",
    desc: "Nhấn “Thêm vào giỏ” ngay trên thẻ sản phẩm. Giỏ hàng được lưu tự động trên trình duyệt, kể cả khi bạn đóng tab và quay lại.",
    tips: [
      "Đơn hàng từ 300.000 ₫ được miễn phí vận chuyển",
      "Số lượng tối đa phụ thuộc tồn kho thực tế của sản phẩm",
    ],
  },
  {
    icon: CreditCard,
    title: "Bước 3 — Điền thông tin giao hàng",
    desc: "Nhập họ tên, số điện thoại, email và địa chỉ nhận hàng. Chúng tôi dùng thông tin này để gọi xác nhận và giao đúng địa chỉ.",
    tips: [
      "Số điện thoại phải là số thật để đơn vị vận chuyển liên hệ được",
      "Ghi chú thêm vào mô tả đơn hàng nếu bạn muốn giao vào giờ khác",
    ],
  },
  {
    icon: CreditCard,
    title: "Bước 4 — Chọn phương thức thanh toán",
    desc: "TechZone hỗ trợ 2 phương thức: thanh toán khi nhận hàng (COD) hoặc chuyển khoản ngân hàng. Thông tin tài khoản hiển thị ngay trên trang xác nhận đơn.",
    tips: [
      "COD: bạn kiểm tra hàng rồi mới thanh toán cho shipper",
      "Chuyển khoản: chuyển trước, đơn được ưu tiên xử lý",
    ],
  },
  {
    icon: PackageCheck,
    title: "Bước 5 — Nhận hàng và kiểm tra",
    desc: "Đơn hàng được xác nhận trong 24 giờ làm việc, sau đó đóng gói và giao đi. Bạn kiểm tra số lượng và tình trạng sản phẩm trước khi thanh toán.",
    tips: [
      "Kiểm tra phụ kiện đi kèm: cáp, hộp, tem bảo hành",
      "Từ chối nhận và ghi rõ vào biên bản nếu hàng bị sai",
    ],
  },
  {
    icon: Headphones,
    title: "Bước 6 — Hỗ trợ sau bán hàng",
    desc: "Sau khi nhận hàng, bạn vẫn được hỗ trợ tra cứu đơn, đổi trả trong 7 ngày và bảo hành trong 12 tháng.",
    tips: [
      "Tư vấn trực tuyến 8:00-22:00 hằng ngày qua form liên hệ",
      "Bảo quản hóa đơn hoặc mã đơn hàng để tra cứu nhanh hơn",
    ],
  },
];

export default function BuyingGuidePage() {
  const crumbs = [
    { name: "Trang chủ", href: "/" },
    { name: "Hướng dẫn mua hàng", href: "/huong-dan-mua-hang" },
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
            Hướng dẫn mua hàng tại TechZone
          </h1>
          <p className="mt-2 text-sm leading-6 text-ink-600">
            Toàn bộ quy trình từ chọn sản phẩm đến bảo hành, được hướng dẫn
            chi tiết để bạn đặt hàng nhanh và đúng nhu cầu.
          </p>
        </header>

        {/* Tóm tắt nhanh */}
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              icon: Truck,
              title: "Giao 24-48h",
              desc: "Toàn quốc, miễn phí từ 300k",
            },
            {
              icon: CreditCard,
              title: "COD hoặc chuyển khoản",
              desc: "Thanh toán linh hoạt",
            },
            {
              icon: PackageCheck,
              title: "Đổi trả 7 ngày",
              desc: "Không cần lý do",
            },
            {
              icon: Headphones,
              title: "Hỗ trợ 8:00-22:00",
              desc: "Chat tư vấn trực tuyến",
            },
          ].map((s) => (
            <div
              key={s.title}
              className="rounded-xl border border-ink-200 bg-white p-5"
            >
              <s.icon className="size-5 text-brand-600" />
              <h2 className="mt-3 text-sm font-semibold text-ink-950">
                {s.title}
              </h2>
              <p className="mt-1 text-xs text-ink-600">{s.desc}</p>
            </div>
          ))}
        </div>

        {/* Các bước */}
        <section className="mt-12">
          <SectionHeading
            eyebrow="Quy trình"
            title="6 bước đặt hàng tại TechZone"
          />
          <ol className="mt-8 space-y-5">
            {steps.map((step, i) => (
              <li
                key={step.title}
                className="rounded-xl border border-ink-200 bg-white p-6"
              >
                <div className="flex flex-wrap items-center gap-3">
                  <span className="grid size-9 place-items-center rounded-lg bg-brand-600 text-sm font-bold text-white">
                    {i + 1}
                  </span>
                  <h3 className="text-base font-bold text-ink-950">
                    {step.title}
                  </h3>
                </div>
                <p className="mt-3 text-sm leading-6 text-ink-700">
                  {step.desc}
                </p>
                <ul className="mt-4 space-y-2">
                  {step.tips.map((tip) => (
                    <li
                      key={tip}
                      className="flex gap-2.5 text-xs leading-5 text-ink-600"
                    >
                      <span
                        className="mt-1.5 size-1.5 shrink-0 rounded-full bg-brand-500"
                        aria-hidden
                      />
                      {tip}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ol>
        </section>

        {/* Liên kết nội bộ */}
        <section className="mt-12">
          <SectionHeading
            eyebrow="Tham khảo"
            title="Xem thêm thông tin hữu ích"
          />
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                href: "/chinh-sach/chinh-sach-van-chuyen",
                title: "Chính sách vận chuyển",
                desc: "Thời gian giao hàng và phí vận chuyển chi tiết.",
              },
              {
                href: "/chinh-sach/chinh-sach-doi-tra",
                title: "Chính sách đổi trả",
                desc: "Quy trình đổi trả và hoàn tiền trong 7 ngày.",
              },
              {
                href: "/chinh-sach/chinh-sach-bao-hanh",
                title: "Chính sách bảo hành",
                desc: "Bảo hành 12 tháng cho toàn bộ sản phẩm chính hãng.",
              },
              {
                href: "/blog/cach-chon-cu-sac-nhanh",
                title: "Cách chọn củ sạc nhanh",
                desc: "Hướng dẫn chọn công suất sạc đúng với điện thoại của bạn.",
              },
              {
                href: "/blog/cach-chon-cap-sac",
                title: "Cách chọn cáp sạc tốt",
                desc: "Tiêu chí nhận biết cáp sạc chính hãng và bền bỉ.",
              },
              {
                href: ROUTES.contact,
                title: "Liên hệ tư vấn",
                desc: "Đội ngũ TechZone sẵn sàng tư vấn theo dòng máy của bạn.",
              },
            ].map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="group rounded-xl border border-ink-200 bg-white p-5 transition hover:border-brand-300 hover:shadow-md"
              >
                <h3 className="text-sm font-semibold text-ink-950 transition group-hover:text-brand-600">
                  {l.title}
                </h3>
                <p className="mt-1.5 text-xs leading-5 text-ink-600">{l.desc}</p>
                <span className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-brand-600">
                  Đọc thêm
                  <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
                </span>
              </Link>
            ))}
          </div>
        </section>

        <FaqSection
          title="Câu hỏi thường gặp"
          items={[
            {
              question: "Mua hàng cần tạo tài khoản không?",
              answer:
                "Không. Bạn có thể đặt hàng ngay mà không cần đăng ký. Việc đăng nhập chỉ dùng cho khu vực quản trị của TechZone.",
            },
            {
              question: "Phí vận chuyển được tính thế nào?",
              answer:
                "Đơn hàng từ 300.000 ₫ miễn phí vận chuyển toàn quốc. Dưới mức đó phí đồng nhất 30.000 ₫/đơn và được hiển thị rõ ở bước thanh toán.",
            },
            {
              question: "Thời gian nhận hàng mất bao lâu?",
              answer:
                "Nội thành Hồ Chí Minh và Hà Nội khoảng 24 giờ làm việc, các tỉnh thành khác 48 giờ làm việc tính từ lúc đơn được xác nhận.",
            },
            {
              question: "Có thể thay đổi đơn hàng sau khi đặt?",
              answer:
                "Có, nếu đơn chưa chuyển sang trạng thái đang giao. Gửi yêu cầu qua form liên hệ trong vòng 2 giờ sau khi đặt hàng để được hỗ trợ.",
            },
            {
              question: "Hóa đơn VAT được cung cấp không?",
              answer:
                "Có. TechZone xuất hóa đơn VAT cho mọi đơn hàng. Bạn cung cấấp thông tin doanh nghiệp khi đặt hàng hoặc yêu cầu bổ sung sau đó.",
            },
          ]}
          className="mt-12"
        />
      </div>

      <CtaBanner />
    </>
  );
}
