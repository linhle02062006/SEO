export const SITE = {
  name: "TechZone",
  legalName: "TechZone",
  tagline: "Phụ kiện điện thoại & công nghệ chính hãng",
  description:
    "TechZone chuyên phân phối phụ kiện điện thoại và công nghệ chính hãng: ốp lưng, cáp sạc, củ sạc nhanh, tai nghe Bluetooth, sạc dự phòng, kính cường lực, giá đỡ điện thoại, phụ kiện laptop và phụ kiện gaming.",
  locale: "vi_VN",
  language: "vi",
  currency: "VND",
  currencySymbol: "₫",
  /**
   * Email liên hệ chính thức — cũng là nơi nhận yêu cầu tư vấn từ form.
   * Được đọc từ biến môi trường `CONTACT_EMAIL` (fallback về giá trị mặc định),
   * nên có thể đổi mà không cần sửa source code.
   */
  email:
    process.env.CONTACT_EMAIL?.trim() ||
    process.env.NEXT_PUBLIC_CONTACT_EMAIL?.trim() ||
    "1350080137@sv.hcmunre.edu.vn",
  /**
   * KHÔNG khai báo số điện thoại / địa chỉ / mạng xã hội giả.
   * Website liên hệ qua email và form tư vấn trực tuyến.
   */
} as const;

/** URL gốc, luôn KHÔNG có dấu "/" cuối (dùng cho canonical, OG, sitemap) */
export function getSiteUrl(): string {
  const raw =
    process.env.NEXT_PUBLIC_SITE_URL?.trim() ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "") ||
    "http://localhost:3000";
  return raw.replace(/\/+$/, "");
}

/** URL tuyệt đối */
export function absoluteUrl(path: string = "/"): string {
  const base = getSiteUrl();
  if (!path.startsWith("/")) path = `/${path}`;
  return `${base}${path === "/" ? "" : path}`;
}

export const ROUTES = {
  home: "/",
  products: "/san-pham",
  categories: "/danh-muc",
  brands: "/thuong-hieu",
  search: "/tim-kiem",
  cart: "/gio-hang",
  checkout: "/dat-hang",
  orderSuccess: "/dat-hang/thanh-cong",
  blog: "/blog",
  about: "/gioi-thieu",
  contact: "/lien-he",
  policies: "/chinh-sach",
  admin: "/admin",
  account: "/tai-khoan",
  login: "/dang-nhap",
  register: "/dang-ky",
  verifyEmail: "/xac-nhan-email",
} as const;
