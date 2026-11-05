import { z } from "zod";
import { createOrder } from "@/services/order-service";
import { getProductById } from "@/services/product-service";
import { trackEvent } from "@/services/seo-service";

export const orderItemSchema = z.object({
  productId: z.number().int().positive(),
  quantity: z.number().int().min(1).max(99),
});

export const checkoutSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, "Họ tên phải có ít nhất 2 ký tự")
    .max(120, "Họ tên quá dài"),
  phone: z
    .string()
    .trim()
    .regex(/^(0|\+84)\d{8,11}$/, "Số điện thoại không hợp lệ"),
  email: z
    .string()
    .trim()
    .email("Email không hợp lệ")
    .optional()
    .or(z.literal("")),
  address: z
    .string()
    .trim()
    .min(10, "Địa chỉ phải có ít nhất 10 ký tự")
    .max(500, "Địa chỉ quá dài"),
  note: z.string().trim().max(1000, "Ghi chú quá dài").optional(),
  paymentMethod: z.enum(["cod", "bank_transfer"]),
  items: z.array(orderItemSchema).min(1, "Giỏ hàng đang trống"),
});

export type CheckoutInput = z.infer<typeof checkoutSchema>;

export type CheckoutResult =
  | { ok: true; orderCode: string; total: number }
  | { ok: false; message: string; errors?: Record<string, string> };

/**
 * Tạo đơn hàng từ dữ liệu giỏ hàng do client gửi lên.
 * Giá & tồn kho LUÔN được lấy lại từ database để không bị thao túng.
 */
export async function submitOrder(
  raw: unknown,
): Promise<CheckoutResult> {
  const parsed = checkoutSchema.safeParse(raw);
  if (!parsed.success) {
    const errors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] ?? "form");
      if (!errors[key]) errors[key] = issue.message;
    }
    return {
      ok: false,
      message: "Vui lòng kiểm tra lại thông tin đặt hàng.",
      errors,
    };
  }

  const input = parsed.data;

  try {
    // Lấy giá & thông tin thật từ database
    const items = [];
    for (const it of input.items) {
      const product = await getProductById(it.productId);
      if (!product || product.status !== "active") {
        return {
          ok: false,
          message: "Một sản phẩm trong giỏ hàng không còn khả dụng.",
        };
      }
      if (product.stock < it.quantity) {
        return {
          ok: false,
          message: `Sản phẩm "${product.name}" chỉ còn ${product.stock} trong kho.`,
        };
      }
      items.push({
        productId: product.id,
        name: product.name,
        slug: product.slug,
        image: product.imageUrl,
        sku: product.sku,
        price: Number(product.price),
        salePrice: product.salePrice != null ? Number(product.salePrice) : null,
        quantity: it.quantity,
      });
    }

    const subtotal = items.reduce((sum, it) => {
      const unit =
        it.salePrice != null && it.salePrice < it.price ? it.salePrice : it.price;
      return sum + unit * it.quantity;
    }, 0);

    const shippingFee = subtotal >= 300000 || subtotal === 0 ? 0 : 30000;

    const { order, orderCode } = await createOrder({
      fullName: input.fullName,
      phone: input.phone,
      email: input.email || null,
      address: input.address,
      note: input.note || null,
      paymentMethod: input.paymentMethod,
      items,
      shippingFee,
    });

    // Ghi nhận event purchase (đo lường nội bộ)
    await trackEvent({
      type: "purchase",
      path: "/dat-hang",
      label: orderCode,
      value: Number(order.total),
    }).catch(() => undefined);

    return { ok: true, orderCode, total: Number(order.total) };
  } catch (err) {
    console.error("[checkout] Lỗi tạo đơn hàng:", err);
    return {
      ok: false,
      message:
        "Hệ thống đang bận, vui lòng thử lại sau ít phút hoặc liên hệ hotline.",
    };
  }
}
