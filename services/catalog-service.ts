import { and, asc, count, desc, eq, or, sql } from "drizzle-orm";
import { getDb } from "@/database/db";
import {
  blogPosts,
  brands,
  categories,
  products,
  type BlogPost,
  type Brand,
  type Category,
} from "@/database/schema";
import { slugify } from "@/lib/slug";
import { foldSql, tokenizeQuery } from "@/lib/vi-search";

/* ------------------------------------------------------------------ */
/* Categories                                                           */
/* ------------------------------------------------------------------ */

export async function getAllCategories(): Promise<Category[]> {
  const db = await getDb();
  return db
    .select()
    .from(categories)
    .orderBy(asc(categories.position), asc(categories.name));
}

export async function getFeaturedCategories(): Promise<Category[]> {
  const db = await getDb();
  return db
    .select()
    .from(categories)
    .where(eq(categories.isFeatured, true))
    .orderBy(asc(categories.position));
}

export async function getCategoryBySlug(
  slug: string,
): Promise<Category | null> {
  const db = await getDb();
  const rows = await db
    .select()
    .from(categories)
    .where(eq(categories.slug, slug))
    .limit(1);
  return rows[0] ?? null;
}

export async function getCategoryBySlugWithCount(
  slug: string,
): Promise<(Category & { productCount: number }) | null> {
  const db = await getDb();
  const rows = await db
    .select({
      category: categories,
      productCount: sql<number>`count(${products.id})`,
    })
    .from(categories)
    .leftJoin(
      products,
      and(eq(products.categoryId, categories.id), eq(products.status, "active")),
    )
    .where(eq(categories.slug, slug))
    .groupBy(categories.id)
    .limit(1);
  if (!rows.length) return null;
  return { ...rows[0].category, productCount: Number(rows[0].productCount) };
}

export async function getCategoryCounts(): Promise<
  Record<string, number>
> {
  const db = await getDb();
  const rows = await db
    .select({
      slug: categories.slug,
      productCount: sql<number>`count(${products.id})`,
    })
    .from(categories)
    .leftJoin(
      products,
      and(eq(products.categoryId, categories.id), eq(products.status, "active")),
    )
    .groupBy(categories.id);
  const out: Record<string, number> = {};
  for (const r of rows) out[r.slug] = Number(r.productCount);
  return out;
}

/* ------------------------------------------------------------------ */
/* Brands                                                               */
/* ------------------------------------------------------------------ */

export async function getAllBrands(): Promise<Brand[]> {
  const db = await getDb();
  return db.select().from(brands).orderBy(asc(brands.name));
}

export async function getBrandBySlug(slug: string): Promise<Brand | null> {
  const db = await getDb();
  const rows = await db
    .select()
    .from(brands)
    .where(eq(brands.slug, slug))
    .limit(1);
  return rows[0] ?? null;
}

export async function getBrandCounts(): Promise<Record<string, number>> {
  const db = await getDb();
  const rows = await db
    .select({
      slug: brands.slug,
      productCount: sql<number>`count(${products.id})`,
    })
    .from(brands)
    .leftJoin(
      products,
      and(eq(products.brandId, brands.id), eq(products.status, "active")),
    )
    .groupBy(brands.id);
  const out: Record<string, number> = {};
  for (const r of rows) out[r.slug] = Number(r.productCount);
  return out;
}

/* ------------------------------------------------------------------ */
/* Blog                                                                 */
/* ------------------------------------------------------------------ */

export async function getPublishedPosts(
  limit?: number,
): Promise<BlogPost[]> {
  const db = await getDb();
  const q = db
    .select()
    .from(blogPosts)
    .where(eq(blogPosts.isPublished, true))
    .orderBy(desc(blogPosts.publishedAt));
  return limit ? q.limit(limit) : q;
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  const db = await getDb();
  const rows = await db
    .select()
    .from(blogPosts)
    .where(and(eq(blogPosts.slug, slug), eq(blogPosts.isPublished, true)))
    .limit(1);
  return rows[0] ?? null;
}

export async function getRelatedPosts(
  postId: number,
  limit = 3,
): Promise<BlogPost[]> {
  const db = await getDb();
  const rows = await db
    .select()
    .from(blogPosts)
    .where(
      and(
        eq(blogPosts.isPublished, true),
        sql`${blogPosts.id} <> ${postId}`,
      ),
    )
    .orderBy(desc(blogPosts.publishedAt))
    .limit(limit);
  return rows;
}

export async function getAllPostSlugs(): Promise<
  { slug: string; updatedAt: Date; publishedAt: Date }[]
> {
  const db = await getDb();
  return db
    .select({
      slug: blogPosts.slug,
      updatedAt: blogPosts.updatedAt,
      publishedAt: blogPosts.publishedAt,
    })
    .from(blogPosts)
    .where(eq(blogPosts.isPublished, true));
}

/* ------------------------------------------------------------------ */
/* Price range (dùng cho bộ lọc giá)                                    */
/* ------------------------------------------------------------------ */

export async function getPriceRange(): Promise<{
  min: number;
  max: number;
}> {
  const db = await getDb();
  const rows = await db
    .select({
      min: sql<number>`COALESCE(MIN(COALESCE(${products.salePrice}, ${products.price})), 0)`,
      max: sql<number>`COALESCE(MAX(COALESCE(${products.salePrice}, ${products.price})), 0)`,
    })
    .from(products)
    .where(eq(products.status, "active"));
  return {
    min: Math.floor(Number(rows[0]?.min ?? 0)),
    max: Math.ceil(Number(rows[0]?.max ?? 0)),
  };
}

/* ------------------------------------------------------------------ */
/* Tìm kiếm nhanh (header autocomplete)                                  */
/* ------------------------------------------------------------------ */

export async function searchSuggestions(q: string, limit = 6) {
  const db = await getDb();
  const tokens = tokenizeQuery(q);
  if (!tokens.length) return [];

  const conditions = [eq(products.status, "active")];
  for (const token of tokens) {
    const pattern = `%${token.replace(/[\\%_]/g, (m) => `\\${m}`)}%`;
    conditions.push(
      or(
        sql`${foldSql(products.name)} LIKE ${pattern} ESCAPE '\'`,
        sql`${foldSql(products.sku)} LIKE ${pattern} ESCAPE '\'`,
      )!,
    );
  }

  return db
    .select({
      id: products.id,
      name: products.name,
      slug: products.slug,
      imageUrl: products.imageUrl,
      price: products.price,
      salePrice: products.salePrice,
    })
    .from(products)
    .where(and(...conditions))
    .orderBy(desc(products.soldCount))
    .limit(limit);
}

export { count, slugify };
