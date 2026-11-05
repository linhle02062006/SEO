"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2, Loader2 } from "lucide-react";
import {
  deleteCategoryAction,
  deleteBrandAction,
} from "@/app/admin/actions";

export function DeleteTaxonomyButton({
  kind,
  id,
  name,
}: {
  kind: "category" | "brand";
  id: number;
  name: string;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const action = kind === "category" ? deleteCategoryAction : deleteBrandAction;

  return (
    <button
      type="button"
      disabled={busy}
      onClick={async () => {
        if (!window.confirm(`Xóa "${name}"? Không thể hoàn tác.`)) return;
        setBusy(true);
        try {
          await action(id);
          router.refresh();
        } finally {
          setBusy(false);
        }
      }}
      className="text-xs font-medium text-rose-600 transition hover:underline disabled:opacity-60"
    >
      {busy ? <Loader2 className="size-3.5 animate-spin" /> : "Xóa"}
    </button>
  );
}
