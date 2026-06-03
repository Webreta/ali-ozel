import Link from "next/link";
import Icon from "@/components/Icon";

export default function NotFound() {
  return (
    <section className="section">
      <div className="container">
        <div className="empty-state">
          <div className="es-icon">
            <Icon name="compass" />
          </div>
          <h1 style={{ fontSize: "3rem" }}>404</h1>
          <h2>Sayfa bulunamadı</h2>
          <p className="section-desc" style={{ marginBottom: 28 }}>
            Aradığınız sayfa taşınmış veya hiç var olmamış olabilir.
          </p>
          <Link href="/" className="btn btn-primary">
            Ana Sayfaya Dön <Icon name="arrow-right" />
          </Link>
        </div>
      </div>
    </section>
  );
}
