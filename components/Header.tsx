"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { mainNav } from "@/lib/site";
import Icon from "./Icon";

export type NavCategory = {
  slug: string;
  shortName: string;
  icon: string;
  tagline: string;
};

export default function Header({ categories }: { categories: NavCategory[] }) {
  const [open, setOpen] = useState(false);
  const [eduOpen, setEduOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // koyu üstlü sayfalar: bordo hero'lu tüm iç sayfalar (detaylar dahil)
  const darkHero =
    pathname.startsWith("/egitimler") ||
    pathname.startsWith("/ekibimiz") ||
    pathname === "/referanslar" ||
    pathname === "/farkimiz-ne" ||
    pathname === "/iletisim" ||
    pathname.startsWith("/blog") ||
    pathname === "/galeri" ||
    pathname.startsWith("/yasal") ||
    pathname.startsWith("/egitim-notlari");
  const transparent = darkHero && !scrolled && !open;
  // anasayfa: bordo zeminli (opak) header
  const brandHeader = pathname === "/";

  return (
    <header
      className={`site-header${transparent ? " transparent" : ""}${
        brandHeader ? " header-brand" : ""
      }`}
    >
      <div className="container header-inner">
        <Link href="/" className="brand" aria-label="aliozel ana sayfa">
          <Image
            src="/logo.png"
            alt="San Eğitim & Danışmanlık"
            width={199}
            height={40}
            priority
          />
        </Link>

        <nav className="nav" aria-label="Ana menü">
          {mainNav.map((item) =>
            item.href === "/egitimler" ? (
              <div className="has-dropdown" key={item.href}>
                <Link href={item.href} className="nav-link">
                  {item.label}
                  <Icon name="chevron-down" />
                </Link>
                <div className="dropdown">
                  <div className="dropdown-grid">
                    {categories.map((cat) => (
                      <Link
                        key={cat.slug}
                        href={`/egitimler/${cat.slug}`}
                        className="dropdown-item"
                      >
                        <span className="di-icon">
                          <Icon name={cat.icon} />
                        </span>
                        <span>
                          <strong>{cat.shortName}</strong>
                          <span>{cat.tagline}</span>
                        </span>
                      </Link>
                    ))}
                  </div>
                  <Link href="/egitimler" className="dropdown-all">
                    Tüm eğitimleri gör →
                  </Link>
                </div>
              </div>
            ) : (
              <Link key={item.href} href={item.href} className="nav-link">
                {item.label}
              </Link>
            )
          )}
        </nav>

        <div className="header-actions">
          <Link href="/egitim-notlari" className="btn btn-primary">
            <Icon name="book" />
            Eğitim Notları
          </Link>
          <button
            className="menu-toggle"
            aria-label="Menüyü aç/kapat"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            <Icon name={open ? "close" : "menu"} />
          </button>
        </div>
      </div>

      {open && (
        <button
          className="nav-backdrop"
          aria-label="Menüyü kapat"
          onClick={() => setOpen(false)}
        />
      )}
      <div className={`mobile-nav ${open ? "open" : ""}`}>
        <div className="container">
          {mainNav.map((item) =>
            item.href === "/egitimler" ? (
              <div key={item.href}>
                <div className="mnav-row">
                  <Link href={item.href} onClick={() => setOpen(false)}>
                    {item.label}
                  </Link>
                  <button
                    className="mnav-toggle"
                    aria-label="Eğitim kategorilerini aç/kapat"
                    aria-expanded={eduOpen}
                    onClick={() => setEduOpen((v) => !v)}
                  >
                    <Icon name="chevron-down" />
                  </button>
                </div>
                {eduOpen &&
                  categories.map((cat) => (
                    <Link
                      key={cat.slug}
                      href={`/egitimler/${cat.slug}`}
                      className="sub"
                      onClick={() => setOpen(false)}
                    >
                      {cat.shortName}
                    </Link>
                  ))}
              </div>
            ) : (
              <div key={item.href}>
                <Link href={item.href} onClick={() => setOpen(false)}>
                  {item.label}
                </Link>
              </div>
            )
          )}
          <div className="mobile-cta">
            <Link
              href="/iletisim"
              className="btn btn-primary"
              onClick={() => setOpen(false)}
            >
              Teklif Al
            </Link>
            <Link
              href="/egitim-notlari"
              className="btn btn-outline"
              onClick={() => setOpen(false)}
            >
              Eğitim Notları
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
