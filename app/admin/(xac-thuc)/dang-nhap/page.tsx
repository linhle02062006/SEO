import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ShieldCheck, ArrowLeft } from "lucide-react";
import { getCurrentUser } from "@/lib/auth";
import { LoginForm } from "./LoginForm";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: { absolute: "Đăng nhập quản trị | TechZone" },
  robots: { index: false, follow: false },
};

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const user = await getCurrentUser();
  if (user && ["admin", "editor"].includes(user.role)) {
    redirect("/admin");
  }

  const sp = await searchParams;
  const next = Array.isArray(sp.next) ? sp.next[0] : sp.next;
  const error = Array.isArray(sp.error) ? sp.error[0] : sp.error;

  return (
    <div className="flex min-h-screen bg-ink-950">
      {/* Panel trái */}
      <div className="relative hidden w-1/2 flex-col justify-between overflow-hidden p-12 lg:flex">
        <div
          className="absolute inset-0 bg-[radial-gradient(60%_60%_at_30%_20%,rgba(51,132,255,0.28),transparent)]"
          aria-hidden
        />
        <div className="relative">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="grid size-10 place-items-center rounded-xl bg-brand-600 text-sm font-bold text-white">
              TZ
            </span>
            <span className="text-lg font-bold text-white">
              Tech<span className="text-brand-300">Zone</span>
            </span>
          </Link>
        </div>

        <div className="relative max-w-md">
          <h1 className="text-3xl font-bold leading-tight tracking-tight text-white">
            Trang quản trị TechZone
          </h1>
          <p className="mt-4 text-sm leading-6 text-ink-400">
            Quản lý sản phẩm, danh mục, thương hiệu, đơn hàng, khách hàng và
            nội dung blog — tất cả trong một nơi.
          </p>
          <ul className="mt-8 space-y-3">
            {[
              "Dashboard doanh thu, đơn hàng và sản phẩm bán chạy",
              "Quản lý sản phẩm, giá bán và tồn kho",
              "Cập nhật trạng thái đơn hàng và thông tin khách hàng",
              "Soạn và xuất bản bài viết trên blog",
            ].map((f) => (
              <li key={f} className="flex items-start gap-2.5 text-sm text-ink-300">
                <ShieldCheck className="mt-0.5 size-4 shrink-0 text-brand-400" />
                {f}
              </li>
            ))}
          </ul>
        </div>

        <p className="relative text-xs text-ink-500">
          © {new Date().getFullYear()} TechZone Việt Nam
        </p>
      </div>

      {/* Panel phải */}
      <div className="flex w-full items-center justify-center bg-white px-6 lg:w-1/2">
        <div className="w-full max-w-sm">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm text-ink-500 transition hover:text-brand-600"
          >
            <ArrowLeft className="size-4" />
            Về trang chủ
          </Link>

          <div className="mt-8 flex items-center gap-2.5">
            <span className="grid size-10 place-items-center rounded-xl bg-brand-600 text-sm font-bold text-white">
              TZ
            </span>
            <span className="text-lg font-bold text-ink-950">
              Tech<span className="text-brand-600">Zone</span>
            </span>
          </div>

          <h2 className="mt-8 text-2xl font-bold tracking-tight text-ink-950">
            Đăng nhập quản trị
          </h2>
          <p className="mt-2 text-sm text-ink-600">
            Sử dụng tài khoản quản trị để truy cập hệ thống.
          </p>

          {error === "forbidden" && (
            <div
              role="alert"
              className="mt-6 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800"
            >
              Bạn không có quyền truy cập trang quản trị.
            </div>
          )}

          <LoginForm next={next} />
        </div>
      </div>
    </div>
  );
}
