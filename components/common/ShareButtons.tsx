"use client";

import { useState } from "react";
import { Share2, Check, Link2 } from "lucide-react";

export function ShareButtons({ title, url }: { title: string; url: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="flex items-center gap-1.5 text-xs font-medium text-ink-500">
        <Share2 className="size-3.5" />
        Chia sẻ:
      </span>
      <a
        href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="rounded-full border border-ink-200 px-3 py-1 text-xs text-ink-700 transition hover:border-brand-300 hover:text-brand-600"
      >
        Facebook
      </a>
      <a
        href={`https://zalo.me/share?url=${encodeURIComponent(url)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="rounded-full border border-ink-200 px-3 py-1 text-xs text-ink-700 transition hover:border-brand-300 hover:text-brand-600"
      >
        Zalo
      </a>
      <button
        type="button"
        onClick={copy}
        className="flex items-center gap-1 rounded-full border border-ink-200 px-3 py-1 text-xs text-ink-700 transition hover:border-brand-300 hover:text-brand-600"
      >
        {copied ? (
          <>
            <Check className="size-3" /> Đã sao chép
          </>
        ) : (
          <>
            <Link2 className="size-3" /> Sao chép link
          </>
        )}
      </button>
    </div>
  );
}
