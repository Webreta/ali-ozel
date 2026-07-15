import Link from "next/link";
import { getCatalog } from "@/lib/data/catalog";
import { site } from "@/lib/site";
import Icon from "@/components/Icon";
import CategoryCardWide from "@/components/CategoryCardWide";
import ApproachList from "@/components/ApproachList";
import ApproachWheel from "@/components/ApproachWheel";
import ReferenceMarquee from "@/components/ReferenceMarquee";
import CTA from "@/components/CTA";
import TeklifButton from "@/components/TeklifButton";
import { getReferences } from "@/lib/data/references";


const values = [
  {
    icon: "users",
    title: "Doğru Uzmanlığı İhtiyacınızla Buluştururuz",
    text: "Tek bir eğitmen yaklaşımına bağlı kalmadan, farklı disiplinlerden gelen uzmanlıkları kurumunuzun ihtiyacına göre eşleştiririz.",
  },
  {
    icon: "cog",
    title: "Hazır Programlar Değil, Kuruma Özel Çözümler",
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
    text: "Danışmanlık, takip ve ölçümleme ile gelişimi iş sonuçlarına dönüştürür; verimliliğinizi ve cironuzun artışını sağlarız.",
  },
  {
    icon: "target",
    title: "Kalıcı Etki Üreten Sonuçlar Hedefleriz",
    text: "Başarıyı yalnızca eğitim gününde değil; eğitim sonrasında oluşan davranış değişikliği ve sürdürülebilir gelişimle ölçeriz.",
  },
];

export default async function HomePage() {
  const [references, categories] = await Promise.all([
    getReferences(),
    getCatalog(),
  ]);
  const moduleCount = categories.reduce((n, c) => n + c.trainings.length, 0);
  return (
    <>
      {/* Hero */}
      <section className="hero">
        <div className="hero-photo">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/ali-ozel-hero.jpg"
            alt="Ali Özel — kurumsal eğitmen ve danışman"
          />
          <span className="hero-photo-sign">
            <span className="hero-photo-badge">{site.name}</span>
            <span className="hero-photo-role">
              Kurucu &amp; Eğitmen &amp; Koordinatör
            </span>
          </span>
        </div>
        <div className="container hero-grid">
          <div className="hero-content">
            <span className="hero-eyebrow">
              <span className="dot">
                <Icon name="sparkle" />
              </span>
              San Eğitim &amp; Danışmanlık
            </span>
            <h1 className="hero-title">
              Ekibinizin potansiyelini{" "}
              <span className="accent">iş sonuçlarına</span> dönüştürüyoruz
            </h1>
            <p className="hero-lead">
              Farklı disiplinlerden uzman kadromuzla; eğitimle başlayan,
              danışmanlık ve ölçümlemeyle tamamlanan sürdürülebilir gelişim
              yolculukları.
            </p>
            <div className="hero-actions">
              <Link href="/egitimler" className="btn btn-primary btn-lg">
                Eğitimleri Keşfet
                <Icon name="arrow-right" />
              </Link>
              <TeklifButton className="btn btn-outline btn-lg">
                Teklif Al
              </TeklifButton>
            </div>
            <div className="hero-stats">
              <div className="stat">
                <div className="num">
                  20<span>+</span>
                </div>
                <div className="label">yıl saha deneyimi</div>
              </div>
              <div className="stat">
                <div className="num">
                  {categories.length}
                </div>
                <div className="label">eğitim alanı</div>
              </div>
              <div className="stat">
                <div className="num">
                  {moduleCount}
                  <span>+</span>
                </div>
                <div className="label">eğitim modülü</div>
              </div>
            </div>
          </div>

          <div className="hero-spacer" aria-hidden />
        </div>
      </section>

      {/* Referans şeridi */}
      <section className="ref-strip">
        <div className="container">
          <p className="ref-strip-label">Bize güvenen kurumlar</p>
        </div>
        <ReferenceMarquee items={references} />
      </section>

      {/* Categories */}
      <section className="section cat-section">
        <div className="container">
          <div className="section-head center">
            <span className="eyebrow">Eğitim Alanlarımız</span>
            <h2 className="section-title">
              Her ihtiyaca doğru uzmanlık, her kuruma özel program
            </h2>
            <p className="section-desc">
              Şirketinizin tüm çalışan kademeleri için; farklı disiplinlerden
              uzman kadromuzla tasarlanmış ana gelişim alanları.
            </p>
          </div>
          <div className="cat-grid-wide">
            {categories.map((cat) => (
              <CategoryCardWide key={cat.slug} category={cat} />
            ))}
          </div>
        </div>
      </section>

      {/* Yaklaşım — dinamik numaralı liste (bordo) */}
      <section className="section approach-section">
        <ApproachWheel />
        <div className="container approach-grid">
          <div className="approach-intro">
            <span className="eyebrow">Yaklaşımımız</span>
            <h2 className="section-title">Neden farklı çalışıyoruz?</h2>
            <p className="section-desc" style={{ marginBottom: 26 }}>
              Slayt anlatan değil; davranış dönüştüren eğitimler. Bizim için
              başarı, eğitim biter bitmez sahada görünür hale gelen değişimdir.
            </p>
            <Link href="/farkimiz-ne" className="btn btn-outline">
              Farkımızı keşfet
              <Icon name="arrow-right" />
            </Link>
          </div>
          <ApproachList items={values} />
        </div>
      </section>

      {/* Eğitim felsefemiz */}
      <section className="section">
        <div className="container about-split">
          <div className="about-portrait">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/uploads/images/3a4c1421-54f1-4101-b353-45c464296e25.webp"
              alt="Ali Özel bir eğitim sırasında"
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
            <Link href="/farkimiz-ne" className="btn btn-outline">
              Daha fazlasını oku
              <Icon name="arrow-right" />
            </Link>
          </div>
        </div>
      </section>

      <CTA />
    </>
  );
}
