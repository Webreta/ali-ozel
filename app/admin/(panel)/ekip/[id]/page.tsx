import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { teamMembers } from "@/db/schema";
import { requireUser } from "@/lib/auth/session";
import TeamForm from "../TeamForm";
import { updateMember } from "../actions";

export const metadata: Metadata = { title: "Ekip Üyesini Düzenle" };

export default async function UyeDuzenlePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireUser();
  const { id } = await params;
  const numericId = Number(id);
  if (!Number.isInteger(numericId)) notFound();

  const [m] = await db
    .select()
    .from(teamMembers)
    .where(eq(teamMembers.id, numericId))
    .limit(1);
  if (!m) notFound();

  return (
    <>
      <div className="adm-page-head">
        <div>
          <h1>{m.name}</h1>
          <p>Ekip üyesini düzenle</p>
        </div>
      </div>
      <div className="adm-card">
        <TeamForm action={updateMember.bind(null, m.id)} initialData={m} />
      </div>
    </>
  );
}
