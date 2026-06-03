import Link from "next/link";
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
    <section className="section">
      <div className="container">
        <div className="empty-state">
          <div className="es-icon">
            <Icon name={icon} />
          </div>
          <h1 className="section-title">{title}</h1>
          <p className="section-desc" style={{ marginBottom: 10 }}>
            {text}
          </p>
          <p className="es-soon">Bu bölüm hazırlanıyor — çok yakında yayında.</p>
          <div
            className="cta-actions"
            style={{
              display: "flex",
              gap: 14,
              flexWrap: "wrap",
              justifyContent: "center",
              marginTop: 28,
            }}
          >
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
  );
}
