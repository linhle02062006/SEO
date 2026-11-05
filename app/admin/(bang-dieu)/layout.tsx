import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminTopbar } from "@/components/admin/AdminTopbar";

export const dynamic = "force-dynamic";

export const metadata = {
  title: {
    absolute: "Quản trị TechZone",
    template: "%s | Quản trị TechZone",
  },
  robots: { index: false, follow: false },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/admin/dang-nhap");
  }

  if (!["admin", "editor"].includes(user!.role)) {
    redirect("/admin/dang-nhap?error=forbidden");
  }

  return (
    <div className="flex min-h-screen bg-ink-50">
      <AdminSidebar
        user={{ name: user!.name, email: user!.email, role: user!.role }}
      />

      <div className="flex min-w-0 flex-1 flex-col lg:pl-64">
        <AdminTopbar
          user={{ name: user!.name, email: user!.email, role: user!.role }}
        />
        <main className="flex-1 p-4 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
