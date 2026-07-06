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
  async redirects() {
    return [
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
