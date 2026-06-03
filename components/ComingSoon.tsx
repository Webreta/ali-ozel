import Link from "next/link";
import Breadcrumb from "./Breadcrumb";
import Icon from "./Icon";

export default function ComingSoon({
  title,
  text,
  icon = "sparkle",
}: {
  title: string;
  text: string;
  icon?: string;
}) {
  return (
    <>
      <section className="page-hero on-brand">
        <Icon name={icon} className="hero-watermark" strokeWidth={0.6} />
        <div className="container">
          <Breadcrumb items={[{ label: title }]} />
          <h1>{title}</h1>
          <p className="page-lead">{text}</p>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <div className="empty-state">
            <div className="es-icon">
              <Icon name="sparkle" />
            </div>
            <h2>Bu bölüm hazırlanıyor</h2>
            <p className="section-desc" style={{ marginBottom: 28 }}>
              İçerik kısa süre içinde yayında olacak. Bu arada eğitim
              programlarımızı inceleyebilir veya bizimle iletişime geçebilirsiniz.
            </p>
            <div className="cta-actions" style={{ display: "flex", gap: 14, flexWrap: "wrap", justifyContent: "center" }}>
              <Link href="/egitimler" className="btn btn-primary">
                Eğitimleri İncele <Icon name="arrow-right" />
              </Link>
              <Link href="/iletisim" className="btn btn-outline">
                İletişime Geç
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
