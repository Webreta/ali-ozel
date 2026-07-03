import type { Metadata } from "next";
import Link from "next/link";
import { requireAdmin } from "@/lib/auth/session";
import { getSetting } from "@/lib/settings";
import SubmitButton from "@/components/admin/SubmitButton";
import { saveCookieSettings, resetCookieConsents } from "./actions";

export const metadata: Metadata = { title: "Çerez Yönetimi" };

export default async function CerezPage() {
  await requireAdmin();
  const cfg = await getSetting("cookieBanner");

  return (
    <>
      <div className="adm-page-head">
        <div>
          <h1>Çerez Yönetimi</h1>
          <p>
            Sitedeki çerez bildirim pop-up&apos;ını yönet — bildirim ziyaretçiyi
            bilgilendirme amaçlıdır.
          </p>
        </div>
        <Link href="/" target="_blank" className="btn btn-outline">
          Sayfada gör ↗
        </Link>
      </div>

      <form action={saveCookieSettings}>
        <div className="adm-card">
          <h2>Bildirim ayarları</h2>
          <p className="adm-hint" style={{ display: "block", marginBottom: 14 }}>
            Ziyaretçi &quot;{cfg.buttonLabel}&quot; butonuna bastığında bildirim
            gizlenir ve ayarladığın süre boyunca ({cfg.intervalHours} saat)
            tekrar gösterilmez.
          </p>
          <div className="adm-form">
            <div className="adm-field">
              <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <input type="checkbox" name="enabled" defaultChecked={cfg.enabled} style={{ width: "auto" }} />
                Çerez bildirimi aktif
              </label>
            </div>
            <div className="adm-field">
              <label htmlFor="title">Başlık</label>
              <input id="title" name="title" defaultValue={cfg.title} />
            </div>
            <div className="adm-field">
              <label htmlFor="text">Bildirim metni</label>
              <textarea id="text" name="text" defaultValue={cfg.text} rows={3} />
              <span className="adm-hint">Ziyaretçiye gösterilecek açıklama.</span>
            </div>
            <div className="adm-form-row">
              <div className="adm-field">
                <label htmlFor="buttonLabel">Buton yazısı</label>
                <input id="buttonLabel" name="buttonLabel" defaultValue={cfg.buttonLabel} />
              </div>
              <div className="adm-field">
                <label htmlFor="intervalHours">Yeniden gösterme aralığı (saat)</label>
                <input id="intervalHours" name="intervalHours" type="number" defaultValue={cfg.intervalHours} />
                <span className="adm-hint">Kabul edildikten sonra tekrar çıkana kadar.</span>
              </div>
            </div>
            <div className="adm-form-row">
              <div className="adm-field">
                <label htmlFor="policyLink">Politika bağlantısı (opsiyonel)</label>
                <input id="policyLink" name="policyLink" defaultValue={cfg.policyLink} placeholder="/yasal/cerez-politikasi" />
                <span className="adm-hint">Örn: /yasal/cerez-politikasi</span>
              </div>
              <div className="adm-field">
                <label htmlFor="policyLabel">Bağlantı yazısı</label>
                <input id="policyLabel" name="policyLabel" defaultValue={cfg.policyLabel} placeholder="Çerez Politikası" />
              </div>
            </div>
            <div className="adm-form-actions">
              <SubmitButton>Kaydet</SubmitButton>
            </div>
          </div>
        </div>
      </form>

      <div className="adm-card">
        <h2>Onayları sıfırla</h2>
        <p className="adm-hint" style={{ display: "block", marginBottom: 12 }}>
          Bunu kullandığında, daha önce &quot;{cfg.buttonLabel}&quot; demiş
          olsalar bile <strong>tüm ziyaretçilere</strong> bildirim yeniden
          gösterilir. Bildirim ayrıca her ziyaretçi için {cfg.intervalHours}{" "}
          saatte bir otomatik olarak tekrar çıkar.
        </p>
        <form action={resetCookieConsents} className="adm-form-actions">
          <SubmitButton pendingText="Sıfırlanıyor…">
            Tüm ziyaretçilere yeniden göster
          </SubmitButton>
          <span className="adm-hint">Geçerli sürüm: v{cfg.version}</span>
        </form>
      </div>
    </>
  );
}
