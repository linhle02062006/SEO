import type { Metadata, Viewport } from "next";
import { Suspense } from "react";
import { Inter } from "next/font/google";
import "./globals.css";
import { metadataTemplate } from "@/lib/seo";
import { getSiteUrl, SITE } from "@/lib/site";
import { Analytics } from "@/components/analytics/Analytics";
import { GtmScript } from "@/components/analytics/GtmScript";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { CartProvider } from "@/hooks/useCart";
import { ToastProvider } from "@/components/ui/ToastProvider";
import { getFeaturedCategories } from "@/services/catalog-service";

const inter = Inter({
  subsets: ["vietnamese", "latin"],
  display: "swap",
  variable: "--font-inter",
  preload: true,
});

export const metadata: Metadata = {
  ...metadataTemplate,
  metadataBase: new URL(getSiteUrl()),
  manifest: "/manifest.webmanifest",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#1b63f5",
  colorScheme: "light",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const categories = await getFeaturedCategories().catch(() => []);

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "@id": `${getSiteUrl()}/#website`,
      url: getSiteUrl(),
      name: SITE.name,
      description: SITE.description,
      inLanguage: "vi-VN",
      potentialAction: {
        "@type": "SearchAction",
        target: `${getSiteUrl()}/tim-kiem?q={search_term_string}`,
        "query-input": "required name=search_term_string",
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      "@id": `${getSiteUrl()}/#organization`,
      name: SITE.name,
      legalName: SITE.legalName,
      url: getSiteUrl(),
      logo: `${getSiteUrl()}/logo.svg`,
      description: SITE.description,
      email: SITE.email,
      telephone: SITE.phone,
      address: {
        "@type": "PostalAddress",
        streetAddress: SITE.address.street,
        addressLocality: SITE.address.city,
        addressRegion: SITE.address.district,
        addressCountry: "VN",
      },
      sameAs: [
        SITE.social.facebook,
        SITE.social.instagram,
        SITE.social.youtube,
        SITE.social.tiktok,
      ],
    },
  ];

  return (
    <html lang="vi" className={inter.variable}>
      <body className="flex min-h-screen flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <GtmScript />
        <Suspense fallback={null}>
          <Analytics />
        </Suspense>
        <ToastProvider>
          <CartProvider>
            <a
              href="#main-content"
              className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-brand-600 focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-white"
            >
              Bỏ qua tới nội dung chính
            </a>
            <Suspense fallback={null}>
              <Header categories={categories} />
            </Suspense>
          <main id="main-content" className="flex-1">
            {children}
          </main>
          <Footer />
            <CartDrawer />
          </CartProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
