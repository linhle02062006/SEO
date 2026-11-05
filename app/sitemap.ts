import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/site";
import {
  getAllBrands,
  getAllCategories,
  getAllPostSlugs,
} from "@/services/catalog-service";
import { getAllActiveProductSlugs } from "@/services/product-service";

export const revalidate = 3600;

type Entry = {
  url: string;
  lastModified?: Date;
  changeFrequency?: MetadataRoute.Sitemap[number]["changeFrequency"];
  priority?: number;
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getSiteUrl();
  const now = new Date();

  const staticEntries: Entry[] = [
    { url: `${base}/`, changeFrequency: "daily", priority: 1 },
    { url: `${base}/san-pham`, changeFrequency: "daily", priority: 0.9 },
    { url: `${base}/danh-muc`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${base}/thuong-hieu`, changeFrequency: "weekly", priority: 0.7 },
    { url: `${base}/blog`, changeFrequency: "daily", priority: 0.8 },
    { url: `${base}/gioi-thieu`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/lien-he`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/chinh-sach`, changeFrequency: "yearly", priority: 0.4 },
    { url: `${base}/huong-dan-mua-hang`, changeFrequency: "monthly", priority: 0.6 },
  ];

  let categoryEntries: Entry[] = [];
  let brandEntries: Entry[] = [];
  let productEntries: Entry[] = [];
  let postEntries: Entry[] = [];

  try {
    const categories = await getAllCategories();
    categoryEntries = categories.map((c) => ({
      url: `${base}/danh-muc/${c.slug}`,
      lastModified: c.createdAt,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));
  } catch {
    /* ignore */
  }

  try {
    const brands = await getAllBrands();
    brandEntries = brands.map((b) => ({
      url: `${base}/thuong-hieu/${b.slug}`,
      lastModified: b.createdAt,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    }));
  } catch {
    /* ignore */
  }

  try {
    const products = await getAllActiveProductSlugs();
    productEntries = products.map((p) => ({
      url: `${base}/san-pham/${p.slug}`,
      lastModified: p.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }));
  } catch {
    /* ignore */
  }

  try {
    const posts = await getAllPostSlugs();
    postEntries = posts.map((p) => ({
      url: `${base}/blog/${p.slug}`,
      lastModified: p.updatedAt ?? p.publishedAt,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }));
  } catch {
    /* ignore */
  }

  const all: Entry[] = [
    ...staticEntries,
    ...categoryEntries,
    ...brandEntries,
    ...productEntries,
    ...postEntries,
  ];

  // Loại bỏ URL trùng lặp
  const seen = new Set<string>();
  const unique = all.filter((e) => {
    if (seen.has(e.url)) return false;
    seen.add(e.url);
    return true;
  });

  return unique.map((e) => ({
    url: e.url,
    lastModified: e.lastModified ?? now,
    changeFrequency: e.changeFrequency,
    priority: e.priority,
  }));
}
