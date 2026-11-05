import { ChevronDown } from "lucide-react";
import type { FaqItem } from "@/types";

export function FaqSection({
  title = "Câu hỏi thường gặp",
  items,
  className,
}: {
  title?: string;
  items: FaqItem[];
  className?: string;
}) {
  if (!items.length) return null;

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };

  return (
    <section className={className}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <h2 className="text-xl font-bold tracking-tight text-ink-950 lg:text-2xl">
        {title}
      </h2>
      <div className="mt-5 divide-y divide-ink-100 overflow-hidden rounded-xl border border-ink-200 bg-white">
        {items.map((item, i) => (
          <details key={item.question} className="group" open={i === 0}>
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-4 py-4 text-sm font-medium text-ink-900 transition hover:bg-ink-50">
              <span>{item.question}</span>
              <ChevronDown className="size-4 shrink-0 text-ink-400 transition-transform group-open:rotate-180" />
            </summary>
            <div className="px-4 pb-4">
              <p className="text-sm leading-6 text-ink-600">{item.answer}</p>
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}
