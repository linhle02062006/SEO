import { and, asc, desc, eq, ilike, or, sql } from "drizzle-orm";
import { getDb } from "@/database/db";
import {
  blogPosts,
  brands,
  categories,
  customers,
  products,
  settings,
  type BlogPost,
  type Product,
  type ProductStatus,
} from "@/database/schema";
import { slugify } from "@/lib/slug";

/* ------------------------------------------------------------------ */
/* Products (admin CRUD)                                                */
/* ------------------------------------------------------------------ */

export type AdminProductInput = {
  name: string;
  slug?: string;
  sku: string;
  shortDescription?: string | null;
  description?: string | null;
  price: number;
  salePrice?: number | null;
  costPrice?: number | null;
  imageUrl?: string | null;
  gallery?: string[];
  categoryId: number;
  brandId?: number | null;
  stock: number;
  badge?: string | null;
  status: ProductStatus;
  specs?: { label: string; value: string }[] | null;
  faq?: { question: string; answer: string }[] | null;
  isFeatured?: boolean;
  seoTitle?: string | null;
  seoDescription?: string | null;
};

export async function getAdminProducts(filters?: {
  q?: string;
  categoryId?: number;
  status?: ProductStatus;
  page?: number;
  limit?: number;
}) {
  const db = await getDb();
  const page = Math.max(1, filters?.page ?? 1);
  const limit = filters?.limit ?? 20;

  const conditions = [];
  if (filters?.q?.trim()) {
    const pattern = `%${filters.q.trim()}%`;
    conditions.push(
      or(
        ilike(products.name, pattern),
        ilike(products.sku, pattern),
        ilike(products.slug, pattern),
      )!,
    );
  }
  if (filters?.categoryId) {
    conditions.push(eq(products.categoryId, filters.categoryId));
  }
  if (filters?.status) {
    conditions.push(eq(products.status, filters.status));
  }
  const where = conditions.length ? and(...conditions) : undefined;

  const rows = await db
    .select({ product: products, category: categories, brand: brands })
    .from(products)
    .leftJoin(categories, eq(products.categoryId, categories.id))
    .leftJoin(brands, eq(products.brandId, brands.id))
    .where(where)
    .orderBy(desc(products.createdAt))
    .limit(limit)
    .offset((page - 1) * limit);

  const [{ total }] = await db
    .select({ total: sql<number>`count(*)` })
    .from(products)
    .where(where);

  return {
    items: rows.map((r) => ({
      ...(r.product as Product),
      category: r.category ?? null,
      brand: r.brand ?? null,
    })),
    total: Number(total),
    page,
    limit,
    totalPages: Math.max(1, Math.ceil(Number(total) / limit)),
  };
}

export async function getProductForEdit(id: number) {
  const db = await getDb();
  const rows = await db.select().from(products).where(eq(products.id, id)).limit(1);
  return rows[0] ?? null;
}

export async function getSlugExists(
  slug: string,
  excludeId?: number,
): Promise<boolean> {
  const db = await getDb();
  const rows = await db
    .select({ id: products.id })
    .from(products)
    .where(eq(products.slug, slug));
  return rows.some((r) => r.id !== excludeId);
}

export async function createProduct(input: AdminProductInput) {
  const db = await getDb();
  const slug = slugify(input.slug?.trim() || input.name);
  const [row] = await db
    .insert(products)
    .values({
      name: input.name,
      slug,
      sku: input.sku,
      shortDescription: input.shortDescription ?? null,
      description: input.description ?? null,
      price: String(input.price),
      salePrice: input.salePrice != null ? String(input.salePrice) : null,
      costPrice: input.costPrice != null ? String(input.costPrice) : null,
      imageUrl: input.imageUrl ?? null,
      gallery: input.gallery ?? [],
      categoryId: input.categoryId,
      brandId: input.brandId ?? null,
      stock: input.stock,
      badge: input.badge ?? null,
      status: input.status,
      specs: input.specs?.length ? JSON.stringify(input.specs) : null,
      faq: input.faq?.length ? JSON.stringify(input.faq) : null,
      isFeatured: input.isFeatured ?? false,
      seoTitle: input.seoTitle ?? null,
      seoDescription: input.seoDescription ?? null,
    })
    .returning();
  return row;
}

export async function updateProduct(id: number, input: AdminProductInput) {
  const db = await getDb();
  const slug = slugify(input.slug?.trim() || input.name);
  const [row] = await db
    .update(products)
    .set({
      name: input.name,
      slug,
      sku: input.sku,
      shortDescription: input.shortDescription ?? null,
      description: input.description ?? null,
      price: String(input.price),
      salePrice: input.salePrice != null ? String(input.salePrice) : null,
      costPrice: input.costPrice != null ? String(input.costPrice) : null,
      imageUrl: input.imageUrl ?? null,
      gallery: input.gallery ?? [],
      categoryId: input.categoryId,
      brandId: input.brandId ?? null,
      stock: input.stock,
      badge: input.badge ?? null,
      status: input.status,
      specs: input.specs?.length ? JSON.stringify(input.specs) : null,
      faq: input.faq?.length ? JSON.stringify(input.faq) : null,
      isFeatured: input.isFeatured ?? false,
      seoTitle: input.seoTitle ?? null,
      seoDescription: input.seoDescription ?? null,
      updatedAt: new Date(),
    })
    .where(eq(products.id, id))
    .returning();
  return row;
}

