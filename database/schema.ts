import { relations, sql } from "drizzle-orm";
import {
  boolean,
  index,
  integer,
  numeric,
  pgTable,
  pgEnum,
  primaryKey,
  serial,
  text,
  timestamp,
  uniqueIndex,
  varchar,
} from "drizzle-orm/pg-core";

/* ------------------------------------------------------------------ */
/* Enums                                                               */
/* ------------------------------------------------------------------ */

export const orderStatusEnum = pgEnum("order_status", [
  "pending", // Chờ xác nhận
  "confirmed", // Đã xác nhận
  "shipping", // Đang giao
  "delivered", // Đã giao
  "cancelled", // Đã hủy
]);

export const paymentMethodEnum = pgEnum("payment_method", [
  "cod", // Thanh toán khi nhận hàng
  "bank_transfer", // Chuyển khoản ngân hàng
]);

export const paymentStatusEnum = pgEnum("payment_status", [
  "unpaid",
  "paid",
  "refunded",
]);

export const roleEnum = pgEnum("user_role", ["admin", "editor", "customer"]);

export const productStatusEnum = pgEnum("product_status", [
  "active",
  "hidden",
  "draft",
]);

/* ------------------------------------------------------------------ */
/* users                                                                */
/* ------------------------------------------------------------------ */

export const users = pgTable(
  "users",
  {
    id: serial("id").primaryKey(),
    email: varchar("email", { length: 160 }).notNull(),
    passwordHash: text("password_hash").notNull(),
    name: varchar("name", { length: 120 }).notNull(),
    role: roleEnum("role").notNull().default("customer"),
    avatarUrl: text("avatar_url"),
    isActive: boolean("is_active").notNull().default(true),
    lastLoginAt: timestamp("last_login_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    uniqueIndex("users_email_unique").on(sql`lower(${t.email})`),
    index("users_role_idx").on(t.role),
  ],
);

/* ------------------------------------------------------------------ */
/* customers                                                            */
/* ------------------------------------------------------------------ */

export const customers = pgTable(
  "customers",
  {
    id: serial("id").primaryKey(),
    userId: integer("user_id").references(() => users.id, { onDelete: "set null" }),
    fullName: varchar("full_name", { length: 120 }).notNull(),
    phone: varchar("phone", { length: 24 }).notNull(),
    email: varchar("email", { length: 160 }),
    address: text("address").notNull(),
    ward: varchar("ward", { length: 120 }),
    district: varchar("district", { length: 120 }),
    city: varchar("city", { length: 120 }),
    note: text("note"),
    totalOrders: integer("total_orders").notNull().default(0),
    totalSpent: numeric("total_spent", { precision: 14, scale: 2 })
      .notNull()
      .default("0"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [index("customers_phone_idx").on(t.phone)],
);

/* ------------------------------------------------------------------ */
/* brands                                                               */
/* ------------------------------------------------------------------ */

export const brands = pgTable(
  "brands",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 100 }).notNull(),
    slug: varchar("slug", { length: 120 }).notNull(),
    logoUrl: text("logo_url"),
    description: text("description"),
    isFeatured: boolean("is_featured").notNull().default(false),
    seoTitle: varchar("seo_title", { length: 200 }),
    seoDescription: varchar("seo_description", { length: 320 }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [uniqueIndex("brands_slug_unique").on(t.slug)],
);

/* ------------------------------------------------------------------ */
/* categories                                                           */
/* ------------------------------------------------------------------ */

export const categories = pgTable(
  "categories",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 120 }).notNull(),
    slug: varchar("slug", { length: 140 }).notNull(),
    parentId: integer("parent_id").references((): any => categories.id, {
      onDelete: "set null",
    }),
    description: text("description"),
    imageUrl: text("image_url"),
    icon: varchar("icon", { length: 60 }),
    position: integer("position").notNull().default(0),
    isFeatured: boolean("is_featured").notNull().default(false),
    seoTitle: varchar("seo_title", { length: 200 }),
    seoDescription: varchar("seo_description", { length: 320 }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    uniqueIndex("categories_slug_unique").on(t.slug),
    index("categories_parent_idx").on(t.parentId),
  ],
);

/* ------------------------------------------------------------------ */
/* products                                                             */
/* ------------------------------------------------------------------ */

