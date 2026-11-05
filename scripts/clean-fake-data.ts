/**
 * Dọn dữ liệu ảo đã từng được seed (rating, số lượt bán, số lượng xem,
 * số điện thoại & địa chỉ giả trong bảng `settings`).
 *
 * Chạy: npm run db:clean-fake
 *
 * LƯU Ý AN TOÀN:
 * - Chỉ xoá `rating_average`/`rating_count` khi bảng `product_reviews` KHÔNG
 *   có bản ghi nào cho sản phẩm đó (tức là số liệu chắc chắn là seed giả).
 * - `sold_count` được tính lại từ `order_items` của các đơn hàng THẬT
 *   (không tính đơn demo `TZ-DEMO-*`), nên số lượt bán luôn khớp dữ liệu.
 * - `view_count` được tính lại từ sự kiện `view_item` có `session_id` KHÔNG bắt
 *   đầu bằng `demo-` (tức là lượt xem thật từ người dùng).
 */
import "./load-env";
import { getStandaloneDb } from "../database/db";
import * as schema from "../database/schema";
import { eq, like, sql } from "drizzle-orm";
import { DEMO_SESSION_PREFIX } from "../database/seed-data/demo";

async function main() {
  const db = await getStandaloneDb();
  console.log("🧹 Bắt đầu dọn dữ liệu ảo...");

  /* -------- 1. Xoá hồ sơ mạng xã hội giả -------- */
  const socials = await db.select().from(schema.socialProfiles);
  for (const s of socials) {
    await db
      .delete(schema.socialProfiles)
      .where(eq(schema.socialProfiles.platform, s.platform));
  }
  if (socials.length) {
    console.log(`✅ Đã xoá ${socials.length} hồ sơ mạng xã hội mẫu`);
  }

  /* -------- 2. Xoá setting liên hệ giả -------- */
  for (const key of ["contact_phone", "contact_address"]) {
    await db.delete(schema.settings).where(eq(schema.settings.key, key));
  }
  await db
    .update(schema.settings)
    .set({
      value:
        process.env.CONTACT_EMAIL?.trim() ||
        process.env.NEXT_PUBLIC_CONTACT_EMAIL?.trim() ||
        "1350080137@sv.hcmunre.edu.vn",
      updatedAt: new Date(),
    })
    .where(eq(schema.settings.key, "contact_email"));
  console.log("✅ Đã cập nhật contact_email + xoá contact_phone/contact_address");

  /* -------- 3. Xoá số điện thoại / địa chỉ giả trong demo customers -------- */
  const customers = await db.select().from(schema.customers);
  for (const c of customers) {
    await db
      .update(schema.customers)
      .set({ address: "", ward: "", district: "", city: "" })
      .where(eq(schema.customers.id, c.id));
  }
  if (customers.length) {
    console.log(`✅ Đã xoá địa chỉ mẫu của ${customers.length} khách hàng demo`);
  }

  /* -------- 4. Reset rating cho sản phẩm không có đánh giá thật -------- */
  const products = await db.select().from(schema.products);
  let ratingCleared = 0;
  for (const p of products) {
    const real = await db
      .select({ id: schema.productReviews.id })
      .from(schema.productReviews)
      .where(eq(schema.productReviews.productId, p.id))
      .limit(1);
    if (real.length) continue; // có đánh giá thật -> giữ nguyên
    await db
      .update(schema.products)
      .set({ ratingAverage: "0", ratingCount: 0, updatedAt: new Date() })
      .where(eq(schema.products.id, p.id));
    ratingCleared++;
  }
  console.log(
    `✅ Đã reset rating của ${ratingCleared} sản phẩm (không có đánh giá thật)`,
  );

  /* -------- 5. Tính lại sold_count từ đơn hàng THẬT -------- */
  await db.execute(sql`
    UPDATE products p SET sold_count = COALESCE((
      SELECT SUM(oi.quantity)
      FROM order_items oi
      JOIN orders o ON o.id = oi.order_id
      WHERE oi.product_id = p.id
        AND o.status <> 'cancelled'
        AND o.order_code NOT LIKE 'TZ-DEMO-%'
    ), 0)
  `);
  console.log("✅ Đã tính lại sold_count từ đơn hàng thật (bỏ qua đơn demo)");

  /* -------- 6. Tính lại view_count từ lượt xem thật -------- */
  await db.execute(sql`
    UPDATE products p SET view_count = COALESCE((
      SELECT COUNT(*)
      FROM seo_events e
      WHERE e.type = 'view_item'
        AND e.product_id = p.id
        AND (e.session_id IS NULL OR e.session_id NOT LIKE ${`${DEMO_SESSION_PREFIX}%`})
    ), 0)
  `);
  console.log(
    "✅ Đã tính lại view_count từ lượt xem thật (bỏ qua dữ liệu demo)",
  );

  /* -------- 7. Xoá lượt xem của blog nếu chỉ là số seed tĩnh -------- */
  await db
    .delete(schema.seoEvents)
    .where(like(schema.seoEvents.sessionId, `${DEMO_SESSION_PREFIX}%`));
  console.log("✅ Đã xoá sự kiện analytics demo (chỉ giữ dữ liệu thật)");

  console.log("\n🎉 Dọn dữ liệu ảo hoàn tất!");
  console.log(
    "   Chạy `npm run db:seed` sau đó để nạp lại dữ liệu demo sạch.",
  );
  process.exit(0);
}

main().catch((err) => {
  console.error("❌ Lỗi:", err);
  process.exit(1);
});
