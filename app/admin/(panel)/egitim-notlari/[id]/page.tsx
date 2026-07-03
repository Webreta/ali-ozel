import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { asc, eq } from "drizzle-orm";
import { db } from "@/db";
import {
  accessCodes,
  brandNoteMaterials,
  brandNotes,
  noteComments,
} from "@/db/schema";
import { requireUser } from "@/lib/auth/session";
import Icon from "@/components/Icon";
import ConfirmDelete from "@/components/admin/ConfirmDelete";
import ImageField from "@/components/admin/ImageField";
import SubmitButton from "@/components/admin/SubmitButton";
import BrandNoteForm from "../BrandNoteForm";
import {
  updateNote,
  deleteNote,
  addAccessCode,
  toggleAccessCode,
  deleteAccessCode,
  addMaterial,
  deleteMaterial,
  setCommentApproved,
  deleteComment,
} from "../actions";

export const metadata: Metadata = { title: "Eğitim Notunu Düzenle" };

export default async function NotDuzenlePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireUser();
  const { id } = await params;
  const numericId = Number(id);
  if (!Number.isInteger(numericId)) notFound();

  const [note] = await db
    .select()
    .from(brandNotes)
    .where(eq(brandNotes.id, numericId))
    .limit(1);
  if (!note) notFound();

  const [codes, materials, comments] = await Promise.all([
    db
      .select()
      .from(accessCodes)
      .where(eq(accessCodes.brandNoteId, note.id))
      .orderBy(asc(accessCodes.createdAt)),
    db
      .select()
      .from(brandNoteMaterials)
      .where(eq(brandNoteMaterials.brandNoteId, note.id))
      .orderBy(asc(brandNoteMaterials.sortOrder), asc(brandNoteMaterials.id)),
    db
      .select()
      .from(noteComments)
      .where(eq(noteComments.brandNoteId, note.id))
      .orderBy(asc(noteComments.createdAt)),
  ]);

  return (
    <>
      <div className="adm-page-head">
        <div>
          <h1>{note.company}</h1>
          <p>
            /egitim-notlari/{note.slug}
            {" · "}
            <Link
              href={`/egitim-notlari/${note.slug}`}
              target="_blank"
              className="adm-row-link"
              style={{ display: "inline" }}
            >
              Önizle ↗
            </Link>
          </p>
        </div>
        <ConfirmDelete
          action={deleteNote.bind(null, note.id)}
          label="Not sayfasını sil"
          confirmText={`"${note.company}" not sayfası, kodları ve yorumlarıyla birlikte silinecek. Emin misiniz?`}
        />
      </div>

      {/* Erişim kodları */}
      <div className="adm-card">
        <h2>Erişim kodları</h2>
        {codes.length > 0 ? (
          <table className="adm-table" style={{ marginBottom: 16 }}>
            <thead>
              <tr>
                <th>Kod</th>
                <th>Durum</th>
                <th style={{ width: 180 }}></th>
              </tr>
            </thead>
            <tbody>
              {codes.map((c) => (
                <tr key={c.id}>
                  <td style={{ fontFamily: "monospace", fontWeight: 700 }}>{c.code}</td>
                  <td>
                    <span className={`adm-badge ${c.active ? "is-done" : "is-muted"}`}>
                      {c.active ? "Aktif" : "Pasif"}
                    </span>
                  </td>
                  <td style={{ textAlign: "right" }}>
                    <div style={{ display: "inline-flex", gap: 8 }}>
                      <form action={toggleAccessCode.bind(null, c.id, !c.active)}>
                        <button type="submit" className="btn btn-outline">
                          {c.active ? "Pasifleştir" : "Aktifleştir"}
                        </button>
                      </form>
                      <ConfirmDelete
                        action={deleteAccessCode.bind(null, c.id)}
                        confirmText={`"${c.code}" kodu silinecek. Bu kodla giriş yapılamayacak.`}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p style={{ color: "var(--muted)", marginBottom: 16 }}>
            Henüz kod yok — ziyaretçiler bu sayfayı açamaz.
          </p>
        )}
        <form action={addAccessCode.bind(null, note.id)} className="adm-form-row" style={{ maxWidth: 520 }}>
          <div className="adm-field">
            <input name="code" placeholder="YENI-KOD-2026" required />
          </div>
          <div className="adm-form-actions" style={{ paddingTop: 0 }}>
            <SubmitButton>Kod ekle</SubmitButton>
          </div>
        </form>
      </div>

      {/* Materyaller */}
      <div className="adm-card">
        <h2>Materyaller (PDF)</h2>
        {materials.length > 0 ? (
          <table className="adm-table" style={{ marginBottom: 16 }}>
            <thead>
              <tr>
                <th>Ad</th>
                <th>Dosya</th>
                <th style={{ width: 100 }}></th>
              </tr>
            </thead>
            <tbody>
              {materials.map((m) => (
                <tr key={m.id}>
                  <td>{m.name}</td>
                  <td>
                    {m.filePath ? (
                      <span className="adm-badge is-done">Yüklendi</span>
                    ) : (
                      <span className="adm-badge is-muted">Dosya yok</span>
                    )}
                  </td>
                  <td style={{ textAlign: "right" }}>
                    <ConfirmDelete
                      action={deleteMaterial.bind(null, m.id)}
                      confirmText={`"${m.name}" materyali silinecek.`}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : null}
        <form action={addMaterial.bind(null, note.id)} className="adm-form" style={{ maxWidth: 520 }}>
          <div className="adm-field">
            <label htmlFor="mat-name">Materyal adı</label>
            <input id="mat-name" name="name" placeholder="ör. Eğitim Sunumu" required />
          </div>
          <ImageField
            name="fileUrl"
            label="PDF dosyası"
            accept="application/pdf"
            hint="Dosya, yalnızca erişim kodu olanların indirebileceği korumalı uçtan servis edilir."
          />
          <div className="adm-form-actions">
            <SubmitButton>Materyal ekle</SubmitButton>
          </div>
        </form>
      </div>

      {/* Yorumlar */}
      <div className="adm-card">
        <h2>Yorumlar</h2>
        {comments.length === 0 ? (
          <div className="adm-empty">
            <Icon name="quote" />
            <p>Henüz yorum yok.</p>
          </div>
        ) : (
          <table className="adm-table">
            <thead>
              <tr>
                <th>Ad</th>
                <th>Yorum</th>
                <th>Tarih</th>
                <th>Durum</th>
                <th style={{ width: 190 }}></th>
              </tr>
            </thead>
            <tbody>
              {comments.map((c) => (
                <tr key={c.id}>
                  <td>{c.name}</td>
                  <td style={{ maxWidth: 340 }}>{c.body}</td>
                  <td>
                    {c.createdAt.toLocaleDateString("tr-TR", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td>
                    <span className={`adm-badge ${c.approved ? "is-done" : "is-new"}`}>
                      {c.approved ? "Onaylı" : "Bekliyor"}
                    </span>
                  </td>
                  <td style={{ textAlign: "right" }}>
                    <div style={{ display: "inline-flex", gap: 8 }}>
                      <form action={setCommentApproved.bind(null, c.id, !c.approved)}>
                        <button type="submit" className="btn btn-outline">
                          {c.approved ? "Gizle" : "Onayla"}
                        </button>
                      </form>
                      <ConfirmDelete
                        action={deleteComment.bind(null, c.id)}
                        confirmText="Yorum kalıcı olarak silinecek."
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Not içeriği */}
      <div className="adm-card">
        <h2>Sayfa içeriği</h2>
        <BrandNoteForm action={updateNote.bind(null, note.id)} initialData={note} />
      </div>
    </>
  );
}
