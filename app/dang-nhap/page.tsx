import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { ArrowLeft, ShieldCheck, UserRound } from "lucide-react";
import { getSession } from "@/lib/auth";
import { ROUTES, SITE } from "@/lib/site";
import { CustomerLoginForm } from "@/components/account/CustomerLoginForm";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: { absolute: `Đăng nhập | ${SITE.name}` },
  robots: { index: false, follow: false },
};

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function LoginPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const session = await getSession();
  if (session) {
    redirect(ROUTES.account);
  }

  const sp = await searchParams;
  const registered = sp.registered === "1";

  return (
    <div className="container-x py-12 lg:py-20">
      <div className="mx-auto max-w-md">
        <Link
          href={ROUTES.home}
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

        <h1 className="mt-7 text-2xl font-bold tracking-tight text-ink-950">
          Đăng nhập tài khoản
        </h1>
        <p className="mt-2 text-sm text-ink-600">
          Xem lịch sử đơn hàng, quản lý sổ địa chỉ và danh sách yêu thích của
          bạn.
        </p>

        {registered && (
          <div
            role="status"
            className="mt-6 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800"
          >
            Đăng ký thành công. Vui lòng đăng nhập để tiếp tục. Nếu chưa nhận
            được email xác nhận, bạn vẫn có thể đăng nhập và xác nhận sau.
          </div>
        )}

        <Suspense fallback={null}>
          <CustomerLoginForm />
        </Suspense>

        <div className="mt-8 rounded-xl border border-ink-200 bg-ink-50 p-4">
          <h2 className="flex items-center gap-2 text-sm font-semibold text-ink-900">
            <ShieldCheck className="size-4 text-brand-600" />
            Bảo mật tài khoản
          </h2>
          <ul className="mt-2 space-y-1.5 text-xs leading-5 text-ink-600">
            <li className="flex gap-2">
              <UserRound className="mt-0.5 size-3.5 shrink-0 text-ink-400" />
              Mật khẩu được lưu ở dạng băm (bcrypt), không lưu bản rõ.
            </li>
            <li className="flex gap-2">
              <UserRound className="mt-0.5 size-3.5 shrink-0 text-ink-400" />
              Email xác nhận giúp bảo vệ tài khoản và khôi phục quyền truy cập.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
