import type { Metadata } from "next";
import { SITE } from "@/lib/site";
import { buildMetadata } from "@/lib/seo";
import { breadcrumbListSchema } from "@/lib/schema";
import { Breadcrumb } from "@/components/common/Breadcrumb";
import { ContactForm } from "@/components/contact/ContactForm";
import { FaqSection } from "@/components/common/FaqSection";

export const metadata: Metadata = buildMetadata({
  title: "Liên hệ — Tư vấn phụ kiện điện thoại",
  description:
    "Liên hệ TechZone để được tư vấn chọn phụ kiện điện thoại, tra cứu đơn hàng hoặc hợp tác phân phối. Hotline 1900 6868, email contact@techzone.vn.",
  path: "/lien-he",
  keywords: [
    "liên hệ techzone",
    "tư vấn phụ kiện điện thoại",
    "hotline techzone",
  ],
});

export default function ContactPage() {
  const crumbs = [
    { name: "Trang chủ", href: "/" },
    { name: "Liên hệ", href: "/lien-he" },
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
            Liên hệ với TechZone
          </h1>
          <p className="mt-2 text-sm leading-6 text-ink-600">
            Chúng tôi sẵn sàng tư vấn về sản phẩm, tra cứu đơn hàng và hỗ trợ
            hợp tác phân phối. Phản hồi trong vòng 24 giờ làm việc.
          </p>
        </header>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_380px]">
          <ContactForm />

          <aside className="space-y-4">
            <div className="rounded-xl border border-ink-200 bg-white p-5">
              <h2 className="text-base font-semibold text-ink-950">
                Thông tin liên hệ
              </h2>
              <dl className="mt-4 space-y-4 text-sm">
                <div>
                  <dt className="text-xs text-ink-500">Hotline</dt>
                  <dd className="mt-0.5">
                    <a
                      href={`tel:${SITE.phone.replace(/\s/g, "")}`}
                      className="text-lg font-bold text-brand-600 hover:underline"
                    >
                      {SITE.phone}
                    </a>
                    <p className="mt-0.5 text-xs text-ink-500">
                      8:00 - 22:00, tất cả các ngày trong tuần
                    </p>
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-ink-500">Email</dt>
                  <dd className="mt-0.5">
                    <a
                      href={`mailto:${SITE.email}`}
                      className="font-medium text-ink-900 hover:text-brand-600"
                    >
                      {SITE.email}
                    </a>
                    <p className="mt-0.5 text-xs text-ink-500">
                      Phản hồi trong 24 giờ làm việc
                    </p>
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-ink-500">Địa chỉ showroom</dt>
                  <dd className="mt-0.5 leading-6 text-ink-800">
                    {SITE.address.street}, {SITE.address.ward},{" "}
                    {SITE.address.district}, {SITE.address.city},{" "}
                    {SITE.address.country}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-ink-500">Giờ mở cửa</dt>
                  <dd className="mt-0.5 text-ink-800">
                    Thứ 2 - Thứ 7: 8:00 - 21:00
                    <br />
                    Chủ nhật: 9:00 - 18:00
                  </dd>
                </div>
              </dl>
            </div>

            <div className="rounded-xl border border-ink-200 bg-ink-50 p-5">
              <h2 className="text-sm font-semibold text-ink-950">
                Hợp tác phân phối
              </h2>
              <p className="mt-2 text-xs leading-5 text-ink-600">
                TechZone đang mở rộng hợp tác với các đại lý và cửa hàng phụ kiện
                trên toàn quốc. Vui lòng gửi thông tin để chúng tôi liên hệ.
              </p>
              <a
                href={`mailto:${SITE.email}?subject=Hợp tác phân phối`}
                className="mt-3 inline-block text-sm font-medium text-brand-600 hover:underline"
              >
                Gửi yêu cầu hợp tác →
              </a>
            </div>
          </aside>
        </div>

        <FaqSection
          title="Câu hỏi thường gặp"
          items={[
            {
              question: "Làm sao tra cứu đơn hàng của tôi?",
              answer:
                "Sau khi đặt hàng bạn sẽ nhận được mã đơn hàng dạng TZ250105A1B2C3. Bạn có thể gọi hotline 1900 6868 hoặc gửi email kèm mã đơn để chúng tôi tra cứu nhanh nhất.",
            },
            {
              question: "Thời gian giao hàng mất bao lâu?",
              answer:
                "Đơn hàng nội thành thường giao trong 24 giờ, các tỉnh thành khác trong 48 giờ. Thời gian giao có thể dài hơn vào thời điểm cao điểm như dịp lễ, Tết.",
            },
            {
              question: "Sản phẩm có được bảo hành không?",
              answer:
                "Tất cả sản phẩm tại TechZone được bảo hành chính hãnh 12 tháng. Sản phẩm lỗi trong thời gian bảo hành sẽ được đổi mới hoặc hoàn tiền.",
            },
            {
              question: "Tôi có thể đổi trả sản phẩm không?",
              answer:
                "Bạn được đổi trả sản phẩm chưa sử dụng, còn nguyên bao bì và phụ kiện trong vòng 7 ngày kể từ khi nhận hàng, không cần lý do.",
            },
            {
              question: "Phương thức thanh toán nào được hỗ trợ?",
              answer:
                "TechZone hỗ trợ thanh toán khi nhận hàng (COD) và chuyển khoản ngân hàng. Thông tin tài khoản sẽ hiển thị ở trang xác nhận đơn hàng khi bạn chọn chuyển khoản.",
            },
          ]}
        />
      </div>
    </>
  );
}
