"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";

function PageViewTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const query = searchParams?.toString();
    const page = query ? `${pathname}?${query}` : pathname;

    if (typeof window !== "undefined" && (window as any).gtag) {
      (window as any).gtag("event", "page_view", {
        page_path: page,
        page_location: window.location.href,
        page_title: document.title,
      });
    }

    // Ghi nhận nội bộ
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

export function Analytics() {
  const gaId = process.env.NEXT_PUBLIC_GA_ID;

  return (
    <>
      {gaId ? (
        <>
          <script
            async
            src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
          />
          <script
            dangerouslySetInnerHTML={{
              __html: `
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${gaId}', { send_page_view: false });
              `.trim(),
            }}
          />
        </>
      ) : null}
      <Suspense fallback={null}>
        <PageViewTracker />
      </Suspense>
    </>
  );
}
