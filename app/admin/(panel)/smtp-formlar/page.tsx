import type { Metadata } from "next";
import Link from "next/link";
import { asc } from "drizzle-orm";
import { db } from "@/db";
import { legalPages } from "@/db/schema";
import { requireAdmin } from "@/lib/auth/session";
import { getSetting } from "@/lib/settings";
import SubmitButton from "@/components/admin/SubmitButton";
import { saveSmtpSettings, saveFormLegal } from "./actions";

export const metadata: Metadata = { title: "SMTP & Formlar" };

const FORMS = [
  {
    key: "contact" as const,
    name: "İletişim formu",
    desc: "İletişim sayfası — soldaki büyük form kartı",
    href: "/iletisim",
  },
  {
    key: "teklif" as const,
    name: "Teklif formu",
    desc: "Tüm sitede — \"Teklif Al\" butonlarının açtığı pop-up form",
    href: "/",
  },
];

function Check({
  name,
  label,
  hint,
  defaultChecked,
}: {
  name: string;
  label: string;
  hint?: string;
  defaultChecked: boolean;
}) {
  return (
    <div className="adm-field">
      <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <input type="checkbox" name={name} defaultChecked={defaultChecked} style={{ width: "auto" }} />
        {label}
      </label>
      {hint ? <span className="adm-hint">{hint}</span> : null}
    </div>
  );
}

