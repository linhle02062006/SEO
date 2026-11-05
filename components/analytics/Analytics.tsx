"use client";

import Script from "next/script";
import { usePathname, useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";

/**
 * Gửi event `page_view` mỗi khi điều hướng phía client (SPA).
 * GA4 được cấu hình với `send_page_view: false` nên ta tự gửi,
 * tránh đếm trùng lần view đầu tiên do gtag.js tự bắn.
 */
function PageViewTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const query = searchParams?.toString();
    const page = query ? `${pathname}?${query}` : pathname;

    if (typeof window !== "undefined") {
      // Push thẳng vào dataLayer để không mất event nếu gtag.js chưa sẵn sàng.
      const w = window as any;
      w.dataLayer = w.dataLayer || [];
      w.dataLayer.push([
        "event",
        "page_view",
        {
          page_path: page,
          page_location: window.location.href,
          page_referrer: document.referrer || undefined,
          page_title: document.title,
        },
      ]);
    }

    // Ghi nhận nội bộ (bảng seo_events) để đối chiếu số liệu.
    fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "page_view",
        path: page,
        sessionId: getSessionIdSafe(),
      }),
      keepalive: true,
    }).catch(() => undefined);
  }, [pathname, searchParams]);

  return null;
}

function getSessionIdSafe(): string {
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

/**
 * Google Analytics 4.
 *
 * - `NEXT_PUBLIC_GA_ID` = mã đo lường GA4 (ví dụ `G-LDBCC13X3G`).
 * - Nếu chưa cấu hình, component không render gì cả -> không gây lỗi.
 *
 * Sự kiện được đo:
 *   page_view, view_item, search, add_to_cart, begin_checkout, purchase
 */
export function Analytics() {
  const gaId = process.env.NEXT_PUBLIC_GA_ID?.trim();

  if (!gaId) {
    return (
      <Suspense fallback={null}>
        <PageViewTracker />
      </Suspense>
    );
  }

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
        strategy="afterInteractive"
        async
      />
      <Script id="ga4-init" strategy="afterInteractive">
        {`
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${gaId}', {
  send_page_view: false,
  anonymize_ip: true,
  allow_google_signals: true,
  cookie_flags: ['SameSite=None;Secure'],
});
        `.trim()}
      </Script>
      <Suspense fallback={null}>
        <PageViewTracker />
      </Suspense>
    </>
  );
}
