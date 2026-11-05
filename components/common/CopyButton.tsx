"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";

export function CopyButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      className="grid size-7 place-items-center rounded-md text-ink-400 transition hover:bg-ink-100 hover:text-ink-700"
      aria-label="Sao chép mã đơn hàng"
    >
      {copied ? (
        <Check className="size-3.5 text-emerald-600" />
      ) : (
        <Copy className="size-3.5" />
      )}
    </button>
  );
}
