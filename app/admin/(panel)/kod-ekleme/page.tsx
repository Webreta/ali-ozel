import type { Metadata } from "next";
import Link from "next/link";
import { requireAdmin } from "@/lib/auth/session";
import { getSetting } from "@/lib/settings";
import SubmitButton from "@/components/admin/SubmitButton";
import { saveCustomCode, saveAdsConversions } from "./actions";

export const metadata: Metadata = { title: "Kod Ekleme" };

export default async function KodEklemePage() {
  await requireAdmin();
  const [code, ads] = await Promise.all([
    getSetting("customCode"),
    getSetting("adsConversions"),
  ]);

  return (
    <>
      <div className="adm-page-head">
        <div>
          <h1>Kod Ekleme</h1>
          <p>
            Üçüncü parti kodlar: Google Ads/Analytics, GTM, Meta Pixel veya
            farklı API scriptleri.
          </p>
        </div>
        <Link href="/" target="_blank" className="btn btn-outline">
          Sayfada gör ↗
        </Link>
      </div>

      <form action={saveCustomCode}>
        <div className="adm-card">
          <h2>Özel kodlar</h2>
          <p className="adm-hint" style={{ display: "block", marginBottom: 14 }}>
            Kodu olduğu gibi (etiketleriyle birlikte) yapıştır. Kayıt sonrası tüm
            ziyaretçi sayfalarında çalışır; admin panelinde çalışmaz.
          </p>
          <div className="adm-form" style={{ maxWidth: 820 }}>
            <div className="adm-field">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <label htmlFor="headerCode">Sayfa başı kodu</label>
                <label style={{ display: "flex", alignItems: "center", gap: 6, fontWeight: 600, fontSize: "0.78rem" }}>
                  <input type="checkbox" name="headerEnabled" defaultChecked={code.headerEnabled} style={{ width: "auto" }} />
                  Aktif
                </label>
              </div>
              <textarea
                id="headerCode"
                name="headerCode"
                defaultValue={code.headerCode}
                rows={8}
                style={{ fontFamily: "ui-monospace, Consolas, monospace", fontSize: "0.8rem" }}
                placeholder={"<!-- Google Tag Manager -->\n<script>...</script>"}
              />
              <span className="adm-hint">
                GTM, Analytics (gtag), Meta Pixel gibi sayfa başında çalışması
                gereken kodlar — içerik gövdesinin en başına yerleştirilir.
              </span>
            </div>
            <div className="adm-field">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <label htmlFor="bodyCode">Sayfa sonu kodu</label>
                <label style={{ display: "flex", alignItems: "center", gap: 6, fontWeight: 600, fontSize: "0.78rem" }}>
                  <input type="checkbox" name="bodyEnabled" defaultChecked={code.bodyEnabled} style={{ width: "auto" }} />
                  Aktif
                </label>
              </div>
              <textarea
                id="bodyCode"
                name="bodyCode"
                defaultValue={code.bodyCode}
                rows={6}
                style={{ fontFamily: "ui-monospace, Consolas, monospace", fontSize: "0.8rem" }}
                placeholder={"<!-- GTM (noscript) -->\n<noscript>...</noscript>"}
              />
              <span className="adm-hint">
                Sayfa sonunda yüklenmesi yeterli olan scriptler, sohbet
                widget&apos;ları, dönüşüm/uzak API çağrıları.
              </span>
            </div>
            <div className="adm-form-actions">
              <SubmitButton>Kaydet</SubmitButton>
            </div>
          </div>
        </div>
      </form>

      <form action={saveAdsConversions}>
        <div className="adm-card">
          <h2>Google Ads dönüşümleri</h2>
          <p className="adm-hint" style={{ display: "block", marginBottom: 14 }}>
            Önce yukarıdaki alana Google Ads etiketini (gtag) yapıştır. Sonra
            Google Ads&apos;te oluşturduğun dönüşüm aksiyonlarının{" "}
            <code>send_to</code> değerini (&quot;AW-XXX/etiket&quot;) ilgili
            kutuya koy. Form gönderimi, WhatsApp ve telefon tıklamaları otomatik
            dönüşüm olarak gönderilir.
          </p>
          <div className="adm-form" style={{ maxWidth: 640 }}>
            <div className="adm-field">
              <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <input type="checkbox" name="enabled" defaultChecked={ads.enabled} style={{ width: "auto" }} />
                Dönüşüm gönderimi aktif
              </label>
            </div>
            <div className="adm-field">
              <label htmlFor="lead">Form gönderimi (lead)</label>
              <input id="lead" name="lead" defaultValue={ads.lead} placeholder="AW-1234567890/AbCdEfG..." />
              <span className="adm-hint">Teklif ve iletişim formu başarıyla gönderildiğinde sayılır.</span>
            </div>
            <div className="adm-field">
              <label htmlFor="whatsapp">WhatsApp tıklaması</label>
              <input id="whatsapp" name="whatsapp" defaultValue={ads.whatsapp} placeholder="AW-1234567890/GhIjKl..." />
              <span className="adm-hint">Sitedeki WhatsApp bağlantılarına tıklanınca sayılır.</span>
            </div>
            <div className="adm-field">
              <label htmlFor="phone">Telefon tıklaması</label>
              <input id="phone" name="phone" defaultValue={ads.phone} placeholder="AW-1234567890/MnOpQr..." />
              <span className="adm-hint">Telefon (tel:) bağlantılarına tıklanınca sayılır.</span>
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
