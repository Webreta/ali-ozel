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
        <div className="container">
          <Breadcrumb items={[{ label: title }]} />
          <span className="badge">
            <Icon name={icon} style={{ width: 16, height: 16 }} />
            {title}
          </span>
          <h1>{title}</h1>
          <p className="page-lead">{text}</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="soon-card">
            <span className="soon-ic">
              <Icon name={icon} />
            </span>
            <h2>Bu bölüm hazırlanıyor</h2>
            <p>
              Çok yakında burada olacak. Bu arada eğitimlerimizi
              inceleyebilir ya da bizimle iletişime geçebilirsiniz.
            </p>
            <div className="soon-actions">
              <Link href="/egitimler" className="btn btn-primary">
                Eğitimleri İncele
                <Icon name="arrow-right" />
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
