import type { Metadata } from "next";
import Breadcrumb from "@/components/Breadcrumb";
import CTA from "@/components/CTA";
import Icon from "@/components/Icon";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Ekibimiz",
  description:
    "Ali Özel San Eğitim & Danışmanlık ekibi — alanında deneyimli eğitmenler ve danışmanlardan oluşan bir kadro.",
};

const team = [
  {
    initials: "AÖ",
    name: site.name,
    role: "Kurucu · Baş Eğitmen",
    bio: "Mavi yaka liderliği ve Eğit-Öğret-Yönet metodolojisinin mimarı. 20+ yıllık saha deneyimi.",
  },
  {
    initials: "EÇ",
    name: "Eğitim Koordinatörü",
    role: "Program & Planlama",
    bio: "Kurumsal eğitim süreçlerinin planlanması, ihtiyaç analizi ve uygulama takibinden sorumlu.",
  },
  {
    initials: "SD",
    name: "Saha Danışmanı",
    role: "Üretim & Operasyon",
    bio: "Üretim sahasında birebir koçluk ve eğitim sonrası pekiştirme çalışmalarını yürütür.",
  },
  {
    initials: "KU",
    name: "Kurumsal İlişkiler",
    role: "Müşteri & İş Geliştirme",
    bio: "Kurumların doğru programla buluşması ve uzun vadeli iş birlikleri için ilk temas noktası.",
  },
];

export default function EkibimizPage() {
  return (
    <>
      <section className="page-hero on-brand">
        <Icon name="users" className="hero-watermark" strokeWidth={0.6} />
        <div className="container">
          <Breadcrumb items={[{ label: "Ekibimiz" }]} />
          <h1>Arkasında güçlü bir ekip olan eğitim</h1>
          <p className="page-lead">
            İhtiyaç analizinden saha takibine kadar her aşamada yanınızda olan,
            alanında deneyimli bir kadro.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="grid grid-4">
            {team.map((m) => (
              <div className="card team-card" key={m.name}>
                <div className="team-photo">{m.initials}</div>
                <h3>{m.name}</h3>
                <div className="role">{m.role}</div>
                <p>{m.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CTA
        title="Ekibimizle tanışmak ister misiniz?"
        text="Kurumunuzun ihtiyacını dinleyelim, size en uygun eğitmen ve programı önerelim."
      />
    </>
  );
}
