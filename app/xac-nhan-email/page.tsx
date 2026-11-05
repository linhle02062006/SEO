import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { CheckCircle2, XCircle, Mail } from "lucide-react";
import { verifyCustomerEmail } from "@/services/account-service";
import { ROUTES } from "@/lib/site";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: { absolute: "Xác nhận email | TechZone" },
  robots: { index: false, follow: false },
};

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function VerifyEmailPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const sp = await searchParams;
  const token = typeof sp["token"] === "string" ? sp["token"] : "";

  if (!token) {
    redirect(ROUTES.login);
  }

  const success = await verifyCustomerEmail(token).catch(() => false);

  return (
    <div className="container-x py-14 lg:py-20">
      <div className="mx-auto max-w-lg rounded-xl border border-ink-200 bg-white p-8 text-center">
        <span
          className={`mx-auto grid size-16 place-items-center rounded-full ${
            success ? "bg-emerald-50" : "bg-rose-50"
          }`}
        >
          {success ? (
            <CheckCircle2 className="size-9 text-emerald-600" />
          ) : (
            <XCircle className="size-9 text-rose-600" />
          )}
        </span>

        <h1 className="mt-5 text-2xl font-bold tracking-tight text-ink-950">
          {success ? "Xác nhận email thành công" : "Link xác nhận không hợp lệ"}
        </h1>

        <p className="mt-3 text-sm leading-6 text-ink-600">
          {success
            ? "Tài khoản của bạn đã được kích hoạt. Bây giờ bạn có thể đăng nhập để xem lịch sử đơn hàng, quản lý sổ địa chỉ và danh sách yêu thích."
            : "Link xác nhận đã hết hạn hoặc không tồn tại. Bạn có thể đăng nhập và yêu cầu gửi lại link xác nhận mới."}
        </p>

        <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href={ROUTES.login}
            className="inline-block rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700"
          >
            Đăng nhập
          </Link>
          <Link
            href={ROUTES.products}
            className="inline-block rounded-lg border border-ink-200 px-5 py-2.5 text-sm font-medium text-ink-700 transition hover:bg-ink-50"
          >
            Tiếp tục mua sắm
          </Link>
        </div>

        {!success && (
          <p className="mt-6 flex items-center justify-center gap-1.5 text-xs text-ink-500">
            <Mail className="size-3.5" />
            Kiểm tra hộp thư spam nếu bạn không thấy email xác nhận.
          </p>
        )}
      </div>
    </div>
  );
}
