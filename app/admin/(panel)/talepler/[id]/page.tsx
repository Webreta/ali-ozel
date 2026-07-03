import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { submissions } from "@/db/schema";
import { requireAdmin } from "@/lib/auth/session";
import ConfirmDelete from "@/components/admin/ConfirmDelete";
import { setHandled, deleteSubmission } from "../actions";

export const metadata: Metadata = { title: "Talep Detayı" };

export default async function TalepDetayPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();
  const { id } = await params;
  const numericId = Number(id);
  if (!Number.isInteger(numericId)) notFound();

  const [s] = await db
    .select()
    .from(submissions)
    .where(eq(submissions.id, numericId))
    .limit(1);
  if (!s) notFound();

  const toggleHandled = setHandled.bind(null, s.id, !s.handled);
  const remove = deleteSubmission.bind(null, s.id);

  return (
    <>
      <div className="adm-page-head">
        <div>
          <h1>{s.name}</h1>
          <p>
            {s.kind === "teklif" ? "Teklif talebi" : "İletişim mesajı"} ·{" "}
            {s.createdAt.toLocaleDateString("tr-TR", {
              day: "numeric",
              month: "long",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>
        <span className={`adm-badge ${s.handled ? "is-done" : "is-new"}`}>
          {s.handled ? "Yanıtlandı" : "Yeni"}
        </span>
      </div>

      <div className="adm-card">
        <h2>İletişim bilgileri</h2>
        <table className="adm-table">
          <tbody>
            <tr>
              <td style={{ width: 160, fontWeight: 700 }}>E-posta</td>
              <td>
                <a href={`mailto:${s.email}`} className="adm-row-link">
                  {s.email}
                </a>
              </td>
            </tr>
            <tr>
              <td style={{ fontWeight: 700 }}>Telefon</td>
              <td>
                {s.phone ? (
                  <a href={`tel:${s.phone.replace(/\s/g, "")}`} className="adm-row-link">
                    {s.phone}
                  </a>
                ) : (
                  "—"
                )}
              </td>
            </tr>
            <tr>
              <td style={{ fontWeight: 700 }}>Gönderildiği sayfa</td>
              <td>{s.pagePath ?? "—"}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="adm-card">
        <h2>Mesaj</h2>
        <p style={{ whiteSpace: "pre-wrap", lineHeight: 1.7 }}>
          {s.message?.trim() || "(Mesaj bırakılmamış)"}
        </p>
      </div>

      <div className="adm-form-actions">
        <form action={toggleHandled}>
          <button type="submit" className="btn btn-primary">
            {s.handled ? "Yeni olarak işaretle" : "Yanıtlandı olarak işaretle"}
          </button>
        </form>
        <ConfirmDelete action={remove} label="Talebi sil" />
        <Link href="/admin/talepler" className="btn btn-outline">
          ← Listeye dön
        </Link>
      </div>
    </>
  );
}
