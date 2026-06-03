# aliozel.com.tr — Kurumsal Eğitim & Danışmanlık Sitesi

Ali Özel (San Eğitim & Danışmanlık) için Next.js ile geliştirilen modern kurumsal
web sitesi. Mavi yaka, gri yaka ve beyaz yaka liderler için davranışsal ve
uygulamalı eğitim programlarını tanıtır.

## Teknoloji

- **Next.js 15** (App Router) + **TypeScript**
- Saf CSS tasarım sistemi (`app/globals.css`, CSS değişkenleriyle)
- Fontlar: Plus Jakarta Sans (başlık) + Inter (gövde) — `next/font`
- Şu an yalnızca **front-end** (form gönderimi henüz bir backend'e bağlı değil)

## Çalıştırma

```bash
npm install
npm run dev      # http://localhost:3000
```

Üretim derlemesi:

```bash
npm run build
npm start
```

> Not: `npm run dev` açıkken `npm run build` çalıştırmayın — ikisi de aynı `.next`
> klasörünü kullanır ve çakışır. Tip kontrolü için `npx tsc --noEmit` kullanın.

## Yapı

```
app/                     # sayfalar (App Router)
  page.tsx               # ana sayfa
  egitimler/             # eğitim index + [category] + [category]/[training]
  hakkimda, ekibimiz, iletisim, blog, galeri, referanslar
  globals.css            # tüm tasarım sistemi ve bileşen stilleri
components/              # Header, Footer, kartlar, modal, ApproachList vb.
lib/
  site.ts                # marka, iletişim, ana menü
  content.ts             # 8 eğitim kategorisi + eğitim modülleri
  trainingPages.ts       # eğitim detay sayfası içerikleri (slug haritası)
  references.ts          # referans logoları
public/                  # logo, fotoğraflar, referans logoları
hizmetler/               # eğitim içeriklerinin Word kaynakları
```

## İçerik nasıl güncellenir?

- **Kategoriler / modüller:** `lib/content.ts`
- **Bir eğitimin detay sayfası içeriği:** `lib/trainingPages.ts` haritasına
  `"<kategoriSlug>/<egitimSlug>": { ... }` anahtarıyla eklenir; `content.ts`
  sonundaki döngü otomatik bağlar. (Word kaynakları `hizmetler/` içinde.)
- **Marka / iletişim / menü:** `lib/site.ts`

## Durum

- Yönetim kategorisindeki 11 eğitimin tümü tam içerikle dolu.
- Diğer kategorilerin detay sayfaları sırayla doldurulacak (kart olarak listeleniyor).
