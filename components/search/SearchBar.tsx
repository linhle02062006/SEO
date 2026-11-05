"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition, useEffect, useRef } from "react";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { trackClientEvent } from "@/lib/analytics-client";

type Suggestion = {
  id: number;
  name: string;
  slug: string;
  imageUrl: string | null;
  price: string;
  salePrice: string | null;
};

export function SearchBar({
  autoFocus = false,
  defaultValue = "",
  className = "",
  placeholder = "Tìm cáp sạc, củ sạc, tai nghe...",
}: {
  autoFocus?: boolean;
  defaultValue?: string;
  className?: string;
  placeholder?: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [q, setQ] = useState(defaultValue);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const boxRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Gợi ý (autocomplete)
  useEffect(() => {
    const term = q.trim();
    if (term.length < 2) {
      setSuggestions([]);
      return;
    }
    const timer = window.setTimeout(async () => {
      try {
        const res = await fetch(
          `/api/products/suggest?q=${encodeURIComponent(term)}`,
        );
        if (res.ok) {
          const data = await res.json();
          setSuggestions(data.data ?? []);
          setOpen(true);
        }
      } catch {
        // ignore
      }
    }, 250);
    return () => window.clearTimeout(timer);
  }, [q]);

  // Click ngoài đóng
  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  function submit(value?: string) {
    const keyword = (value ?? q).trim();
    if (!keyword) return;
    trackClientEvent("search", { label: keyword });
    setOpen(false);
    startTransition(() => {
      router.push(`/tim-kiem?q=${encodeURIComponent(keyword)}`);
    });
  }

  return (
    <div ref={boxRef} className={cn("relative", className)}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          submit();
        }}
        role="search"
      >
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-ink-400" />
          <input
            ref={inputRef}
            type="search"
            value={q}
            autoFocus={autoFocus}
            onChange={(e) => setQ(e.target.value)}
            onFocus={() => suggestions.length && setOpen(true)}
            placeholder={placeholder}
            aria-label="Tìm kiếm sản phẩm"
            className="h-11 w-full rounded-xl border border-ink-200 bg-white pl-9 pr-10 text-sm text-ink-900 outline-none transition placeholder:text-ink-400 focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
          />
          {q && (
            <button
              type="button"
              onClick={() => {
                setQ("");
                inputRef.current?.focus();
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-400 transition hover:text-ink-700"
              aria-label="Xóa từ khóa"
            >
              <X className="size-4" />
            </button>
          )}
        </div>
      </form>

      {open && suggestions.length > 0 && (
        <ul className="absolute z-50 mt-2 w-full overflow-hidden rounded-xl border border-ink-200 bg-white shadow-xl shadow-ink-900/10">
          {suggestions.map((s) => (
            <li key={s.id}>
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  router.push(`/san-pham/${s.slug}`);
                }}
                className="flex w-full items-center gap-3 px-3 py-2.5 text-left transition hover:bg-ink-50"
              >
                {s.imageUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={s.imageUrl}
                    alt={s.name}
                    width={40}
                    height={40}
                    loading="lazy"
                    className="size-10 shrink-0 rounded-lg object-cover"
                  />
                )}
                <span className="min-w-0 flex-1 truncate text-sm text-ink-800">
                  {s.name}
                </span>
              </button>
            </li>
          ))}
          <li>
            <button
              type="button"
              onClick={() => submit()}
              className="w-full border-t border-ink-100 px-3 py-2.5 text-left text-xs font-medium text-brand-600 transition hover:bg-brand-50"
            >
              Xem tất cả kết quả cho "{q}"
            </button>
          </li>
        </ul>
      )}
    </div>
  );
}
