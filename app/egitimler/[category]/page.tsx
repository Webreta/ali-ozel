import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Breadcrumb from "@/components/Breadcrumb";
import TrainingCard from "@/components/TrainingCard";
import Icon from "@/components/Icon";
import CTA from "@/components/CTA";
import TeklifButton from "@/components/TeklifButton";
import { categories, getCategory } from "@/lib/content";

type Params = { category: string };

export function generateStaticParams() {
  return categories.map((c) => ({ category: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { category } = await params;
  const cat = getCategory(category);
  if (!cat) return { title: "Eğitim bulunamadı" };
  return {
    title: cat.name,
    description: cat.summary,
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { category } = await params;
  const cat = getCategory(category);
  if (!cat) notFound();

  return (
    <>
      <section className="page-hero on-brand hero-extended">
        <Icon name={cat.icon} className="hero-watermark" strokeWidth={1} />
        <div className="container">
          <Breadcrumb
            items={[
              { label: "Eğitimler", href: "/egitimler" },
              { label: cat.shortName },
            ]}
          />
          <span className="badge">
            <Icon name={cat.icon} style={{ width: 16, height: 16 }} />
            {cat.tagline}
          </span>
          <h1>{cat.name}</h1>
          <p className="page-lead">{cat.summary}</p>
          <div className="hero-count">
            <span className="hc-circle">{cat.trainings.length}</span>
            <div className="hc-info">
              <strong>program</strong>
              <span>
                Tüm programlar kurumunuzun ihtiyacına göre tek tek ya da bütün
                bir program olarak uyarlanabilir.
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="section detail-section">
        <div className="container">
          <div className="detail-grid">
            <div>
              <div className="grid" style={{ gap: 16 }}>
                {cat.trainings.map((t, i) => (
                  <TrainingCard
                    key={t.slug}
                    training={t}
                    number={i + 1}
                    categorySlug={cat.slug}
                  />
                ))}
              </div>
            </div>

            <aside className="detail-aside">
              <div className="aside-card dark teklif-card">
                <div className="teklif-banner">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/ali-ozel-form.jpg" alt="Ali Özel" />
                  <span className="teklif-tag">San Eğitim Danışmanlık</span>
                </div>
                <h4>Kuruma özel teklif</h4>
                <p>
                  Bu alandaki modülleri ekibinize göre uyarlayalım. İhtiyaç
                  analiziyle başlayan bir teklif hazırlayalım.
                </p>
                <TeklifButton className="btn btn-primary">
                  Teklif Al
                  <Icon name="arrow-right" />
                </TeklifButton>
              </div>
              <div className="aside-card aud-card">
                <h4>Bu programlar kimler için?</h4>
                <div className="aud-chips">
                  {cat.forWhom.map((w) => (
                    <span className="aud-chip" key={w}>
                      <span className="ac-dot">
                        <Icon name="check" />
                      </span>
                      <span className="ac-label">{w}</span>
                    </span>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <CTA />
    </>
  );
}
