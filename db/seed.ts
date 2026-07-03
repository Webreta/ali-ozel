/**
 * İlk veri yükleme: mevcut statik içeriği (lib/content.ts, lib/references.ts,
 * sayfa içi ekip + vestel notu) veritabanına taşır. Idempotent — dolu tabloları
 * atlar, tekrar çalıştırmak güvenlidir.
 *
 *   npx tsx db/seed.ts
 *
 * ÖNEMLİ: Eğitimler SADECE lib/content.ts'ten okunur — dosyanın sonundaki döngü
 * trainingPages kayıtlarını training.page'e zaten iliştiriyor. trainingPages.ts'i
 * ayrıca import etmek çift sayıma yol açar.
 */
import "dotenv/config";
import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import { hashSync } from "bcryptjs";
import * as schema from "./schema";
import { categories as staticCategories } from "../lib/content";
import { references as staticReferences } from "../lib/references";

const client = postgres(process.env.DATABASE_URL!, { max: 1 });
const db = drizzle(client, { schema });

const daysAgo = (n: number) => new Date(Date.now() - n * 24 * 60 * 60 * 1000);

async function seedCatalog() {
  const existing = await db.select().from(schema.categories).limit(1);
  if (existing.length) {
    console.log("• Katalog dolu, atlandı");
    return;
  }
  for (const [ci, cat] of staticCategories.entries()) {
    const [row] = await db
      .insert(schema.categories)
      .values({
        slug: cat.slug,
        name: cat.name,
        shortName: cat.shortName,
        icon: cat.icon,
        tagline: cat.tagline,
        summary: cat.summary,
        forWhom: cat.forWhom,
        sortOrder: ci,
      })
      .returning({ id: schema.categories.id });

    for (const [ti, t] of cat.trainings.entries()) {
      const [tr] = await db
        .insert(schema.trainings)
        .values({
          categoryId: row.id,
          slug: t.slug,
          title: t.title,
          blurb: t.blurb,
          sortOrder: ti,
        })
        .returning({ id: schema.trainings.id });

      if (t.page) {
        await db.insert(schema.trainingPages).values({
          trainingId: tr.id,
          seoTitle: t.page.seoTitle,
          seoDescription: t.page.seoDescription,
          heroQuote: t.page.heroQuote,
          audience: t.page.audience,
          intro: t.page.intro,
          sections: t.page.sections,
          outcomes: t.page.outcomes,
          format: t.page.format,
          faq: t.page.faq,
        });
      }
    }
  }
  const pageCount = staticCategories
    .flatMap((c) => c.trainings)
    .filter((t) => t.page).length;
  console.log(
    `✓ Katalog: ${staticCategories.length} kategori, ${staticCategories.reduce((n, c) => n + c.trainings.length, 0)} eğitim, ${pageCount} detay sayfası`
  );
}

async function seedReferences() {
  const existing = await db.select().from(schema.referenceLogos).limit(1);
  if (existing.length) {
    console.log("• Referanslar dolu, atlandı");
    return;
  }
  await db.insert(schema.referenceLogos).values(
    staticReferences.map((r, i) => ({ name: r.name, src: r.src, sortOrder: i }))
  );
  console.log(`✓ Referanslar: ${staticReferences.length} logo`);
}

