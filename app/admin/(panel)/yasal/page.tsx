import type { Metadata } from "next";
import Link from "next/link";
import { asc } from "drizzle-orm";
import { db } from "@/db";
import { legalPages } from "@/db/schema";
import { requireUser } from "@/lib/auth/session";
import ConfirmDelete from "@/components/admin/ConfirmDelete";
import LegalForm from "./LegalForm";
import { createLegalPage, deleteLegalPage } from "./actions";

export const metadata: Metadata = { title: "Yasal Sayfalar" };

export default async function YasalPage() {
  await requireUser();
  const rows = await db
    .select()
    .from(legalPages)
    .orderBy(asc(legalPages.title));

  return (
    <>
      <div className="adm-page-head">
        <div>
          <h1>Yasal Sayfalar</h1>
          <p>
            Gizlilik, KVKK, çerez politikası gibi metinler — formlarda onay
            olarak da seçilebilir.
          </p>
        </div>
      </div>

      <div className="adm-card">
        <h2>+ Yeni yasal sayfa</h2>
        <LegalForm action={createLegalPage} />
      </div>

      <div className="adm-card">
        <h2>Tüm sayfalar ({rows.length})</h2>
        {rows.length === 0 ? (
          <p className="adm-hint">Henüz sayfa yok.</p>
        ) : (
          <table className="adm-table">
            <tbody>
              {rows.map((p) => (
                <tr key={p.id}>
                  <td>
                    <Link href={`/admin/yasal/${p.id}`} className="adm-row-link">
                      {p.title}
                    </Link>
                    <span className="adm-hint">/yasal/{p.slug}</span>
                  </td>
                  <td style={{ textAlign: "right", whiteSpace: "nowrap" }}>
                    <div style={{ display: "inline-flex", gap: 8 }}>
                      <Link href={`/yasal/${p.slug}`} target="_blank" className="btn btn-outline">
                        Gör ↗
                      </Link>
                      <Link href={`/admin/yasal/${p.id}`} className="btn btn-outline">
                        Düzenle
                      </Link>
                      <ConfirmDelete
                        action={deleteLegalPage.bind(null, p.id)}
                        confirmText={`"${p.title}" sayfası silinecek. Formlarda onay olarak seçiliyse onay kutusu kaybolur.`}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}
