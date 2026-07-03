import Header from "@/components/Header";
import Footer from "@/components/Footer";
import TeklifModal from "@/components/TeklifModal";
import CookieBanner from "@/components/CookieBanner";
import ConversionTracker from "@/components/ConversionTracker";
import { getNavCategories } from "@/lib/data/catalog";
import { getFormConsents, getSetting } from "@/lib/settings";

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [navCategories, teklifConsents, cookieBanner, customCode, ads] =
    await Promise.all([
      getNavCategories(),
      getFormConsents("teklif"),
      getSetting("cookieBanner"),
      getSetting("customCode"),
      getSetting("adsConversions"),
    ]);

  return (
    <>
      {/* Panelden eklenen "sayfa başı" kodu (GTM/Analytics/Pixel).
          SSR HTML'inde geldiği için script'ler tarayıcıda normal çalışır. */}
      {customCode.headerEnabled && customCode.headerCode ? (
        <div
          style={{ display: "none" }}
          dangerouslySetInnerHTML={{ __html: customCode.headerCode }}
        />
      ) : null}

      <Header categories={navCategories} />
      <main>{children}</main>
      <Footer />
      <TeklifModal consents={teklifConsents} />
      <CookieBanner config={cookieBanner} />
      <ConversionTracker config={ads} />

      {/* Panelden eklenen "sayfa sonu" kodu */}
      {customCode.bodyEnabled && customCode.bodyCode ? (
        <div
          style={{ display: "none" }}
          dangerouslySetInnerHTML={{ __html: customCode.bodyCode }}
        />
      ) : null}
    </>
  );
}
