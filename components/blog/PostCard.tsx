import Image from "next/image";
import Link from "next/link";
import { Clock, Calendar } from "lucide-react";
import type { BlogPost } from "@/database/schema";
import { formatDateShort } from "@/lib/format";

export function PostCard({ post }: { post: BlogPost }) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-xl border border-ink-200 bg-white transition hover:border-brand-300 hover:shadow-lg hover:shadow-ink-900/5">
      <Link
        href={`/blog/${post.slug}`}
        className="relative block aspect-[16/9] overflow-hidden bg-ink-50"
      >
        <Image
          src={post.coverImage ?? "/og-default.jpg"}
          alt={post.coverAlt ?? post.title}
          fill
          sizes="(max-width: 768px) 100vw, 400px"
          className="object-cover transition duration-500 group-hover:scale-105"
        />
      </Link>

      <div className="flex flex-1 flex-col p-4">
        <div className="flex flex-wrap items-center gap-3 text-xs text-ink-500">
          <time
            dateTime={post.publishedAt.toISOString()}
            className="flex items-center gap-1"
          >
            <Calendar className="size-3" />
            {formatDateShort(post.publishedAt)}
          </time>
          <span className="flex items-center gap-1">
            <Clock className="size-3" />
            {post.readingTime} phút đọc
          </span>
        </div>

        <h3 className="mt-2 line-clamp-2 text-base font-semibold leading-snug text-ink-950">
          <Link
            href={`/blog/${post.slug}`}
            className="transition hover:text-brand-600"
          >
            {post.title}
          </Link>
        </h3>

        {post.excerpt && (
          <p className="mt-2 line-clamp-3 flex-1 text-sm leading-6 text-ink-600">
            {post.excerpt}
          </p>
        )}

        <Link
          href={`/blog/${post.slug}`}
          className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-brand-600 transition hover:text-brand-700"
        >
          Đọc bài viết
          <span aria-hidden>→</span>
        </Link>
      </div>
    </article>
  );
}
