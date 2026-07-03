import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { and, asc, eq } from "drizzle-orm";
import Icon from "@/components/Icon";
import NoteCommentForm from "@/components/NoteCommentForm";
import { db } from "@/db";
import { brandNoteMaterials, brandNotes, noteComments } from "@/db/schema";
import { getAccessibleNoteIds } from "@/lib/noteAccess";
import { getCurrentUser } from "@/lib/auth/session";

// Erişim cookie'si her istekte okunur — bu sayfa statik üretilmez.
export const dynamic = "force-dynamic";

async function getNote(slug: string) {
  const [note] = await db
    .select()
    .from(brandNotes)
    .where(and(eq(brandNotes.slug, slug), eq(brandNotes.published, true)))
    .limit(1);
  return note ?? null;
}

function formatBytes(n: number | null): string {
  if (!n) return "";
  if (n >= 1024 * 1024) return `PDF · ${(n / (1024 * 1024)).toFixed(1)} MB`;
  return `PDF · ${Math.round(n / 1024)} KB`;
}

function relativeDateTr(date: Date): string {
  const days = Math.floor((Date.now() - date.getTime()) / (24 * 60 * 60 * 1000));
  if (days < 1) return "bugün";
  if (days < 7) return `${days} gün önce`;
  if (days < 30) return `${Math.floor(days / 7)} hafta önce`;
  if (days < 365) return `${Math.floor(days / 30)} ay önce`;
  return `${Math.floor(days / 365)} yıl önce`;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ brand: string }>;
}): Promise<Metadata> {
  const { brand } = await params;
  const note = await getNote(brand);
  if (!note) return { title: "Eğitim Notu bulunamadı" };
  return {
    title: `${note.company} — ${note.title} | Eğitim Notları`,
    description: note.intro?.slice(0, 150),
    robots: { index: false, follow: false },
  };
}

