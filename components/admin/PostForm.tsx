"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { Loader2, Save, ArrowLeft, ExternalLink } from "lucide-react";
import { savePostAction } from "@/app/admin/actions";
import { emptyState, type ActionState } from "@/app/admin/action-state";
import type { BlogPost, Category } from "@/database/schema";
import { cn } from "@/lib/utils";

export function PostForm({
  categories,
  post,
}: {
  categories: Category[];
  post?: BlogPost | null;
}) {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(
    savePostAction,
    emptyState,
  );

  const inputCls = (err?: string) =>
    cn(
      "w-full rounded-lg border px-3 py-2.5 text-sm outline-none transition placeholder:text-ink-400",
      err
        ? "border-rose-300 focus:border-rose-500 focus:ring-2 focus:ring-rose-100"
        : "border-ink-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-100",
    );

  return (
    <form action={formAction} className="space-y-6">
      {post && <input type="hidden" name="id" value={post.id} />}

      {state.message && (
        <div
          role="status"
          className={cn(
            "rounded-lg border px-4 py-3 text-sm",
            state.ok
              ? "border-emerald-200 bg-emerald-50 text-emerald-800"
              : "border-rose-200 bg-rose-50 text-rose-700",
          )}
        >
          {state.message}
        </div>
      )}

      <section className="rounded-xl border border-ink-200 bg-white p-5">
        <h2 className="text-base font-semibold text-ink-950">Nội dung bài viết</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-xs font-medium text-ink-700">
              Tiêu đề (H1) <span className="text-rose-500">*</span>
            </label>
            <input
              name="title"
              defaultValue={post?.title ?? ""}
              required
              placeholder="Cách chọn củ sạc nhanh phù hợp với điện thoại"
              className={inputCls(state.errors?.title)}
            />
            {state.errors?.title && (
              <p className="mt-1 text-xs text-rose-600">{state.errors.title}</p>
            )}
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium text-ink-700">
              Slug (URL)
            </label>
            <input
              name="slug"
              defaultValue={post?.slug ?? ""}
              placeholder="cach-chon-cu-sac-nhanh"
              className={inputCls()}
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium text-ink-700">
              Danh mục
            </label>
            <select
              name="categoryId"
              defaultValue={post?.categoryId ?? ""}
              className={inputCls()}
            >
              <option value="">— Chưa phân loại —</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-xs font-medium text-ink-700">
              Đoạn tóm tắt (excerpt)
            </label>
            <textarea
              name="excerpt"
              rows={2}
              defaultValue={post?.excerpt ?? ""}
              maxLength={400}
              placeholder="Tóm tắt 1-2 câu, hiển thị trên trang danh sách blog..."
              className={inputCls()}
            />
          </div>

          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-xs font-medium text-ink-700">
              Nội dung (HTML) <span className="text-rose-500">*</span>
            </label>
            <textarea
              name="content"
              rows={18}
              defaultValue={post?.content ?? ""}
              required
              placeholder="<h2>Tiêu đề phần</h2>&#10;<p>Nội dung đoạn văn...</p>&#10;<ul><li>Danh sách...</li></ul>"
              className={cn(inputCls(state.errors?.content), "font-mono text-xs")}
            />
            {state.errors?.content && (
              <p className="mt-1 text-xs text-rose-600">{state.errors.content}</p>
            )}
            <p className="mt-1 text-[11px] text-ink-500">
              Dùng thẻ h2, h3, p, ul, table để tạo cấu trúc heading chuẩn SEO.
            </p>
          </div>

          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-xs font-medium text-ink-700">
              Tags (phân tách bằng dấu phẩy)
            </label>
            <input
              name="tags"
              defaultValue={(post?.tags ?? []).join(", ")}
              placeholder="cáp sạc, sạc nhanh, hướng dẫn"
              className={inputCls()}
            />
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-ink-200 bg-white p-5">
        <h2 className="text-base font-semibold text-ink-950">
          Ảnh &amp; SEO
        </h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-ink-700">
              Ảnh cover (URL)
            </label>
            <input
              name="coverImage"
              defaultValue={post?.coverImage ?? ""}
              placeholder="/blog/cach-chon-cu-sac-nhanh.jpg"
              className={inputCls()}
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-ink-700">
              Alt ảnh cover
            </label>
            <input
              name="coverAlt"
              defaultValue={post?.coverAlt ?? ""}
              placeholder="Cách chọn củ sạc nhanh phù hợp điện thoại"
              className={inputCls()}
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-ink-700">
              SEO Title
            </label>
            <input
              name="seoTitle"
              defaultValue={post?.seoTitle ?? ""}
              maxLength={200}
              className={inputCls()}
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-ink-700">
              Thời gian đọc (phút)
            </label>
            <input
              name="readingTime"
              type="number"
              min={1}
              max={120}
              defaultValue={post?.readingTime ?? 5}
              className={inputCls()}
            />
          </div>
          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-xs font-medium text-ink-700">
              Meta Description
            </label>
            <textarea
              name="seoDescription"
              rows={2}
              defaultValue={post?.seoDescription ?? ""}
              maxLength={320}
              className={inputCls()}
            />
          </div>
        </div>

        <label className="mt-4 flex items-center gap-2 text-sm text-ink-700">
          <input
            type="checkbox"
            name="isPublished"
            defaultChecked={post?.isPublished ?? false}
            className="size-4 rounded border-ink-300 text-brand-600 focus:ring-brand-500"
          />
          Xuất bản (hiển thị công khai và đưa vào sitemap)
        </label>
      </section>

      <div className="sticky bottom-0 flex flex-wrap items-center gap-3 rounded-xl border border-ink-200 bg-white px-5 py-4 shadow-lg shadow-ink-900/5">
        <button
          type="submit"
          disabled={pending}
          className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:opacity-60"
        >
          {pending ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Save className="size-4" />
          )}
          {pending ? "Đang lưu..." : "Lưu bài viết"}
        </button>
        <Link
          href="/admin/blog"
          className="inline-flex items-center gap-2 rounded-lg border border-ink-200 px-5 py-2.5 text-sm font-medium text-ink-700 transition hover:bg-ink-50"
        >
          <ArrowLeft className="size-4" />
          Quay lại
        </Link>
        {post?.slug && (
          <Link
            href={`/blog/${post.slug}`}
            target="_blank"
            className="inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-medium text-brand-600 transition hover:bg-brand-50"
          >
            <ExternalLink className="size-4" />
            Xem bài
          </Link>
        )}
      </div>
    </form>
  );
}
