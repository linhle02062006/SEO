"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { updateOrderStatus } from "@/services/order-service";
import type { ActionState } from "@/app/admin/action-state";

const schema = z.object({
  id: z.coerce.number().int().positive(),
  status: z.enum(["pending", "confirmed", "shipping", "delivered", "cancelled"]),
});

export async function updateOrderStatusAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = schema.safeParse({
    id: formData.get("id"),
    status: formData.get("status"),
  });

  if (!parsed.success) {
    return { ok: false, message: "Trạng thái không hợp lệ." };
  }

  try {
    await updateOrderStatus(parsed.data.id, parsed.data.status);
    revalidatePath("/admin/don-hang");
    revalidatePath(`/admin/don-hang/${parsed.data.id}`);
    revalidatePath("/admin");
    return { ok: true, message: "Đã cập nhật trạng thái đơn hàng." };
  } catch (err) {
    console.error("[admin] updateOrderStatus:", err);
    return { ok: false, message: "Không thể cập nhật trạng thái." };
  }
}
