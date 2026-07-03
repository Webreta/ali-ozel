"use client";

import { useActionState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Icon from "./Icon";
import { submitContact, type SubmitState } from "@/app/actions/submissions";

export type FormConsent = { id: number; title: string; slug: string };

export default function ContactForm({
  kind = "teklif",
  consents = [],
}: {
  kind?: "contact" | "teklif";
  consents?: FormConsent[];
}) {
  const pathname = usePathname();
  const [state, formAction, pending] = useActionState<SubmitState, FormData>(
    submitContact,
    {}
  );

  // Google Ads lead dönüşümü — ConversionTracker dinler
  useEffect(() => {
    if (state.ok) window.dispatchEvent(new Event("lead-conversion"));
  }, [state.ok]);

  if (state.ok) {
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
    <form className="form-card" action={formAction}>
      <input type="hidden" name="kind" value={kind} />
      <input type="hidden" name="pagePath" value={pathname} />
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
      {consents.map((c) => (
        <label key={c.id} className="form-consent">
          <input type="checkbox" name={`consent-${c.id}`} required />
          <span>
            <Link href={`/yasal/${c.slug}`} target="_blank">
              {c.title}
            </Link>
            {"'"}ni okudum, onaylıyorum.
          </span>
        </label>
      ))}
      {state.error ? (
        <p className="form-error" role="alert">
          {state.error}
        </p>
      ) : null}
      <button
        type="submit"
        className="btn btn-primary btn-lg"
        style={{ width: "100%" }}
        disabled={pending}
      >
        {pending ? "Gönderiliyor…" : "Teklif Talebi Gönder"}
        <Icon name="arrow-right" />
      </button>
    </form>
  );
}
