import type { Metadata } from "next";
import Link from "next/link";
import { and, desc, eq, count, ilike, or, type SQL } from "drizzle-orm";
import { db } from "@/db";
import { submissions } from "@/db/schema";
import { requireAdmin } from "@/lib/auth/session";
import Icon from "@/components/Icon";

export const metadata: Metadata = { title: "Talepler" };

export default async function TaleplerPage({
  searchParams,
}: {
  searchParams: Promise<{ durum?: string; q?: string }>;
}) {
  await requireAdmin();
  const { durum, q } = await searchParams;

  const conditions: SQL[] = [];
  if (durum === "yeni") conditions.push(eq(submissions.handled, false));
  if (durum === "yanitlandi") conditions.push(eq(submissions.handled, true));
  const query = q?.trim();
  if (query) {
    const pattern = `%${query}%`;
    conditions.push(
      or(
        ilike(submissions.name, pattern),
        ilike(submissions.email, pattern),
        ilike(submissions.message, pattern)
      )!
    );
  }
  const filter = conditions.length ? and(...conditions) : undefined;

  const [rows, [total], [open]] = await Promise.all([
    filter
      ? db.select().from(submissions).where(filter).orderBy(desc(submissions.createdAt))
      : db.select().from(submissions).orderBy(desc(submissions.createdAt)),
    db.select({ n: count() }).from(submissions),
    db.select({ n: count() }).from(submissions).where(eq(submissions.handled, false)),
  ]);

  return (
    <>
      <div className="adm-page-head">
        <div>
          <h1>Talepler</h1>
          <p>
            Toplam {total.n} başvuru · {open.n} yanıt bekliyor
          </p>
        </div>
        <div className="adm-quick">
          <Link
            href="/admin/talepler"
            className={`btn ${!durum ? "btn-primary" : "btn-outline"}`}
          >
            Tümü
          </Link>
          <Link
            href="/admin/talepler?durum=yeni"
            className={`btn ${durum === "yeni" ? "btn-primary" : "btn-outline"}`}
          >
            Yeni
          </Link>
          <Link
            href="/admin/talepler?durum=yanitlandi"
            className={`btn ${durum === "yanitlandi" ? "btn-primary" : "btn-outline"}`}
          >
            Yanıtlanan
          </Link>
        </div>
      </div>

      <div className="adm-card">
        <form method="get" className="adm-search">
          {durum ? <input type="hidden" name="durum" value={durum} /> : null}
          <input
            type="search"
            name="q"
            defaultValue={q ?? ""}
            placeholder="Ad, e-posta veya mesajda ara…"
            aria-label="Taleplerde ara"
          />
          <button type="submit" className="btn btn-outline">Ara</button>
        </form>
        {rows.length === 0 ? (
          <div className="adm-empty">
            <Icon name="mail" />
            <p>{query ? `"${query}" için sonuç yok.` : "Bu filtrede talep yok."}</p>
          </div>
        ) : (
          <table className="adm-table">
            <thead>
              <tr>
                <th>Ad</th>
                <th>E-posta</th>
                <th>Telefon</th>
                <th>Tür</th>
                <th>Kaynak</th>
                <th>Tarih</th>
                <th>Durum</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((s) => (
                <tr key={s.id}>
                  <td>
                    <Link href={`/admin/talepler/${s.id}`} className="adm-row-link">
                      {s.name}
                    </Link>
                  </td>
                  <td>{s.email}</td>
                  <td>{s.phone ?? "—"}</td>
                  <td>{s.kind === "teklif" ? "Teklif" : "İletişim"}</td>
                  <td>{s.pagePath ?? "—"}</td>
                  <td>
                    {s.createdAt.toLocaleDateString("tr-TR", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                  <td>
                    <span className={`adm-badge ${s.handled ? "is-done" : "is-new"}`}>
                      {s.handled ? "Yanıtlandı" : "Yeni"}
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
