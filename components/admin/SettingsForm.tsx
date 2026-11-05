"use client";

import { useActionState } from "react";
import { Loader2, Save } from "lucide-react";
import { saveSettingsAction } from "@/app/admin/actions";
import { emptyState, type ActionState } from "@/app/admin/action-state";
import { cn } from "@/lib/utils";


const GROUPS: {
  title: string;
  description: string;
  fields: { key: string; label: string; hint?: string; type?: "text" | "textarea" }[];
}[] = [
  {
    title: "Thông tin thương hiệu (Brand Entity)",
    description:
      "Dùng cho Schema.org Organization, Open Graph và thông tin hiển thị trên website.",
    fields: [
      { key: "brand_name", label: "Tên thương hiệu" },
      { key: "brand_legal_name", label: "Tên pháp lý" },
      { key: "brand_logo", label: "Đường dẫn logo" },
      { key: "brand_description", label: "Mô tả thương hiệu", type: "textarea" },
      { key: "brand_slogan", label: "Slogan" },
    ],
  },
  {
    title: "Thông tin liên hệ (NAP)",
    description:
      "Chỉ khai báo thông tin liên hệ THẬT. Website không hiển thị số điện thoại hay địa chỉ nếu chưa có dữ liệu thực tế.",
    fields: [
      { key: "contact_email", label: "Email hỗ trợ" },
      { key: "contact_hours", label: "Giờ tư vấn" },
    ],
  },
  {
    title: "SEO kỹ thuật",
    description:
      "Các giá trị này dùng để sinh sitemap.xml, robots.txt và canonical đúng chuẩn.",
    fields: [
      {
        key: "seo_default_title",
        label: "Title mặc định",
        hint: "Dùng khi trang không có title riêng.",
      },
      {
        key: "seo_default_description",
        label: "Meta description mặc định",
        type: "textarea",
      },
      { key: "seo_og_image", label: "Ảnh Open Graph (1200x630)" },
      {
        key: "seo_google_site_verification",
        label: "Google Site Verification",
        hint: "Mã xác minh Search Console (dạng content=...).",
      },
    ],
  },
  {
    title: "Thương mại điện tử",
    description: "Thông tin dùng cho Google Merchant Center và nút mua nhanh.",
    fields: [
      { key: "shop_currency", label: "Tiền tệ" },
      { key: "shop_shipping_fee", label: "Phí vận chuyển" },
      { key: "shop_free_shipping_threshold", label: "Miễn phí ship từ" },
      { key: "shop_return_policy", label: "Chính sách đổi trả" },
    ],
  },
];

export function SettingsForm({
  settings,
}: {
  settings: Record<string, string>;
}) {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(
    saveSettingsAction,
    emptyState,
  );

  return (
    <form action={formAction} className="space-y-6">
      {GROUPS.map((group) => (
        <section
          key={group.title}
          className="rounded-xl border border-ink-200 bg-white p-5"
        >
          <h2 className="text-base font-semibold text-ink-950">{group.title}</h2>
          <p className="mt-1 text-sm text-ink-500">{group.description}</p>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {group.fields.map((f) => (
              <div
                key={f.key}
                className={f.type === "textarea" ? "sm:col-span-2" : ""}
              >
                <label className="mb-1.5 block text-xs font-medium text-ink-700">
                  {f.label}
                </label>
                {f.type === "textarea" ? (
                  <textarea
                    name={`setting_${f.key}`}
                    rows={3}
                    defaultValue={settings[f.key] ?? ""}
                    className="w-full rounded-lg border border-ink-200 px-3 py-2.5 text-sm outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
                  />
                ) : (
                  <input
                    name={`setting_${f.key}`}
                    defaultValue={settings[f.key] ?? ""}
                    className="h-10 w-full rounded-lg border border-ink-200 px-3 text-sm outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
                  />
                )}
                {f.hint && (
                  <p className="mt-1 text-[11px] text-ink-400">{f.hint}</p>
                )}
              </div>
            ))}
          </div>
        </section>
      ))}

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

      <div className="sticky bottom-4 flex justify-end">
        <button
          type="submit"
          disabled={pending}
          className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-600/20 transition hover:bg-brand-700 disabled:opacity-60"
        >
          {pending && <Loader2 className="size-4 animate-spin" />}
          <Save className="size-4" />
          Lưu cài đặt
        </button>
      </div>
    </form>
  );
}
