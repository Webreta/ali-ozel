import type { Metadata } from "next";
import Link from "next/link";
import { asc, count, eq } from "drizzle-orm";
import { db } from "@/db";
import { accessCodes, brandNotes, noteComments } from "@/db/schema";
import { requireUser } from "@/lib/auth/session";
import Icon from "@/components/Icon";

export const metadata: Metadata = { title: "Eğitim Notları" };

export default async function NotlarAdminPage() {
  await requireUser();
  const rows = await db
    .select({
      id: brandNotes.id,
      slug: brandNotes.slug,
      company: brandNotes.company,
      title: brandNotes.title,
      published: brandNotes.published,
      codeCount: count(accessCodes.id),
    })
    .from(brandNotes)
    .leftJoin(accessCodes, eq(accessCodes.brandNoteId, brandNotes.id))
    .groupBy(brandNotes.id)
    .orderBy(asc(brandNotes.company));

  const pending = await db
    .select({ noteId: noteComments.brandNoteId, n: count() })
    .from(noteComments)
    .where(eq(noteComments.approved, false))
    .groupBy(noteComments.brandNoteId);
  const pendingByNote = new Map(pending.map((p) => [p.noteId, Number(p.n)]));

  return (
    <>
      <div className="adm-page-head">
        <div>
          <h1>Eğitim notları</h1>
          <p>{rows.length} kurum sayfası — erişim kodlarıyla korunur.</p>
        </div>
        <Link href="/admin/egitim-notlari/yeni" className="btn btn-primary">
          <Icon name="plus" /> Yeni not sayfası
        </Link>
      </div>

      <div className="adm-card">
        {rows.length === 0 ? (
          <div className="adm-empty">
            <Icon name="layers" />
            <p>Henüz not sayfası yok.</p>
          </div>
        ) : (
          <table className="adm-table">
            <thead>
              <tr>
                <th>Kurum</th>
                <th>Program</th>
                <th>Kod sayısı</th>
                <th>Bekleyen yorum</th>
                <th>Durum</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((n) => (
                <tr key={n.id}>
                  <td>
                    <Link href={`/admin/egitim-notlari/${n.id}`} className="adm-row-link">
                      {n.company}
                    </Link>
                  </td>
                  <td>{n.title}</td>
                  <td>{n.codeCount}</td>
                  <td>
                    {pendingByNote.get(n.id) ? (
                      <span className="adm-badge is-new">
                        {pendingByNote.get(n.id)} yorum
                      </span>
                    ) : (
                      "—"
                    )}
                  </td>
                  <td>
                    <span className={`adm-badge ${n.published ? "is-done" : "is-muted"}`}>
                      {n.published ? "Yayında" : "Gizli"}
                    </span>
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
