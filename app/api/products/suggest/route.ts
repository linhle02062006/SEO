import { NextResponse } from "next/server";
import { searchSuggestions } from "@/services/catalog-service";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q")?.trim() ?? "";

  if (q.length < 2) {
    return NextResponse.json({ ok: true, data: [] });
  }

  try {
    const rows = await searchSuggestions(q, 6);
    return NextResponse.json({
      ok: true,
      data: rows.map((r) => ({
        id: r.id,
        name: r.name,
        slug: r.slug,
        imageUrl: r.imageUrl,
        price: r.price,
        salePrice: r.salePrice,
      })),
    });
  } catch {
    return NextResponse.json(
      { ok: false, message: "Không tải được gợi ý tìm kiếm" },
      { status: 500 },
    );
  }
}