// app/(site)/ekibimiz/page.tsx'ten birebir kopya (sayfa modülü next bağımlılığı
// çektiği için import edilmiyor). İlk kayıt kurucu/lider kart.
const team = [
  {
    name: "Ali Özel",
    roleTitle: "Kurucu & Baş Eğitmen",
    photo: "/team/ali-ozel.jpg",
    bio: "Mavi yaka liderliği ve Eğit-Öğret-Yönet metodolojisinin mimarı. Yıllarını üretim sahasında, gerçek ekiplerin içinde geçirdi; sahanın gerçeğinden doğan, davranış değiştiren eğitimler veriyor.",
  },
  {
    name: "Prof. Dr. Sabah Balta Ulay",
    roleTitle: "Yönetim & Strateji Profesörü",
    photo: "/team/sabah-balta-ulay.jpg",
    bio: "Yaşar Üniversitesi öğretim üyesi ve 14+ yıl YÜSEM müdürü. Yönetim, liderlik, motivasyon ve örgütsel gelişim alanlarında binlerce yöneticiye eğitim verdi.",
  },
  {
    name: "Taner Akdaş",
    roleTitle: "Satış & İletişim Eğitmeni · ICF Koç",
    photo: "/team/taner-akdas.jpg",
    bio: "ICF onaylı profesyonel koç. Satış, iletişim ve müşteri deneyimi alanında 21.000+ katılımcıya 13.000+ saat eğitim verdi; Garanti, Akbank, Hepsiburada gibi kurumlarla çalıştı.",
  },
  {
    name: "Timur Nihat Vreskala",
    roleTitle: "İş Geliştirme & Operasyon Uzmanı",
    photo: "/team/timur-vreskala.jpg",
    bio: "25+ yıllık kariyerinde IT proje yönetimi, çağrı merkezi, satış ve iş geliştirme alanlarında uzmanlaştı. 12.000+ katılımcıya 8.000+ saat eğitim verdi.",
  },
  {
    name: "Sevde Engin",
    roleTitle: "İK & Organizasyonel Gelişim Uzmanı",
    photo: "/team/sevde-engin.jpg",
    bio: "İK, organizasyonel gelişim ve eğitim yönetiminde 13+ yıl deneyim. Performans yönetimi, OKR sistemleri ve liderlik gelişimi alanlarında danışmanlık veriyor.",
  },
  {
    name: "Mehmet Yıldız",
    roleTitle: "Üretim & Operasyon Eğitmeni",
    initials: "MY",
    bio: "Saha üretiminden gelen deneyimiyle vardiya liderliği, iş güvenliği kültürü ve operasyonel verimlilik alanlarında eğitimler veriyor. (Örnek kart)",
  },
  {
    name: "Zeynep Kaya",
    roleTitle: "Satış & Müşteri Deneyimi Eğitmeni",
    initials: "ZK",
    bio: "Perakende ve hizmet sektöründe satış ekipleri, müşteri memnuniyeti ve ikna becerileri üzerine uygulamalı programlar yürütüyor. (Örnek kart)",
  },
];

async function seedTeam() {
  const existing = await db.select().from(schema.teamMembers).limit(1);
  if (existing.length) {
    console.log("• Ekip dolu, atlandı");
    return;
  }
  await db
    .insert(schema.teamMembers)
    .values(team.map((m, i) => ({ ...m, sortOrder: i })));
  console.log(`✓ Ekip: ${team.length} kişi`);
}

