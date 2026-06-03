import Link from "next/link";
import { categories } from "@/lib/content";
import { site } from "@/lib/site";
import Icon from "@/components/Icon";
import CategoryCardWide from "@/components/CategoryCardWide";
import ApproachList from "@/components/ApproachList";
import ApproachWheel from "@/components/ApproachWheel";
import ReferenceMarquee from "@/components/ReferenceMarquee";
import CTA from "@/components/CTA";
import TeklifButton from "@/components/TeklifButton";
import { references } from "@/lib/references";

const moduleCount = categories.reduce((n, c) => n + c.trainings.length, 0);

const values = [
  {
    icon: "target",
    title: "Davranışsal ve Uygulamalı",
    text: "Akademik teori değil; rol yapma, vaka çalışması ve sahadan örneklerle kalıcı davranış değişimi.",
  },
  {
    icon: "layers",
    title: "Eğit-Öğret-Yönet Metodolojisi",
    text: "Üretim sahasına özgü üç aşamalı çerçeve: doğru davranışı öğret, uygulat ve sahada pekiştir.",
  },
  {
    icon: "cog",
    title: "Sektöre Özel Uyarlama",
    text: "İhtiyaç analizinin ardından içerik; kurumunuzun diline, kültürüne ve gerçek vakalarına göre özelleştirilir.",
  },
  {
    icon: "shield",
    title: "Saha Deneyiminden Doğan İçerik",
    text: "Mavi yakadan üst yönetime; gerçek üretim ortamlarında test edilmiş, işe yarayan içerikler.",
  },
];

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="hero">
        <div className="hero-photo">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/ali-ozel.jpg"
            alt="Ali Özel — kurumsal eğitmen ve danışman"
          />
          <span className="hero-photo-badge">
            <strong>{site.name}</strong>
            <small>Eğitmen &amp; Danışman</small>
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
              Sahadan üst yönetime{" "}
              <span className="accent">liderlik</span> dönüşümü
            </h1>
            <p className="hero-lead">
              Mavi yaka, gri yaka ve beyaz yaka liderler için davranışsal ve
              uygulamalı kurumsal eğitim programları. Ekibinizin gerçek
              potansiyelini sahada açığa çıkarıyoruz.
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
      <section className="section">
        <div className="container">
          <div className="section-head center">
            <span className="eyebrow">Eğitim Alanlarımız</span>
            <h2 className="section-title">
              Her seviyeye, her sahaya özel programlar
            </h2>
            <p className="section-desc">
              Üretim hattındaki formenden üst düzey yöneticiye kadar; kurumunuzun
              ihtiyacına göre tasarlanmış {categories.length} ana eğitim alanı.
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
            <Link href="/hakkimda" className="btn btn-outline">
              Yaklaşımı keşfet
              <Icon name="arrow-right" />
            </Link>
          </div>
          <ApproachList items={values} />
        </div>
      </section>

      {/* About teaser */}
      <section className="section">
        <div className="container about-split">
          <div className="about-portrait">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/ali-ozel-selfie.jpg" alt="Ali Özel bir eğitim sırasında" />
            <div className="ap-badge">
              <strong>{site.name}</strong>
              <span>Kurumsal Eğitmen &amp; Liderlik Danışmanı</span>
            </div>
          </div>
          <div>
            <span className="eyebrow">Hakkımda</span>
            <h2 className="section-title">
              Üretimin diliyle konuşan bir eğitmen
            </h2>
            <p className="lead">
              Yıllarını üretim sahasında, gerçek ekiplerin içinde geçirdim. Bu
              yüzden eğitimlerim ofis jargonundan değil; sahanın gerçeğinden,
              vardiya dilinden ve insan ilişkilerinin özünden besleniyor.
            </p>
            <ul className="check-list" style={{ margin: "24px 0 30px" }}>
              <li>
                <Icon name="check-circle" />
                Mavi yaka liderliğinde uzmanlaşmış, sahada test edilmiş içerikler
              </li>
              <li>
                <Icon name="check-circle" />
                Eğit-Öğret-Yönet metodolojisiyle kalıcı davranış değişimi
              </li>
              <li>
                <Icon name="check-circle" />
                Kuruma özel uyarlama ve eğitim sonrası saha takibi
              </li>
            </ul>
            <Link href="/hakkimda" className="btn btn-outline">
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
