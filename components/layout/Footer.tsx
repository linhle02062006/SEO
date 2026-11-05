import Link from "next/link";
import {
  Facebook,
  Instagram,
  Youtube,
  Music2,
  Phone,
  Mail,
  MapPin,
  ShieldCheck,
  Truck,
  RotateCcw,
  Headphones,
  CreditCard,
} from "lucide-react";
import { ROUTES, SITE } from "@/lib/site";
import { getAllCategories } from "@/services/catalog-service";

export async function Footer() {
  const categories = await getAllCategories().catch(() => []);
  const helpLinks = [
    { label: "Hướng dẫn mua hàng", href: "/huong-dan-mua-hang" },
    { label: "Chính sách bảo mật", href: `${ROUTES.policies}/chinh-sach-bao-mat` },
    { label: "Chính sách đổi trả", href: `${ROUTES.policies}/chinh-sach-doi-tra` },
    { label: "Chính sách vận chuyển", href: `${ROUTES.policies}/chinh-sach-van-chuyen` },
    { label: "Điều khoản sử dụng", href: `${ROUTES.policies}/dieu-khoan-su-dung` },
  ];

  return (
    <footer className="mt-16 border-t border-ink-100 bg-ink-950 text-ink-300">
      {/* Trust bar */}
      <div className="border-b border-white/10">
        <div className="container-x grid grid-cols-2 gap-4 py-8 lg:grid-cols-4">
          {[
            {
              icon: Truck,
              title: "Giao hàng nhanh",
              desc: "Toàn quốc 24-48h, miễn phí từ 300K",
            },
            {
              icon: ShieldCheck,
              title: "Bảo hành chính hãng",
              desc: "Bảo hành 12 tháng từ nhà phân phối",
            },
            {
              icon: RotateCcw,
              title: "Đổi trả 7 ngày",
              desc: "Đổi mới sản phẩm lỗi trong 7 ngày",
            },
            {
              icon: Headphones,
              title: "Hỗ trợ 8:00-22:00",
              desc: "Tư vấn chọn phụ kiện phù hợp",
            },
          ].map((item) => (
            <div key={item.title} className="flex items-start gap-3">
              <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-white/5 text-brand-300">
                <item.icon className="size-5" />
              </span>
              <div>
                <p className="text-sm font-semibold text-white">{item.title}</p>
                <p className="mt-0.5 text-xs leading-5 text-ink-400">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Links */}
      <div className="container-x grid gap-8 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Link href={ROUTES.home} className="flex items-center gap-2">
            <span className="grid size-9 place-items-center rounded-xl bg-brand-600 text-sm font-bold text-white">
              TZ
            </span>
            <span className="text-lg font-bold text-white">
              Tech<span className="text-brand-300">Zone</span>
            </span>
          </Link>
          <p className="mt-4 text-sm leading-6 text-ink-400">
            Chuyên phân phối phụ kiện điện thoại và công nghệ chính hãng: cáp
            sạc, củ sạc nhanh, tai nghe Bluetooth, sạc dự phòng, kính cường
            lực, ốp lưng và phụ kiện gaming.
          </p>
          <div className="mt-5 flex items-center gap-2">
            {[
              { icon: Facebook, href: SITE.social.facebook, label: "Facebook" },
              { icon: Instagram, href: SITE.social.instagram, label: "Instagram" },
              { icon: Youtube, href: SITE.social.youtube, label: "YouTube" },
              { icon: Music2, href: SITE.social.tiktok, label: "TikTok" },
            ].map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer nofollow"
                aria-label={s.label}
                className="grid size-9 place-items-center rounded-lg bg-white/5 text-ink-300 transition hover:bg-brand-600 hover:text-white"
              >
                <s.icon className="size-4" />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-white">
            Danh mục
          </h2>
          <ul className="mt-4 space-y-2.5 text-sm">
            {categories.slice(0, 8).map((c) => (
              <li key={c.id}>
                <Link
                  href={`${ROUTES.categories}/${c.slug}`}
                  className="transition hover:text-brand-300"
                >
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-white">
            Hỗ trợ khách hàng
          </h2>
          <ul className="mt-4 space-y-2.5 text-sm">
            {helpLinks.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="transition hover:text-brand-300">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-white">
            Liên hệ
          </h2>
          <ul className="mt-4 space-y-3 text-sm">
            <li className="flex items-start gap-2.5">
              <MapPin className="mt-0.5 size-4 shrink-0 text-brand-300" />
              <span className="leading-6">
                {SITE.address.street}, {SITE.address.ward},{" "}
                {SITE.address.district}, {SITE.address.city}
              </span>
            </li>
            <li className="flex items-center gap-2.5">
              <Phone className="size-4 shrink-0 text-brand-300" />
              <a
                href={`tel:${SITE.phone.replace(/\s/g, "")}`}
                className="transition hover:text-brand-300"
              >
                {SITE.phone}
              </a>
            </li>
            <li className="flex items-center gap-2.5">
              <Mail className="size-4 shrink-0 text-brand-300" />
              <a
                href={`mailto:${SITE.email}`}
                className="transition hover:text-brand-300"
              >
                {SITE.email}
              </a>
            </li>
            <li className="flex items-center gap-2.5">
              <CreditCard className="size-4 shrink-0 text-brand-300" />
              <span>COD &amp; Chuyển khoản ngân hàng</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-x flex flex-col items-center justify-between gap-3 py-5 text-xs text-ink-400 sm:flex-row">
          <p>
            © {new Date().getFullYear()} {SITE.legalName}. Đã đăng ký kinh doanh.
          </p>
          <p className="flex items-center gap-4">
            <Link href={ROUTES.about} className="transition hover:text-brand-300">
              Giới thiệu
            </Link>
            <Link href={ROUTES.contact} className="transition hover:text-brand-300">
              Liên hệ
            </Link>
            <span>Thiết kế &amp; phát triển bởi TechZone</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
