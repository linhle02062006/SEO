"use client";

import { useActionState, useState } from "react";
import { Loader2, Plus, Trash2 } from "lucide-react";
import {
  saveSocialProfileAction,
  deleteSocialProfileAction,
} from "@/app/admin/actions";
import { emptyState, type ActionState } from "@/app/admin/action-state";

export type SocialProfileRow = {
  id: number;
  platform: string;
  url: string;
  handle: string | null;
  isPrimary: boolean;
  isActive: boolean;
};

const PLATFORMS = [
  "facebook",
  "instagram",
  "youtube",
  "tiktok",
  "linkedin",
  "pinterest",
];

const inputCls =
  "h-10 w-full rounded-lg border border-ink-200 px-3 text-sm outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100";

/**
 * Quản lý hồ sơ mạng xã hội (Social Entity).
 * Dữ liệu này dùng cho thuộc tính sameAs của Schema.org Organization
 * và cho phần liên hệ hiển thị ở footer.
 */
export function SocialProfilesManager({
  socialProfiles,
}: {
  socialProfiles: SocialProfileRow[];
}) {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(
    saveSocialProfileAction,
    emptyState,
  );
  const [rows, setRows] = useState(socialProfiles);

  async function handleDelete(id: number, platform: string) {
    await deleteSocialProfileAction(id);
    setRows((prev) => prev.filter((r) => r.id !== id));
  }

  return (
    <section className="rounded-xl border border-ink-200 bg-white p-5">
      <h2 className="text-base font-semibold text-ink-950">
        Hồ sơ mạng xã hội
      </h2>
      <p className="mt-1 text-sm text-ink-500">
        Danh sách này được xuất ra thuộc tính <code>sameAs</code> của Schema.org
        Organization, giúp các nền tảng xác thực thực thể thương hiệu TechZone.
      </p>

      <form
        action={formAction}
        className="mt-5 grid gap-4 border-t border-ink-100 pt-5 sm:grid-cols-2"
      >
        <div>
          <label
            htmlFor="social-platform"
            className="mb-1.5 block text-xs font-medium text-ink-700"
          >
            Nền tảng
          </label>
          <select
            id="social-platform"
            name="platform"
            defaultValue="facebook"
            className={inputCls}
          >
            {PLATFORMS.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="social-url"
            className="mb-1.5 block text-xs font-medium text-ink-700"
          >
            URL hồ sơ
          </label>
          <input
            id="social-url"
            name="url"
            required
            placeholder="https://facebook.com/ten-tai-khoan-that"
            className={inputCls}
          />
          {state.errors?.url && (
            <p className="mt-1 text-xs text-rose-600">{state.errors.url}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="social-handle"
            className="mb-1.5 block text-xs font-medium text-ink-700"
          >
            Handle / Username
          </label>
          <input
            id="social-handle"
            name="handle"
            placeholder="ten-tai-khoan-that"
            className={inputCls}
          />
        </div>

        <div className="flex items-end gap-5 pb-1">
          <label className="flex items-center gap-2 text-sm text-ink-700">
            <input
              type="checkbox"
              name="isPrimary"
              className="size-4 rounded border-ink-300 text-brand-600 focus:ring-brand-500"
            />
            Hồ sơ chính
          </label>
          <label className="flex items-center gap-2 text-sm text-ink-700">
            <input
              type="checkbox"
              name="isActive"
              defaultChecked
              className="size-4 rounded border-ink-300 text-brand-600 focus:ring-brand-500"
            />
            Đang hoạt động
          </label>
        </div>

        {state.message && (
          <p
            role="status"
            className={`text-sm sm:col-span-2 ${
              state.ok ? "text-emerald-700" : "text-rose-600"
            }`}
          >
            {state.message}
          </p>
        )}

        <div className="sm:col-span-2">
          <button
            type="submit"
            disabled={pending}
            className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:opacity-60"
          >
            {pending ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Plus className="size-4" />
            )}
            Lưu hồ sơ
          </button>
        </div>
      </form>

      {rows.length === 0 ? (
        <p className="mt-6 rounded-lg bg-ink-50 p-4 text-center text-sm text-ink-500">
          Chưa có hồ sơ mạng xã hội nào được khai báo.
        </p>
      ) : (
        <ul className="mt-6 space-y-2">
          {rows.map((p) => (
            <li
              key={p.id}
              className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-ink-100 px-3 py-2 text-sm"
            >
              <span className="font-medium capitalize text-ink-900">
                {p.platform}
                {p.isPrimary && (
                  <span className="ml-2 rounded-full bg-brand-50 px-2 py-0.5 text-[10px] font-medium text-brand-700">
                    Chính
                  </span>
                )}
              </span>
              <a
                href={p.url}
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="truncate text-xs text-brand-600 hover:underline"
              >
                {p.handle ?? p.url}
              </a>
              <button
                type="button"
                onClick={() => handleDelete(p.id, p.platform)}
                aria-label={`Xóa hồ sơ ${p.platform}`}
                className="inline-flex items-center gap-1 text-xs font-medium text-ink-500 transition hover:text-rose-600"
              >
                <Trash2 className="size-3.5" />
                Xóa
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
