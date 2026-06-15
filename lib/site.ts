export const site = {
  name: "Ali Özel",
  brandTitle: "aliozel",
  brandSubtitle: "san eğitim & danışmanlık",
  tagline: "Uçamıyorsan koş, koşamıyorsan yürü…",
  description:
    "Üretim sahasından üst yönetime; mavi yaka, gri yaka ve beyaz yaka liderler için davranışsal ve uygulamalı kurumsal eğitim & danışmanlık.",
  contact: {
    phone: "+90 533 460 79 43",
    phoneHref: "tel:+905334607943",
    email: "ali@aliozel.com.tr",
    emailHref: "mailto:ali@aliozel.com.tr",
    location: "Sarıyer / İstanbul",
  },
  social: {
    instagram: "https://instagram.com/aliozelofficiall",
    linkedin: "https://www.linkedin.com/in/aliozel",
  },
} as const;

export type NavItem = {
  label: string;
  href: string;
  children?: { label: string; href: string }[];
};

export const mainNav: NavItem[] = [
  { label: "Ana Sayfa", href: "/" },
  { label: "Eğitimler", href: "/egitimler" }, // children doldurulur (content.ts)
  { label: "Ekibimiz", href: "/ekibimiz" },
  { label: "Referanslar", href: "/referanslar" },
  { label: "Hakkımda", href: "/hakkimda" },
  { label: "Blog", href: "/blog" },
  { label: "Galeri", href: "/galeri" },
  { label: "İletişim", href: "/iletisim" },
];
