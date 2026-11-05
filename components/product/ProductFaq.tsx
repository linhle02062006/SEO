"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import type { FaqItem } from "@/types";
import { cn } from "@/lib/utils";

export function ProductFaq({ items }: { items: FaqItem[] }) {
  const [open, setOpen] = useState<number | null>(0);

  if (!items.length) return null;

  return (
    <div className="mt-4 max-w-3xl divide-y divide-ink-100 overflow-hidden rounded-xl border border-ink-200">
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <div key={item.question} className="bg-white">
            <h3>
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : i)}
                className="flex w-full items-center justify-between gap-4 px-4 py-4 text-left"
                aria-expanded={isOpen}
              >
                <span className="text-sm font-medium text-ink-900">
                  {item.question}
                </span>
                <ChevronDown
                  className={cn(
                    "size-4 shrink-0 text-ink-400 transition-transform",
                    isOpen && "rotate-180",
                  )}
                />
              </button>
            </h3>
            {isOpen && (
              <div className="px-4 pb-4">
                <p className="text-sm leading-6 text-ink-600">{item.answer}</p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
