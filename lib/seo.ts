import type { Metadata } from "next";
import { SITE, absoluteUrl, getSiteUrl } from "./site";

type BuildMetadataArgs = {
  title: string;
  description: string;
  /** Đường dẫn tuyệt đối trong site, ví dụ "/san-pham/cap-sac-nhanh-20w" */
  path?: string;
  images?: string[];
  type?: "website" | "article" | "product";
  keywords?: string[];
  noindex?: boolean;
  publishedTime?: string;
  modifiedTime?: string;
  authors?: string[];
  section?: string;
  tags?: string[];
};

/**
 * Bỏ hậu tố thương hiệu bị trùng lặp ở cuối title.
 * Ví dụ: "Cáp sạc nhanh 20W | giá 129.000 đ | TechZone" -> "Cáp sạc nhanh 20W | giá 129.000 đ"
 * Nhờ vậy title template "%s | TechZone" của layout chỉ được thêm đúng một lần.
 */
export function normalizeTitle(title: string): string {
  return title.replace(/\s*[|—–]\s*TechZone\s*$/i, "").trim();
}

/**
 * Tạo metadata đầy đủ cho mọi trang:
 * title, description, canonical, robots, OG, Twitter Card.
 */
export function buildMetadata({
  title,
  description,
  path = "/",
  images,
  type = "website",
  keywords = [],
  noindex = false,
  publishedTime,
  modifiedTime,
  authors,
  section,
  tags,
}: BuildMetadataArgs): Metadata {
  const url = absoluteUrl(path);
  const safeTitle = normalizeTitle(title);
  const ogImages = (images && images.length ? images : ["/og-default.jpg"]).map(
    (img) => (img.startsWith("http") ? img : absoluteUrl(img)),
  );

  return {
    title: safeTitle,
    description,
    keywords: keywords.length ? keywords : undefined,
    alternates: {
      canonical: url,
    },
    robots: noindex
      ? { index: false, follow: false }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-image-preview": "large",
            "max-snippet": -1,
            "max-video-preview": -1,
          },
        },
    openGraph: {
      type: type === "article" ? "article" : type === "product" ? "website" : "website",
      title: safeTitle,
      description,
      url,
      siteName: SITE.name,
      locale: SITE.locale,
      images: ogImages.map((img) => ({ url: img, width: 1200, height: 630, alt: safeTitle })),
      ...(type === "article"
        ? {
            publishedTime,
            modifiedTime,
            authors,
            section,
            tags,
          }
        : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: safeTitle,
      description,
      images: ogImages,
    },
  };
}

/** Title mặc định có template: "Tiêu đề | TechZone" */
export const metadataTemplate = {
  title: {
    default: `${SITE.name} — ${SITE.tagline}`,
    template: `%s | ${SITE.name}`,
  },
  description: SITE.description,
  applicationName: SITE.name,
  authors: [{ name: SITE.name, url: getSiteUrl() }],
  creator: SITE.name,
  publisher: SITE.name,
  formatDetection: { telephone: false, address: false, email: false },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
    apple: [{ url: "/apple-touch-icon.png" }],
  },
  manifest: "/manifest.webmanifest",
};
