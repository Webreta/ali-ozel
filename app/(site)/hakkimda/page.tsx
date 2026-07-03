import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumb from "@/components/Breadcrumb";
import Icon from "@/components/Icon";
import CTA from "@/components/CTA";

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

const expertise = [
  "Mavi & gri yaka liderliği",
  "Vardiya ve saha yönetimi",
  "Yönetici gelişim programları",
  "Etkili iletişim & geri bildirim",
  "Çatışma ve zor insan yönetimi",
  "Takım çalışması & aidiyet",
  "Koçluk & mentorluk",
  "Eğit-Öğret-Yönet metodolojisi",
];

export default function HakkimdaPage() {
  return (
    <>
      <section className="page-hero on-brand">
        <div className="container">
          <Breadcrumb items={[{ label: "Hakkımda" }]} />
          <span className="badge">
            <Icon name="users" style={{ width: 16, height: 16 }} />
            Hakkımda
          </span>
          <h1>Üretimin diliyle konuşan bir eğitmen</h1>
          <p className="page-lead">
            Birçok eğitim bilgi aktarır ve unutulur. Benim amacım; katılımcının
            eğitimden çıktığı an sahada farklı davranmaya başlamasıdır.
          </p>
          <div className="team-hero-stats">
            <div>
              <strong>20+ yıl</strong>
              <span>Saha deneyimi</span>
            </div>
            <div>
              <strong>Binlerce</strong>
              <span>Eğitilen profesyonel</span>
            </div>
            <div>
              <strong>8+</strong>
              <span>Eğitim alanı</span>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container about-split">
          <div className="about-portrait">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/ali-ozel-selfie.jpg" alt="Ali Özel bir eğitim sırasında" />
          </div>
          <div>
            <span className="eyebrow">Hikâyem</span>
            <h2 className="section-title">Sahadan doğan bir yöntem</h2>
            <p className="lead">
              Yıllarımı üretim sahasında, gerçek ekiplerin içinde geçirdim. Bu
              yüzden eğitimlerim ofis jargonundan değil; sahanın gerçeğinden,
              vardiya dilinden ve insan ilişkilerinin özünden besleniyor.
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
            <Link
              href="/iletisim"
              className="btn btn-primary"
              style={{ marginTop: 10 }}
            >
              Birlikte çalışalım
              <Icon name="arrow-right" />
            </Link>
          </div>
        </div>
      </section>

      <section className="section section-soft">
        <div className="container">
          <div className="section-head center">
            <span className="eyebrow">Uzmanlık Alanlarım</span>
            <h2 className="section-title">Sahada çalıştığım başlıklar</h2>
          </div>
          <ul className="about-expertise">
            {expertise.map((e) => (
              <li key={e}>
                <Icon name="check" />
                {e}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section">
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
