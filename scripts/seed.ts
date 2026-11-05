/**
 * Seed dữ liệu cho TechZone.
 * Chạy: npm run db:seed
 */
import "./load-env";
import { getStandaloneDb } from "../database/db";import * as schema from "../database/schema";
import { SEED_BRANDS, SEED_CATEGORIES } from "../database/seed-data/catalog";
import { SEED_PRODUCTS } from "../database/seed-data/products";
import { SEED_POSTS } from "../database/seed-data/posts";
import { SEED_KEYWORDS } from "../database/seed-data/keywords";
import { hashPassword } from "../lib/password";
import { slugify } from "../lib/slug";

async function main() {
  const db = await getStandaloneDb();
  console.log("🌱 Bắt đầu seed dữ liệu TechZone...");

  /* ------------------------- Admin user ------------------------- */
  const adminEmail = (
    process.env.ADMIN_EMAIL ?? "admin@techzone.vn"
  ).toLowerCase();
  const adminPassword = process.env.ADMIN_PASSWORD ?? "Admin@12345";
  const passwordHash = await hashPassword(adminPassword);

  const existingAdmin = await db
    .select()
    .from(schema.users)
    .where(eqEmail(adminEmail));

  if (!existingAdmin.length) {
    await db.insert(schema.users).values({
      email: adminEmail,
      passwordHash,
      name: "Quản trị viên TechZone",
      role: "admin",
      isActive: true,
    });
    console.log(`✅ Đã tạo tài khoản admin: ${adminEmail}`);
  } else {
    await db
      .update(schema.users)
      .set({ passwordHash, role: "admin", isActive: true })
      .where(eqEmail(adminEmail));
    console.log(`🔄 Đã cập nhật tài khoản admin: ${adminEmail}`);
  }

  const [adminRow] = await db
    .select()
    .from(schema.users)
    .where(eqEmail(adminEmail));

  /* ------------------------- Brands ------------------------- */
  const brandIds = new Map<string, number>();
  for (const b of SEED_BRANDS) {
    const existing = await db
      .select()
      .from(schema.brands)
      .where(eqBrand(b.slug));
    if (existing.length) {
      await db
        .update(schema.brands)
        .set({
          description: b.description,
          seoTitle: `${b.name} - phụ kiện điện thoại chính hãng`,
          seoDescription: b.description.slice(0, 300),
        })
        .where(eqBrand(b.slug));
      brandIds.set(b.slug, existing[0].id);
    } else {
      const [row] = await db
        .insert(schema.brands)
        .values({
          name: b.name,
          slug: b.slug,
          description: b.description,
          isFeatured: b.isFeatured ?? false,
          seoTitle: `${b.name} - phụ kiện điện thoại chính hãng`,
          seoDescription: b.description.slice(0, 300),
        })
        .returning();
      brandIds.set(b.slug, row.id);
    }
  }
  console.log(`✅ Thương hiệu: ${brandIds.size}`);

  /* ------------------------- Categories ------------------------- */
  const categoryIds = new Map<string, number>();
  for (const c of SEED_CATEGORIES) {
    const existing = await db
      .select()
      .from(schema.categories)
      .where(eqCategory(c.slug));
    if (existing.length) {
      await db
        .update(schema.categories)
        .set({
          description: c.description,
          icon: c.icon,
          position: c.position,
          isFeatured: c.isFeatured ?? false,
          seoTitle: `${c.name} chính hãng giá tốt`,
          seoDescription: c.description.slice(0, 300),
        })
        .where(eqCategory(c.slug));
      categoryIds.set(c.slug, existing[0].id);
    } else {
      const [row] = await db
        .insert(schema.categories)
        .values({
          name: c.name,
          slug: c.slug,
          description: c.description,
          icon: c.icon,
          position: c.position,
          isFeatured: c.isFeatured,
          seoTitle: `${c.name} chính hãng giá tốt`,
          seoDescription: c.description.slice(0, 300),
        })
        .returning();
      categoryIds.set(c.slug, row.id);
    }
  }
  console.log(`✅ Danh mục: ${categoryIds.size}`);

  /* ------------------------- Products ------------------------- */
  let productCount = 0;
  for (const p of SEED_PRODUCTS) {
    const existing = await db
      .select()
      .from(schema.products)
      .where(eqProduct(p.slug));
    const values = {
      name: p.name,
      slug: p.slug,
      sku: p.sku,
      shortDescription: p.shortDescription,
      description: p.description,
      price: String(p.price),
      salePrice: p.salePrice != null ? String(p.salePrice) : null,
      imageUrl: `/products/${p.slug}.jpg`,
      gallery: [
        `/products/${p.slug}.jpg`,
        `/products/${p.slug}-2.jpg`,
      ],
      categoryId: categoryIds.get(p.category)!,
      brandId: brandIds.get(p.brand) ?? null,
      stock: p.stock,
      soldCount: p.soldCount ?? 0,
      viewCount: Math.floor((p.soldCount ?? 10) * 12.5) + 40,
      ratingAverage: String(p.ratingAverage ?? 0),
      ratingCount: p.ratingCount ?? 0,
      badge: p.badge ?? null,
      status: "active" as const,
      specs: JSON.stringify(p.specs),
      faq: p.faq ? JSON.stringify(p.faq) : null,
      isFeatured: p.isFeatured ?? false,
      seoTitle: p.name,
      seoDescription: `${p.shortDescription} Giá ${(p.salePrice ?? p.price).toLocaleString("vi-VN")} đ, bảo hành 12 tháng, giao hàng 24-48h toàn quốc.`,
    };
    if (existing.length) {
      await db
        .update(schema.products)
        .set({ ...values, updatedAt: new Date() })
        .where(eqProduct(p.slug));
    } else {
      await db.insert(schema.products).values(values);
    }
    productCount++;
  }
  console.log(`✅ Sản phẩm: ${productCount}`);

  /* ------------------------- Blog posts ------------------------- */
  let postCount = 0;
  for (const p of SEED_POSTS) {
    const existing = await db
      .select()
      .from(schema.blogPosts)
      .where(eqPost(p.slug));
    const values = {
      title: p.title,
      slug: p.slug,
      excerpt: p.excerpt,
      content: p.content,
      coverImage: p.coverImage,
      coverAlt: p.coverAlt,
      categoryId: categoryIds.get(p.category) ?? null,
      authorId: adminRow.id,
      authorName: "Ban biên tập TechZone",
      tags: p.tags,
      status: "published" as const,
      isPublished: true,
      readingTime: p.readingTime,
      viewCount: 120 + postCount * 47,
      seoTitle: p.seoTitle,
      seoDescription: p.seoDescription,
      publishedAt: new Date(p.publishedAt),
    };
    if (existing.length) {
      await db
        .update(schema.blogPosts)
        .set({ ...values, updatedAt: new Date() })
        .where(eqPost(p.slug));
    } else {
      await db.insert(schema.blogPosts).values(values);
    }
    postCount++;
  }
  console.log(`✅ Bài viết blog: ${postCount}`);

  /* ------------------------- Keywords ------------------------- */
  for (const k of SEED_KEYWORDS) {
    const existing = await db
      .select()
      .from(schema.keywords)
      .where(eqKeyword(slugify(k.keyword)));
    const values = {
      keyword: k.keyword,
      slug: slugify(k.keyword),
      intent: k.intent,
      topicGroup: k.topicGroup,
      targetUrl: k.targetUrl,
      priority: k.priority,
      searchVolume: k.searchVolume,
      difficulty: k.difficulty,
      position: k.position ?? null,
      notes: k.notes ?? null,
      isActive: true,
    };
    if (existing.length) {
      await db
        .update(schema.keywords)
        .set({ ...values, updatedAt: new Date() })
        .where(eqKeyword(slugify(k.keyword)));
    } else {
      await db.insert(schema.keywords).values(values);
    }
  }
  console.log(`✅ Từ khóa: ${SEED_KEYWORDS.length}`);

  /* ------------------------- Social profiles ------------------------- */
  const socials = [
    { platform: "facebook", url: "https://facebook.com/techzone.vn", handle: "techzone.vn", isPrimary: true },
    { platform: "instagram", url: "https://instagram.com/techzone.vn", handle: "techzone.vn", isPrimary: false },
    { platform: "youtube", url: "https://youtube.com/@techzone.vn", handle: "@techzone.vn", isPrimary: false },
    { platform: "tiktok", url: "https://tiktok.com/@techzone.vn", handle: "@techzone.vn", isPrimary: false },
    { platform: "linkedin", url: "https://linkedin.com/company/techzone-vn", handle: "techzone-vn", isPrimary: false },
    { platform: "pinterest", url: "https://pinterest.com/techzonevn", handle: "techzonevn", isPrimary: false },
  ];
  for (const s of socials) {
    await db
      .insert(schema.socialProfiles)
      .values(s)
      .onConflictDoUpdate({
        target: schema.socialProfiles.platform,
        set: { url: s.url, handle: s.handle, updatedAt: new Date() },
      });
  }
  console.log(`✅ Social profiles: ${socials.length}`);

  /* ------------------------- Demo orders ------------------------- */
  const orderRows = await db.select().from(schema.orders);
  if (!orderRows.length) {
    const allProducts = await db.select().from(schema.products);
    if (allProducts.length) {
      const demoStatuses = [
        "pending",
        "confirmed",
        "shipping",
        "delivered",
        "delivered",
        "delivered",
        "cancelled",
      ] as const;
      const customers = [
        { fullName: "Nguyễn Minh Anh", phone: "0901234567", email: "minhanh@example.com", address: "123 Lê Lợi, Quận 1, TP.HCM" },
        { fullName: "Trần Thị Bình", phone: "0912345678", email: "binh.tran@example.com", address: "45 Nguyễn Huệ, Quận 1, TP.HCM" },
        { fullName: "Lê Hoàng Cường", phone: "0934567890", email: "cuong.le@example.com", address: "78 Hai Bà Trưng, Quận 1, TP.HCM" },
        { fullName: "Phạm Thu Hà", phone: "0987654321", email: "ha.pham@example.com", address: "12 Nguyễn Thị Minh Khai, Quận 3, TP.HCM" },
        { fullName: "Võ Đức Thắng", phone: "0968887766", email: "thang.vo@example.com", address: "200 Võ Văn Tần, Quận 3, TP.HCM" },
      ];

      for (let i = 0; i < 7; i++) {
        const c = customers[i % customers.length];
        const product = allProducts[(i * 5) % allProducts.length];
        const qty = (i % 3) + 1;
        const unit = product.salePrice
          ? Number(product.salePrice)
          : Number(product.price);
        const subtotal = unit * qty;
        const shipping = subtotal >= 300000 ? 0 : 30000;
        const daysAgo = 30 - i * 4;

        const [order] = await db
          .insert(schema.orders)
          .values({
            orderCode: `TZ2501${String(1000 + i)}`,
            fullName: c.fullName,
            phone: c.phone,
            email: c.email,
            address: c.address,
            paymentMethod: i % 3 === 0 ? "bank_transfer" : "cod",
            paymentStatus: i % 3 === 0 ? "paid" : "unpaid",
            status: demoStatuses[i],
            subtotal: String(subtotal),
            shippingFee: String(shipping),
            discount: "0",
            total: String(subtotal + shipping),
            createdAt: new Date(Date.now() - daysAgo * 24 * 3600 * 1000),
          })
          .returning();

        await db.insert(schema.orderItems).values({
          orderId: order.id,
          productId: product.id,
          productName: product.name,
          productSlug: product.slug,
          productImage: product.imageUrl,
          sku: product.sku,
          unitPrice: String(unit),
          quantity: qty,
          lineTotal: String(subtotal),
        });
      }
      console.log("✅ Đơn hàng demo: 7");
    }
  }

  /* ------------------------- Settings ------------------------- */
  const settings = [
    { key: "brand_name", value: "TechZone" },
    { key: "brand_logo", value: "/logo.svg" },
    { key: "brand_description", value: "Chuyên phân phối phụ kiện điện thoại và công nghệ chính hãng tại Việt Nam." },
    { key: "contact_email", value: "contact@techzone.vn" },
    { key: "contact_phone", value: "1900 6868" },
    { key: "contact_address", value: "123 Nguyễn Huệ, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh" },
  ];
  for (const s of settings) {
    const existing = await db
      .select()
      .from(schema.settings)
      .where(eqSetting(s.key));
    if (!existing.length) {
      await db.insert(schema.settings).values(s);
    }
  }
  console.log("✅ Settings");

  console.log("\n🎉 Seed hoàn tất!");
  console.log(`   Đăng nhập admin: ${adminEmail} / ${adminPassword}`);
  console.log("   Hãy chạy: npm run images:generate (nếu chưa tạo ảnh)\n");
  process.exit(0);
}

// Helper: dùng eq để tránh import nhiều lần
import { eq } from "drizzle-orm";
const eqEmail = (v: string) => eq(schema.users.email, v);
const eqBrand = (v: string) => eq(schema.brands.slug, v);
const eqCategory = (v: string) => eq(schema.categories.slug, v);
const eqProduct = (v: string) => eq(schema.products.slug, v);
const eqPost = (v: string) => eq(schema.blogPosts.slug, v);
const eqKeyword = (v: string) => eq(schema.keywords.slug, v);
const eqSetting = (v: string) => eq(schema.settings.key, v);

main().catch((err) => {
  console.error("❌ Lỗi seed:", err);
  process.exit(1);
});
