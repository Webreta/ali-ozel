import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumb from "@/components/Breadcrumb";
import Icon from "@/components/Icon";
import CTA from "@/components/CTA";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Hakkımda",
  description:
    "Ali Özel — üretim sahasından üst yönetime liderlik eğitimleri veren kurumsal eğitmen ve danışman. Eğit-Öğret-Yönet metodolojisinin mimarı.",
};

const principles = [
  {
    icon: "target",
    title: "Sahanın gerçeğiyle",
    text: "Eğitimlerim teorik değil; üretim ortamının dili, temposu ve insan ilişkileriyle örülüdür.",
  },
  {
    icon: "layers",
    title: "Eğit-Öğret-Yönet",
    text: "Doğru davranışı öğret, uygulat ve sahada pekiştir — kalıcı dönüşümün üç adımı.",
  },
  {
    icon: "users",
    title: "İnsanı merkeze alarak",
    text: "Teknoloji ve sistemler önemlidir; ama her gelişim, insanı anlamakla başlar.",
  },
];

export default function HakkimdaPage() {
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <Breadcrumb items={[{ label: "Hakkımda" }]} />
          <h1>Üretimin diliyle konuşan bir eğitmen</h1>
          <p className="page-lead">
            Yıllarımı gerçek üretim sahalarında, gerçek ekiplerin içinde
            geçirdim. Bugün bu deneyimi; mavi yakadan üst yönetime kadar her
            seviyede lidere aktarıyorum.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container about-split">
          <div className="about-portrait">
            <span className="ap-mono">AÖ</span>
            <div className="ap-badge">
              <strong>{site.name}</strong>
              <span>Kurumsal Eğitmen &amp; Liderlik Danışmanı</span>
            </div>
          </div>
          <div>
            <span className="eyebrow">Kim olduğum</span>
            <h2 className="section-title">Slayt değil, davranış dönüştürürüm</h2>
            <p className="lead">
              Birçok eğitim bilgi aktarır ve unutulur. Benim amacım; katılımcının
              eğitimden çıktığı an sahada farklı davranmaya başlamasıdır.
            </p>
            <p>
              Mavi yaka ve gri yaka liderliğinde uzmanlaştım. Formenden vardiya
              amirine, üretim şefinden mühendise ve üst düzey yöneticiye kadar
              binlerce profesyonelle çalıştım. Her programı, kurumun gerçek
              vakalarına ve kültürüne göre yeniden tasarlıyorum.
            </p>
            <p>
              Geliştirdiğim <strong>Eğit-Öğret-Yönet</strong> metodolojisi; soyut
              yönetim kavramlarını sahanın gerçeğiyle buluşturarak ölçülebilir ve
              kalıcı sonuçlar üretir.
            </p>
            <Link href="/iletisim" className="btn btn-primary" style={{ marginTop: 10 }}>
              Birlikte çalışalım
              <Icon name="arrow-right" />
            </Link>
          </div>
        </div>
      </section>

      <section className="section section-soft">
        <div className="container">
          <div className="section-head center">
            <span className="eyebrow">Çalışma İlkelerim</span>
            <h2 className="section-title">Eğitime nasıl yaklaşıyorum?</h2>
          </div>
          <div className="grid grid-3">
            {principles.map((p) => (
              <div className="card value-card" key={p.title}>
                <span className="card-icon">
                  <Icon name={p.icon} />
                </span>
                <h3>{p.title}</h3>
                <p>{p.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CTA
        title="Kurumunuza özel bir program konuşalım"
        text="İhtiyacınızı dinleyip ekibinize en uygun eğitim yol haritasını birlikte çıkaralım."
      />
    </>
  );
}
