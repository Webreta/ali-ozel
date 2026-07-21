"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Icon from "@/components/Icon";
import type { FloatBarSettings } from "@/lib/settings";

// Mobil alt iletişim barı: 2 hızlı link + "İletişim" popover'ı (Telefon + WhatsApp).
export default function FloatBar({ config }: { config: FloatBarSettings }) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    const onDown = (e: PointerEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onDown);
    };
  }, [open]);

  if (!config.enabled) return null;

  const telHref = "tel:" + config.phone.replace(/[^+\d]/g, "");
  const waNumber = config.whatsapp.replace(/\D/g, "");
  const waHref =
    "https://wa.me/" +
    waNumber +
    (config.whatsappText ? "?text=" + encodeURIComponent(config.whatsappText) : "");

  const renderItem = (label: string, href: string, icon: string) => {
    if (!label) return null;
    if (href === "#teklif") {
      return (
        <button
          type="button"
          className="float-bar-item"
          onClick={() => {
            setOpen(false);
            window.dispatchEvent(new Event("open-teklif"));
          }}
        >
          <Icon name={icon} />
          {label}
        </button>
      );
    }
    return (
      <Link href={href} className="float-bar-item" onClick={() => setOpen(false)}>
        <Icon name={icon} />
        {label}
      </Link>
    );
  };

  return (
    <div className="float-bar-wrap" ref={wrapRef}>
      {open ? (
        <div className="float-pop" role="dialog" aria-label={config.popTitle}>
          <div className="float-pop-head">
            <span>{config.popTitle}</span>
            <button
              type="button"
              className="float-pop-close"
              aria-label="Kapat"
              onClick={() => setOpen(false)}
            >
              <Icon name="close" />
            </button>
          </div>
          <div className="float-pop-actions">
            <a href={telHref} className="float-pop-tel">
              <Icon name="phone" />
              Telefon
            </a>
            <a href={waHref} target="_blank" rel="noopener" className="float-pop-wa">
              <Icon name="whatsapp" />
              WhatsApp
            </a>
          </div>
        </div>
      ) : null}
      <nav className="float-bar" aria-label="Hızlı iletişim">
        {renderItem(config.item1Label, config.item1Href, "book")}
        {renderItem(config.item2Label, config.item2Href, "mail")}
        <button
          type="button"
          className={"float-bar-item" + (open ? " is-active" : "")}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span className="float-bar-icons">
            <Icon name="phone" />
            <Icon name="whatsapp" className="icon-wa" />
          </span>
          {config.contactLabel}
        </button>
      </nav>
    </div>
  );
}
