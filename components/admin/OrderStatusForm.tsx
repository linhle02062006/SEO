"use client";

import { useActionState } from "react";
import { Loader2, Save } from "lucide-react";
import { updateOrderStatusAction } from "@/app/admin/(bang-dieu)/don-hang/actions";
import { emptyState } from "@/app/admin/action-state";
import { ORDER_STATUS_OPTIONS } from "@/lib/constants";

export function OrderStatusForm({
  orderId,
  current,
}: {
  orderId: number;
  current: string;
}) {
  const [state, formAction, pending] = useActionState(
    updateOrderStatusAction,
    emptyState,
  );

  return (
    <form action={formAction} className="space-y-3">
      <input type="hidden" name="id" value={orderId} />
      <div className="flex flex-wrap items-end gap-3">
        <div className="min-w-[200px]">
          <label className="mb-1.5 block text-xs font-medium text-ink-700">
            Trạng thái đơn hàng
          </label>
          <select
            name="status"
            defaultValue={current}
            className="h-10 w-full rounded-lg border border-ink-200 px-3 text-sm outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
          >
            {ORDER_STATUS_OPTIONS.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          disabled={pending}
          className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:opacity-60"
        >
          {pending ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Save className="size-4" />
          )}
          Cập nhật
        </button>
      </div>
      {state.message && (
        <p
          className={
            state.ok ? "text-xs text-emerald-700" : "text-xs text-rose-600"
          }
        >
          {state.message}
        </p>
      )}
    </form>
  );
}
