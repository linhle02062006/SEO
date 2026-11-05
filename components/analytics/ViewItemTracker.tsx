"use client";

import { useEffect } from "react";
import { trackClientEvent } from "@/lib/analytics-client";

/**
 * Ghi nhận event `view_item` (GA4 + nội bộ) khi người dùng mở trang sản phẩm.
 * Chỉ fire 1 lần cho mỗi lần mount component (tức mỗi lần vào trang sản phẩm).
 */
export function ViewItemTracker({
  productId,
  productName,
  price,
}: {
  productId: number;
  productName: string;
  price: number;
}) {
  useEffect(() => {
    trackClientEvent("view_item", {
      productId,
      value: price,
      label: productName,
    });
  }, [productId, productName, price]);

  return null;
}