export const products = pgTable(
  "products",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 220 }).notNull(),
    slug: varchar("slug", { length: 240 }).notNull(),
    sku: varchar("sku", { length: 60 }).notNull(),
    shortDescription: varchar("short_description", { length: 320 }),
    description: text("description"),
    // Giá lưu bằng numeric -> chuẩn tiền tệ, không mất precision
    price: numeric("price", { precision: 12, scale: 2 }).notNull(),
    salePrice: numeric("sale_price", { precision: 12, scale: 2 }),
    costPrice: numeric("cost_price", { precision: 12, scale: 2 }),
    imageUrl: text("image_url"),
    gallery: text("gallery").array().notNull().default(sql`'{}'::text[]`),
    categoryId: integer("category_id")
      .notNull()
      .references(() => categories.id, { onDelete: "restrict" }),
    brandId: integer("brand_id").references(() => brands.id, {
      onDelete: "set null",
    }),
    stock: integer("stock").notNull().default(0),
    soldCount: integer("sold_count").notNull().default(0),
    viewCount: integer("view_count").notNull().default(0),
    ratingAverage: numeric("rating_average", { precision: 3, scale: 2 })
      .notNull()
      .default("0"),
    ratingCount: integer("rating_count").notNull().default(0),
    // "hot" | "new" | null -> dùng cho sắp xếp nổi bật / mới
    badge: varchar("badge", { length: 40 }),
    status: productStatusEnum("status").notNull().default("active"),
    // JSON string: thông số kỹ thuật [{label, value}]
    specs: text("specs"),
    // JSON string: FAQ [{question, answer}]
    faq: text("faq"),
    isFeatured: boolean("is_featured").notNull().default(false),
    seoTitle: varchar("seo_title", { length: 200 }),
    seoDescription: varchar("seo_description", { length: 320 }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    uniqueIndex("products_slug_unique").on(t.slug),
    uniqueIndex("products_sku_unique").on(t.sku),
    index("products_category_idx").on(t.categoryId),
    index("products_brand_idx").on(t.brandId),
    index("products_status_idx").on(t.status),
    index("products_price_idx").on(t.price),
    index("products_featured_idx").on(t.isFeatured),
  ],
);

/* ------------------------------------------------------------------ */
/* product_reviews                                                      */
/* ------------------------------------------------------------------ */

export const productReviews = pgTable(
  "product_reviews",
  {
    id: serial("id").primaryKey(),
    productId: integer("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    customerId: integer("customer_id").references(() => customers.id, {
      onDelete: "set null",
    }),
    authorName: varchar("author_name", { length: 120 }).notNull(),
    rating: integer("rating").notNull(),
    title: varchar("title", { length: 200 }),
    content: text("content"),
    isVerified: boolean("is_verified").notNull().default(false),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    index("reviews_product_idx").on(t.productId),
    index("reviews_customer_idx").on(t.customerId),
  ],
);

/* ------------------------------------------------------------------ */
/* orders & order_items                                                 */
/* ------------------------------------------------------------------ */

