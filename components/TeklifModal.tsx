"use client";

import { useEffect, useState } from "react";
import ContactForm, { type FormConsent } from "./ContactForm";
import Icon from "./Icon";

export default function TeklifModal({
  consents = [],
}: {
  consents?: FormConsent[];
}) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onOpen = () => setOpen(true);
    window.addEventListener("open-teklif", onOpen);
    return () => window.removeEventListener("open-teklif", onOpen);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="modal-backdrop" onClick={() => setOpen(false)}>
      <div
        className="modal-card modal-split"
        role="dialog"
        aria-modal="true"
        aria-label="Teklif al"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="modal-close"
          onClick={() => setOpen(false)}
          aria-label="Kapat"
        >
          <Icon name="close" />
        </button>

        <div className="modal-main">
          <div className="modal-head">
            <span className="modal-badge">
              <Icon name="sparkle" /> Ücretsiz ön görüşme
            </span>
            <h3>Kurumunuz için teklif alın</h3>
            <p>
              İhtiyacınızı paylaşın; size özel bir program tasarlayalım. 1 iş günü
              içinde dönüş yapıyoruz.
            </p>
          </div>
          <div className="modal-body">
            <ContactForm consents={consents} />
          </div>
        </div>

        <div className="modal-photo">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/ali-ozel.jpg" alt="Ali Özel" />
          <div className="modal-quote">
            <span className="modal-sign">Ali Özel</span>
            <span className="modal-sign-title">
              Kurucu &amp; Eğitmen &amp; Koordinatör
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
