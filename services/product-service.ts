import { and, asc, desc, eq, gte, ilike, inArray, lte, or, sql } from "drizzle-orm";
import { getDb } from "@/database/db";
import {
  brands,
  categories,
  products,
  type Product,
  type ProductWithRelations,
} from "@/database/schema";
import type { Paginated, ProductFilterState } from "@/types";
import { normalizeText } from "@/lib/slug";

const PRODUCT_COLUMNS = {
  id: products.id,
  name: products.name,
  slug: products.slug,
  sku: products.sku,
  shortDescription: products.shortDescription,
  description: products.description,
  price: products.price,
  salePrice: products.salePrice,
  imageUrl: products.imageUrl,
  gallery: products.gallery,
  categoryId: products.categoryId,
  brandId: products.brandId,
  stock: products.stock,
  soldCount: products.soldCount,
  viewCount: products.viewCount,
  ratingAverage: products.ratingAverage,
  ratingCount: products.ratingCount,
  badge: products.badge,
  status: products.status,
  specs: products.specs,
  faq: products.faq,
  isFeatured: products.isFeatured,
  seoTitle: products.seoTitle,
  seoDescription: products.seoDescription,
  createdAt: products.createdAt,
  updatedAt: products.updatedAt,
};

function buildWhere(filters: ProductFilterState) {
  const conditions = [eq(products.status, "active")];

  if (filters.q?.trim()) {
    const q = normalizeText(filters.q.trim());
    const pattern = `%${q}%`;
    conditions.push(
      or(
        ilike(products.name, pattern),
        ilike(products.shortDescription, pattern),
        ilike(products.sku, pattern),
        ilike(products.description, pattern),
      )!,
    );
  }

  if (filters.category) {
    conditions.push(
      sql`${products.categoryId} IN (SELECT id FROM ${categories} WHERE ${categories.slug} = ${filters.category})`,
    );
  }

  if (filters.brand) {
    conditions.push(
      sql`${products.brandId} IN (SELECT id FROM ${brands} WHERE ${brands.slug} = ${filters.brand})`,
    );
  }

  if (filters.minPrice != null) {
    conditions.push(
      gte(
        sql`COALESCE(${products.salePrice}, ${products.price})`,
        filters.minPrice,
      ),
    );
  }

  if (filters.maxPrice != null) {
    conditions.push(
      lte(
        sql`COALESCE(${products.salePrice}, ${products.price})`,
        filters.maxPrice,
      ),
    );
  }

  if (filters.rating) {
    conditions.push(sql`${products.ratingAverage} >= ${filters.rating}`);
  }

  if (filters.inStock) {
    conditions.push(sql`${products.stock} > 0`);
  }

  if (filters.onSale) {
    conditions.push(
      sql`${products.salePrice} IS NOT NULL AND ${products.salePrice} < ${products.price}`,
    );
  }

  return and(...conditions);
}

function buildOrderBy(sort: ProductFilterState["sort"]) {
  switch (sort) {
    case "price-asc":
      return [asc(sql`COALESCE(${products.salePrice}, ${products.price})`)];
    case "price-desc":
      return [desc(sql`COALESCE(${products.salePrice}, ${products.price})`)];
    case "oldest":
      return [asc(products.createdAt)];
    case "popular":
      return [desc(products.soldCount)];
    case "rating":
      return [desc(products.ratingAverage), desc(products.ratingCount)];
    case "name-asc":
      return [asc(products.name)];
    case "name-desc":
      return [desc(products.name)];
    case "newest":
    default:
      return [desc(products.createdAt)];
  }
}

export async function getProducts(
  filters: ProductFilterState = {},
): Promise<Paginated<ProductWithRelations>> {
  const db = await getDb();
  const page = Math.max(1, filters.page ?? 1);
  const pageSize = Math.min(60, Math.max(1, filters.limit ?? 12));
  const where = buildWhere(filters);
  const orderBy = buildOrderBy(filters.sort);

  const rows = await db
    .select({ product: PRODUCT_COLUMNS, category: categories, brand: brands })
    .from(products)
    .leftJoin(categories, eq(products.categoryId, categories.id))
    .leftJoin(brands, eq(products.brandId, brands.id))
    .where(where)
    .orderBy(...orderBy)
    .limit(pageSize)
    .offset((page - 1) * pageSize);

  const [{ count }] = await db
    .select({ count: sql<number>`count(*)` })
    .from(products)
    .where(where);

  const total = Number(count);
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return {
    items: rows.map((r) => ({
      ...(r.product as Product),
      category: r.category ?? null,
      brand: r.brand ?? null,
    })),
    total,
    page,
    pageSize,
    totalPages,
    hasPrev: page > 1,
    hasNext: page < totalPages,
  };
}

