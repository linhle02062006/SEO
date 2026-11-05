"use client";

import { useEffect } from "react";
import { trackGaEvent } from "@/lib/analytics-client";

/**
 * Gửi event `purchase` lên GA4 sau khi đơn hàng thành công.
 * Event nội bộ (bảng seo_events) đã được ghi ở server action checkout.
 */
export function PurchaseTracker({
  orderCode,
  value,
  items,
}: {
  orderCode: string;
  value: number;
  items: { id: number; name: string; quantity: number }[];
}) {
  useEffect(() => {
    trackGaEvent("purchase", {
      transaction_id: orderCode,
      value,
      currency: "VND",
      items: items.map((i) => ({
        item_id: String(i.id),
        item_name: i.name,
        quantity: i.quantity,
      })),
    });
  }, [orderCode, value, items]);

  return null;
}
