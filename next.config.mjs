// Eski WordPress sitesinde blog yazıları kök dizindeydi (aliozel.com.tr/<slug>/);
// SEO için yeni /blog/<slug> adreslerine kalıcı yönlendirme yapılır.
const wpBlogSlugs = [
  "insan-mi-yonetiyoruz-is-mi",
  "lider-yonetici-olmak",
  "uretimde-liderlik-ve-yeni-yil",
  "ic-egitici-olmak-bilgiyi-insanlara-tasimak",
  "egit-ogret-yonet-modeli-mavi-yakanin-yeni-yonetim-felsefesi",
  "satista-basariya-giden-yol",
  "genc-profesyoneller-icin-uprun",
  "uretimde-liderlik-iletisimden-basariya",
  "ciftci-kiz",
  "uretimde-liderlik",
  "vardiya-liderleri",
  "turkcellde-iletisim-onemlidir",
  "hizmette-kalite-tesaduf-degildir",
  "vardiya-liderleri-onemlidir",
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: "standalone",
  // Next, bot user-agent'larına (AdsBot dahil) metadata'yı bloklayarak,
  // tarayıcılara ise stream ederek farklı HTML döner. Google Ads incelemesi
  // bot/kullanıcı farkını "cloaking" sayabildiği için herkese aynı HTML gitsin.
  htmlLimitedBots: /.*/,
  async redirects() {
    return [
      // www ve çıplak alan adı ayrı ayrı 200 dönmesin — tek adres kalsın.
      {
        source: "/:path*",
        has: [{ type: "host", value: "www\\.(?<host>.+)" }],
        destination: "https://:host/:path*",
        permanent: true,
      },
      { source: "/hakkimda", destination: "/farkimiz-ne", permanent: true },
      { source: "/blog-yazilarim", destination: "/blog", permanent: true },
      ...wpBlogSlugs.map((slug) => ({
        source: `/${slug}`,
        destination: `/blog/${slug}`,
        permanent: true,
      })),
    ];
  },
};

export default nextConfig;
