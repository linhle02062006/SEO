import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { getSession } from "@/lib/auth";
import { ROUTES, SITE } from "@/lib/site";
import { CustomerRegisterForm } from "@/components/account/CustomerRegisterForm";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: { absolute: `Đăng ký tài khoản | ${SITE.name}` },
  robots: { index: false, follow: false },
};

export default async function RegisterPage() {
  const session = await getSession();
  if (session) {
    redirect(ROUTES.account);
  }

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
          Tạo tài khoản khách hàng
        </h1>
        <p className="mt-2 text-sm text-ink-600">
          Đăng ký để theo dõi đơn hàng và lưu sản phẩm yêu thích của bạn.
        </p>

        <CustomerRegisterForm />

        <div className="mt-8 rounded-xl border border-ink-200 bg-ink-50 p-4">
          <h2 className="flex items-center gap-2 text-sm font-semibold text-ink-900">
            <CheckCircle2 className="size-4 text-brand-600" />
            Bạn sẽ có gì?
          </h2>
          <ul className="mt-2 space-y-1.5 text-xs leading-5 text-ink-600">
            <li>• Lịch sử đơn hàng và trạng thái giao hàng.</li>
            <li>• Sổ địa chỉ để đặt hàng nhanh hơn lần sau.</li>
            <li>• Danh sách yêu thích sản phẩm.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
