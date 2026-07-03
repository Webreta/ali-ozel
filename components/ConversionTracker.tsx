"use client";

import { useEffect } from "react";
import type { AdsConversionSettings } from "@/lib/settings";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

function fire(sendTo: string) {
  if (!sendTo || typeof window.gtag !== "function") return;
  window.gtag("event", "conversion", { send_to: sendTo });
}

/**
 * Google Ads dönüşüm takibi:
 *  - tel: bağlantı tıklaması → telefon dönüşümü
 *  - WhatsApp bağlantı tıklaması → whatsapp dönüşümü
 *  - ContactForm başarı olayı ("lead-conversion" window event'i) → lead
 * gtag, panelden eklenen Ads/GTM koduyla yüklenmiş olmalı.
 */
export default function ConversionTracker({
  config,
}: {
  config: AdsConversionSettings;
}) {
  useEffect(() => {
    if (!config.enabled) return;

    const onClick = (e: MouseEvent) => {
      const link = (e.target as HTMLElement).closest?.("a[href]");
      if (!link) return;
      const href = link.getAttribute("href") ?? "";
      if (href.startsWith("tel:")) fire(config.phone);
      else if (/wa\.me|api\.whatsapp\.com|whatsapp:/i.test(href)) fire(config.whatsapp);
    };
    const onLead = () => fire(config.lead);

    document.addEventListener("click", onClick, true);
    window.addEventListener("lead-conversion", onLead);
    return () => {
      document.removeEventListener("click", onClick, true);
      window.removeEventListener("lead-conversion", onLead);
    };
  }, [config]);

  return null;
}
