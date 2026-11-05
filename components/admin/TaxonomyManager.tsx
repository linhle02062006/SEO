"use client";

import { useActionState, useEffect, useState } from "react";
import { Loader2, Save, Plus, X } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  saveCategoryAction,
  saveBrandAction,
} from "@/app/admin/actions";
import { emptyState, type ActionState } from "@/app/admin/action-state";
import { cn } from "@/lib/utils";
import { DeleteTaxonomyButton } from "@/components/admin/DeleteTaxonomyButton";

export type CategoryRow = {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  position: number;
  isFeatured: boolean;
  productCount: number;
};

export type BrandRow = {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  isFeatured: boolean;
  productCount: number;
};

const inputCls = (err?: string) =>
  cn(
    "h-10 w-full rounded-lg border px-3 text-sm outline-none transition placeholder:text-ink-400",
    err
      ? "border-rose-300 focus:border-rose-500 focus:ring-2 focus:ring-rose-100"
      : "border-ink-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-100",
  );

export function TaxonomyManager({
  kind,
  rows,
}: {
  kind: "category" | "brand";
  rows: (CategoryRow | BrandRow)[];
}) {
  const isCategory = kind === "category";
  const action = isCategory ? saveCategoryAction : saveBrandAction;
  const router = useRouter();

  const [state, formAction, pending] = useActionState<ActionState, FormData>(
    action,
    emptyState,
  );
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [items, setItems] = useState(rows);

  const editing = items.find((r) => r.id === editingId) ?? null;

  useEffect(() => {
    if (state.ok) {
      router.refresh();
      setEditingId(null);
    }
  }, [state.ok, router]);

  function startEdit(id: number) {
    setEditingId(id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function reset() {
    setEditingId(null);
    setShowForm(false);
  }

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-ink-200 bg-white p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-base font-semibold text-ink-950">
            {editing
              ? `Sửa ${isCategory ? "danh mục" : "thương hiệu"}`
              : `Thêm ${isCategory ? "danh mục" : "thương hiệu"}`}
          </h2>
          <button
            type="button"
            onClick={() => (showForm ? reset() : setShowForm(true))}
            className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700"
          >
            {showForm ? <X className="size-4" /> : <Plus className="size-4" />}
            {showForm ? "Đóng" : `Thêm ${isCategory ? "danh mục" : "thương hiệu"}`}
          </button>
        </div>

        {showForm && (
          <form
            key={editing?.id ?? "new"}
            action={formAction}
            className="mt-5 grid gap-4 border-t border-ink-100 pt-5 sm:grid-cols-2"
          >
            {editing && <input type="hidden" name="id" value={editing.id} />}

            <div>
              <label className="mb-1.5 block text-xs font-medium text-ink-700">
                Tên <span className="text-rose-500">*</span>
              </label>
              <input
                name="name"
                defaultValue={editing?.name ?? ""}
                required
                className={inputCls(state.errors?.name)}
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium text-ink-700">
                Slug
              </label>
              <input
                name="slug"
                defaultValue={editing?.slug ?? ""}
                placeholder="tu-dong-tao-tu-ten"
                className={inputCls()}
              />
            </div>

            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-xs font-medium text-ink-700">
                Mô tả
              </label>
              <textarea
                name="description"
                rows={2}
                defaultValue={editing?.description ?? ""}
                className="w-full rounded-lg border border-ink-200 px-3 py-2.5 text-sm outline-none transition placeholder:text-ink-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
              />
            </div>

            {isCategory && (
              <div>
                <label className="mb-1.5 block text-xs font-medium text-ink-700">
                  Thứ tự hiển thị
                </label>
                <input
                  name="position"
                  type="number"
                  min={0}
                  defaultValue={(editing as CategoryRow)?.position ?? 0}
                  className={inputCls()}
                />
              </div>
            )}

            <div className="flex items-end pb-2">
              <label className="flex items-center gap-2 text-sm text-ink-700">
                <input
                  type="checkbox"
                  name="isFeatured"
                  defaultChecked={editing?.isFeatured ?? false}
                  className="size-4 rounded border-ink-300 text-brand-600 focus:ring-brand-500"
                />
                Hiển thị nổi bật
              </label>
            </div>

            {state.message && (
              <div
                role="status"
                className={cn(
                  "rounded-lg border px-4 py-2.5 text-sm sm:col-span-2",
                  state.ok
                    ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                    : "border-rose-200 bg-rose-50 text-rose-700",
                )}
              >
                {state.message}
              </div>
            )}

            <div className="flex items-center gap-2 sm:col-span-2">
              <button
                type="submit"
                disabled={pending}
                className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:opacity-60"
              >
                {pending && <Loader2 className="size-4 animate-spin" />}
                <Save className="size-4" />
                {editing ? "Cập nhật" : "Thêm"}
              </button>
              {editing && (
                <button
                  type="button"
                  onClick={reset}
                  className="rounded-lg border border-ink-200 px-4 py-2.5 text-sm font-medium text-ink-700 transition hover:bg-ink-50"
                >
                  Hủy
                </button>
              )}
            </div>
          </form>
        )}
      </div>

      <div className="overflow-hidden rounded-xl border border-ink-200 bg-white">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-sm">
            <thead className="border-b border-ink-100 bg-ink-50 text-xs uppercase tracking-wide text-ink-500">
              <tr>
                <th className="px-5 py-3 text-left font-medium">Tên</th>
                <th className="px-5 py-3 text-left font-medium">Slug</th>
                <th className="px-5 py-3 text-left font-medium">Mô tả</th>
                <th className="px-5 py-3 text-left font-medium">Sản phẩm</th>
                <th className="px-5 py-3 text-left font-medium">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-100">
              {items.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-5 py-12 text-center text-sm text-ink-500"
                  >
                    Chưa có {isCategory ? "danh mục" : "thương hiệu"} nào.
                  </td>
                </tr>
              )}
              {items.map((r) => (
                <tr key={r.id} className="transition hover:bg-ink-50">
                  <td className="px-5 py-3">
                    <span className="font-medium text-ink-950">{r.name}</span>
                    {r.isFeatured && (
                      <span className="ml-2 rounded-full bg-brand-50 px-2 py-0.5 text-[10px] font-medium text-brand-700">
                        Nổi bật
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-3 text-xs text-ink-500">/{r.slug}</td>
                  <td className="max-w-[320px] px-5 py-3 text-xs text-ink-600">
                    <span className="line-clamp-2">
                      {r.description ?? "—"}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-ink-700">{r.productCount}</td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => startEdit(r.id)}
                        className="text-xs font-medium text-brand-600 hover:underline"
                      >
                        Sửa
                      </button>
                      <DeleteTaxonomyButton kind={kind} id={r.id} name={r.name} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
