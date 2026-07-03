import type { Metadata } from "next";
import { asc } from "drizzle-orm";
import { db } from "@/db";
import { referenceLogos } from "@/db/schema";
import { requireUser } from "@/lib/auth/session";
import ConfirmDelete from "@/components/admin/ConfirmDelete";
import ReferenceForm from "./ReferenceForm";
import { deleteReference, moveReference, toggleReference } from "./actions";

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
            {rows.length} logo — sıralama, tanınan markaları dağıtacak şekilde
            sitedeki görünüm sırasıdır.
          </p>
        </div>
      </div>

      <div className="adm-card">
        <h2>Yeni referans</h2>
        <ReferenceForm />
      </div>

      <div className="adm-card">
        <div className="adm-ref-grid">
          {rows.map((r, i) => (
            <figure className="adm-ref-cell" key={r.id}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={r.src} alt={r.name} />
              <figcaption>{r.name}</figcaption>
              <span className={`adm-badge ${r.published ? "is-done" : "is-muted"}`}>
                {r.published ? "Yayında" : "Gizli"}
              </span>
              <div className="adm-ref-actions">
                <form action={moveReference.bind(null, r.id, "up")}>
                  <button type="submit" className="adm-icon-btn" disabled={i === 0} title="Öne al">
                    ↑
                  </button>
                </form>
                <form action={moveReference.bind(null, r.id, "down")}>
                  <button
                    type="submit"
                    className="adm-icon-btn"
                    disabled={i === rows.length - 1}
                    title="Arkaya al"
                  >
                    ↓
                  </button>
                </form>
                <form action={toggleReference.bind(null, r.id, !r.published)}>
                  <button type="submit" className="adm-icon-btn" title={r.published ? "Gizle" : "Yayınla"}>
                    {r.published ? "◎" : "○"}
                  </button>
                </form>
                <ConfirmDelete
                  action={deleteReference.bind(null, r.id)}
                  label="Sil"
                  confirmText={`"${r.name}" logosu silinecek. Emin misiniz?`}
                />
              </div>
            </figure>
          ))}
        </div>
      </div>
    </>
  );
}
