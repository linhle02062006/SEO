import { SITE, absoluteUrl } from "@/lib/site";

/* ------------------------------------------------------------------ */
/* JSON-LD builders — dữ liệu lấy thật từ database, không hard-code    */
/* ------------------------------------------------------------------ */

export function webSiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${absoluteUrl("/")}#website`,
    url: absoluteUrl("/"),
    name: SITE.name,
    description: SITE.description,
    inLanguage: "vi-VN",
    publisher: { "@id": `${absoluteUrl("/")}#organization` },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${absoluteUrl("/tim-kiem")}?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${absoluteUrl("/")}#organization`,
    name: SITE.name,
    legalName: SITE.legalName,
    url: absoluteUrl("/"),
    logo: {
      "@type": "ImageObject",
      url: absoluteUrl("/logo.svg"),
      width: 512,
      height: 512,
    },
    image: absoluteUrl("/og-default.jpg"),
    description: SITE.description,
    email: SITE.email,
    contactPoint: [
      {
        "@type": "ContactPoint",
        email: SITE.email,
        contactType: "customer service",
        areaServed: "VN",
        availableLanguage: ["vi"],
      },
    ],
  };
}

export type ProductSchemaInput = {
  name: string;
  slug: string;
  image: string | null;
  images?: string[];
  description: string;
  sku: string;
  price: number;
  salePrice: number | null;
  currency?: string;
  availability: "InStock" | "OutOfStock" | "PreOrder";
  brandName?: string | null;
  categoryName?: string | null;
  ratingValue?: number;
  reviewCount?: number;
  url?: string;
};

export function productSchema(p: ProductSchemaInput) {
  const url = p.url ?? absoluteUrl(`/san-pham/${p.slug}`);
  const images = (p.images && p.images.length ? p.images : p.image ? [p.image] : [])
    .map((img) => (img.startsWith("http") ? img : absoluteUrl(img)));

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": `${url}#product`,
    name: p.name,
    description: p.description,
    sku: p.sku,
    mpn: p.sku,
    url,
    ...(images.length ? { image: images } : {}),
    ...(p.brandName
      ? { brand: { "@type": "Brand", name: p.brandName } }
      : {}),
    ...(p.categoryName ? { category: p.categoryName } : {}),
    ...(p.reviewCount && p.reviewCount > 0
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: Number(p.ratingValue ?? 0),
            reviewCount: p.reviewCount,
            bestRating: 5,
            worstRating: 1,
          },
        }
      : {}),
    offers: {
      "@type": "Offer",
      url,
      priceCurrency: p.currency ?? SITE.currency,
      price: p.price,
      priceValidUntil: new Date(Date.now() + 365 * 24 * 3600 * 1000)
        .toISOString()
        .slice(0, 10),
      availability: `https://schema.org/${p.availability}`,
      itemCondition: "https://schema.org/NewCondition",
      seller: { "@id": `${absoluteUrl("/")}#organization` },
      ...(p.salePrice && p.salePrice < p.price
        ? {
            priceSpecification: {
              "@type": "UnitPriceSpecification",
              price: p.salePrice,
              priceCurrency: p.currency ?? SITE.currency,
            },
          }
        : {}),
    },
  };
}

export function breadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.url),
    })),
  };
}

export function articleSchema(input: {
  title: string;
  slug: string;
  description: string;
  image: string | null;
  publishedAt: Date | string;
  updatedAt?: Date | string;
  authorName: string;
  readingTime?: number;
  keywords?: string[];
}) {
  const url = absoluteUrl(`/blog/${input.slug}`);
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": `${url}#article`,
    headline: input.title,
    description: input.description,
    url,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    datePublished: new Date(input.publishedAt).toISOString(),
    dateModified: new Date(input.updatedAt ?? input.publishedAt).toISOString(),
    author: { "@type": "Person", name: input.authorName },
    publisher: { "@id": `${absoluteUrl("/")}#organization` },
    ...(input.image
      ? {
          image: {
            "@type": "ImageObject",
            url: input.image.startsWith("http")
              ? input.image
              : absoluteUrl(input.image),
            width: 1200,
            height: 630,
          },
        }
      : {}),
    ...(input.readingTime
      ? {
          timeRequired: `PT${input.readingTime}M`,
        }
      : {}),
    ...(input.keywords?.length ? { keywords: input.keywords.join(", ") } : {}),
    inLanguage: "vi-VN",
  };
}

export function breadcrumbListSchema(
  crumbs: { name: string; href: string }[],
): string {
  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      item: absoluteUrl(c.href),
    })),
  });
}
