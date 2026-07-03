import Link from "next/link";
import { count, desc, eq } from "drizzle-orm";
import { db } from "@/db";
import {
  blogPosts,
  brandNotes,
  noteComments,
  referenceLogos,
  submissions,
  teamMembers,
  trainings,
} from "@/db/schema";
import { requireUser } from "@/lib/auth/session";
import Icon from "@/components/Icon";

export default async function DashboardPage() {
  const user = await requireUser();
  const isAdmin = user.role === "admin";

  const [
    [newSubmissions],
    [publishedPosts],
    [draftPosts],
    [trainingCount],
    [noteCount],
    [teamCount],
    [refCount],
    [pendingComments],
    recent,
  ] = await Promise.all([
    db.select({ n: count() }).from(submissions).where(eq(submissions.handled, false)),
    db.select({ n: count() }).from(blogPosts).where(eq(blogPosts.status, "published")),
    db.select({ n: count() }).from(blogPosts).where(eq(blogPosts.status, "draft")),
    db.select({ n: count() }).from(trainings),
    db.select({ n: count() }).from(brandNotes),
    db.select({ n: count() }).from(teamMembers),
    db.select({ n: count() }).from(referenceLogos),
    db.select({ n: count() }).from(noteComments).where(eq(noteComments.approved, false)),
    isAdmin
      ? db
          .select()
          .from(submissions)
          .orderBy(desc(submissions.createdAt))
          .limit(5)
      : Promise.resolve([]),
  ]);

  return (
    <>
      <div className="adm-page-head">
        <div>
          <h1>Hoş geldin, {user.name} 👋</h1>
          <p>Sitenin genel durumu ve son hareketler.</p>
        </div>
      </div>

      <div className="adm-stat-grid">
        {isAdmin ? (
          <div className={`adm-stat${newSubmissions.n > 0 ? " is-alert" : ""}`}>
            <strong>{newSubmissions.n}</strong>
            <span>Yeni talep</span>
          </div>
        ) : null}
        <div className="adm-stat">
          <strong>{publishedPosts.n}</strong>
          <span>Yayında blog yazısı{draftPosts.n > 0 ? ` (+${draftPosts.n} taslak)` : ""}</span>
        </div>
        <div className="adm-stat">
          <strong>{trainingCount.n}</strong>
          <span>Eğitim programı</span>
        </div>
        <div className="adm-stat">
          <strong>{noteCount.n}</strong>
          <span>Eğitim notu</span>
        </div>
        <div className="adm-stat">
          <strong>{teamCount.n}</strong>
          <span>Ekip üyesi</span>
        </div>
        <div className="adm-stat">
          <strong>{refCount.n}</strong>
          <span>Referans logosu</span>
        </div>
        <div className={`adm-stat${pendingComments.n > 0 ? " is-alert" : ""}`}>
          <strong>{pendingComments.n}</strong>
          <span>Onay bekleyen yorum</span>
        </div>
      </div>

      {isAdmin ? (
        <div className="adm-card">
          <h2>Son talepler</h2>
          {recent.length === 0 ? (
            <div className="adm-empty">
              <Icon name="mail" />
              <p>Henüz talep yok. Formdan gelen başvurular burada listelenecek.</p>
            </div>
          ) : (
            <table className="adm-table">
              <thead>
                <tr>
                  <th>Ad</th>
                  <th>E-posta</th>
                  <th>Tür</th>
                  <th>Tarih</th>
                  <th>Durum</th>
                </tr>
              </thead>
              <tbody>
                {recent.map((s) => (
                  <tr key={s.id}>
                    <td>
                      <Link href={`/admin/talepler/${s.id}`} className="adm-row-link">
                        {s.name}
                      </Link>
                    </td>
                    <td>{s.email}</td>
                    <td>{s.kind === "teklif" ? "Teklif" : "İletişim"}</td>
                    <td>
                      {s.createdAt.toLocaleDateString("tr-TR", {
                        day: "numeric",
                        month: "short",
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
      ) : null}

      <div className="adm-card">
        <h2>Hızlı işlemler</h2>
        <div className="adm-quick">
          <Link href="/admin/blog/yeni" className="btn btn-outline">
            <Icon name="plus" /> Yeni blog yazısı
          </Link>
          <Link href="/admin/egitim-notlari/yeni" className="btn btn-outline">
            <Icon name="plus" /> Yeni eğitim notu
          </Link>
          <Link href="/" target="_blank" className="btn btn-outline">
            <Icon name="arrow-up-right" /> Siteyi görüntüle
          </Link>
        </div>
      </div>
    </>
  );
}
