/**
 * Kiểu dữ liệu dùng chung cho các Server Action trong admin.
 * Tách riêng khỏi file "use server" vì thư mục đó chỉ được export async function.
 */

export type ActionState = {
  ok: boolean;
  message: string;
  errors?: Record<string, string>;
};

export const emptyState: ActionState = { ok: false, message: "" };
