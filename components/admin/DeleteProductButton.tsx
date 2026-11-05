"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2, Loader2 } from "lucide-react";
import { deleteProductAction } from "@/app/admin/actions";

export function DeleteProductButton({
  id,
  name,
}: {
  id: number;
  name: string;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  return (
    <button
      type="button"
      disabled={busy}
      onClick={async () => {
        if (
          !window.confirm(
            `Xóa sản phẩm "${name}"? Hành động này không thể hoàn tác.`,
          )
        )
          return;
        setBusy(true);
        try {
          await deleteProductAction(id);
          router.push("/admin/san-pham");
          router.refresh();
        } finally {
          setBusy(false);
        }
      }}
      className="inline-flex items-center gap-2 rounded-lg border border-rose-200 bg-white px-4 py-2.5 text-sm font-medium text-rose-600 transition hover:bg-rose-50 disabled:opacity-60"
    >
      {busy ? (
        <Loader2 className="size-4 animate-spin" />
      ) : (
        <Trash2 className="size-4" />
      )}
      Xóa
    </button>
  );
}
