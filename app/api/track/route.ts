import { NextResponse } from "next/server";
import { trackEvent } from "@/services/seo-service";

export const dynamic = "force-dynamic";

const ALLOWED = new Set([
  "page_view",
  "view_item",
  "search",
  "add_to_cart",
  "begin_checkout",
  "purchase",
]);

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!ALLOWED.has(body?.type)) {
      return NextResponse.json({ ok: false }, { status: 400 });
    }

    await trackEvent({
      type: body.type,
      path: String(body.path ?? "/").slice(0, 400),
      label: body.label ? String(body.label).slice(0, 240) : null,
      productId: body.productId ? Number(body.productId) : null,
      value: Number(body.value ?? 0),
      sessionId: body.sessionId ? String(body.sessionId).slice(0, 64) : null,
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
}
