import type { Metadata } from "next";
import { requireUser } from "@/lib/auth/session";
import PasswordForm from "./PasswordForm";

export const metadata: Metadata = { title: "Hesabım" };

export default async function HesabimPage() {
  const user = await requireUser();

  return (
    <>
      <div className="adm-page-head">
        <div>
          <h1>Hesabım</h1>
          <p>
            {user.name} · {user.email} ·{" "}
            {user.role === "admin" ? "Yönetici" : "Editör"}
          </p>
        </div>
      </div>

      <div className="adm-card">
        <h2>Şifre değiştir</h2>
        <PasswordForm />
      </div>
    </>
  );
}
