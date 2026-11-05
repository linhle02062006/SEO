export const SITE = {
  name: "TechZone",
  legalName: "TechZone Việt Nam",
  tagline: "Phụ kiện điện thoại & công nghệ chính hãng",
  description:
    "TechZone chuyên phân phối phụ kiện điện thoại và công nghệ chính hãng: ốp lưng, cáp sạc, củ sạc nhanh, tai nghe Bluetooth, sạc dự phòng, kính cường lực, giá đỡ điện thoại, phụ kiện laptop và phụ kiện gaming.",
  locale: "vi_VN",
  language: "vi",
  currency: "VND",
  currencySymbol: "₫",
  email: "contact@techzone.vn",
  phone: "1900 6868",
  address: {
    street: "123 Nguyễn Huệ",
    ward: "Phường Bến Nghé",
    district: "Quận 1",
    city: "TP. Hồ Chí Minh",
    country: "Việt Nam",
  },
  social: {
    facebook: "https://facebook.com/techzone.vn",
    instagram: "https://instagram.com/techzone.vn",
    youtube: "https://youtube.com/@techzone.vn",
    tiktok: "https://tiktok.com/@techzone.vn",
  },
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
} as const;