export async function deleteProduct(id: number) {
  const db = await getDb();
  await db.delete(products).where(eq(products.id, id));
}

/* ------------------------------------------------------------------ */
/* Blog posts (admin CRUD)                                             */
/* ------------------------------------------------------------------ */

export type AdminPostInput = {
  title: string;
  slug?: string;
  excerpt?: string | null;
  content: string;
  coverImage?: string | null;
  coverAlt?: string | null;
  categoryId?: number | null;
  tags?: string[];
  status?: string;
  isPublished: boolean;
  readingTime?: number;
  seoTitle?: string | null;
  seoDescription?: string | null;
  publishedAt?: Date;
};

export async function getAdminPosts(filters?: {
  q?: string;
  page?: number;
  limit?: number;
}) {
  const db = await getDb();
  const page = Math.max(1, filters?.page ?? 1);
  const limit = filters?.limit ?? 20;

  const conditions = [];
  if (filters?.q?.trim()) {
    const pattern = `%${filters.q.trim()}%`;
    conditions.push(
      or(ilike(blogPosts.title, pattern), ilike(blogPosts.slug, pattern))!,
    );
  }
  const where = conditions.length ? and(...conditions) : undefined;

  const rows = await db
    .select()
    .from(blogPosts)
    .where(where)
    .orderBy(desc(blogPosts.createdAt))
    .limit(limit)
    .offset((page - 1) * limit);

  const [{ total }] = await db
    .select({ total: sql<number>`count(*)` })
    .from(blogPosts)
    .where(where);

  return {
    items: rows as BlogPost[],
    total: Number(total),
    page,
    limit,
    totalPages: Math.max(1, Math.ceil(Number(total) / limit)),
  };
}

export async function getPostForEdit(id: number) {
  const db = await getDb();
  const rows = await db
    .select()
    .from(blogPosts)
    .where(eq(blogPosts.id, id))
    .limit(1);
  return rows[0] ?? null;
}

export async function createPost(input: AdminPostInput) {
  const db = await getDb();
  const slug = slugify(input.slug?.trim() || input.title);
  const [row] = await db
    .insert(blogPosts)
    .values({
      title: input.title,
      slug,
      excerpt: input.excerpt ?? null,
      content: input.content,
      coverImage: input.coverImage ?? null,
      coverAlt: input.coverAlt ?? null,
      categoryId: input.categoryId ?? null,
      tags: input.tags ?? [],
      status: input.status ?? (input.isPublished ? "published" : "draft"),
      isPublished: input.isPublished,
      readingTime: input.readingTime ?? 5,
      seoTitle: input.seoTitle ?? null,
      seoDescription: input.seoDescription ?? null,
      publishedAt: input.publishedAt ?? new Date(),
    })
    .returning();
  return row;
}

export async function updatePost(id: number, input: AdminPostInput) {
  const db = await getDb();
  const slug = slugify(input.slug?.trim() || input.title);
  const [row] = await db
    .update(blogPosts)
    .set({
      title: input.title,
      slug,
      excerpt: input.excerpt ?? null,
      content: input.content,
      coverImage: input.coverImage ?? null,
      coverAlt: input.coverAlt ?? null,
      categoryId: input.categoryId ?? null,
      tags: input.tags ?? [],
      status: input.status ?? (input.isPublished ? "published" : "draft"),
      isPublished: input.isPublished,
      readingTime: input.readingTime ?? 5,
      seoTitle: input.seoTitle ?? null,
      seoDescription: input.seoDescription ?? null,
      publishedAt: input.publishedAt ?? undefined,
      updatedAt: new Date(),
    })
    .where(eq(blogPosts.id, id))
    .returning();
  return row;
}

export async function deletePost(id: number) {
  const db = await getDb();
  await db.delete(blogPosts).where(eq(blogPosts.id, id));
}

/* ------------------------------------------------------------------ */
/* Categories & brands (admin CRUD)                                     */
/* ------------------------------------------------------------------ */

export async function getAdminCategories() {
  const db = await getDb();
  const rows = await db
    .select({
      category: categories,
      productCount: sql<number>`(
        SELECT count(*) FROM ${products}
        WHERE ${products.categoryId} = ${categories.id}
      )`,
    })
    .from(categories)
    .orderBy(asc(categories.position), asc(categories.name));
  return rows.map((r) => ({
    ...r.category,
    productCount: Number(r.productCount),
  }));
}