export const orders = pgTable(
  "orders",
  {
    id: serial("id").primaryKey(),
    orderCode: varchar("order_code", { length: 32 }).notNull(),
    customerId: integer("customer_id").references(() => customers.id, {
      onDelete: "set null",
    }),
    userId: integer("user_id").references(() => users.id, {
      onDelete: "set null",
    }),
    // Snapshot thông tin giao hàng tại thời điểm đặt
    fullName: varchar("full_name", { length: 120 }).notNull(),
    phone: varchar("phone", { length: 24 }).notNull(),
    email: varchar("email", { length: 160 }),
    address: text("address").notNull(),
    note: text("note"),
    paymentMethod: paymentMethodEnum("payment_method").notNull().default("cod"),
    paymentStatus: paymentStatusEnum("payment_status")
      .notNull()
      .default("unpaid"),
    status: orderStatusEnum("status").notNull().default("pending"),
    subtotal: numeric("subtotal", { precision: 12, scale: 2 }).notNull(),
    shippingFee: numeric("shipping_fee", { precision: 12, scale: 2 })
      .notNull()
      .default("0"),
    discount: numeric("discount", { precision: 12, scale: 2 })
      .notNull()
      .default("0"),
    total: numeric("total", { precision: 12, scale: 2 }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    uniqueIndex("orders_code_unique").on(t.orderCode),
    index("orders_status_idx").on(t.status),
    index("orders_created_idx").on(t.createdAt),
    index("orders_customer_idx").on(t.customerId),
  ],
);

export const orderItems = pgTable(
  "order_items",
  {
    id: serial("id").primaryKey(),
    orderId: integer("order_id")
      .notNull()
      .references(() => orders.id, { onDelete: "cascade" }),
    productId: integer("product_id").references(() => products.id, {
      onDelete: "set null",
    }),
    // Snapshot tên/giá tại thời điểm mua
    productName: varchar("product_name", { length: 220 }).notNull(),
    productSlug: varchar("product_slug", { length: 240 }),
    productImage: text("product_image"),
    sku: varchar("sku", { length: 60 }),
    unitPrice: numeric("unit_price", { precision: 12, scale: 2 }).notNull(),
    quantity: integer("quantity").notNull().default(1),
    lineTotal: numeric("line_total", { precision: 12, scale: 2 }).notNull(),
  },
  (t) => [
    index("order_items_order_idx").on(t.orderId),
    index("order_items_product_idx").on(t.productId),
  ],
);

/* ------------------------------------------------------------------ */
/* coupons                                                              */
/* ------------------------------------------------------------------ */

export const coupons = pgTable("coupons", {
  id: serial("id").primaryKey(),
  code: varchar("code", { length: 40 }).notNull(),
  description: varchar("description", { length: 200 }),
  type: varchar("type", { length: 20 }).notNull().default("percent"),
  value: numeric("value", { precision: 12, scale: 2 }).notNull(),
  minOrderValue: numeric("min_order_value", { precision: 12, scale: 2 })
    .notNull()
    .default("0"),
  maxDiscount: numeric("max_discount", { precision: 12, scale: 2 }),
  usageLimit: integer("usage_limit"),
  usedCount: integer("used_count").notNull().default(0),
  isActive: boolean("is_active").notNull().default(true),
  startsAt: timestamp("starts_at", { withTimezone: true }),
  expiresAt: timestamp("expires_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

/* ------------------------------------------------------------------ */
/* blog_posts                                                          */
/* ------------------------------------------------------------------ */

export const blogPosts = pgTable(
  "blog_posts",
  {
    id: serial("id").primaryKey(),
    title: varchar("title", { length: 240 }).notNull(),
    slug: varchar("slug", { length: 260 }).notNull(),
    excerpt: varchar("excerpt", { length: 400 }),
    content: text("content").notNull(),
    coverImage: text("cover_image"),
    coverAlt: varchar("cover_alt", { length: 200 }),
    categoryId: integer("category_id").references(() => categories.id, {
      onDelete: "set null",
    }),
    authorId: integer("author_id").references(() => users.id, {
      onDelete: "set null",
    }),
    authorName: varchar("author_name", { length: 120 }).notNull().default("TechZone"),
    tags: text("tags").array().notNull().default(sql`'{}'::text[]`),
    status: varchar("status", { length: 20 }).notNull().default("published"),
    isPublished: boolean("is_published").notNull().default(true),
    readingTime: integer("reading_time").notNull().default(4),
    viewCount: integer("view_count").notNull().default(0),
    seoTitle: varchar("seo_title", { length: 200 }),
    seoDescription: varchar("seo_description", { length: 320 }),
    publishedAt: timestamp("published_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    uniqueIndex("blog_slug_unique").on(t.slug),
    index("blog_published_idx").on(t.isPublished, t.publishedAt),
  ],
);

/* ------------------------------------------------------------------ */
/* SEO: keywords                                                        */
/* ------------------------------------------------------------------ */

export const searchIntentEnum = pgEnum("search_intent", [
  "informational",
  "commercial",
  "transactional",
  "navigational",
]);

export const keywordPriorityEnum = pgEnum("keyword_priority", [
  "low",
  "medium",
  "high",
  "top",
]);

export const keywords = pgTable(
  "keywords",
  {
    id: serial("id").primaryKey(),
    keyword: varchar("keyword", { length: 180 }).notNull(),
    slug: varchar("slug", { length: 200 }).notNull(),
    intent: searchIntentEnum("intent").notNull().default("commercial"),
    topicGroup: varchar("topic_group", { length: 120 }).notNull().default("Chung"),
    targetUrl: varchar("target_url", { length: 300 }).notNull(),
    priority: keywordPriorityEnum("priority").notNull().default("medium"),
    searchVolume: integer("search_volume"),
    difficulty: integer("difficulty"),
    position: integer("position"),
    notes: text("notes"),
    isActive: boolean("is_active").notNull().default(true),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    uniqueIndex("keywords_slug_unique").on(t.slug),
    index("keywords_intent_idx").on(t.intent),
    index("keywords_group_idx").on(t.topicGroup),
  ],
);

export type Keyword = typeof keywords.$inferSelect;

/* ------------------------------------------------------------------ */
/* SEO: social entity (thông tin thương hiệu thống nhất)                */
/* ------------------------------------------------------------------ */

export const socialProfiles = pgTable(
  "social_profiles",
  {
    id: serial("id").primaryKey(),
    platform: varchar("platform", { length: 40 }).notNull(),
    url: varchar("url", { length: 400 }).notNull(),
    handle: varchar("handle", { length: 120 }),
    isPrimary: boolean("is_primary").notNull().default(false),
    isActive: boolean("is_active").notNull().default(true),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [uniqueIndex("social_platform_unique").on(t.platform)],
);

/* ------------------------------------------------------------------ */
/* SEO: backlink tracking                                                */
/* ------------------------------------------------------------------ */

export const backlinkStatusEnum = pgEnum("backlink_status", [
  "pending",
  "active",
  "rejected",
  "removed",
]);

export const backlinkTypeEnum = pgEnum("backlink_type", [
  "editorial",
  "guest_post",
  "directory",
  "forum",
  "social",
  "press",
  "other",
]);

export const backlinks = pgTable(
  "backlinks",
  {
    id: serial("id").primaryKey(),
    sourceUrl: varchar("source_url", { length: 600 }).notNull(),
    targetUrl: varchar("target_url", { length: 600 }).notNull(),
    anchorText: varchar("anchor_text", { length: 200 }),
    domain: varchar("domain", { length: 255 }).notNull(),
    domainAuthority: integer("domain_authority"),
    type: backlinkTypeEnum("type").notNull().default("editorial"),
    status: backlinkStatusEnum("status").notNull().default("pending"),
    firstSeenAt: timestamp("first_seen_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    note: text("note"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    index("backlinks_domain_idx").on(t.domain),
    index("backlinks_status_idx").on(t.status),
  ],
);

export type Backlink = typeof backlinks.$inferSelect;

/* ------------------------------------------------------------------ */
/* SEO: automated audit results                                         */
/* ------------------------------------------------------------------ */

export const seoAuditStatusEnum = pgEnum("seo_audit_status", [
  "pass",
  "warning",
  "error",
]);

export const seoAudits = pgTable(
  "seo_audits",
  {
    id: serial("id").primaryKey(),
    url: varchar("url", { length: 600 }).notNull(),
    pageType: varchar("page_type", { length: 60 }).notNull().default("page"),
    checkName: varchar("check_name", { length: 80 }).notNull(),
    status: seoAuditStatusEnum("status").notNull().default("pass"),
    message: text("message"),
    severity: integer("severity").notNull().default(0),
    checkedAt: timestamp("checked_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    index("seo_audits_url_idx").on(t.url),
    index("seo_audits_status_idx").on(t.status),
    index("seo_audits_checked_idx").on(t.checkedAt),
  ],
);

export type SeoAudit = typeof seoAudits.$inferSelect;

/* ------------------------------------------------------------------ */
/* Analytics: nội bộ (đo lường tại server, fallback + đối chiếu GA4)     */
/* ------------------------------------------------------------------ */

export const seoEventTypeEnum = pgEnum("seo_event_type", [
  "page_view",
  "view_item",
  "search",
  "add_to_cart",
  "begin_checkout",
  "purchase",
]);

export const seoEvents = pgTable(
  "seo_events",
  {
    id: serial("id").primaryKey(),
    type: seoEventTypeEnum("type").notNull(),
    path: varchar("path", { length: 400 }).notNull(),
    label: varchar("label", { length: 240 }),
    productId: integer("product_id").references(() => products.id, {
      onDelete: "set null",
    }),
    value: numeric("value", { precision: 12, scale: 2 }).notNull().default("0"),
    sessionId: varchar("session_id", { length: 64 }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    index("seo_events_type_idx").on(t.type),
    index("seo_events_created_idx").on(t.createdAt),
  ],
);

/* ------------------------------------------------------------------ */
/* contact_messages                                                     */
/* ------------------------------------------------------------------ */

export const contactMessages = pgTable(
  "contact_messages",
  {
    id: serial("id").primaryKey(),
    fullName: varchar("full_name", { length: 120 }).notNull(),
    email: varchar("email", { length: 160 }).notNull(),
    phone: varchar("phone", { length: 24 }),
    subject: varchar("subject", { length: 200 }),
    content: text("content").notNull(),
    isRead: boolean("is_read").notNull().default(false),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [index("contact_created_idx").on(t.createdAt)],
);

/* ------------------------------------------------------------------ */
/* settings (key/value) — thông tin cấu hình website & SEO             */
/* ------------------------------------------------------------------ */

export const settings = pgTable(
  "settings",
  {
    id: serial("id").primaryKey(),
    key: varchar("key", { length: 80 }).notNull(),
    value: text("value").notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [uniqueIndex("settings_key_unique").on(t.key)],
);

/* ------------------------------------------------------------------ */
/* relations                                                            */
/* ------------------------------------------------------------------ */

export const usersRelations = relations(users, ({ many }) => ({
  orders: many(orders),
}));

export const categoriesRelations = relations(categories, ({ one, many }) => ({
  parent: one(categories, {
    fields: [categories.parentId],
    references: [categories.id],
    relationName: "category_tree",
  }),
  children: many(categories, { relationName: "category_tree" }),
  products: many(products),
  posts: many(blogPosts),
}));

export const brandsRelations = relations(brands, ({ many }) => ({
  products: many(products),
}));

export const productsRelations = relations(products, ({ one, many }) => ({
  category: one(categories, {
    fields: [products.categoryId],
    references: [categories.id],
  }),
  brand: one(brands, { fields: [products.brandId], references: [brands.id] }),
  orderItems: many(orderItems),
  reviews: many(productReviews),
}));

export const ordersRelations = relations(orders, ({ one, many }) => ({
  customer: one(customers, { fields: [orders.customerId], references: [customers.id] }),
  user: one(users, { fields: [orders.userId], references: [users.id] }),
  items: many(orderItems),
}));

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, { fields: [orderItems.orderId], references: [orders.id] }),
  product: one(products, {
    fields: [orderItems.productId],
    references: [products.id],
  }),
}));

export const customersRelations = relations(customers, ({ one, many }) => ({
  user: one(users, { fields: [customers.userId], references: [users.id] }),
  orders: many(orders),
  reviews: many(productReviews),
}));

export const productReviewsRelations = relations(productReviews, ({ one }) => ({
  product: one(products, {
    fields: [productReviews.productId],
    references: [products.id],
  }),
  customer: one(customers, {
    fields: [productReviews.customerId],
    references: [customers.id],
  }),
}));

export const blogPostsRelations = relations(blogPosts, ({ one }) => ({
  category: one(categories, {
    fields: [blogPosts.categoryId],
    references: [categories.id],
  }),
  author: one(users, { fields: [blogPosts.authorId], references: [users.id] }),
}));

/* ------------------------------------------------------------------ */
/* type exports                                                         */
/* ------------------------------------------------------------------ */

export type User = typeof users.$inferSelect;
export type Brand = typeof brands.$inferSelect;
export type Category = typeof categories.$inferSelect;
export type Product = typeof products.$inferSelect;
export type ProductReview = typeof productReviews.$inferSelect;
export type Order = typeof orders.$inferSelect;
export type OrderItem = typeof orderItems.$inferSelect;
export type Customer = typeof customers.$inferSelect;
export type BlogPost = typeof blogPosts.$inferSelect;
export type ContactMessage = typeof contactMessages.$inferSelect;
export type OrderStatus = (typeof orderStatusEnum.enumValues)[number];
export type PaymentMethod = (typeof paymentMethodEnum.enumValues)[number];
export type PaymentStatus = (typeof paymentStatusEnum.enumValues)[number];
export type UserRole = (typeof roleEnum.enumValues)[number];
export type ProductStatus = (typeof productStatusEnum.enumValues)[number];

export type ProductWithRelations = Product & {
  category: Category | null;
  brand: Brand | null;
};

export type OrderWithItems = Order & {
  items: (OrderItem & { product: Product | null })[];
};

export { primaryKey };
