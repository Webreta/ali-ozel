import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/egitim-notlari/"],
    },
    sitemap: "https://aliozel.com.tr/sitemap.xml",
  };
}
