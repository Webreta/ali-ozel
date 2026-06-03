"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { mainNav } from "@/lib/site";
import { categories } from "@/lib/content";
import Icon from "./Icon";

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link href="/" className="brand" aria-label="aliozel ana sayfa">
          <Image
            src="/logo.png"
            alt="aliozel san eğitim & danışmanlık"
            width={148}
            height={55}
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
          <Link href="/iletisim" className="btn btn-primary">
            Teklif Al
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

      <div className={`mobile-nav ${open ? "open" : ""}`}>
        <div className="container">
          {mainNav.map((item) => (
            <div key={item.href}>
              <Link href={item.href} onClick={() => setOpen(false)}>
                {item.label}
              </Link>
              {item.href === "/egitimler" &&
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
          ))}
          <div className="mobile-cta">
            <Link
              href="/iletisim"
              className="btn btn-primary"
              onClick={() => setOpen(false)}
            >
              Teklif Al
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