export async function createCategory(data: {
  name: string;
  slug?: string;
  description?: string | null;
  icon?: string | null;
  position?: number;
  isFeatured?: boolean;
  seoTitle?: string | null;
  seoDescription?: string | null;
}) {
  const db = await getDb();
  const slug = slugify(data.slug?.trim() || data.name);
  const [row] = await db
    .insert(categories)
    .values({
      name: data.name,
      slug,
      description: data.description ?? null,
      icon: data.icon ?? null,
      position: data.position ?? 0,
      isFeatured: data.isFeatured ?? false,
      seoTitle: data.seoTitle ?? null,
      seoDescription: data.seoDescription ?? null,
    })
    .returning();
  return row;
}

export async function updateCategory(
  id: number,
  data: Partial<{
    name: string;
    slug: string;
    description: string | null;
    icon: string | null;
    position: number;
    isFeatured: boolean;
    seoTitle: string | null;
    seoDescription: string | null;
  }>,
) {
  const db = await getDb();
  const patch: Record<string, unknown> = { ...data };
  if (data.slug) patch.slug = slugify(data.slug);
  const [row] = await db
    .update(categories)
    .set(patch as typeof categories.$inferInsert)
    .where(eq(categories.id, id))
    .returning();
  return row;
}

export async function deleteCategory(id: number) {
  const db = await getDb();
  await db.delete(categories).where(eq(categories.id, id));
}

export async function getAdminBrands() {
  const db = await getDb();
  const rows = await db
    .select({
      brand: brands,
      productCount: sql<number>`(
        SELECT count(*) FROM ${products}
        WHERE ${products.brandId} = ${brands.id}
      )`,
    })
    .from(brands)
    .orderBy(asc(brands.name));
  return rows.map((r) => ({
    ...r.brand,
    productCount: Number(r.productCount),
  }));
}

export async function createBrand(data: {
  name: string;
  slug?: string;
  description?: string | null;
  isFeatured?: boolean;
  seoTitle?: string | null;
  seoDescription?: string | null;
}) {
  const db = await getDb();
  const slug = slugify(data.slug?.trim() || data.name);
  const [row] = await db
    .insert(brands)
    .values({
      name: data.name,
      slug,
      description: data.description ?? null,
      isFeatured: data.isFeatured ?? false,
      seoTitle: data.seoTitle ?? null,
      seoDescription: data.seoDescription ?? null,
    })
    .returning();
  return row;
}

export async function updateBrand(
  id: number,
  data: Partial<{
    name: string;
    slug: string;
    description: string | null;
    isFeatured: boolean;
    seoTitle: string | null;
    seoDescription: string | null;
  }>,
) {
  const db = await getDb();
  const patch: Record<string, unknown> = { ...data };
  if (data.slug) patch.slug = slugify(data.slug);
  const [row] = await db
    .update(brands)
    .set(patch as typeof brands.$inferInsert)
    .where(eq(brands.id, id))
    .returning();
  return row;
}

export async function deleteBrand(id: number) {
  const db = await getDb();
  await db.delete(brands).where(eq(brands.id, id));
}

/* ------------------------------------------------------------------ */
/* Customers                                                            */
/* ------------------------------------------------------------------ */

export async function getAdminCustomers(filters?: {
  q?: string;
  page?: number;
  limit?: number;
}) {
  const db = await getDb();
  const page = Math.max(1, filters?.page ?? 1);
  const limit = filters?.limit ?? 20;

  const conditions = [];
  if (filters?.q?.trim()) {
    const pattern = `%${filters.q.trim()}%`;
    conditions.push(
      or(
        ilike(customers.fullName, pattern),
        ilike(customers.phone, pattern),
        ilike(customers.email, pattern),
      )!,
    );
  }
  const where = conditions.length ? and(...conditions) : undefined;

  const rows = await db
    .select()
    .from(customers)
    .where(where)
    .orderBy(desc(customers.totalSpent))
    .limit(limit)
    .offset((page - 1) * limit);

  const [{ total }] = await db
    .select({ total: sql<number>`count(*)` })
    .from(customers)
    .where(where);

  return {
    items: rows,
    total: Number(total),
    page,
    limit,
    totalPages: Math.max(1, Math.ceil(Number(total) / limit)),
  };
}

/* ------------------------------------------------------------------ */
/* Settings                                                             */
/* ------------------------------------------------------------------ */

export async function getSettings(): Promise<Record<string, string>> {
  const db = await getDb();
  const rows = await db.select().from(settings);
  const out: Record<string, string> = {};
  for (const r of rows) out[r.key] = r.value;
  return out;
}

export async function saveSettings(values: Record<string, string>) {
  const db = await getDb();
  for (const [key, value] of Object.entries(values)) {
    const existing = await db
      .select({ id: settings.id })
      .from(settings)
      .where(eq(settings.key, key))
      .limit(1);
    if (existing.length) {
      await db
        .update(settings)
        .set({ value, updatedAt: new Date() })
        .where(eq(settings.key, key));
    } else {
      await db.insert(settings).values({ key, value });
    }
  }
}
