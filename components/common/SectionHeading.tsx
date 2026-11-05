import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function SectionHeading({
  eyebrow,
  title,
  description,
  href,
  linkLabel,
  className = "",
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  href?: string;
  linkLabel?: string;
  className?: string;
}) {
  return (
    <div className={`flex flex-wrap items-end justify-between gap-4 ${className}`}>
      <div className="max-w-2xl">
        {eyebrow && (
          <p className="text-xs font-semibold uppercase tracking-wider text-brand-600">
            {eyebrow}
          </p>
        )}
        <h2 className="mt-1.5 text-2xl font-bold tracking-tight text-ink-950 lg:text-3xl">
          {title}
        </h2>
        {description && (
          <p className="mt-2 text-sm leading-6 text-ink-600">{description}</p>
        )}
      </div>
      {href && linkLabel && (
        <Link
          href={href}
          className="group inline-flex shrink-0 items-center gap-1.5 text-sm font-medium text-brand-600 transition hover:text-brand-700"
        >
          {linkLabel}
          <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      )}
    </div>
  );
}
