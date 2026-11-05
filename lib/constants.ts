export const ORDER_STATUS_LABEL: Record<string, string> = {
  pending: "Chờ xác nhận",
  confirmed: "Đã xác nhận",
  shipping: "Đang giao",
  delivered: "Đã giao",
  cancelled: "Đã hủy",
};

export const ORDER_STATUS_TONE: Record<string, string> = {
  pending: "bg-amber-50 text-amber-700 ring-amber-600/20",
  confirmed: "bg-blue-50 text-blue-700 ring-blue-600/20",
  shipping: "bg-indigo-50 text-indigo-700 ring-indigo-600/20",
  delivered: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  cancelled: "bg-rose-50 text-rose-700 ring-rose-600/20",
};

export const PAYMENT_METHOD_LABEL: Record<string, string> = {
  cod: "Thanh toán khi nhận hàng (COD)",
  bank_transfer: "Chuyển khoản ngân hàng",
};

export const PAYMENT_STATUS_LABEL: Record<string, string> = {
  unpaid: "Chưa thanh toán",
  paid: "Đã thanh toán",
  refunded: "Đã hoàn tiền",
};

export const PRODUCT_STATUS_LABEL: Record<string, string> = {
  active: "Đang bán",
  hidden: "Đã ẩn",
  draft: "Nháp",
};

export const ORDER_STATUS_OPTIONS = [
  { value: "pending", label: "Chờ xác nhận" },
  { value: "confirmed", label: "Đã xác nhận" },
  { value: "shipping", label: "Đang giao" },
  { value: "delivered", label: "Đã giao" },
  { value: "cancelled", label: "Đã hủy" },
] as const;
