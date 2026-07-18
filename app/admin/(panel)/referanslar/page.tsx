import type { Metadata } from "next";
import { asc } from "drizzle-orm";
import { db } from "@/db";
import { referenceLogos } from "@/db/schema";
import { requireUser } from "@/lib/auth/session";
import ReferenceForm from "./ReferenceForm";
import ReferenceGrid from "./ReferenceGrid";

export const metadata: Metadata = { title: "Referanslar" };

export default async function ReferanslarAdminPage() {
  await requireUser();
  const rows = await db
    .select()
    .from(referenceLogos)
    .orderBy(asc(referenceLogos.sortOrder), asc(referenceLogos.id));

  return (
    <>
      <div className="adm-page-head">
        <div>
          <h1>Referanslar</h1>
          <p>
            {rows.length} logo — logoları sürükleyip bırakarak sitedeki görünüm
            sırasını değiştirebilirsiniz. Yeni eklenen logo en başa gelir.
          </p>
        </div>
      </div>

      <div className="adm-card">
        <h2>Yeni referans</h2>
        <ReferenceForm />
      </div>

      <div className="adm-card">
        <ReferenceGrid
          rows={rows.map((r) => ({
            id: r.id,
            name: r.name,
            src: r.src,
            published: r.published,
          }))}
        />
      </div>
    </>
  );
}
