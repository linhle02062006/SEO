import { NextResponse } from "next/server";
import { z } from "zod";
import { getSession } from "@/lib/auth";
import {
  addAddress,
  listAddresses,
  removeAddress,
  setDefaultAddress,
} from "@/services/account-service";

export const dynamic = "force-dynamic";

const addressSchema = z.object({
  label: z.string().trim().max(60, "Nhãn quá dài").optional(),
  fullName: z
    .string()
    .trim()
    .min(2, "Họ tên phải có ít nhất 2 ký tự")
    .max(120, "Họ tên quá dài"),
  phone: z
    .string()
    .trim()
    .regex(/^(0|\+84)\d{8,11}$/, "Số điện thoại không hợp lệ"),
  address: z
    .string()
    .trim()
    .min(10, "Địa chỉ phải có ít nhất 10 ký tự")
    .max(500, "Địa chỉ quá dài"),
  ward: z.string().trim().max(120).optional().or(z.literal("")),
  district: z.string().trim().max(120).optional().or(z.literal("")),
  city: z.string().trim().max(120).optional().or(z.literal("")),
  isDefault: z.boolean().optional(),
});

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { ok: false, message: "Bạn cần đăng nhập để thực hiện thao tác này." },
        { status: 401 },
      );
    }

    const addresses = await listAddresses(session.sub);
    return NextResponse.json({ ok: true, addresses });
  } catch (err) {
    console.error("[api/account/addresses] Lỗi:", err);
    return NextResponse.json(
      { ok: false, message: "Không tải được danh sách địa chỉ." },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { ok: false, message: "Bạn cần đăng nhập để thực hiện thao tác này." },
        { status: 401 },
      );
    }

    const body = await request.json();
    const parsed = addressSchema.safeParse(body);
    if (!parsed.success) {
      const errors: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const key = String(issue.path[0] ?? "form");
        if (!errors[key]) errors[key] = issue.message;
      }
      return NextResponse.json(
        { ok: false, message: "Vui lòng kiểm tra lại thông tin.", errors },
        { status: 400 },
      );
    }

    await addAddress(session.sub, {
      label: parsed.data.label || "Mặc định",
      fullName: parsed.data.fullName,
      phone: parsed.data.phone,
      address: parsed.data.address,
      ward: parsed.data.ward || null,
      district: parsed.data.district || null,
      city: parsed.data.city || null,
      isDefault: parsed.data.isDefault,
    });

    const addresses = await listAddresses(session.sub);
    return NextResponse.json({
      ok: true,
      message: "Thêm địa chỉ thành công.",
      addresses,
    });
  } catch (err) {
    console.error("[api/account/addresses] Lỗi:", err);
    return NextResponse.json(
      { ok: false, message: "Không lưu được địa chỉ. Vui lòng thử lại." },
      { status: 500 },
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { ok: false, message: "Bạn cần đăng nhập để thực hiện thao tác này." },
        { status: 401 },
      );
    }

    const body = await request.json();
    const id = Number(body?.id);
    if (!Number.isInteger(id) || id <= 0) {
      return NextResponse.json(
        { ok: false, message: "Địa chỉ không hợp lệ." },
        { status: 400 },
      );
    }

    await removeAddress(session.sub, id);
    const addresses = await listAddresses(session.sub);
    return NextResponse.json({
      ok: true,
      message: "Đã xoá địa chỉ.",
      addresses,
    });
  } catch (err) {
    console.error("[api/account/addresses] Lỗi:", err);
    return NextResponse.json(
      { ok: false, message: "Không xoá được địa chỉ. Vui lòng thử lại." },
      { status: 500 },
    );
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { ok: false, message: "Bạn cần đăng nhập để thực hiện thao tác này." },
        { status: 401 },
      );
    }

    const body = await request.json();
    const id = Number(body?.id);
    if (!Number.isInteger(id) || id <= 0) {
      return NextResponse.json(
        { ok: false, message: "Địa chỉ không hợp lệ." },
        { status: 400 },
      );
    }

    await setDefaultAddress(session.sub, id);
    const addresses = await listAddresses(session.sub);
    return NextResponse.json({
      ok: true,
      message: "Đã đặt địa chỉ mặc định.",
      addresses,
    });
  } catch (err) {
    console.error("[api/account/addresses] Lỗi:", err);
    return NextResponse.json(
      { ok: false, message: "Không cập nhật được địa chỉ. Vui lòng thử lại." },
      { status: 500 },
    );
  }
}
