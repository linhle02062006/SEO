import { and, asc, desc, eq, sql } from "drizzle-orm";
import { getDb } from "@/database/db";
import { seoEvents, socialProfiles } from "@/database/schema";

/* ------------------------------------------------------------------ */
/* Social entity                                                        */
/* ------------------------------------------------------------------ */

export async function getSocialProfiles() {
  const db = await getDb();
  return db.select().from(socialProfiles).orderBy(asc(socialProfiles.platform));
}

export async function upsertSocialProfile(data: {
  platform: string;
  url: string;
  handle?: string | null;
  isPrimary?: boolean;
  isActive?: boolean;
}) {
  const db = await getDb();
  const [row] = await db
    .insert(socialProfiles)
    .values({
      platform: data.platform,
      url: data.url,
      handle: data.handle ?? null,
      isPrimary: data.isPrimary ?? false,
      isActive: data.isActive ?? true,
    })
    .onConflictDoUpdate({
      target: socialProfiles.platform,
      set: {
        url: data.url,
        handle: data.handle ?? null,
        isPrimary: data.isPrimary ?? false,
        isActive: data.isActive ?? true,
        updatedAt: new Date(),
      },
    })
    .returning();
  return row;
}

export async function deleteSocialProfile(id: number) {
  const db = await getDb();
  await db.delete(socialProfiles).where(eq(socialProfiles.id, id));
}

/* ------------------------------------------------------------------ */
/* Analytics events (nội bộ)                                            */
/* ------------------------------------------------------------------ */

export async function trackEvent(data: {
  type:
    | "page_view"
    | "view_item"
    | "search"
    | "add_to_cart"
    | "begin_checkout"
    | "purchase";
  path: string;
  label?: string | null;
  productId?: number | null;
  value?: number;
  sessionId?: string | null;
}) {
  const db = await getDb();
  await db.insert(seoEvents).values({
    type: data.type,
    path: data.path.slice(0, 400),
    label: data.label?.slice(0, 240) ?? null,
    productId: data.productId ?? null,
    value: String(data.value ?? 0),
    sessionId: data.sessionId ?? null,
  });
}

export async function getAnalyticsSummary(range?: { from: Date; to: Date }) {
  const db = await getDb();
  const from = range?.from ?? new Date(Date.now() - 30 * 24 * 3600 * 1000);
  const to = range?.to ?? new Date();

  const rows = await db
    .select({
      type: seoEvents.type,
      total: sql<number>`count(*)`,
      value: sql<number>`COALESCE(SUM(${seoEvents.value}), 0)`,
    })
    .from(seoEvents)
    .where(
      and(
        sql`${seoEvents.createdAt} >= ${from}`,
        sql`${seoEvents.createdAt} <= ${to}`,
      ),
    )
    .groupBy(seoEvents.type);

  const map: Record<string, { count: number; value: number }> = {
    page_view: { count: 0, value: 0 },
    view_item: { count: 0, value: 0 },
    search: { count: 0, value: 0 },
    add_to_cart: { count: 0, value: 0 },
    begin_checkout: { count: 0, value: 0 },
    purchase: { count: 0, value: 0 },
  };
  for (const r of rows) {
    map[r.type] = { count: Number(r.total), value: Number(r.value) };
  }

  const daily = await db
    .select({
      day: sql<string>`to_char(date_trunc('day', ${seoEvents.createdAt}), 'YYYY-MM-DD')`,
      views: sql<number>`count(*) FILTER (WHERE ${seoEvents.type} = 'page_view')`,
      carts: sql<number>`count(*) FILTER (WHERE ${seoEvents.type} = 'add_to_cart')`,
      purchases: sql<number>`count(*) FILTER (WHERE ${seoEvents.type} = 'purchase')`,
    })
    .from(seoEvents)
    .where(sql`${seoEvents.createdAt} >= ${from}`)
    .groupBy(sql`date_trunc('day', ${seoEvents.createdAt})`)
    .orderBy(sql`date_trunc('day', ${seoEvents.createdAt})`);

  const topSearches = await db
    .select({
      label: seoEvents.label,
      total: sql<number>`count(*)`,
    })
    .from(seoEvents)
    .where(eq(seoEvents.type, "search"))
    .groupBy(seoEvents.label)
    .orderBy(desc(sql`count(*)`))
    .limit(10);

  const topViewed = await db
    .select({
      productId: seoEvents.productId,
      label: seoEvents.label,
      total: sql<number>`count(*)`,
    })
    .from(seoEvents)
    .where(eq(seoEvents.type, "view_item"))
    .groupBy(seoEvents.productId, seoEvents.label)
    .orderBy(desc(sql`count(*)`))
    .limit(10);

  return {
    events: map,
    daily: daily.map((d) => ({
      day: d.day,
      views: Number(d.views),
      carts: Number(d.carts),
      purchases: Number(d.purchases),
    })),
    topSearches: topSearches.map((t) => ({
      label: t.label ?? "",
      total: Number(t.total),
    })),
    topViewed: topViewed.map((t) => ({
      productId: t.productId,
      label: t.label ?? "",
      total: Number(t.total),
    })),
  };
}

