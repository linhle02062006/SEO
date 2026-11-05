import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const TONES: Record<string, { bg: string; text: string }> = {
  brand: { bg: "bg-brand-50", text: "text-brand-600" },
  blue: { bg: "bg-blue-50", text: "text-blue-600" },
  violet: { bg: "bg-violet-50", text: "text-violet-600" },
  emerald: { bg: "bg-emerald-50", text: "text-emerald-600" },
  amber: { bg: "bg-amber-50", text: "text-amber-600" },
  rose: { bg: "bg-rose-50", text: "text-rose-600" },
};

export function StatCard({
  icon: Icon,
  label,
  value,
  hint,
  tone = "brand",
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  hint?: string;
  tone?: keyof typeof TONES | string;
}) {
  const t = TONES[tone] ?? TONES.brand;

  return (
    <div className="rounded-xl border border-ink-200 bg-white p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-medium uppercase tracking-wide text-ink-500">
            {label}
          </p>
          <p className="mt-2 truncate text-2xl font-bold tracking-tight text-ink-950">
            {value}
          </p>
          {hint && <p className="mt-1 text-xs text-ink-500">{hint}</p>}
        </div>
        <span
          className={cn(
            "grid size-10 shrink-0 place-items-center rounded-lg",
            t.bg,
            t.text,
          )}
        >
          <Icon className="size-5" />
        </span>
      </div>
    </div>
  );
}
