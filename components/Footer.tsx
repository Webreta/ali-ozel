import Link from "next/link";
import Image from "next/image";
import { site } from "@/lib/site";
import { categories } from "@/lib/content";
import Icon from "./Icon";

export default function Footer() {
  const year = 2026;
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <Image
              src="/logo.png"
              alt="aliozel"
              width={150}
              height={56}
            />
            <p>{site.description}</p>
            <div className="footer-social">
              <a href={site.social.instagram} target="_blank" rel="noreferrer" aria-label="Instagram">
                <Icon name="instagram" />
              </a>
              <a href={site.social.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn">
                <Icon name="linkedin" />
              </a>
            </div>
          </div>

          <div className="footer-col">
            <h5>Eğitimler</h5>
            {categories.slice(0, 5).map((c) => (
              <Link key={c.slug} href={`/egitimler/${c.slug}`}>
                {c.shortName}
              </Link>
            ))}
            <Link href="/egitimler">Tüm eğitimler</Link>
          </div>

          <div className="footer-col">
            <h5>Kurumsal</h5>
            <Link href="/hakkimda">Hakkımda</Link>
            <Link href="/ekibimiz">Ekibimiz</Link>
            <Link href="/referanslar">Referanslar</Link>
            <Link href="/blog">Blog</Link>
            <Link href="/galeri">Galeri</Link>
          </div>

          <div className="footer-col">
            <h5>İletişim</h5>
            <a href={site.contact.phoneHref}>{site.contact.phone}</a>
            <a href={site.contact.emailHref}>{site.contact.email}</a>
            <span>{site.contact.location}</span>
            <Link href="/iletisim">Teklif al →</Link>
          </div>
        </div>

        <div className="footer-bottom">
          <span>
            © {year} {site.name} — San Eğitim & Danışmanlık. Tüm hakları saklıdır.
          </span>
          <span>{site.tagline}</span>
        </div>
      </div>
    </footer>
  );
}
