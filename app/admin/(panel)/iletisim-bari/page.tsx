import type { Metadata } from "next";
import Link from "next/link";
import { requireAdmin } from "@/lib/auth/session";
import { getSetting } from "@/lib/settings";
import SubmitButton from "@/components/admin/SubmitButton";
import { saveFloatBarSettings } from "./actions";

export const metadata: Metadata = { title: "İletişim Barı" };

export default async function IletisimBariPage() {
  await requireAdmin();
  const cfg = await getSetting("floatBar");

  return (
    <>
      <div className="adm-page-head">
        <div>
          <h1>İletişim Barı</h1>
          <p>
            Mobilde ekranın altında sabit duran hızlı iletişim barını yönet —
            iki hızlı bağlantı ve Telefon/WhatsApp penceresi.
          </p>
        </div>
        <Link href="/" target="_blank" className="btn btn-outline">
          Sayfada gör ↗
        </Link>
      </div>

      <form action={saveFloatBarSettings}>
        <div className="adm-card">
          <h2>Bar ayarları</h2>
          <p className="adm-hint" style={{ display: "block", marginBottom: 14 }}>
            Bar yalnızca mobil ekranlarda (≤720px) görünür. &quot;
            {cfg.contactLabel}&quot; sekmesine basınca Telefon ve WhatsApp
            butonlarının olduğu pencere açılır.
          </p>
          <div className="adm-form">
            <div className="adm-field">
              <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <input type="checkbox" name="enabled" defaultChecked={cfg.enabled} style={{ width: "auto" }} />
                İletişim barı aktif (mobil)
              </label>
            </div>

            <div className="adm-field">
              <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <input
                  type="checkbox"
                  name="desktopButtonsEnabled"
                  defaultChecked={cfg.desktopButtonsEnabled}
                  style={{ width: "auto" }}
                />
                Masaüstünde sağ-alt Telefon/WhatsApp butonları
              </label>
              <span className="adm-hint">
                Masaüstü ekranlarda (&gt;720px) sağ altta üst üste iki buton
                gösterir. Aynı telefon/WhatsApp numaralarını kullanır.
              </span>
            </div>

            <div className="adm-form-row">
              <div className="adm-field">
                <label htmlFor="item1Label">1. bağlantı yazısı</label>
                <input id="item1Label" name="item1Label" defaultValue={cfg.item1Label} placeholder="Eğitimler" />
                <span className="adm-hint">Boş bırakılırsa bu sekme gizlenir.</span>
              </div>
              <div className="adm-field">
                <label htmlFor="item1Href">1. bağlantı adresi</label>
                <input id="item1Href" name="item1Href" defaultValue={cfg.item1Href} placeholder="/egitimler" />
              </div>
            </div>

            <div className="adm-form-row">
              <div className="adm-field">
                <label htmlFor="item2Label">2. bağlantı yazısı</label>
                <input id="item2Label" name="item2Label" defaultValue={cfg.item2Label} placeholder="Teklif Al" />
                <span className="adm-hint">Boş bırakılırsa bu sekme gizlenir.</span>
              </div>
              <div className="adm-field">
                <label htmlFor="item2Href">2. bağlantı adresi</label>
                <input id="item2Href" name="item2Href" defaultValue={cfg.item2Href} placeholder="#teklif" />
                <span className="adm-hint">
                  <code>#teklif</code> yazarsan teklif penceresi açılır.
                </span>
              </div>
            </div>

            <div className="adm-form-row">
              <div className="adm-field">
                <label htmlFor="contactLabel">İletişim sekmesi yazısı</label>
                <input id="contactLabel" name="contactLabel" defaultValue={cfg.contactLabel} placeholder="İletişim" />
              </div>
              <div className="adm-field">
                <label htmlFor="popTitle">Pencere başlığı</label>
                <input id="popTitle" name="popTitle" defaultValue={cfg.popTitle} placeholder="Hemen Bağlan" />
              </div>
            </div>

            <div className="adm-form-row">
              <div className="adm-field">
                <label htmlFor="phone">Telefon numarası</label>
                <input id="phone" name="phone" defaultValue={cfg.phone} placeholder="+90 533 460 79 43" />
                <span className="adm-hint">Arama bu numaraya gider.</span>
              </div>
              <div className="adm-field">
                <label htmlFor="whatsapp">WhatsApp numarası</label>
                <input id="whatsapp" name="whatsapp" defaultValue={cfg.whatsapp} placeholder="905334607943" />
                <span className="adm-hint">Uluslararası biçim, başında + olmadan.</span>
              </div>
            </div>

            <div className="adm-field">
              <label htmlFor="whatsappText">WhatsApp hazır mesajı (opsiyonel)</label>
              <textarea
                id="whatsappText"
                name="whatsappText"
                defaultValue={cfg.whatsappText}
                rows={2}
                placeholder="Merhaba, eğitimleriniz hakkında bilgi almak istiyorum."
              />
              <span className="adm-hint">
                Ziyaretçi WhatsApp&apos;a geçtiğinde mesaj kutusu bu metinle dolu gelir.
              </span>
            </div>

            <div className="adm-form-actions">
              <SubmitButton>Kaydet</SubmitButton>
            </div>
          </div>
        </div>
      </form>
    </>
  );
}
