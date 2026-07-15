import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumb from "@/components/Breadcrumb";
import Icon from "@/components/Icon";
import CTA from "@/components/CTA";
import { getTeam } from "@/lib/data/team";

export const metadata: Metadata = {
  title: "Ekibimiz",
  description:
    "Ali Özel San Eğitim & Danışmanlık ekibi — akademiden sahaya, alanında uzman eğitmen ve danışmanlardan oluşan bir kadro.",
};

type Member = {
  name: string;
  roleTitle: string;
  bio: string;
  photo: string | null;
  initials: string | null;
  slug: string | null;
  detailBio: string;
};

function MemberCard({ m, lead = false }: { m: Member; lead?: boolean }) {
  const hasDetail = Boolean(m.slug && m.detailBio);
  return (
    <div className={`member-card${lead ? " member-lead" : ""}`}>
      <div className="member-photo">
        {m.photo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={m.photo} alt={m.name} />
        ) : (
          <span className="member-initials">{m.initials}</span>
        )}
      </div>
      <div className="member-body">
        <span className="member-role">{m.roleTitle}</span>
        <h3 className="member-name">{m.name}</h3>
        <p className="member-bio">{m.bio}</p>
        {hasDetail ? (
          <Link
            href={`/ekibimiz/${m.slug}`}
            className={`btn member-btn${lead ? " btn-primary" : " btn-outline"}`}
          >
            Hakkında
            <Icon name="arrow-right" />
          </Link>
        ) : null}
      </div>
    </div>
  );
}

export default async function EkibimizPage() {
  const team = await getTeam();
  // İlk sıradaki üye (kurucu) hero'da öne çıkar, kalanlar grid'de listelenir
  const [lead, ...rest] = team;

  return (
    <>
      <section className="page-hero on-brand team-hero">
        <div className="container">
          <Breadcrumb items={[{ label: "Ekibimiz" }]} />
          <div className="team-hero-grid">
            <div className="team-hero-aside">
              {lead ? <MemberCard m={lead} lead /> : null}
            </div>
            <div className="team-hero-main">
              <span className="badge">Ekibimiz</span>
              <h1>Gücünü deneyimden alan uzman kadro</h1>
              <p className="page-lead">
                On binlerce katılımcıya dokunan, kurumların gerçeğini bilen
                eğitmenlerimizle; teoriyi yaşanmış deneyimle buluşturan bir
                ekip.
              </p>
              <div className="team-hero-stats">
                <div>
                  <strong>{team.length}+</strong>
                  <span>Uzman eğitmen</span>
                </div>
                <div>
                  <strong>50.000+</strong>
                  <span>Eğitilen katılımcı</span>
                </div>
                <div>
                  <strong>35+ yıl</strong>
                  <span>Kurumsal deneyim</span>
                </div>
                <div>
                  <strong>15+ yıl</strong>
                  <span>Eğitmenlik deneyimi</span>
                </div>
              </div>
              <div className="team-hero-tags">
                <span>Liderlik</span>
                <span>Satış &amp; İletişim</span>
                <span>İK &amp; Gelişim</span>
                <span>Üretim Sahası</span>
                <span>Yapay Zekâ ve Liderlik</span>
              </div>
              <blockquote className="team-hero-quote">
                Yalnız gidersen hızlı gidersin; birlikte gidersen uzağa.
                <cite>Afrika atasözü</cite>
              </blockquote>
            </div>
          </div>
        </div>
      </section>

      <section className="section team-body">
        <div className="container">
          <div className="member-grid">
            {rest.map((m) => (
              <MemberCard key={m.name} m={m} />
            ))}
          </div>
        </div>
      </section>

      <CTA />
    </>
  );
}
