"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2, Loader2 } from "lucide-react";
import { deletePostAction } from "@/app/admin/actions";

export function DeletePostButton({
  id,
  title,
}: {
  id: number;
  title: string;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  return (
    <button
      type="button"
      disabled={busy}
      onClick={async () => {
        if (
          !window.confirm(`Xóa bài viết "${title}"? Hành động không thể hoàn tác.`)
        )
          return;
        setBusy(true);
        try {
          await deletePostAction(id);
          router.push("/admin/blog");
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
      Xóa bài
    </button>
  );
}
