import Link from "next/link";
import { ArrowRight, MessageCircle } from "lucide-react";
import { ROUTES } from "@/lib/site";

export function CtaBanner() {
  return (
    <section className="container-x py-12 lg:py-16">
      <div className="relative overflow-hidden rounded-2xl bg-brand-600 px-6 py-10 sm:px-10 lg:py-14">
        <div
          className="absolute inset-0 bg-[radial-gradient(60%_120%_at_85%_0%,rgba(255,255,255,0.18),transparent)]"
          aria-hidden
        />
        <div className="relative flex flex-col items-start gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <h2 className="text-2xl font-bold tracking-tight text-white lg:text-3xl">
              Cần tư vấn chọn phụ kiện điện thoại phù hợp?
            </h2>
            <p className="mt-3 text-sm leading-6 text-brand-50/90">
              Đội ngũ TechZone sẵn sàng tư vấn theo dòng máy và nhu cầu sử dụng
              của bạn. Miễn phí tư vấn, giao hàng nhanh toàn quốc, thanh toán COD
              tiện lợi.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href={ROUTES.products}
                className="inline-flex items-center gap-2 rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-brand-700 transition hover:bg-brand-50"
              >
                Xem sản phẩm
                <ArrowRight className="size-4" />
              </Link>
              <Link
                href={`${ROUTES.contact}?topic=tu-van`}
                className="inline-flex items-center gap-2 rounded-lg border border-white/40 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                <MessageCircle className="size-4" />
                Liên hệ tư vấn →
              </Link>
            </div>
          </div>

          <div className="w-full shrink-0 rounded-xl bg-white/10 p-5 backdrop-blur lg:w-72">
            <p className="text-xs font-semibold uppercase tracking-wide text-brand-100">
              Chat tư vấn TechZone
            </p>
            <p className="mt-2 text-lg font-bold leading-snug text-white">
              Gửi yêu cầu tư vấn trực tuyến
            </p>
            <p className="mt-2 text-xs text-brand-50/80">
              Tư vấn 8:00 - 22:00, tất cả các ngày trong tuần. Phản hồi qua
              email trong vòng 24 giờ làm việc.
            </p>
            <Link
              href={`${ROUTES.contact}?topic=tu-van`}
              className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-brand-700 transition hover:bg-brand-50"
            >
              <MessageCircle className="size-4" />
              Mở form tư vấn
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
