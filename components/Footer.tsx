import Link from "next/link";
import Image from "next/image";
import { site } from "@/lib/site";
import { getCatalog } from "@/lib/data/catalog";
import Icon from "./Icon";

export default async function Footer() {
  const categories = await getCatalog();
  const year = 2026;
  return (
    <footer className="site-footer">
      <span className="footer-glow" aria-hidden />
      <div className="container">
        {/* üst: marka + iletişim/sosyal */}
        <div className="footer-head">
          <div className="footer-brand">
            <Image
              src="/logo.png"
              alt="San Eğitim & Danışmanlık"
              width={199}
              height={40}
            />
            <p>{site.description}</p>
          </div>
          <div className="footer-reach">
            <a className="footer-chip" href={site.contact.phoneHref}>
              <span className="fc-ic">
                <Icon name="phone" />
              </span>
              <span className="fc-txt">
                <small>Telefon</small>
                <strong>{site.contact.phone}</strong>
              </span>
            </a>
            <a className="footer-chip" href={site.contact.emailHref}>
              <span className="fc-ic">
                <Icon name="mail" />
              </span>
              <span className="fc-txt">
                <small>E-posta</small>
                <strong>{site.contact.email}</strong>
              </span>
            </a>
            <div className="footer-social">
              <a href={site.social.instagram} target="_blank" rel="noreferrer" aria-label="Instagram">
                <Icon name="instagram" />
              </a>
              <a href={site.social.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn">
                <Icon name="linkedin" />
              </a>
            </div>
          </div>
        </div>

        <div className="footer-divider" />

        {/* link kolonları */}
        <div className="footer-nav">
          <div className="footer-col footer-col-wide">
            <h5>Eğitimler</h5>
            <div className="footer-links-grid">
              {categories.map((c) => (
                <Link key={c.slug} href={`/egitimler/${c.slug}`}>
                  {c.shortName}
                </Link>
              ))}
            </div>
          </div>
          <div className="footer-col">
            <h5>Kurumsal</h5>
            <Link href="/farkimiz-ne">Farkımız Ne?</Link>
            <Link href="/ekibimiz">Ekibimiz</Link>
            <Link href="/referanslar">Referanslar</Link>
            <Link href="/blog">Blog</Link>
            <Link href="/galeri">Galeri</Link>
          </div>
          <div className="footer-col">
            <h5>İletişim</h5>
            <span className="footer-loc">
              <Icon name="pin" />
              {site.contact.location}
            </span>
            <Link href="/iletisim" className="footer-cta-link">
              Teklif al
              <Icon name="arrow-right" />
            </Link>
          </div>
        </div>

        <div className="footer-bottom">
          <span>
            © {year} {site.name} — San Eğitim &amp; Danışmanlık
          </span>
          <span className="footer-quote">“{site.tagline}”</span>
        </div>
      </div>
    </footer>
  );
}
