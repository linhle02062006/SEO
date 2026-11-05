"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { Loader2, Save, ArrowLeft } from "lucide-react";
import { saveProductAction } from "@/app/admin/actions";
import { emptyState, type ActionState } from "@/app/admin/action-state";
import type { Brand, Category, Product } from "@/database/schema";
import { cn } from "@/lib/utils";

export function ProductForm({
  categories,
  brands,
  product,
}: {
  categories: Category[];
  brands: Brand[];
  product?: Product | null;
}) {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(
    saveProductAction,
    emptyState,
  );
  const [specsText, setSpecsText] = useState(
    product?.specs ? JSON.stringify(JSON.parse(product.specs), null, 2) : "",
  );
  const [faqText, setFaqText] = useState(
    product?.faq ? JSON.stringify(JSON.parse(product.faq), null, 2) : "",
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
      {product && <input type="hidden" name="id" value={product.id} />}

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

      {/* Thông tin cơ bản */}
      <section className="rounded-xl border border-ink-200 bg-white p-5">
        <h2 className="text-base font-semibold text-ink-950">Thông tin cơ bản</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-xs font-medium text-ink-700">
              Tên sản phẩm <span className="text-rose-500">*</span>
            </label>
            <input
              name="name"
              defaultValue={product?.name ?? ""}
              required
              placeholder="Cáp sạc nhanh 20W Type-C hỗ trợ PD 3.0"
              className={inputCls(state.errors?.name)}
            />
            {state.errors?.name && (
              <p className="mt-1 text-xs text-rose-600">{state.errors.name}</p>
            )}
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium text-ink-700">
              Slug (URL thân thiện SEO)
            </label>
            <input
              name="slug"
              defaultValue={product?.slug ?? ""}
              placeholder="cap-sac-nhanh-20w-type-c"
              className={inputCls(state.errors?.slug)}
            />
            <p className="mt-1 text-[11px] text-ink-500">
              Để trống sẽ tự sinh từ tên sản phẩm.
            </p>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium text-ink-700">
              SKU <span className="text-rose-500">*</span>
            </label>
            <input
              name="sku"
              defaultValue={product?.sku ?? ""}
              required
              placeholder="TZ-CAP-001"
              className={inputCls(state.errors?.sku)}
            />
            {state.errors?.sku && (
              <p className="mt-1 text-xs text-rose-600">{state.errors.sku}</p>
            )}
          </div>

          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-xs font-medium text-ink-700">
              Mô tả ngắn (hiển thị trên thẻ sản phẩm &amp; meta description)
            </label>
            <textarea
              name="shortDescription"
              rows={2}
              defaultValue={product?.shortDescription ?? ""}
              maxLength={320}
              placeholder="Mô tả ngắn gọn trong 160-320 ký tự..."
              className={inputCls()}
            />
          </div>

          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-xs font-medium text-ink-700">
              Mô tả đầy đủ
            </label>
            <textarea
              name="description"
              rows={6}
              defaultValue={product?.description ?? ""}
              placeholder="Mô tả chi tiết sản phẩm, công nghệ, chất liệu, lợi ích..."
              className={inputCls()}
            />
          </div>
        </div>
      </section>

      {/* Giá & kho */}
      <section className="rounded-xl border border-ink-200 bg-white p-5">
        <h2 className="text-base font-semibold text-ink-950">
          Giá bán &amp; tồn kho
        </h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-ink-700">
              Giá gốc (₫) <span className="text-rose-500">*</span>
            </label>
            <input
              name="price"
              type="number"
              min={0}
              step={1000}
              required
              defaultValue={product?.price ?? ""}
              className={inputCls(state.errors?.price)}
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-ink-700">
              Giá khuyến mại (₫)
            </label>
            <input
              name="salePrice"
              type="number"
              min={0}
              step={1000}
              defaultValue={product?.salePrice ?? ""}
              className={inputCls(state.errors?.salePrice)}
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-ink-700">
              Giá nhập (₫)
            </label>
            <input
              name="costPrice"
              type="number"
              min={0}
              step={1000}
              defaultValue={product?.costPrice ?? ""}
              className={inputCls()}
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-ink-700">
              Tồn kho <span className="text-rose-500">*</span>
            </label>
            <input
              name="stock"
              type="number"
              min={0}
              required
              defaultValue={product?.stock ?? 0}
              className={inputCls(state.errors?.stock)}
            />
          </div>
        </div>
      </section>

      {/* Phân loại */}
      <section className="rounded-xl border border-ink-200 bg-white p-5">
        <h2 className="text-base font-semibold text-ink-950">Phân loại</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-ink-700">
              Danh mục <span className="text-rose-500">*</span>
            </label>
            <select
              name="categoryId"
              required
              defaultValue={product?.categoryId ?? ""}
              className={inputCls(state.errors?.categoryId)}
            >
              <option value="">— Chọn danh mục —</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-ink-700">
              Thương hiệu
            </label>
            <select
              name="brandId"
              defaultValue={product?.brandId ?? ""}
              className={inputCls()}
            >
              <option value="">— Chọn thương hiệu —</option>
              {brands.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-ink-700">
              Trạng thái
            </label>
            <select
              name="status"
              defaultValue={product?.status ?? "active"}
              className={inputCls()}
            >
              <option value="active">Đang bán</option>
              <option value="hidden">Đã ẩn</option>
              <option value="draft">Nháp</option>
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-ink-700">
              Nhãn (badge)
            </label>
            <input
              name="badge"
              defaultValue={product?.badge ?? ""}
              placeholder="Bán chạy / Mới"
              className={inputCls()}
            />
          </div>
        </div>
        <label className="mt-4 flex items-center gap-2 text-sm text-ink-700">
          <input
            type="checkbox"
            name="isFeatured"
            defaultChecked={product?.isFeatured ?? false}
            className="size-4 rounded border-ink-300 text-brand-600 focus:ring-brand-500"
          />
          Sản phẩm nổi bật (hiển thị ở trang chủ)
        </label>
      </section>

      {/* Hình ảnh */}
      <section className="rounded-xl border border-ink-200 bg-white p-5">
        <h2 className="text-base font-semibold text-ink-950">Hình ảnh</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-ink-700">
              Ảnh chính (URL)
            </label>
            <input
              name="imageUrl"
              defaultValue={product?.imageUrl ?? ""}
              placeholder="/products/cap-sac-nhanh-20w.jpg"
              className={inputCls()}
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-ink-700">
              Thư viện ảnh (phân tách bằng dấu phẩy)
            </label>
            <input
              name="gallery"
              defaultValue={(product?.gallery ?? []).join(", ")}
              placeholder="/products/a.jpg, /products/a-2.jpg"
              className={inputCls()}
            />
          </div>
        </div>
      </section>

      {/* SEO */}
      <section className="rounded-xl border border-ink-200 bg-white p-5">
        <h2 className="text-base font-semibold text-ink-950">SEO On-page</h2>
        <div className="mt-4 space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-ink-700">
              SEO Title (60 ký tự)
            </label>
            <input
              name="seoTitle"
              defaultValue={product?.seoTitle ?? ""}
              maxLength={200}
              placeholder="Cáp sạc nhanh 20W Type-C chính hãng | TechZone"
              className={inputCls()}
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-ink-700">
              Meta Description (160 ký tự)
            </label>
            <textarea
              name="seoDescription"
              rows={2}
              defaultValue={product?.seoDescription ?? ""}
              maxLength={320}
              placeholder="Mô tả ngắn gọn giúp người dùng hiểu sản phẩm và có từ khóa chính..."
              className={inputCls()}
            />
          </div>
        </div>
      </section>

      {/* Specs & FAQ */}
      <section className="rounded-xl border border-ink-200 bg-white p-5">
        <h2 className="text-base font-semibold text-ink-950">
          Thông số kỹ thuật &amp; FAQ
        </h2>
        <p className="mt-1 text-xs text-ink-500">
          Nhập dạng JSON. Thông số: mảng{" "}
          <code className="rounded bg-ink-100 px-1">[{"{"}"label":"...","value":"..."{"}"}]</code>
          . FAQ: mảng{" "}
          <code className="rounded bg-ink-100 px-1">[{"{"}"question":"...","answer":"..."{"}"}]</code>
          .
        </p>
        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-ink-700">
              Thông số kỹ thuật (JSON)
            </label>
            <textarea
              name="specsJson"
              rows={10}
              value={specsText}
              onChange={(e) => setSpecsText(e.target.value)}
              placeholder='[{"label":"Công suất","value":"20W"}]'
              className={cn(inputCls(state.errors?.specsJson), "font-mono text-xs")}
            />
            {state.errors?.specsJson && (
              <p className="mt-1 text-xs text-rose-600">{state.errors.specsJson}</p>
            )}
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-ink-700">
              FAQ (JSON)
            </label>
            <textarea
              name="faqJson"
              rows={10}
              value={faqText}
              onChange={(e) => setFaqText(e.target.value)}
              placeholder='[{"question":"Có tương thích iPhone không?","answer":"Có, ..."}]'
              className={cn(inputCls(state.errors?.faqJson), "font-mono text-xs")}
            />
            {state.errors?.faqJson && (
              <p className="mt-1 text-xs text-rose-600">{state.errors.faqJson}</p>
            )}
          </div>
        </div>
      </section>

      {/* Actions */}
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
          {pending ? "Đang lưu..." : "Lưu sản phẩm"}
        </button>
        <Link
          href="/admin/san-pham"
          className="inline-flex items-center gap-2 rounded-lg border border-ink-200 px-5 py-2.5 text-sm font-medium text-ink-700 transition hover:bg-ink-50"
        >
          <ArrowLeft className="size-4" />
          Quay lại danh sách
        </Link>
      </div>
    </form>
  );
}
