import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans, Dancing_Script } from "next/font/google";
import "./globals.css";
import { site } from "@/lib/site";
import { getSetting } from "@/lib/settings";
import { parseMetaTags } from "@/lib/customCode";

const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://sanegitim.com"
).replace(/\/+$/, "");

const inter = Inter({
  subsets: ["latin", "latin-ext"],
  variable: "--font-inter",
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin", "latin-ext"],
  variable: "--font-jakarta",
  display: "swap",
});

const dancing = Dancing_Script({
  subsets: ["latin", "latin-ext"],
  variable: "--font-hand",
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const base: Metadata = {
    metadataBase: new URL(SITE_URL),
    title: {
      default: `${site.name} | San Eğitim & Danışmanlık — Liderlik Eğitimleri`,
      template: `%s | ${site.name}`,
    },
    description: site.description,
    openGraph: {
      type: "website",
      locale: "tr_TR",
      siteName: site.name,
      title: `${site.name} | San Eğitim & Danışmanlık`,
      description: site.description,
    },
  };

  // Panelden ("Kod Ekleme" > Sayfa başı kodu) yapıştırılan <meta> etiketlerini
  // gerçek <head> içine bas — Google Search Console doğrulama meta'sı burada
  // olmak zorunda. DB erişilemezse (build) sessizce atla, build bozulmasın.
  try {
    const cc = await getSetting("customCode");
    if (cc.headerEnabled && cc.headerCode) {
      const metas = parseMetaTags(cc.headerCode);
      if (Object.keys(metas).length) base.other = metas;
    }
  } catch {
    /* DB yok — sadece temel metadata döner */
  }

  return base;
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="tr"
      className={`${inter.variable} ${jakarta.variable} ${dancing.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
