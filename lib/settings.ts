import "server-only";
import { unstable_cache, revalidateTag } from "next/cache";
import { eq, inArray } from "drizzle-orm";
import { db } from "@/db";
import { legalPages, settings } from "@/db/schema";

// ---------- Ayar şekilleri ----------

export type SmtpSettings = {
  enabled: boolean;
  host: string;
  port: number;
  encryption: "ssl" | "tls" | "none";
  authEnabled: boolean;
  username: string;
  password: string;
  fromEmail: string;
  fromName: string;
  forceFrom: boolean;
  skipTlsVerify: boolean;
  notifyTo: string;
};

export type FormLegalSettings = {
  // form türü -> onaylanması zorunlu yasal sayfa id'leri
  contact: number[];
  teklif: number[];
};

export type CookieBannerSettings = {
  enabled: boolean;
  title: string;
  text: string;
  buttonLabel: string;
  intervalHours: number;
  policyLink: string;
  policyLabel: string;
  version: number;
};

export type FloatBarSettings = {
  enabled: boolean;
  item1Label: string;
  item1Href: string;
  item2Label: string;
  item2Href: string; // "#teklif" → teklif penceresini açar
  contactLabel: string;
  popTitle: string;
  phone: string; // görünen biçim; tel: linki rakamlara indirgenir
  whatsapp: string; // uluslararası biçim, yalnız rakam (905xxxxxxxxx)
  whatsappText: string; // ops. önden dolu mesaj
};

export type CustomCodeSettings = {
  headerEnabled: boolean;
  headerCode: string;
  bodyEnabled: boolean;
  bodyCode: string;
};

export type AdsConversionSettings = {
  enabled: boolean;
  lead: string;
  whatsapp: string;
  phone: string;
};

export type AnalyticsSettings = {
  enabled: boolean;
};

export type SettingShapes = {
  smtp: SmtpSettings;
  formLegal: FormLegalSettings;
  cookieBanner: CookieBannerSettings;
  floatBar: FloatBarSettings;
  customCode: CustomCodeSettings;
  adsConversions: AdsConversionSettings;
  analytics: AnalyticsSettings;
};

export const SETTING_DEFAULTS: SettingShapes = {
  smtp: {
    enabled: false,
    host: "",
    port: 465,
    encryption: "ssl",
    authEnabled: true,
    username: "",
    password: "",
    fromEmail: "",
    fromName: "",
    forceFrom: true,
    skipTlsVerify: false,
    notifyTo: "ali.ozel@sanegitim.com",
  } satisfies SmtpSettings,
  formLegal: { contact: [], teklif: [] } satisfies FormLegalSettings,
  cookieBanner: {
    enabled: false,
    title: "Çerez Bildirimi",
    text: "Bu siteyi ziyaret ettiğinizde çerez politikamızı kabul etmiş olursunuz. Performansı iyileştirmek ve kullanıcı deneyimini analiz etmek için çerezler kullanıyoruz.",
    buttonLabel: "Tamam",
    intervalHours: 24,
    policyLink: "",
    policyLabel: "Çerez Politikası",
    version: 1,
  } satisfies CookieBannerSettings,
  floatBar: {
    enabled: true,
    item1Label: "Eğitimler",
    item1Href: "/egitimler",
    item2Label: "Teklif Al",
    item2Href: "#teklif",
    contactLabel: "İletişim",
    popTitle: "Hemen Bağlan",
    phone: "+90 533 460 79 43",
    whatsapp: "905334607943",
    whatsappText: "",
  } satisfies FloatBarSettings,
  customCode: {
    headerEnabled: false,
    headerCode: "",
    bodyEnabled: false,
    bodyCode: "",
  } satisfies CustomCodeSettings,
  adsConversions: {
    enabled: false,
    lead: "",
    whatsapp: "",
    phone: "",
  } satisfies AdsConversionSettings,
  analytics: { enabled: true } satisfies AnalyticsSettings,
};

export type SettingKey = keyof SettingShapes;

// ---------- Okuma / yazma ----------

const readAllSettings = unstable_cache(
  async () => {
    const rows = await db.select().from(settings);
    return Object.fromEntries(rows.map((r) => [r.key, r.value]));
  },
  ["settings"],
  { tags: ["settings"] }
);

export async function getSetting<K extends SettingKey>(
  key: K
): Promise<SettingShapes[K]> {
  const all = await readAllSettings();
  const stored = all[key] as Partial<SettingShapes[K]> | undefined;
  // Varsayılanlarla birleştir — yeni alan eklendiğinde eski kayıt bozulmaz
  return { ...SETTING_DEFAULTS[key], ...(stored ?? {}) };
}

export async function setSetting<K extends SettingKey>(
  key: K,
  value: SettingShapes[K]
) {
  await db
    .insert(settings)
    .values({ key, value, updatedAt: new Date() })
    .onConflictDoUpdate({
      target: settings.key,
      set: { value, updatedAt: new Date() },
    });
  revalidateTag("settings");
}

// ---------- Form onayları için yardımcı ----------

export async function getFormConsents(kind: "contact" | "teklif") {
  const config = await getSetting("formLegal");
  const ids = config[kind];
  if (!ids.length) return [];
  const pages = await db
    .select({ id: legalPages.id, title: legalPages.title, slug: legalPages.slug })
    .from(legalPages)
    .where(inArray(legalPages.id, ids));
  // Silinmiş sayfaların id'leri düşer
  return pages;
}