export async function getProductBySlug(
  slug: string,
): Promise<ProductWithRelations | null> {
  const db = await getDb();
  const rows = await db
    .select({ product: PRODUCT_COLUMNS, category: categories, brand: brands })
    .from(products)
    .leftJoin(categories, eq(products.categoryId, categories.id))
    .leftJoin(brands, eq(products.brandId, brands.id))
    .where(and(eq(products.slug, slug), eq(products.status, "active")))
    .limit(1);

  if (!rows.length) return null;
  const r = rows[0];
  return { ...(r.product as Product), category: r.category ?? null, brand: r.brand ?? null };
}

export async function getProductById(id: number): Promise<Product | null> {
  const db = await getDb();
  const rows = await db
    .select()
    .from(products)
    .where(eq(products.id, id))
    .limit(1);
  return rows[0] ?? null;
}

export async function getRelatedProducts(
  productId: number,
  categoryId: number,
  limit = 8,
): Promise<ProductWithRelations[]> {
  const db = await getDb();
  const rows = await db
    .select({ product: PRODUCT_COLUMNS, category: categories, brand: brands })
    .from(products)
    .leftJoin(categories, eq(products.categoryId, categories.id))
    .leftJoin(brands, eq(products.brandId, brands.id))
    .where(
      and(
        eq(products.status, "active"),
        eq(products.categoryId, categoryId),
        sql`${products.id} <> ${productId}`,
      ),
    )
    .orderBy(desc(products.soldCount))
    .limit(limit);

  return rows.map((r) => ({
    ...(r.product as Product),
    category: r.category ?? null,
    brand: r.brand ?? null,
  }));
}

export async function getFeaturedProducts(limit = 8): Promise<ProductWithRelations[]> {
  const db = await getDb();
  const rows = await db
    .select({ product: PRODUCT_COLUMNS, category: categories, brand: brands })
    .from(products)
    .leftJoin(categories, eq(products.categoryId, categories.id))
    .leftJoin(brands, eq(products.brandId, brands.id))
    .where(and(eq(products.status, "active"), eq(products.isFeatured, true)))
    .orderBy(desc(products.soldCount))
    .limit(limit);

  return rows.map((r) => ({
    ...(r.product as Product),
    category: r.category ?? null,
    brand: r.brand ?? null,
  }));
}

export async function getLatestProducts(limit = 8): Promise<ProductWithRelations[]> {
  const db = await getDb();
  const rows = await db
    .select({ product: PRODUCT_COLUMNS, category: categories, brand: brands })
    .from(products)
    .leftJoin(categories, eq(products.categoryId, categories.id))
    .leftJoin(brands, eq(products.brandId, brands.id))
    .where(eq(products.status, "active"))
    .orderBy(desc(products.createdAt))
    .limit(limit);

  return rows.map((r) => ({
    ...(r.product as Product),
    category: r.category ?? null,
    brand: r.brand ?? null,
  }));
}

export async function getBestSellers(limit = 8): Promise<ProductWithRelations[]> {
  const db = await getDb();
  const rows = await db
    .select({ product: PRODUCT_COLUMNS, category: categories, brand: brands })
    .from(products)
    .leftJoin(categories, eq(products.categoryId, categories.id))
    .leftJoin(brands, eq(products.brandId, brands.id))
    .where(eq(products.status, "active"))
    .orderBy(desc(products.soldCount))
    .limit(limit);

  return rows.map((r) => ({
    ...(r.product as Product),
    category: r.category ?? null,
    brand: r.brand ?? null,
  }));
}

export async function getOnSaleProducts(limit = 8): Promise<ProductWithRelations[]> {
  const db = await getDb();
  const rows = await db
    .select({ product: PRODUCT_COLUMNS, category: categories, brand: brands })
    .from(products)
    .leftJoin(categories, eq(products.categoryId, categories.id))
    .leftJoin(brands, eq(products.brandId, brands.id))
    .where(
      and(
        eq(products.status, "active"),
        sql`${products.salePrice} IS NOT NULL AND ${products.salePrice} < ${products.price}`,
      ),
    )
    .orderBy(desc(products.soldCount))
    .limit(limit);

  return rows.map((r) => ({
    ...(r.product as Product),
    category: r.category ?? null,
    brand: r.brand ?? null,
  }));
}

/** Lấy id của các sản phẩm đang bán (dùng cho sitemap) */
export async function getAllActiveProductSlugs(): Promise<
  { slug: string; updatedAt: Date }[]
> {
  const db = await getDb();
  return db
    .select({ slug: products.slug, updatedAt: products.updatedAt })
    .from(products)
    .where(eq(products.status, "active"));
}

export async function getProductIdsByIds(ids: number[]): Promise<Product[]> {
  if (!ids.length) return [];
  const db = await getDb();
  return db.select().from(products).where(inArray(products.id, ids));
}
