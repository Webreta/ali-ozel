import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Icon from "@/components/Icon";
import { getNavCategories } from "@/lib/data/catalog";

// Kök seviyedeki not-found tüm eşleşmeyen URL'leri yakalar; (site) layout'unun
// dışında kaldığı için site iskeletini kendisi kurar.
export default async function NotFound() {
  const navCategories = await getNavCategories();
  return (
    <>
      <Header categories={navCategories} />
      <main>
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
      </main>
      <Footer />
    </>
  );
}
