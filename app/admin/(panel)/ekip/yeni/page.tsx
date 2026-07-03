import type { Metadata } from "next";
import { requireUser } from "@/lib/auth/session";
import TeamForm from "../TeamForm";
import { createMember } from "../actions";

export const metadata: Metadata = { title: "Yeni Ekip Üyesi" };

export default async function YeniUyePage() {
  await requireUser();
  return (
    <>
      <div className="adm-page-head">
        <div>
          <h1>Yeni ekip üyesi</h1>
        </div>
      </div>
      <div className="adm-card">
        <TeamForm action={createMember} />
      </div>
    </>
  );
}
