"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Heart } from "lucide-react";
import { useToast } from "@/components/ui/ToastProvider";
import { cn } from "@/lib/utils";

/**
 * Nút yêu thích (wishlist).
 *
 * - Chưa đăng nhập -> hiện toast yêu cầu đăng nhập và chuyển tới trang đăng nhập.
 * - Đã đăng nhập -> gọi API toggle, cập nhật trạng thái trái tim.
 */
export function WishlistButton({
  productId,
  initialActive = false,
  className,
  size = "md",
}: {
  productId: number;
  initialActive?: boolean;
  className?: string;
  size?: "sm" | "md";
}) {
  const router = useRouter();
  const { success, error } = useToast();
  const [active, setActive] = useState(initialActive);
  const [loading, setLoading] = useState(false);

  const iconSize = size === "sm" ? "size-4" : "size-5";

  async function handleToggle(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();

    if (loading) return;
    setLoading(true);

    try {
      const res = await fetch("/api/account/wishlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId }),
      });
      const data = await res.json();

      if (res.status === 401) {
        error("Bạn cần đăng nhập để lưu sản phẩm yêu thích.");
        router.push("/dang-nhap");
        return;
      }

      if (!res.ok || !data.ok) {
        error(data.message ?? "Không cập nhật được danh sách yêu thích.");
        return;
      }

      setActive(!!data.inWishlist);
      success(data.message ?? "Đã cập nhật danh sách yêu thích.");
    } catch {
      error("Không kết nối được máy chủ, vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleToggle}
      disabled={loading}
      aria-label={active ? "Bỏ khỏi yêu thích" : "Thêm vào yêu thích"}
      aria-pressed={active}
      title={active ? "Bỏ khỏi yêu thích" : "Thêm vào yêu thích"}
      className={cn(
        "grid place-items-center rounded-full border bg-white/95 backdrop-blur transition",
        active
          ? "border-rose-300 text-rose-500 hover:bg-rose-50"
          : "border-ink-200 text-ink-400 hover:border-rose-300 hover:text-rose-500",
        size === "sm" ? "size-8" : "size-9",
        className,
      )}
    >
      <Heart
        className={cn(iconSize, active && "fill-current")}
        aria-hidden
      />
    </button>
  );
}
