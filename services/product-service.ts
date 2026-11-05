import {
  and,
  asc,
  desc,
  eq,
  gt,
  gte,
  inArray,
  lte,
  or,
  sql,
} from "drizzle-orm";
import { getDb } from "@/database/db";
import {
  brands,
  categories,
  products,
  productReviews,
  type Product,
  type ProductWithRelations,
} from "@/database/schema";
import type { Paginated, ProductFilterState } from "@/types";
import { foldSql, tokenizeQuery } from "@/lib/vi-search";

/** Escape các ký tự đặc biệt của LIKE để tránh khớp sai (%, _). */
function escapeLike(input: string): string {
  return input.replace(/[\\%_]/g, (m) => `\\${m}`);
}

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
    // Tìm kiếm tiếng Việt không dấu: "sac" phải match "Sạc".
    // Mọi token trong từ khóa đều phải xuất hiện (AND), mỗi token có thể nằm
    // ở bất kỳ cột nào (OR).
    const tokens = tokenizeQuery(filters.q);
    if (tokens.length) {
      const searchable = [
        products.name,
        products.shortDescription,
        products.sku,
        products.description,
      ];
      for (const token of tokens) {
        const pattern = `%${escapeLike(token)}%`;
        conditions.push(
          or(
            ...searchable.map((col) =>
              sql`${foldSql(col)} LIKE ${pattern} ESCAPE '\'`,
            ),
          )!,
        );
      }
    }
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

/**
 * Sản phẩm "bán chạy" — CHỈ trả về sản phẩm có `soldCount > 0`, tức là đã
 * có đơn hàng THẬT. Nếu shop chưa có đơn hàng nào thì hàm trả về mảng rỗng
 * để UI ẩn section thay vì hiển thị sản phẩm "bán chạy" không có căn cứ.
 */
export async function getBestSellers(limit = 8): Promise<ProductWithRelations[]> {
  const db = await getDb();
  const rows = await db
    .select({ product: PRODUCT_COLUMNS, category: categories, brand: brands })
    .from(products)
    .leftJoin(categories, eq(products.categoryId, categories.id))
    .leftJoin(brands, eq(products.brandId, brands.id))
    .where(and(eq(products.status, "active"), gt(products.soldCount, 0)))
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

/**
 * Kiểm tra shop đã có dữ liệu bán hàng THẬT chưa.
 * Dùng để ẩn các option sắp xếp "Bán chạy nhất" khi chưa có đơn hàng nào
 * — tránh đưa ra bảng xếp hạng vô căn cứ.
 */
export async function hasSalesData(): Promise<boolean> {
  const db = await getDb();
  const rows = await db
    .select({ id: products.id })
    .from(products)
    .where(and(eq(products.status, "active"), gt(products.soldCount, 0)))
    .limit(1);
  return rows.length > 0;
}

/**
 * Kiểm tra shop đã có đánh giá THẬT chưa — dùng để ẩn option sắp xếp
 * "Đánh giá cao" và bộ lọc đánh giá khi chưa có bản ghi `product_reviews`.
 */
export async function hasReviewsData(): Promise<boolean> {
  const db = await getDb();
  const rows = await db
    .select({ id: productReviews.id })
    .from(productReviews)
    .limit(1);
  return rows.length > 0;
}

export async function getProductIdsByIds(ids: number[]): Promise<Product[]> {
  if (!ids.length) return [];
  const db = await getDb();
  return db.select().from(products).where(inArray(products.id, ids));
}
