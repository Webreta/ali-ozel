import Icon from "@/components/Icon";
import type { FloatBarSettings } from "@/lib/settings";

// Masaüstü (>720px) sağ-alt köşede üst üste iki hızlı iletişim butonu:
// WhatsApp + Telefon. Numaralar float bar (İletişim Barı) ayarından okunur.
// Mobilde gizlidir; mobilde alttaki float bar kullanılır.
export default function DesktopContact({
  config,
}: {
  config: FloatBarSettings;
}) {
  if (!config.desktopButtonsEnabled) return null;

  const telHref = "tel:" + config.phone.replace(/[^+\d]/g, "");
  const waNumber = config.whatsapp.replace(/\D/g, "");
  const waHref =
    "https://wa.me/" +
    waNumber +
    (config.whatsappText
      ? "?text=" + encodeURIComponent(config.whatsappText)
      : "");

  return (
    <div className="desktop-contact" aria-label="Hızlı iletişim">
      <a
        href={waHref}
        target="_blank"
        rel="noopener"
        className="dc-btn dc-wa"
        data-ev="desktop:whatsapp"
        data-ev-label="Masaüstü — WhatsApp"
      >
        <Icon name="whatsapp" />
        <span className="dc-tip">WhatsApp</span>
      </a>
      <a
        href={telHref}
        className="dc-btn dc-tel"
        data-ev="desktop:tel"
        data-ev-label="Masaüstü — Telefon"
      >
        <Icon name="phone" />
        <span className="dc-tip">Telefon</span>
      </a>
    </div>
  );
}
