"use client";

import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function ProductGallery({
  images,
  alt,
  badge,
}: {
  images: string[];
  alt: string;
  badge?: string | null;
}) {
  const [active, setActive] = useState(0);
  const list = images.length ? images : ["/products/placeholder.svg"];

  return (
    <div className="lg:sticky lg:top-24">
      <div className="relative aspect-square overflow-hidden rounded-2xl border border-ink-200 bg-white">
        <Image
          src={list[active]}
          alt={`${alt} - hình ${active + 1}`}
          fill
          sizes="(max-width: 1024px) 100vw, 560px"
          className="object-cover"
          priority
        />
        {badge && (
          <span className="absolute left-4 top-4 rounded-lg bg-accent-500 px-2.5 py-1 text-sm font-bold text-white shadow">
            {badge}
          </span>
        )}
      </div>

      {list.length > 1 && (
        <div className="mt-3 grid grid-cols-4 gap-3">
          {list.map((img, i) => (
            <button
              key={img + i}
              type="button"
              onClick={() => setActive(i)}
              className={cn(
                "relative aspect-square overflow-hidden rounded-lg border-2 bg-white transition",
                i === active
                  ? "border-brand-500"
                  : "border-ink-200 hover:border-ink-300",
              )}
              aria-label={`Xem hình ${i + 1} của ${alt}`}
              aria-current={i === active}
            >
              <Image
                src={img}
                alt={`${alt} - thumbnail ${i + 1}`}
                fill
                sizes="120px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
