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
import {
  DEMO_CUSTOMERS,
  DEMO_ORDERS,
  DEMO_SESSION_PREFIX,
  buildDemoEvents,
  daysAgoDate,
} from "../database/seed-data/demo";
import { hashPassword } from "../lib/password";
import { slugify } from "../lib/slug";

/** Email liên hệ chính thức — nguồn nhận yêu cầu tư vấn từ form liên hệ. */
const CONTACT_EMAIL =
  process.env.CONTACT_EMAIL?.trim() ||
  process.env.NEXT_PUBLIC_CONTACT_EMAIL?.trim() ||
  "1350080137@sv.hcmunre.edu.vn";

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
    // Ảnh đại diện danh mục được sinh từ ảnh sản phẩm thật (public/categories)
    const coverImage = `/categories/${c.slug}.jpg`;
    const existing = await db
      .select()
      .from(schema.categories)
      .where(eqCategory(c.slug));
    if (existing.length) {
      await db
        .update(schema.categories)
        .set({
          description: c.description,
          imageUrl: coverImage,
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
          imageUrl: coverImage,
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
    // Tìm theo slug, nếu không có thì tìm theo SKU.
    // Nhờ vậy đổi tên/slug sản phẩm vẫn giữ nguyên id (không vỡ FK ở order_items).
    let existing = await db
      .select()
      .from(schema.products)
      .where(eqProduct(p.slug));
    if (!existing.length) {
      existing = await db.select().from(schema.products).where(eqSku(p.sku));
    }
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
      badge: p.badge ?? null,
      status: "active" as const,
      specs: JSON.stringify(p.specs),
      faq: p.faq ? JSON.stringify(p.faq) : null,
      isFeatured: p.isFeatured ?? false,
      seoTitle: p.name,
      seoDescription: `${p.shortDescription} Giá ${(p.salePrice ?? p.price).toLocaleString("vi-VN")} đ, bảo hành 12 tháng, giao hàng 24-48h toàn quốc.`,
    };
    if (existing.length) {
      // KHÔNG ghi đè `soldCount` / `viewCount` / `ratingAverage` / `ratingCount`:
      // những số này phản ánh dữ liệu THẬT (đơn hàng, lượt xem, đánh giá).
      // Chỉ reset về 0 nếu sản phẩm chưa từng có dữ liệu thật nào.
      await db
        .update(schema.products)
        .set({
          ...values,
          soldCount: existing[0].soldCount,
          viewCount: existing[0].viewCount,
          ratingAverage: existing[0].ratingAverage,
          ratingCount: existing[0].ratingCount,
          updatedAt: new Date(),
        })
        .where(eqProduct(existing[0].slug));
    } else {
      // Sản phẩm MỚI -> mặc định 0 đã bán / 0 lượt xem / chưa có đánh giá.
      await db.insert(schema.products).values({
        ...values,
        soldCount: 0,
        viewCount: 0,
        ratingAverage: "0",
        ratingCount: 0,
      });
    }
    productCount++;
  }
  console.log(`✅ Sản phẩm: ${productCount}`);

  /* -------- Dọn sản phẩm cũ không còn trong danh mục -------- */
  const keepSlugs = SEED_PRODUCTS.map((p) => p.slug);
  const allProducts = await db.select().from(schema.products);
  const staleProducts = allProducts.filter((p) => !keepSlugs.includes(p.slug));
  for (const stale of staleProducts) {
    await db.delete(schema.products).where(eqProduct(stale.slug));
  }
  if (staleProducts.length) {
    console.log(`🧹 Đã xóa ${staleProducts.length} sản phẩm không còn trong danh mục`);
  }

  /* -------- Cập nhật snapshot đơn hàng theo SKU mới -------- */
  for (const p of SEED_PRODUCTS) {
    await db
      .update(schema.orderItems)
      .set({
        productName: p.name,
        productSlug: p.slug,
        productImage: `/products/${p.slug}.jpg`,
        sku: p.sku,
      })
      .where(eqItemSku(p.sku));
  }

  /* -------- Dọn thương hiệu cũ không còn dùng -------- */
  const keepBrands = SEED_BRANDS.map((b) => b.slug);
  const allBrands = await db.select().from(schema.brands);
  const staleBrands = allBrands.filter((b) => !keepBrands.includes(b.slug));
  for (const stale of staleBrands) {
    await db.delete(schema.brands).where(eqBrand(stale.slug));
  }
  if (staleBrands.length) {
    console.log(`🧹 Đã xóa ${staleBrands.length} thương hiệu không còn dùng`);
  }

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
      // KHÔNG seed lượt xem giả — số này chỉ tăng khi có lượt đọc THẬT.
      viewCount: existing.length ? existing[0].viewCount : 0,
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
  // KHÔNG seed hồ sơ mạng xã hội giả. Nếu chủ shop có tài khoản thật,
  // thêm trong Admin → Cài đặt website → Hồ sơ mạng xã hội.
  // Ở đây chỉ dọn các bản ghi giả còn sót từ phiên bản seed trước.
  const staleSocials = await db.select().from(schema.socialProfiles);
  for (const s of staleSocials) {
    await db
      .delete(schema.socialProfiles)
      .where(eqSocialPlatform(s.platform));
  }
  if (staleSocials.length) {
    console.log(`🧹 Đã xoá ${staleSocials.length} hồ sơ mạng xã hội mẫu`);
  }

  /* ------------------------- Demo customers ------------------------- */
  // Bảng `customers` là nguồn cho thẻ "Khách hàng" + "Tổng tích lũy" ở dashboard.
  // Đơn hàng demo cần `customer_id` trỏ tới đây để số liệu khách hàng khớp.
  const customerIds = new Map<string, number>();
  for (const c of DEMO_CUSTOMERS) {
    const existing = await db
      .select()
      .from(schema.customers)
      .where(eqCustomerPhone(c.phone));
    const values = {
      fullName: c.fullName,
      phone: c.phone,
      email: c.email,
      address: c.address,
      ward: c.address,
      district: c.district,
      city: c.city,
    };
    if (existing.length) {
      await db
        .update(schema.customers)
        .set(values)
        .where(eqCustomerPhone(c.phone));
      customerIds.set(c.phone, existing[0].id);
    } else {
      const [row] = await db
        .insert(schema.customers)
        .values({ ...values, createdAt: daysAgoDate(45) })
        .returning();
      customerIds.set(c.phone, row.id);
    }
  }
  console.log(`✅ Khách hàng demo: ${customerIds.size}`);

  /* ------------------------- Demo orders ------------------------- */
  // Đơn hàng demo có `daysAgo` tương đối (1-32 ngày trước) nên dashboard luôn
  // có số liệu cho cả bộ lọc "Hôm nay" / "7 ngày" / "Tháng này".
  const demoProducts = await db.select().from(schema.products);
  const productBySlug = new Map(demoProducts.map((p) => [p.slug, p]));
  let demoOrderCount = 0;

  // Xoá đơn hàng demo cũ (mã `TZ2501xxx` từ phiên bản seed trước) để không
  // bị trùng dữ liệu với bộ demo mới (mã `TZ-DEMO-xxxx`).
  const legacyDemoOrders = await db
    .select()
    .from(schema.orders)
    .where(like(schema.orders.orderCode, "TZ2501%"));
  for (const legacy of legacyDemoOrders) {
    await db.delete(schema.orderItems).where(eqOrderId(legacy.id));
    await db.delete(schema.orders).where(eqOrderCode(legacy.orderCode));
  }
  if (legacyDemoOrders.length) {
    console.log(`🧹 Đã xoá ${legacyDemoOrders.length} đơn hàng demo phiên bản cũ`);
  }

  for (const o of DEMO_ORDERS) {
    const product = productBySlug.get(o.productSlug);
    if (!product) continue;
    const customer = DEMO_CUSTOMERS[o.customerIndex];
    const unit = product.salePrice
      ? Number(product.salePrice)
      : Number(product.price);
    const subtotal = unit * o.quantity;
    const shipping = subtotal >= 300000 ? 0 : 30000;
    const createdAt = daysAgoDate(o.daysAgo);

    const existing = await db
      .select()
      .from(schema.orders)
      .where(eqOrderCode(o.orderCode));

    let orderId: number;
    if (existing.length) {
      await db
        .update(schema.orders)
        .set({
          customerId: customerIds.get(customer.phone) ?? null,
          fullName: customer.fullName,
          phone: customer.phone,
          email: customer.email,
          address: customer.address,
          paymentMethod: o.paymentMethod,
          paymentStatus: o.paymentStatus,
          status: o.status,
          subtotal: String(subtotal),
          shippingFee: String(shipping),
          discount: "0",
          total: String(subtotal + shipping),
          createdAt,
          updatedAt: createdAt,
        })
        .where(eqOrderCode(o.orderCode));
      orderId = existing[0].id;
    } else {
      const [row] = await db
        .insert(schema.orders)
        .values({
          orderCode: o.orderCode,
          customerId: customerIds.get(customer.phone) ?? null,
          fullName: customer.fullName,
          phone: customer.phone,
          email: customer.email,
          address: customer.address,
          paymentMethod: o.paymentMethod,
          paymentStatus: o.paymentStatus,
          status: o.status,
          subtotal: String(subtotal),
          shippingFee: String(shipping),
          discount: "0",
          total: String(subtotal + shipping),
          createdAt,
          updatedAt: createdAt,
        })
        .returning();
      orderId = row.id;
    }

    // Đơn hàng demo chỉ có 1 sản phẩm -> xoá item cũ rồi tạo lại cho sạch.
    await db.delete(schema.orderItems).where(eqOrderId(orderId));
    await db.insert(schema.orderItems).values({
      orderId,
      productId: product.id,
      productName: product.name,
      productSlug: product.slug,
      productImage: product.imageUrl,
      sku: product.sku,
      unitPrice: String(unit),
      quantity: o.quantity,
      lineTotal: String(subtotal),
    });
    demoOrderCount++;
  }
  console.log(`✅ Đơn hàng demo: ${demoOrderCount}`);

  /* ------------------------- Cập nhật tổng chi khách hàng ------------------------- */
  for (const [phone, customerId] of customerIds) {
    const custOrders = await db
      .select()
      .from(schema.orders)
      .where(eqOrderPhone(phone));
    const valid = custOrders.filter((o) => o.status !== "cancelled");
    const spent = valid.reduce((sum, o) => sum + Number(o.total), 0);
    await db
      .update(schema.customers)
      .set({ totalOrders: valid.length, totalSpent: String(spent) })
      .where(eqCustomerPhone(phone));
    void customerId;
  }

  /* ------------------------- Demo analytics (lưu lượng) ------------------------- */
  // Xoá sự kiện demo cũ trước (theo tiền tố session) rồi tạo lại theo mốc
  // thời gian tương đối -> biểu đồ & bảng "Lưu lượng khách hàng" luôn có số.
  await db
    .delete(schema.seoEvents)
    .where(like(schema.seoEvents.sessionId, `${DEMO_SESSION_PREFIX}%`));

  const demoEvents = buildDemoEvents(
    demoProducts.map((p) => ({ slug: p.slug, name: p.name })),
    30,
  );
  const productIdBySlug = new Map(demoProducts.map((p) => [p.slug, p.id]));
  for (let i = 0; i < demoEvents.length; i += 200) {
    const chunk = demoEvents.slice(i, i + 200);
    await db.insert(schema.seoEvents).values(
      chunk.map((e) => ({
        type: e.type,
        path: e.path,
        label: e.label,
        productId: e.productSlug
          ? (productIdBySlug.get(e.productSlug) ?? null)
          : null,
        value: String(e.value),
        sessionId: e.sessionId,
        createdAt: e.createdAt,
      })),
    );
  }
  console.log(`✅ Sự kiện analytics demo: ${demoEvents.length}`);

  /* ------------------------- Settings ------------------------- */
  // Chỉ lưu thông tin liên hệ THẬT. Không khai báo số điện thoại / địa chỉ
  // giả — website liên hệ qua email + form tư vấn.
  const settings = [
    { key: "brand_name", value: "TechZone" },
    { key: "brand_logo", value: "/logo.svg" },
    { key: "brand_description", value: "Chuyên phân phối phụ kiện điện thoại và công nghệ chính hãng tại Việt Nam." },
    { key: "contact_email", value: CONTACT_EMAIL },
  ];
  for (const s of settings) {
    const existing = await db
      .select()
      .from(schema.settings)
      .where(eqSetting(s.key));
    if (!existing.length) {
      await db.insert(schema.settings).values(s);
    } else {
      await db
        .update(schema.settings)
        .set({ value: s.value, updatedAt: new Date() })
        .where(eqSetting(s.key));
    }
  }
  // Dọn các setting liên hệ giả còn sót từ phiên bản seed trước.
  for (const staleKey of ["contact_phone", "contact_address"]) {
    const stale = await db
      .select()
      .from(schema.settings)
      .where(eqSetting(staleKey));
    for (const row of stale) {
      await db.delete(schema.settings).where(eqSetting(staleKey));
    }
  }
  console.log("✅ Settings");

  console.log("\n🎉 Seed hoàn tất!");
  console.log(`   Đăng nhập admin: ${adminEmail} / ${adminPassword}`);
  console.log("   Hãy chạy: npm run images:generate (nếu chưa tạo ảnh)\n");
  process.exit(0);
}

// Helper: dùng eq để tránh import nhiều lần
import { eq, like } from "drizzle-orm";
const eqEmail = (v: string) => eq(schema.users.email, v);
const eqBrand = (v: string) => eq(schema.brands.slug, v);
const eqCategory = (v: string) => eq(schema.categories.slug, v);
const eqProduct = (v: string) => eq(schema.products.slug, v);
const eqSku = (v: string) => eq(schema.products.sku, v);
const eqItemSku = (v: string) => eq(schema.orderItems.sku, v);
const eqPost = (v: string) => eq(schema.blogPosts.slug, v);
const eqKeyword = (v: string) => eq(schema.keywords.slug, v);
const eqSetting = (v: string) => eq(schema.settings.key, v);
const eqSocialPlatform = (v: string) => eq(schema.socialProfiles.platform, v);
const eqCustomerPhone = (v: string) => eq(schema.customers.phone, v);
const eqOrderCode = (v: string) => eq(schema.orders.orderCode, v);
const eqOrderPhone = (v: string) => eq(schema.orders.phone, v);
const eqOrderId = (v: number) => eq(schema.orderItems.orderId, v);

main().catch((err) => {
  console.error("❌ Lỗi seed:", err);
  process.exit(1);
});
