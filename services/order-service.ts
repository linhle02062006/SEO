import { and, asc, desc, eq, sql } from "drizzle-orm";
import { getDb } from "@/database/db";
import {
  customers,
  blogPosts,
  orderItems,
  orders,
  products,
  type Customer,
  type Order,
  type OrderItem,
  type OrderStatus,
  type PaymentMethod,
} from "@/database/schema";

export type OrderWithRelations = Order & {
  items: (OrderItem & { product: { name: string; slug: string; imageUrl: string | null } | null })[];
  customer: Customer | null;
};

export type OrderItemInput = {
  productId: number;
  name: string;
  slug: string;
  image: string | null;
  sku: string;
  price: number;
  salePrice: number | null;
  quantity: number;
};

/** Sinh mã đơn hàng dạng TZ + timestamp: TZ250105A1B2C3 */
export function generateOrderCode(): string {
  const now = new Date();
  const y = String(now.getFullYear()).slice(-2);
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  const rand = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `TZ${y}${m}${d}${rand}`;
}

export function calculateTotals(
  items: OrderItemInput[],
  shippingFee: number,
  discount = 0,
) {
  const subtotal = items.reduce((sum, it) => {
    const unit = it.salePrice != null && it.salePrice < it.price ? it.salePrice : it.price;
    return sum + unit * it.quantity;
  }, 0);
  const total = Math.max(0, subtotal + shippingFee - discount);
  return { subtotal, shippingFee, discount, total };
}

export type CreateOrderInput = {
  fullName: string;
  phone: string;
  email?: string | null;
  address: string;
  note?: string | null;
  paymentMethod: PaymentMethod;
  items: OrderItemInput[];
  shippingFee: number;
  discount?: number;
  userId?: number | null;
};

export async function createOrder(
  input: CreateOrderInput,
): Promise<{ order: OrderWithRelations; orderCode: string }> {
  const db = await getDb();

  // Tìm hoặc tạo customer theo số điện thoại
  let customer = await db
    .select()
    .from(customers)
    .where(eq(customers.phone, input.phone))
    .limit(1);
  let customerId = customer[0]?.id ?? null;

  if (!customer.length) {
    const inserted = await db
      .insert(customers)
      .values({
        userId: input.userId ?? null,
        fullName: input.fullName,
        phone: input.phone,
        email: input.email ?? null,
        address: input.address,
      })
      .returning();
    customerId = inserted[0].id;
  } else {
    await db
      .update(customers)
      .set({
        fullName: input.fullName,
        address: input.address,
        // Gắn tài khoản nếu khách đang đăng nhập và record chưa có.
        ...(input.userId && !customer[0].userId
          ? { userId: input.userId }
          : {}),
      })
      .where(eq(customers.id, customerId!));
  }

  const { subtotal, shippingFee, discount, total } = calculateTotals(
    input.items,
    input.shippingFee,
    input.discount ?? 0,
  );

  const orderCode = generateOrderCode();

  const insertedOrders = await db
    .insert(orders)
    .values({
      orderCode,
      customerId,
      userId: input.userId ?? null,
      fullName: input.fullName,
      phone: input.phone,
      email: input.email ?? null,
      address: input.address,
      note: input.note ?? null,
      paymentMethod: input.paymentMethod,
      status: "pending",
      subtotal: String(subtotal),
      shippingFee: String(shippingFee),
      discount: String(discount),
      total: String(total),
    })
    .returning();

  const order = insertedOrders[0];

  await db.insert(orderItems).values(
    input.items.map((it) => {
      const unit = it.salePrice != null && it.salePrice < it.price ? it.salePrice : it.price;
      return {
        orderId: order.id,
        productId: it.productId,
        productName: it.name,
        productSlug: it.slug,
        productImage: it.image,
        sku: it.sku,
        unitPrice: String(unit),
        quantity: it.quantity,
        lineTotal: String(unit * it.quantity),
      };
    }),
  );

  // Cập nhật tồn kho + số lượng đã bán
  for (const it of input.items) {
    await db
      .update(products)
      .set({
        stock: sql`GREATEST(0, ${products.stock} - ${it.quantity})`,
        soldCount: sql`${products.soldCount} + ${it.quantity}`,
        updatedAt: new Date(),
      })
      .where(eq(products.id, it.productId));
  }

  // Cập nhật tổng chi tiêu khách hàng
  await db
    .update(customers)
    .set({
      totalOrders: sql`${customers.totalOrders} + 1`,
      totalSpent: sql`${customers.totalSpent} + ${total}`,
    })
    .where(eq(customers.id, customerId!));

  const full = await getOrderByCode(orderCode);
  return { order: full!, orderCode };
}

export async function getOrderByCode(code: string): Promise<OrderWithRelations | null> {
  const db = await getDb();
  const rows = await db
    .select({ order: orders, customer: customers })
    .from(orders)
    .leftJoin(customers, eq(orders.customerId, customers.id))
    .where(eq(orders.orderCode, code))
    .limit(1);
  if (!rows.length) return null;

  const items = await db
    .select({ item: orderItems, product: products })
    .from(orderItems)
    .leftJoin(products, eq(orderItems.productId, products.id))
    .where(eq(orderItems.orderId, rows[0].order.id));

  return {
    ...rows[0].order,
    customer: rows[0].customer ?? null,
    items: items.map((r) => ({
      ...r.item,
      product: r.product
        ? {
            name: r.product.name,
            slug: r.product.slug,
            imageUrl: r.product.imageUrl,
          }
        : null,
    })),
  };
}

