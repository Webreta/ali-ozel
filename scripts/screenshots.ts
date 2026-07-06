/**
 * Sitenin tüm sayfalarının tam boy (full-page) ekran görüntülerini alır.
 * Vestel eğitim notu için admin session cookie'si kullanılır (önizleme yetkisi).
 *
 *   $env:SHOT_SESSION_TOKEN=...; npx tsx screenshots.tmp.ts
 */
import { chromium } from "playwright";
import { mkdirSync } from "fs";
import path from "path";

const BASE = "http://localhost:3000";
const OUT = path.resolve("ali-ozel-ss/site-full");

const PAGES: { name: string; url: string; gated?: boolean }[] = [
  { name: "01-anasayfa", url: "/" },
  { name: "02-egitimler", url: "/egitimler" },
  { name: "03-katalog-yonetim-egitimleri", url: "/egitimler/yonetim-egitimleri" },
  { name: "04-egitim-detay-kocluk-mentorluk", url: "/egitimler/yonetim-egitimleri/kocluk-mentorluk" },
  { name: "05-ekibimiz", url: "/ekibimiz" },
  { name: "06-referanslar", url: "/referanslar" },
  { name: "07-farkimiz-ne", url: "/farkimiz-ne" },
  { name: "08-blog", url: "/blog" },
  { name: "09-blog-yazi", url: "/blog/sahada-liderlik" },
  { name: "10-galeri", url: "/galeri" },
  { name: "11-iletisim", url: "/iletisim" },
  { name: "12-egitim-notlari", url: "/egitim-notlari" },
  { name: "13-egitim-notu-vestel", url: "/egitim-notlari/vestel", gated: true },
  { name: "14-yasal-kvkk", url: "/yasal/gizlilik-politikasi-ve-kvkk" },
];

async function main() {
  mkdirSync(OUT, { recursive: true });
  const token = process.env.SHOT_SESSION_TOKEN;

  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 1,
    locale: "tr-TR",
  });
  if (token) {
    await context.addCookies([
      { name: "session", value: token, url: BASE },
    ]);
  }

  for (const p of PAGES) {
    const page = await context.newPage();
    try {
      const res = await page.goto(BASE + p.url, {
        waitUntil: "networkidle",
        timeout: 60_000,
      });
      // Fontlar ve lazy görseller otursun
      await page.waitForTimeout(1200);
      await page.screenshot({
        path: path.join(OUT, `${p.name}.png`),
        fullPage: true,
      });
      console.log(`✓ ${p.name} (${res?.status()}) — ${p.url}`);
    } catch (e) {
      console.error(`✗ ${p.name}: ${e instanceof Error ? e.message : e}`);
    } finally {
      await page.close();
    }
  }

  await browser.close();
  console.log(`\nKayıt yeri: ${OUT}`);
}

main();
