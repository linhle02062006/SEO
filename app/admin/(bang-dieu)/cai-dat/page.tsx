import type { Metadata } from "next";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { SettingsForm } from "@/components/admin/SettingsForm";
import { SocialProfilesManager } from "@/components/admin/SocialProfilesManager";
import { getSettings } from "@/services/admin-service";
import { getSocialProfiles } from "@/services/seo-service";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Cài đặt website",
  robots: { index: false, follow: false },
};

export default async function AdminSettingsPage() {
  const [settings, socialProfiles] = await Promise.all([
    getSettings(),
    getSocialProfiles(),
  ]);

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Cài đặt website"
        description="Cấu hình thông tin thương hiệu, liên hệ, hồ sơ mạng xã hội và các khoá dùng cho Schema.org, sitemap, robots và Open Graph."
      />

      <SettingsForm settings={settings} />

      <SocialProfilesManager socialProfiles={socialProfiles} />
    </div>
  );
}