export async function getOrders(filters?: {
  status?: OrderStatus;
  q?: string;
  page?: number;
  limit?: number;
}) {
  const db = await getDb();
  const page = Math.max(1, filters?.page ?? 1);
  const limit = filters?.limit ?? 20;

  const conditions = [];
  if (filters?.status) conditions.push(eq(orders.status, filters.status));

  const where = conditions.length ? and(...conditions) : undefined;

  const rows = await db
    .select({ order: orders, customer: customers })
    .from(orders)
    .leftJoin(customers, eq(orders.customerId, customers.id))
    .where(where)
    .orderBy(desc(orders.createdAt))
    .limit(limit)
    .offset((page - 1) * limit);

  const [{ total }] = await db
    .select({ total: sql<number>`count(*)` })
    .from(orders)
    .where(where);

  return {
    items: rows.map((r) => ({ ...r.order, customer: r.customer ?? null })),
    total: Number(total),
    page,
    limit,
    totalPages: Math.max(1, Math.ceil(Number(total) / limit)),
  };
}

export async function getOrderById(id: number): Promise<OrderWithRelations | null> {
  const db = await getDb();
  const rows = await db
    .select({ order: orders, customer: customers })
    .from(orders)
    .leftJoin(customers, eq(orders.customerId, customers.id))
    .where(eq(orders.id, id))
    .limit(1);
  if (!rows.length) return null;

  const items = await db
    .select({ item: orderItems, product: products })
    .from(orderItems)
    .leftJoin(products, eq(orderItems.productId, products.id))
    .where(eq(orderItems.orderId, id));

  return {
    ...rows[0].order,
    customer: rows[0].customer ?? null,
    items: items.map((r) => ({
      ...r.item,
      product: r.product
        ? { name: r.product.name, slug: r.product.slug, imageUrl: r.product.imageUrl }
        : null,
    })),
  };
}

export async function updateOrderStatus(id: number, status: OrderStatus) {
  const db = await getDb();
  await db
    .update(orders)
    .set({ status, updatedAt: new Date() })
    .where(eq(orders.id, id));
}

export async function getRecentOrders(limit = 5) {
  const db = await getDb();
  return db
    .select({ order: orders, customer: customers })
    .from(orders)
    .leftJoin(customers, eq(orders.customerId, customers.id))
    .orderBy(desc(orders.createdAt))
    .limit(limit)
    .then((rows) => rows.map((r) => ({ ...r.order, customer: r.customer ?? null })));
}

/* ------------------------------------------------------------------ */
/* Dashboard stats                                                      */
/* ------------------------------------------------------------------ */

export async function getDashboardStats(range?: { from: Date; to: Date }) {
  const db = await getDb();
  const from = range?.from ?? new Date(Date.now() - 30 * 24 * 3600 * 1000);
  const to = range?.to ?? new Date();

  const [revenueRows] = await db
    .select({
      revenue: sql<number>`COALESCE(SUM(${orders.total}), 0)`,
      orderCount: sql<number>`count(*)`,
    })
    .from(orders)
    .where(
      and(
        sql`${orders.status} <> 'cancelled'`,
        sql`${orders.createdAt} >= ${from}`,
        sql`${orders.createdAt} <= ${to}`,
      ),
    );

  const [allTimeRows] = await db
    .select({
      revenue: sql<number>`COALESCE(SUM(${orders.total}), 0)`,
      orderCount: sql<number>`count(*)`,
    })
    .from(orders)
    .where(sql`${orders.status} <> 'cancelled'`);

  const [productCount] = await db
    .select({ total: sql<number>`count(*)` })
    .from(products)
    .where(eq(products.status, "active"));

  const [customerCount] = await db
    .select({ total: sql<number>`count(*)` })
    .from(customers);

  const [postCount] = await db
    .select({ total: sql<number>`count(*)` })
    .from(blogPosts)
    .where(eq(blogPosts.isPublished, true));

  const topProducts = await db
    .select({
      id: products.id,
      name: products.name,
      slug: products.slug,
      imageUrl: products.imageUrl,
      price: products.price,
      salePrice: products.salePrice,
      soldCount: products.soldCount,
      viewCount: products.viewCount,
      stock: products.stock,
    })
    .from(products)
    .orderBy(desc(products.soldCount))
    .limit(5);

  const daily = await db
    .select({
      day: sql<string>`to_char(date_trunc('day', ${orders.createdAt}), 'YYYY-MM-DD')`,
      revenue: sql<number>`COALESCE(SUM(${orders.total}), 0)`,
      orders: sql<number>`count(*)`,
    })
    .from(orders)
    .where(
      and(
        sql`${orders.status} <> 'cancelled'`,
        sql`${orders.createdAt} >= ${from}`,
      ),
    )
    .groupBy(sql`date_trunc('day', ${orders.createdAt})`)
    .orderBy(sql`date_trunc('day', ${orders.createdAt})`);

  const pendingOrders = await db
    .select({ total: sql<number>`count(*)` })
    .from(orders)
    .where(eq(orders.status, "pending"));

  return {
    revenue: Number(revenueRows.revenue),
    orderCount: Number(revenueRows.orderCount),
    totalRevenue: Number(allTimeRows.revenue),
    totalOrders: Number(allTimeRows.orderCount),
    productCount: Number(productCount.total),
    customerCount: Number(customerCount.total),
    postCount: Number(postCount.total),
    pendingOrderCount: Number(pendingOrders[0]?.total ?? 0),
    topProducts,
    dailyRevenue: daily.map((d) => ({
      day: d.day,
      revenue: Number(d.revenue),
      orders: Number(d.orders),
    })),
  };
}
