import type { Metadata } from "next";
import Breadcrumb from "@/components/Breadcrumb";
import Icon from "@/components/Icon";
import CTA from "@/components/CTA";

export const metadata: Metadata = {
  title: "Ekibimiz",
  description:
    "Ali Özel San Eğitim & Danışmanlık ekibi — akademiden sahaya, alanında uzman eğitmen ve danışmanlardan oluşan bir kadro.",
};

type Member = {
  name: string;
  role: string;
  bio: string;
  photo?: string;
  initials?: string;
};

const team: Member[] = [
  {
    name: "Prof. Dr. Sabah Balta Ulay",
    role: "Yönetim & Strateji Profesörü",
    photo: "/team/sabah-balta-ulay.jpg",
    bio: "Yaşar Üniversitesi öğretim üyesi ve 14+ yıl YÜSEM müdürü. Yönetim, liderlik, motivasyon ve örgütsel gelişim alanlarında binlerce yöneticiye eğitim verdi.",
  },
  {
    name: "Taner Akdaş",
    role: "Satış & İletişim Eğitmeni · ICF Koç",
    photo: "/team/taner-akdas.jpg",
    bio: "ICF onaylı profesyonel koç. Satış, iletişim ve müşteri deneyimi alanında 21.000+ katılımcıya 13.000+ saat eğitim verdi; Garanti, Akbank, Hepsiburada gibi kurumlarla çalıştı.",
  },
  {
    name: "Timur Nihat Vreskala",
    role: "İş Geliştirme & Operasyon Uzmanı",
    photo: "/team/timur-vreskala.jpg",
    bio: "25+ yıllık kariyerinde IT proje yönetimi, çağrı merkezi, satış ve iş geliştirme alanlarında uzmanlaştı. 12.000+ katılımcıya 8.000+ saat eğitim verdi.",
  },
  {
    name: "Sevde Engin",
    role: "İK & Organizasyonel Gelişim Uzmanı",
    photo: "/team/sevde-engin.jpg",
    bio: "İK, organizasyonel gelişim ve eğitim yönetiminde 13+ yıl deneyim. Performans yönetimi, OKR sistemleri ve liderlik gelişimi alanlarında danışmanlık veriyor.",
  },
  {
    name: "Mehmet Yıldız",
    role: "Üretim & Operasyon Eğitmeni",
    initials: "MY",
    bio: "Saha üretiminden gelen deneyimiyle vardiya liderliği, iş güvenliği kültürü ve operasyonel verimlilik alanlarında eğitimler veriyor. (Örnek kart)",
  },
  {
    name: "Zeynep Kaya",
    role: "Satış & Müşteri Deneyimi Eğitmeni",
    initials: "ZK",
    bio: "Perakende ve hizmet sektöründe satış ekipleri, müşteri memnuniyeti ve ikna becerileri üzerine uygulamalı programlar yürütüyor. (Örnek kart)",
  },
];

function MemberCard({ m, lead = false }: { m: Member; lead?: boolean }) {
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
        <span className="member-role">{m.role}</span>
        <h3 className="member-name">{m.name}</h3>
        <p className="member-bio">{m.bio}</p>
        <button
          type="button"
          className={`btn member-btn${lead ? " btn-primary" : " btn-outline"}`}
        >
          Hakkında
          <Icon name="arrow-right" />
        </button>
      </div>
    </div>
  );
}

export default function EkibimizPage() {
  return (
    <>
      <section className="page-hero on-brand team-hero">
        <div className="container">
          <Breadcrumb items={[{ label: "Ekibimiz" }]} />
          <div className="team-hero-grid">
            <div className="team-hero-aside">
              <MemberCard
                m={{
                  name: "Ali Özel",
                  role: "Kurucu & Baş Eğitmen",
                  photo: "/team/ali-ozel.jpg",
                  bio: "Mavi yaka liderliği ve Eğit-Öğret-Yönet metodolojisinin mimarı. Yıllarını üretim sahasında, gerçek ekiplerin içinde geçirdi; sahanın gerçeğinden doğan, davranış değiştiren eğitimler veriyor.",
                }}
                lead
              />
            </div>
            <div className="team-hero-main">
              <span className="badge">Ekibimiz</span>
              <h1>Arkasında güçlü bir ekip olan eğitim</h1>
              <p className="page-lead">
                İhtiyaç analizinden saha takibine kadar her aşamada yanınızda
                olan; akademiden üretim sahasına, alanında uzman bir kadro.
              </p>
              <div className="team-hero-stats">
                <div>
                  <strong>5+</strong>
                  <span>Uzman eğitmen</span>
                </div>
                <div>
                  <strong>50.000+</strong>
                  <span>Eğitilen katılımcı</span>
                </div>
                <div>
                  <strong>20+ yıl</strong>
                  <span>Saha deneyimi</span>
                </div>
                <div>
                  <strong>8+</strong>
                  <span>Eğitim alanı</span>
                </div>
              </div>
              <div className="team-hero-tags">
                <span>Liderlik</span>
                <span>Satış &amp; İletişim</span>
                <span>İK &amp; Gelişim</span>
                <span>Üretim Sahası</span>
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
            {team.map((m) => (
              <MemberCard key={m.name} m={m} />
            ))}
          </div>
        </div>
      </section>

      <CTA />
    </>
  );
}
