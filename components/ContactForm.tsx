"use client";

import { useState } from "react";
import Icon from "./Icon";

export default function ContactForm() {
  const [sent, setSent] = useState(false);

  if (sent) {
    return (
      <div className="form-card form-done">
        <div className="es-icon" style={{ margin: "0 auto 18px" }}>
          <Icon name="check" />
        </div>
        <h3>Talebiniz alındı</h3>
        <p className="section-desc">
          En kısa sürede size dönüş yapacağız. İlginiz için teşekkürler.
        </p>
      </div>
    );
  }

  return (
    <form
      className="form-card"
      onSubmit={(e) => {
        e.preventDefault();
        setSent(true);
      }}
    >
      <div className="field">
        <label htmlFor="name">Ad Soyad</label>
        <input id="name" name="name" required placeholder="Adınız ve soyadınız" />
      </div>
      <div className="field">
        <label htmlFor="email">E-posta</label>
        <input id="email" type="email" name="email" required placeholder="ornek@kurum.com" />
      </div>
      <div className="field">
        <label htmlFor="phone">Telefon</label>
        <input id="phone" name="phone" placeholder="05xx xxx xx xx" />
      </div>
      <div className="field">
        <label htmlFor="message">Mesajınız</label>
        <textarea
          id="message"
          name="message"
          placeholder="İhtiyacınızı kısaca anlatın"
        />
      </div>
      <button type="submit" className="btn btn-primary btn-lg" style={{ width: "100%" }}>
        Teklif Talebi Gönder
        <Icon name="arrow-right" />
      </button>
      <p className="form-note">
        Bilgileriniz yalnızca size dönüş yapmak için kullanılır.
      </p>
    </form>
  );
}
