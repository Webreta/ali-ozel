import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumb from "@/components/Breadcrumb";
import Icon from "@/components/Icon";
import CTA from "@/components/CTA";

export const metadata: Metadata = {
  title: "Farkımız Ne?",
  description:
    "San Eğitim & Danışmanlık'ı farklı kılan 5 ilke: doğru uzmanlık, kuruma özel tasarım, sahada test edilmiş içerik, danışmanlıkla tamamlanan gelişim ve kalıcı etki.",
};

const diffs = [
  {
    icon: "users",
    title: "Doğru Uzmanlığı İhtiyacınızla Buluştururuz",
    text: "Tek bir eğitmen yaklaşımına bağlı kalmadan, farklı disiplinlerden gelen uzmanlıkları kurumunuzun ihtiyacına göre eşleştiririz.",
  },
  {
    icon: "cog",
    title: "Hazır Programlar Değil, Kuruma Özel Çözümler Tasarlarız",
    text: "Kurumunuzu dinler, ihtiyaçlarınızı analiz eder ve çözümü sıfırdan size özel olarak kurgularız.",
  },
  {
    icon: "helmet",
    title: "Teoriyi Sahadaki Gerçek Deneyimle Güçlendiririz",
    text: "Bilgiyi yalnızca aktarmakla kalmaz; sahada yaşanmış deneyimi bilimsel metodolojiyle birleştirerek uygulanabilir hale getiririz.",
  },
  {
    icon: "trending",
    title: "Eğitimle Başlar, Değişimle Tamamlarız",
    text: "Bilgi aktarımının ötesine geçer; danışmanlık, takip ve ölçümleme ile gelişimi iş sonuçlarına dönüştürür, verimliliğinizi ve cironuzun artışını sağlarız.",
  },
  {
    icon: "target",
    title: "Günü Kurtaran Değil, Kalıcı Etki Üreten Sonuçlar Hedefleriz",
    text: "Başarıyı yalnızca eğitim gününde değil, eğitim sonrasında oluşan davranış değişikliği ve sürdürülebilir gelişimle ölçeriz.",
  },
];

export default function FarkimizNePage() {
  return (
    <>
      <section className="page-hero on-brand">
        <div className="container">
          <Breadcrumb items={[{ label: "Farkımız Ne?" }]} />
          <span className="badge">
            <Icon name="sparkle" style={{ width: 16, height: 16 }} />
            San Eğitim &amp; Danışmanlık
          </span>
          <h1>Farkımız Ne?</h1>
          <p className="page-lead">
            Eğitimle başlayan, danışmanlık ve ölçümlemeyle tamamlanan bir
            gelişim anlayışı. Bizi farklı kılan beş ilke:
          </p>
          <div className="team-hero-stats">
            <div>
              <strong>7+</strong>
              <span>Uzman eğitmen</span>
            </div>
            <div>
              <strong>50.000+</strong>
              <span>Eğitilen katılımcı</span>
            </div>
            <div>
              <strong>9</strong>
              <span>Eğitim alanı</span>
            </div>
            <div>
              <strong>80+</strong>
              <span>Eğitim modülü</span>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="diff-list">
            {diffs.map((d, i) => (
              <article className="diff-row" key={d.title}>
                <div className="diff-marker">
                  <span className="diff-num">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="diff-icon">
                    <Icon name={d.icon} />
                  </span>
                </div>
                <div className="diff-body">
                  <h2>{d.title}</h2>
                  <p>{d.text}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-soft">
        <div className="container about-split">
          <div className="about-portrait">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/ali-ozel-form.jpg" alt="Ali Özel" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className="ap-logo"
              src="/logo.png"
              alt="San Eğitim Danışmanlık"
            />
          </div>
          <div>
            <span className="eyebrow">Eğitim Felsefemiz</span>
            <h2 className="section-title">
              Katılım belgesiyle değil, davranışla biten eğitimler
            </h2>
            <ul className="check-list" style={{ margin: "26px 0 30px" }}>
              <li>
                <Icon name="check-circle" />
                Konu ne olursa olsun — liderlik, iletişim, satış, teknik
                beceri — kuruma özel ihtiyaç analiziyle başlıyoruz
              </li>
              <li>
                <Icon name="check-circle" />
                Sahada test edilmiş içerik ve Eğit-Öğret-Yönet metodolojisiyle
                kalıcı davranış değişimi sağlıyoruz
              </li>
              <li>
                <Icon name="check-circle" />
                Eğitim sonrası ölçümleme ve takiple çalışan bağlılığına somut
                katkı sunuyoruz
              </li>
            </ul>
            <Link href="/ekibimiz" className="btn btn-outline">
              Ekibimizi tanıyın
              <Icon name="arrow-right" />
            </Link>
          </div>
        </div>
      </section>

      <CTA
        title="Farkı birlikte deneyimleyelim"
        text="İhtiyacınızı dinleyip ekibinize en uygun eğitim yol haritasını birlikte çıkaralım."
      />
    </>
  );
}
