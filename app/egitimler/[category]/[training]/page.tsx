import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Breadcrumb from "@/components/Breadcrumb";
import Icon from "@/components/Icon";
import Faq from "@/components/Faq";
import CTA from "@/components/CTA";
import { categories, getTraining } from "@/lib/content";

type Params = { category: string; training: string };

export function generateStaticParams() {
  return categories.flatMap((c) =>
    c.trainings.map((t) => ({ category: c.slug, training: t.slug }))
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { category, training } = await params;
  const found = getTraining(category, training);
  if (!found) return { title: "Eğitim bulunamadı" };
  const { training: t } = found;
  if (t.page) {
    return { title: t.page.seoTitle, description: t.page.seoDescription };
  }
  return { title: t.title, description: t.blurb };
}

export default async function TrainingPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { category, training } = await params;
  const found = getTraining(category, training);
  if (!found) notFound();
  const { category: cat, training: t } = found;

  const crumbs = [
    { label: "Eğitimler", href: "/egitimler" },
    { label: cat.shortName, href: `/egitimler/${cat.slug}` },
    { label: t.title },
  ];

  // Detaylı içerik henüz hazır değilse zarif bir placeholder göster
  if (!t.page) {
    return (
      <>
        <section className="page-hero on-brand">
          <div className="container">
            <Breadcrumb items={crumbs} />
            <span className="badge">
              <Icon name={cat.icon} style={{ width: 16, height: 16 }} />
              {cat.shortName}
            </span>
            <h1>{t.title}</h1>
            <p className="page-lead">{t.blurb}</p>
          </div>
        </section>
        <section className="section">
          <div className="container">
            <div className="empty-state">
              <div className="es-icon">
                <Icon name="sparkle" />
              </div>
              <h2>Detaylı içerik hazırlanıyor</h2>
              <p className="section-desc" style={{ marginBottom: 28 }}>
                Bu modülün ayrıntılı sayfası çok yakında yayında olacak. Bu arada
                bu modülü ekibinize özel olarak hemen planlayabiliriz.
              </p>
              <div
                className="cta-actions"
                style={{ display: "flex", gap: 14, flexWrap: "wrap", justifyContent: "center" }}
              >
                <Link href="/iletisim" className="btn btn-primary">
                  Bu Eğitim İçin Teklif Al <Icon name="arrow-right" />
                </Link>
                <Link href={`/egitimler/${cat.slug}`} className="btn btn-outline">
                  Diğer Modüller
                </Link>
              </div>
            </div>
          </div>
        </section>
      </>
    );
  }

  const p = t.page;

  return (
    <>
      <section className="page-hero on-brand">
        <div className="container">
          <Breadcrumb items={crumbs} />
          <span className="badge">
            <Icon name={cat.icon} style={{ width: 16, height: 16 }} />
            {cat.shortName}
          </span>
          <h1>{t.title}</h1>
          <p className="page-lead">{p.intro[0]}</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="detail-grid">
            <article>
              <p className="detail-quote">{p.heroQuote}</p>
              {p.intro.slice(1).map((para, i) => (
                <p className="lead" key={i}>
                  {para}
                </p>
              ))}

              <div style={{ margin: "32px 0 8px" }}>
                <span className="eyebrow">Kimler İçin?</span>
                <p>{p.audience}</p>
              </div>

              <div style={{ marginTop: 40 }}>
                <span className="eyebrow">Eğitim İçeriği</span>
                <h2 className="section-title" style={{ marginBottom: 22 }}>
                  Program modülleri
                </h2>
                {p.sections.map((s, i) => (
                  <div className="module" key={i}>
                    <h3>
                      <span className="m-num">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      {s.title}
                    </h3>
                    <p>{s.intro}</p>
                    <ul>
                      {s.bullets.map((b, j) => (
                        <li key={j}>{b}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              <div style={{ marginTop: 44 }}>
                <span className="eyebrow">Kazanımlar</span>
                <h2 className="section-title" style={{ marginBottom: 22 }}>
                  Eğitim sonunda katılımcılar
                </h2>
                <div className="outcome-grid">
                  {p.outcomes.map((o, i) => (
                    <div className="outcome" key={i}>
                      <Icon name="check-circle" />
                      <span>{o}</span>
                    </div>
                  ))}
                </div>
              </div>
            </article>

            <aside className="detail-aside">
              <div className="aside-card">
                <h4>Eğitim Bilgileri</h4>
                {p.format.map((f) => (
                  <div className="format-row" key={f.label}>
                    <span className="fr-label">{f.label}</span>
                    <span className="fr-value">{f.value}</span>
                  </div>
                ))}
              </div>
              <div className="aside-card dark">
                <h4>Kurumunuza özel planlayalım</h4>
                <p>
                  Bu eğitimi ekibinizin gerçek vakalarına göre uyarlayıp size
                  özel bir teklif hazırlayalım.
                </p>
                <a href="/iletisim" className="btn btn-primary">
                  Teklif Talep Et
                  <Icon name="arrow-right" />
                </a>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <section className="section section-soft">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">Sıkça Sorulan Sorular</span>
            <h2 className="section-title">Aklınızdaki sorular</h2>
          </div>
          <Faq items={p.faq} />
        </div>
      </section>

      <CTA />
    </>
  );
}
