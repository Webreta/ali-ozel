import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { marked } from "marked";
import Breadcrumb from "@/components/Breadcrumb";
import Icon from "@/components/Icon";
import CTA from "@/components/CTA";
import TeklifButton from "@/components/TeklifButton";
import { getMember, getTeam } from "@/lib/data/team";

type Params = { slug: string };

// Panelden eklenen yeni üyeler rebuild beklemeden açılabilsin
export const dynamicParams = true;

export async function generateStaticParams() {
  const team = await getTeam();
  return team
    .filter((m) => m.slug && m.detailBio)
    .map((m) => ({ slug: m.slug as string }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const member = await getMember(slug);
  if (!member) return { title: "Üye bulunamadı" };
  return {
    title: `${member.name} — ${member.roleTitle}`,
    description: member.bio,
  };
}

export default async function MemberPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const member = await getMember(slug);
  if (!member || !member.detailBio) notFound();

  const html = marked.parse(member.detailBio) as string;

  return (
    <>
      <section className="page-hero on-brand member-hero">
        <div className="container">
          <Breadcrumb
            items={[
              { label: "Ekibimiz", href: "/ekibimiz" },
              { label: member.name },
            ]}
          />
          <div className="member-hero-grid">
            <div className="member-hero-photo">
              {member.photo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={member.photo} alt={member.name} />
              ) : (
                <span className="member-initials">{member.initials}</span>
              )}
            </div>
            <div className="member-hero-main">
              <span className="badge">{member.roleTitle}</span>
              <h1>{member.name}</h1>
              <p className="page-lead">{member.bio}</p>
              {member.highlights.length > 0 ? (
                <div className="team-hero-stats">
                  {member.highlights.map((h) => (
                    <div key={h.label}>
                      <strong>{h.value}</strong>
                      <span>{h.label}</span>
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="detail-grid">
            <article
              className="prose"
              // İçerik yalnızca yetkili panel kullanıcılarınca yazılır
              dangerouslySetInnerHTML={{ __html: html }}
            />
            <aside className="detail-aside">
              {member.expertise.length > 0 ? (
                <div className="aside-card aud-card">
                  <h4>Eğitim &amp; uzmanlık alanları</h4>
                  <div className="aud-chips">
                    {member.expertise.map((e) => (
                      <span className="aud-chip" key={e}>
                        <span className="ac-dot">
                          <Icon name="check" />
                        </span>
                        <span className="ac-label">{e}</span>
                      </span>
                    ))}
                  </div>
                </div>
              ) : null}
              <div className="aside-card dark">
                <h4>Ekibimizle çalışın</h4>
                <p>
                  {member.name} ve ekibimizle kurumunuza özel bir eğitim
                  programı planlayalım.
                </p>
                <TeklifButton className="btn btn-primary">
                  Teklif Al
                  <Icon name="arrow-right" />
                </TeklifButton>
                <Link
                  href="/ekibimiz"
                  className="btn btn-outline"
                  style={{ marginTop: 10 }}
                >
                  Tüm ekibi gör
                </Link>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <CTA />
    </>
  );
}