export default async function BrandNotePage({
  params,
}: {
  params: Promise<{ brand: string }>;
}) {
  const { brand } = await params;
  const note = await getNote(brand);
  if (!note) notFound();

  // Erişim: geçerli kod cookie'si VEYA giriş yapmış panel kullanıcısı (önizleme)
  const [accessible, user] = await Promise.all([
    getAccessibleNoteIds(),
    getCurrentUser(),
  ]);
  if (!accessible.includes(note.id) && !user) {
    redirect("/egitim-notlari?denied=1");
  }

  const [materials, comments] = await Promise.all([
    db
      .select()
      .from(brandNoteMaterials)
      .where(eq(brandNoteMaterials.brandNoteId, note.id))
      .orderBy(asc(brandNoteMaterials.sortOrder), asc(brandNoteMaterials.id)),
    db
      .select()
      .from(noteComments)
      .where(
        and(eq(noteComments.brandNoteId, note.id), eq(noteComments.approved, true))
      )
      .orderBy(asc(noteComments.createdAt)),
  ]);

  return (
    <div className="note-standalone">
      {/* kendine özel header */}
      <header className="ns-header">
        <div className="ns-wrap ns-header-inner">
          <span className="ns-brand">
            <span className="ns-logo">
              {note.logo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={note.logo} alt={note.company} />
              ) : null}
            </span>
            <span className="ns-brand-label">Eğitim Notları</span>
          </span>
          <Link href="/egitim-notlari" className="ns-back">
            <span aria-hidden>←</span> Tüm notlar
          </Link>
        </div>
      </header>

      {/* doküman başlığı */}
      <section className="ns-hero">
        <div className="ns-wrap">
          <span className="ns-co">
            {note.company}
            {note.eventDateLabel ? ` · ${note.eventDateLabel}` : ""}
          </span>
          <h1>{note.title}</h1>
          <p className="ns-lead">
            {note.company} ekibine özel hazırlanmış eğitim notları, materyaller
            ve programın saha çıktıları.
          </p>
          <div className="ns-meta">
            {note.meta.map((m) => (
              <div key={m.label}>
                <span>{m.label}</span>
                <strong>{m.value}</strong>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* içerik */}
      <main className="ns-main">
        <div className="ns-wrap ns-body">
          {note.intro ? (
            <section className="ns-block">
              <span className="ns-kicker">Proje Detayı</span>
              <h2>Programın hikâyesi</h2>
              <p className="ns-text">{note.intro}</p>
            </section>
          ) : null}

          {note.instructorNote ? (
            <section className="ns-block">
              <blockquote className="ns-quote">
                <Icon name="quote" />
                <p>{note.instructorNote}</p>
                <cite>Ali Özel · Baş Eğitmen</cite>
              </blockquote>
            </section>
          ) : null}

          {note.segments.length > 0 ? (
            <section className="ns-block">
              <span className="ns-kicker">Segmentler</span>
              <h2>Program akışı</h2>
              <div className="ns-segments">
                {note.segments.map((s, i) => (
                  <div className="ns-segment" key={s.title}>
                    <span className="ns-seg-num">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <h3>{s.title}</h3>
                      <p>{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ) : null}

          {note.notes.length > 0 ? (
            <section className="ns-block">
              <span className="ns-kicker">Eğitim Notları</span>
              <h2>Akılda kalanlar</h2>
              <ul className="ns-notes">
                {note.notes.map((n) => (
                  <li key={n}>
                    <Icon name="check" />
                    <span>{n}</span>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          {materials.length > 0 ? (
            <section className="ns-block">
              <span className="ns-kicker">Materyaller</span>
              <h2>İndirilebilir dosyalar</h2>
              <div className="ns-files">
                {materials.map((f) =>
                  f.filePath ? (
                    <a
                      className="ns-file"
                      href={`/api/materials/${f.id}`}
                      key={f.id}
                    >
                      <span className="ns-file-ic">PDF</span>
                      <span className="ns-file-txt">
                        <strong>{f.name}</strong>
                        <small>{formatBytes(f.sizeBytes)}</small>
                      </span>
                      <Icon name="arrow-up-right" />
                    </a>
                  ) : (
                    <span className="ns-file is-disabled" key={f.id}>
                      <span className="ns-file-ic">PDF</span>
                      <span className="ns-file-txt">
                        <strong>{f.name}</strong>
                        <small>Yakında eklenecek</small>
                      </span>
                    </span>
                  )
                )}
              </div>
            </section>
          ) : null}

          {note.gallery.length > 0 ? (
            <section className="ns-block">
              <span className="ns-kicker">Galeri</span>
              <h2>Eğitimden kareler</h2>
              <div className="ns-slider">
                {note.gallery.map((g) => (
                  <figure className="ns-slide" key={g.src + g.caption}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={g.src} alt={g.caption} />
                    <figcaption>{g.caption}</figcaption>
                  </figure>
                ))}
              </div>
            </section>
          ) : null}

          {note.feedback.length > 0 ? (
            <section className="ns-block">
              <span className="ns-kicker">Katılımcı Geri Bildirimi</span>
              <h2>Ekipten yansımalar</h2>
              <div className="ns-feedback">
                {note.feedback.map((f) => (
                  <div className="ns-fb" key={f.person + f.quote.slice(0, 20)}>
                    <p>“{f.quote}”</p>
                    <cite>{f.person}</cite>
                  </div>
                ))}
              </div>
            </section>
          ) : null}

          <section className="ns-block">
            <span className="ns-kicker">Yorumlar</span>
            <h2>Katılımcı yorumları</h2>
            <div className="ns-comments">
              {comments.map((c) => (
                <div className="ns-comment" key={c.id}>
                  <span className="ns-avatar">{c.initials}</span>
                  <div className="ns-comment-body">
                    <div className="ns-comment-head">
                      <strong>{c.name}</strong>
                      <span>{relativeDateTr(c.createdAt)}</span>
                    </div>
                    <p>{c.body}</p>
                  </div>
                </div>
              ))}
            </div>

            <NoteCommentForm noteId={note.id} />
          </section>
        </div>
      </main>

      {/* kendine özel footer */}
      <footer className="ns-footer">
        <div className="ns-wrap ns-footer-inner">
          <div>
            <strong>Ali Özel · San Eğitim &amp; Danışmanlık</strong>
            <p>
              Bu sayfa {note.company} ekibine özeldir ve yalnızca erişim koduyla
              görüntülenir.
            </p>
          </div>
          <Link href="/egitim-notlari" className="ns-footer-link">
            Tüm eğitim notları <Icon name="arrow-right" />
          </Link>
        </div>
      </footer>
    </div>
  );
}
