"use client";

import { useEffect } from "react";

/**
 * Gửi event lên GA4 (nếu có) + ghi nhận nội bộ qua API route.
 * Không gây lỗi khi chưa cấu hình GA_ID.
 */
export function trackGaEvent(
  eventName:
    | "view_item"
    | "search"
    | "add_to_cart"
    | "begin_checkout"
    | "purchase"
    | "page_view",
  params: {
    productId?: number;
    value?: number;
    label?: string;
    currency?: string;
    [key: string]: unknown;
  } = {},
) {
  if (typeof window === "undefined") return;
  const gtag = (window as any).gtag;
  if (!gtag) return;
  const eventParams: Record<string, unknown> = {
    ...params,
    currency: params.currency ?? "VND",
  };
  if (params.productId) {
    eventParams.item_id = String(params.productId);
    eventParams.items = [
      { item_id: String(params.productId), item_name: params.label ?? "" },
    ];
  }
  gtag("event", eventName, eventParams);
}

export function trackClientEvent(
  eventName:
    | "view_item"
    | "search"
    | "add_to_cart"
    | "begin_checkout"
    | "purchase",
  params: {
    productId?: number;
    value?: number;
    label?: string;
    currency?: string;
    [key: string]: unknown;
  } = {},
) {
  // 1) GA4
  trackGaEvent(eventName, params);

  // 2) Ghi nhận nội bộ (fallback khi chưa có GA4, và để đối chiếu số liệu)
  if (typeof window === "undefined") return;
  const payload = JSON.stringify({
    type: eventName,
    path: window.location.pathname,
    label: params.label ?? null,
    productId: params.productId ?? null,
    value: params.value ?? 0,
    sessionId: getSessionId(),
  });
  if (navigator.sendBeacon) {
    navigator.sendBeacon("/api/track", new Blob([payload], { type: "application/json" }));
  } else {
    fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: payload,
      keepalive: true,
    }).catch(() => undefined);
  }
}

export function getSessionId(): string {
  if (typeof window === "undefined") return "";
  try {
    let id = window.localStorage.getItem("tz_session_id");
    if (!id) {
      id = `s_${Math.random().toString(36).slice(2, 11)}${Date.now().toString(36)}`;
      window.localStorage.setItem("tz_session_id", id);
    }
    return id;
  } catch {
    return "";
  }
}

/** Hook ghi sự kiện page_view mỗi khi điều hướng (SPA) */
export function usePageViewTracking() {
  useEffect(() => {
    // page_view do Analytics component gửi tự động qua usePathname
  }, []);
}
