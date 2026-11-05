import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/site";

export const revalidate = 3600;

export default function robots(): MetadataRoute.Robots {
  const base = getSiteUrl();

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin",
          "/admin/",
          "/admin/*",
          "/api/",
          "/gio-hang",
          "/dat-hang",
          "/dat-hang/",
          "/dat-hang/*",
          "/tim-kiem",
          "/chinh-sach/thanh-cong",
        ],
      },
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow: ["/admin", "/admin/*", "/api/", "/gio-hang", "/dat-hang/*"],
      },
      {
        userAgent: "Googlebot-Image",
        allow: "/",
        disallow: ["/admin", "/admin/*"],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