async function seedVestelNote() {
  const existing = await db.select().from(schema.brandNotes).limit(1);
  if (existing.length) {
    console.log("• Eğitim notları dolu, atlandı");
    return;
  }
  const [note] = await db
    .insert(schema.brandNotes)
    .values({
      slug: "vestel",
      company: "Vestel",
      logo: "/referanslar/vestel.png",
      title: "Mavi Yaka Liderlik Programı",
      eventDateLabel: "Mart 2025",
      meta: [
        { label: "Süre", value: "2 gün (12 saat)" },
        { label: "Katılımcı", value: "18 vardiya lideri" },
        { label: "Lokasyon", value: "Manisa Üretim Kampüsü" },
        { label: "Format", value: "Şirket içi (in-house)" },
        { label: "Yöntem", value: "Rol yapma & vaka çalışmaları" },
        { label: "Dil", value: "Türkçe" },
      ],
      intro:
        "Vestel Manisa üretim kampüsündeki vardiya liderleri için tasarlanan bu program; sahanın gerçek diliyle, üretim hattının ritmini bozmadan liderlik etkisini güçlendirmeyi hedefledi. İki gün boyunca rol yapma, vaka çalışmaları ve birebir geri bildirim oturumlarıyla teorik bilgi sahaya dönüştürüldü. Program; ekip içi iletişim, zor konuşmaları yönetme ve sürdürülebilir motivasyon başlıkları etrafında kurgulandı.",
      segments: [
        {
          title: "Sahada Liderlik Duruşu",
          desc: "Vardiya liderinin ekip üzerindeki davranışsal etkisi; otorite ile güven arasındaki dengeyi kurma ve tutarlılık.",
        },
        {
          title: "Vardiya İçi İletişim",
          desc: "Gürültülü üretim ortamında net, kısa ve doğru iletişim; bilgi akışını ve devir-teslimi kesintisiz tutma.",
        },
        {
          title: "Zor Konuşmalar & Geri Bildirim",
          desc: "Performans ve davranış konularını çatışmaya dönüştürmeden ele alma; yapıcı geri bildirim teknikleri.",
        },
        {
          title: "Ekip Motivasyonu & Aidiyet",
          desc: "Mavi yaka ekiplerde içsel motivasyonu tetikleyen takdir, sahiplenme ve ortak hedef pratikleri.",
        },
      ],
      notes: [
        "Lider, söylediğiyle değil kurduğu bağ ve tutarlılığıyla iz bırakır.",
        "Geri bildirim; kişiyi değil davranışı ve somut sonucu hedeflemelidir.",
        "Vardiya devir-teslimi, ekibin güven ve verim seviyesini belirleyen kritik andır.",
        "Takdir, en güçlü ve en düşük maliyetli motivasyon aracıdır.",
        "Zor konuşmayı ertelemek, sorunu büyütür; zamanında ve sakin ele almak çözer.",
      ],
      gallery: [
        { src: "/ali-ozel.jpg", caption: "Açılış oturumu" },
        { src: "/ali-ozel-form.jpg", caption: "Grup çalışması" },
        { src: "/ali-ozel-selfie.jpg", caption: "Saha uygulaması" },
        { src: "/team/ali-ozel.jpg", caption: "Kapanış & sertifika" },
      ],
      instructorNote:
        "Bu ekip, sahanın dilini çok iyi biliyor. Bizim işimiz teori anlatmak değil; onların zaten bildiği doğruları bilinçli birer liderlik aracına dönüştürmekti. İki günün sonunda gördüğüm en değerli şey, vardiya liderlerinin birbirine verdiği geri bildirimdeki olgunluktu.",
      feedback: [
        {
          quote:
            "İlk kez bir eğitim sahadaki gerçek sorunlarımızla bu kadar örtüştü. Ertesi vardiya hemen uygulamaya başladık.",
          person: "Vardiya Lideri, Montaj Hattı",
        },
        {
          quote:
            "Zor konuşma bölümü benim için dönüm noktasıydı. Artık çatışmadan önce nasıl konuşacağımı biliyorum.",
          person: "Takım Lideri, Kalite",
        },
        {
          quote:
            "Rol yapma çalışmaları çok gerçekçiydi; kendi ekibimi karşımda gibi hissettim.",
          person: "Vardiya Amiri, Lojistik",
        },
      ],
    })
    .returning({ id: schema.brandNotes.id });

  // Dosyalar henüz yok — file_path boş, UI "yüklenmedi" gösterir
  await db.insert(schema.brandNoteMaterials).values([
    { brandNoteId: note.id, name: "Eğitim Sunumu", sortOrder: 0 },
    { brandNoteId: note.id, name: "Katılımcı Çalışma Kitabı", sortOrder: 1 },
    { brandNoteId: note.id, name: "Saha Uygulama Kılavuzu", sortOrder: 2 },
    { brandNoteId: note.id, name: "Geri Bildirim Şablonları", sortOrder: 3 },
  ]);

  await db.insert(schema.accessCodes).values({
    code: "VESTEL-2025",
    brandNoteId: note.id,
  });

  // Sitedeki göreli tarihler ("2 hafta önce") gerçek timestamp'e çevrildi
  await db.insert(schema.noteComments).values([
    {
      brandNoteId: note.id,
      name: "Murat A.",
      initials: "MA",
      body: "Eğitim sahadaki gerçek sorunlarımıza birebir değindi. Ertesi vardiya hemen uygulamaya başladık, teşekkürler.",
      approved: true,
      createdAt: daysAgo(14),
    },
    {
      brandNoteId: note.id,
      name: "Elif K.",
      initials: "EK",
      body: "Zor konuşmalar bölümü ekibimde gözle görülür bir fark yarattı. Notları sık sık tekrar ediyorum.",
      approved: true,
      createdAt: daysAgo(21),
    },
    {
      brandNoteId: note.id,
      name: "Serkan T.",
      initials: "ST",
      body: "Rol yapma çalışmaları çok gerçekçiydi. Geri bildirim verme şeklim tamamen değişti.",
      approved: true,
      createdAt: daysAgo(30),
    },
  ]);
  console.log("✓ Vestel eğitim notu + erişim kodu + yorumlar");
}

async function seedAdmin() {
  const email = process.env.SEED_ADMIN_EMAIL;
  const password = process.env.SEED_ADMIN_PASSWORD;
  if (!email || !password) {
    console.log("• SEED_ADMIN_EMAIL/PASSWORD tanımsız, admin atlandı");
    return;
  }
  await db
    .insert(schema.users)
    .values({
      email,
      name: "Admin",
      passwordHash: hashSync(password, 12),
      role: "admin",
    })
    .onConflictDoNothing({ target: schema.users.email });
  console.log(`✓ Admin kullanıcı: ${email}`);
}

async function main() {
  await seedCatalog();
  await seedReferences();
  await seedTeam();
  await seedVestelNote();
  await seedAdmin();
  await client.end();
  console.log("Seed tamamlandı.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
