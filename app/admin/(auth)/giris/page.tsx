import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/session";
import LoginForm from "./LoginForm";
import "../../admin.css";

export const metadata: Metadata = {
  title: "Yönetim Paneli — Giriş",
  robots: { index: false, follow: false },
};

export default async function GirisPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const user = await getCurrentUser();
  if (user) redirect("/admin");
  const { next } = await searchParams;

  return (
    <div className="adm-login-shell">
      <div className="adm-login-card">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo.png" alt="Ali Özel San Eğitim & Danışmanlık" />
        <h1>Yönetim Paneli</h1>
        <p>Devam etmek için giriş yapın.</p>
        <LoginForm next={next} />
      </div>
    </div>
  );
}