export default async function SmtpFormlarPage() {
  await requireAdmin();
  const [smtp, formLegal, pages] = await Promise.all([
    getSetting("smtp"),
    getSetting("formLegal"),
    db
      .select({ id: legalPages.id, title: legalPages.title })
      .from(legalPages)
      .orderBy(asc(legalPages.title)),
  ]);

  return (
    <>
      <div className="adm-page-head">
        <div>
          <h1>SMTP &amp; Formlar</h1>
          <p>Form bildirimlerinin mail gönderimi ve form başına yasal onaylar.</p>
        </div>
      </div>

      <form action={saveSmtpSettings}>
        <div className="adm-card">
          <h2>Gönderici</h2>
          <div className="adm-form">
            <Check
              name="enabled"
              label="SMTP gönderim aktif"
              hint="Kapalıysa formlar mail göndermez (talepler yine panele düşer)."
              defaultChecked={smtp.enabled}
            />
            <div className="adm-form-row">
              <div className="adm-field">
                <label htmlFor="host">SMTP Host</label>
                <input id="host" name="host" defaultValue={smtp.host} placeholder="ör. mail.aliozel.com.tr" />
                <span className="adm-hint">Mail sunucusunun adresi. Örn: smtp.gmail.com</span>
              </div>
              <div className="adm-field">
                <label htmlFor="port">SMTP Port</label>
                <input id="port" name="port" type="number" defaultValue={smtp.port} />
                <span className="adm-hint">TLS için 587, SSL için 465.</span>
              </div>
            </div>
            <div className="adm-field" style={{ maxWidth: 300 }}>
              <label htmlFor="encryption">Şifreleme türü</label>
              <select id="encryption" name="encryption" defaultValue={smtp.encryption}>
                <option value="ssl">SSL</option>
                <option value="tls">TLS (STARTTLS)</option>
                <option value="none">Yok</option>
              </select>
            </div>
          </div>
        </div>

        <div className="adm-card">
          <h2>Kimlik doğrulama</h2>
          <div className="adm-form">
            <Check
              name="authEnabled"
              label="SMTP Authentication"
              hint="Önerilen: açık. Sadece kimlik doğrulamasız SMTP sunucuları için kapatın."
              defaultChecked={smtp.authEnabled}
            />
            <div className="adm-form-row">
              <div className="adm-field">
                <label htmlFor="username">SMTP Username</label>
                <input id="username" name="username" defaultValue={smtp.username} placeholder="form@aliozel.com.tr" />
                <span className="adm-hint">Genelde tam e-posta adresi.</span>
              </div>
              <div className="adm-field">
                <label htmlFor="password">SMTP Password</label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  placeholder={smtp.password ? "••••••••" : ""}
                  autoComplete="new-password"
                />
                <span className="adm-hint">
                  {smtp.password ? "Kayıtlı şifre var. Boş bırakırsan korunur." : "Henüz şifre kaydedilmedi."}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="adm-card">
          <h2>From &amp; alıcı bilgileri</h2>
          <div className="adm-form">
            <div className="adm-form-row">
              <div className="adm-field">
                <label htmlFor="fromEmail">From Email Address</label>
                <input id="fromEmail" name="fromEmail" defaultValue={smtp.fromEmail} />
                <span className="adm-hint">Boşsa SMTP Username kullanılır.</span>
              </div>
              <div className="adm-field">
                <label htmlFor="fromName">From Name</label>
                <input id="fromName" name="fromName" defaultValue={smtp.fromName} placeholder="aliozel.com.tr" />
              </div>
            </div>
            <div className="adm-field">
              <label htmlFor="notifyTo">Bildirimin gideceği adres</label>
              <input id="notifyTo" name="notifyTo" defaultValue={smtp.notifyTo} />
              <span className="adm-hint">Form dolduğunda mail bu adrese düşer.</span>
            </div>
            <Check
              name="forceFrom"
              label="Force From Address"
              hint="Açıksa tüm mailler yukarıdaki adresle gönderilir."
              defaultChecked={smtp.forceFrom}
            />
          </div>
        </div>

        <div className="adm-card">
          <h2>İleri ayarlar</h2>
          <div className="adm-form">
            <Check
              name="skipTlsVerify"
              label="SSL/TLS doğrulamasını devre dışı bırak"
              hint="Sadece self-signed sertifika kullanan sunucular için. Önerilmez."
              defaultChecked={smtp.skipTlsVerify}
            />
            <div className="adm-form-actions">
              <SubmitButton>Değişiklikleri kaydet</SubmitButton>
            </div>
          </div>
        </div>
      </form>

      <form action={saveFormLegal}>
        <div className="adm-card">
          <h2>Sitedeki formlar</h2>
          <p className="adm-hint" style={{ display: "block", marginBottom: 14 }}>
            Toplam {FORMS.length} form. Her formun altından ziyaretçinin onaylaması
            gereken yasal sayfaları seçebilirsin — hiçbiri seçili değilse onay
            kutusu görünmez.
          </p>
          {FORMS.map((f) => (
            <div key={f.key} className="adm-fieldset" style={{ marginBottom: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10 }}>
                <div>
                  <strong style={{ fontSize: "0.9rem" }}>{f.name}</strong>
                  <p className="adm-hint" style={{ margin: 0 }}>{f.desc}</p>
                </div>
                <Link href={f.href} target="_blank" className="btn btn-outline">
                  Görüntüle ↗
                </Link>
              </div>
              <div>
                <span className="adm-hint" style={{ fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  Yasal onaylar · {formLegal[f.key].length} seçili
                </span>
                {pages.length === 0 ? (
                  <p className="adm-hint" style={{ marginTop: 6 }}>
                    Henüz yasal sayfa yok — önce{" "}
                    <Link href="/admin/yasal" className="adm-row-link" style={{ display: "inline" }}>
                      Yasal Sayfalar
                    </Link>{" "}
                    bölümünden ekleyin.
                  </p>
                ) : (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 8 }}>
                    {pages.map((p) => (
                      <label
                        key={p.id}
                        style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: "0.83rem", fontWeight: 600, border: "1px solid var(--line-strong)", borderRadius: 8, padding: "6px 10px" }}
                      >
                        <input
                          type="checkbox"
                          name={f.key}
                          value={p.id}
                          defaultChecked={formLegal[f.key].includes(p.id)}
                          style={{ width: "auto" }}
                        />
                        {p.title}
                      </label>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
          <div className="adm-form-actions">
            <SubmitButton>Yasal seçimleri kaydet</SubmitButton>
          </div>
        </div>
      </form>
    </>
  );
}
