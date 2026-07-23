import Header from "@/components/Header";
import Footer from "@/components/Footer";
import TeklifModal from "@/components/TeklifModal";
import CookieBanner from "@/components/CookieBanner";
import FloatBar from "@/components/FloatBar";
import ConversionTracker from "@/components/ConversionTracker";
import AnalyticsTracker from "@/components/AnalyticsTracker";
import { getNavCategories } from "@/lib/data/catalog";
import { getFormConsents, getSetting } from "@/lib/settings";

// Tüm kurumsal site DB'den runtime'da okur; build sırasında (DATABASE_URL
// erişilemezken) prerender denenmesin diye segment dinamik. Bu ayar layout'un
// altındaki tüm sayfalara uygulanır.
export const dynamic = "force-dynamic";

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [
    navCategories,
    teklifConsents,
    cookieBanner,
    floatBar,
    customCode,
    ads,
    analytics,
  ] = await Promise.all([
    getNavCategories(),
    getFormConsents("teklif"),
    getSetting("cookieBanner"),
    getSetting("floatBar"),
    getSetting("customCode"),
    getSetting("adsConversions"),
    getSetting("analytics"),
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
      <FloatBar config={floatBar} />
      <ConversionTracker config={ads} />
      <AnalyticsTracker enabled={analytics.enabled} />

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
