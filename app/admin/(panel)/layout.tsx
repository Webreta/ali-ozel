import type { Metadata } from "next";
import { Suspense } from "react";
import { requireUser } from "@/lib/auth/session";
import Sidebar from "@/components/admin/Sidebar";
import SavedToast from "@/components/admin/SavedToast";
import "../admin.css";

export const metadata: Metadata = {
  title: { default: "Yönetim Paneli", template: "%s | Yönetim Paneli" },
  robots: { index: false, follow: false },
};

export default async function PanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Gerçek yetki kontrolü burada — middleware yalnızca iyimser eleme yapar
  const user = await requireUser();

  return (
    <div className="adm-shell">
      <Sidebar user={user} />
      <main className="adm-main">{children}</main>
      <Suspense fallback={null}>
        <SavedToast />
      </Suspense>
    </div>
  );
}
