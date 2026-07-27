// Panelden ("Kod Ekleme") yapıştırılan HAM HTML içindeki <meta> etiketlerini
// ayıklar. Bunlar Next Metadata API üzerinden gerçek <head> içine basılır —
// böylece Google Search Console doğrulama meta'sı (google-site-verification)
// gibi head'de olması ŞART olan etiketler doğru yere gider.
//
// <script>/<noscript> gibi kodlar head'e değil, gövdeye enjekte edilmeye devam
// eder (GTM/Analytics/Pixel gövdede de çalışır); onları stripMetaTags ile
// ayırıyoruz ki meta'lar iki kez basılmasın.

const META_TAG = /<meta\b[^>]*>/gi;

function attr(source: string, name: string): string | undefined {
  const m = new RegExp(`${name}\\s*=\\s*("([^"]*)"|'([^']*)')`, "i").exec(source);
  return m ? (m[2] ?? m[3] ?? "") : undefined;
}

/**
 * Ham HTML'deki tüm <meta> etiketlerini { ad: içerik } sözlüğüne çevirir.
 * Anahtar olarak name | property | http-equiv kullanılır; content değeri alınır.
 * Next `metadata.other` bunları <meta name="ad" content="içerik"> olarak basar.
 */
export function parseMetaTags(html: string): Record<string, string> {
  const out: Record<string, string> = {};
  const tags = html.match(META_TAG) ?? [];
  for (const tag of tags) {
    const key = attr(tag, "name") ?? attr(tag, "property") ?? attr(tag, "http-equiv");
    const content = attr(tag, "content");
    if (key && content != null) out[key] = content;
  }
  return out;
}

/** Ham HTML'den <meta> etiketlerini çıkarır (geri kalan script/noscript kalır). */
export function stripMetaTags(html: string): string {
  return html.replace(META_TAG, "").trim();
}
