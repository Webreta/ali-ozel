import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Icon from "@/components/Icon";

type BrandNote = {
  company: string;
  logo: string;
  title: string;
  date: string;
  meta: { label: string; value: string }[];
  intro: string;
  segments: { title: string; desc: string }[];
  notes: string[];
  materials: { name: string; size: string }[];
  gallery: { src: string; caption: string }[];
  instructorNote: string;
  feedback: { quote: string; person: string }[];
  comments: { name: string; initials: string; date: string; text: string }[];
};

const brandNotes: Record<string, BrandNote> = {
  vestel: {
    company: "Vestel",
    logo: "/referanslar/vestel.png",
    title: "Mavi Yaka Liderlik Programı",
    date: "Mart 2025",
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
    materials: [
      { name: "Eğitim Sunumu", size: "PDF · 4.2 MB" },
      { name: "Katılımcı Çalışma Kitabı", size: "PDF · 1.8 MB" },
      { name: "Saha Uygulama Kılavuzu", size: "PDF · 920 KB" },
      { name: "Geri Bildirim Şablonları", size: "PDF · 540 KB" },
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
    comments: [
      {
        name: "Murat A.",
        initials: "MA",
        date: "2 hafta önce",
        text: "Eğitim sahadaki gerçek sorunlarımıza birebir değindi. Ertesi vardiya hemen uygulamaya başladık, teşekkürler.",
      },
      {
        name: "Elif K.",
        initials: "EK",
        date: "3 hafta önce",
        text: "Zor konuşmalar bölümü ekibimde gözle görülür bir fark yarattı. Notları sık sık tekrar ediyorum.",
      },
      {
        name: "Serkan T.",
        initials: "ST",
        date: "1 ay önce",
        text: "Rol yapma çalışmaları çok gerçekçiydi. Geri bildirim verme şeklim tamamen değişti.",
      },
    ],
  },
};

export function generateStaticParams() {
  return Object.keys(brandNotes).map((brand) => ({ brand }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ brand: string }>;
}): Promise<Metadata> {
  const { brand } = await params;
  const note = brandNotes[brand];
  if (!note) return { title: "Eğitim Notu bulunamadı" };
  return {
    title: `${note.company} — ${note.title} | Eğitim Notları`,
    description: note.intro.slice(0, 150),
    robots: { index: false, follow: false },
  };
}

export default async function BrandNotePage({
  params,
}: {
  params: Promise<{ brand: string }>;
}) {
  const { brand } = await params;
  const note = brandNotes[brand];
  if (!note) notFound();

  return (
    <div className="note-standalone">
      {/* kendine özel header */}
      <header className="ns-header">
        <div className="ns-wrap ns-header-inner">
          <span className="ns-brand">
            <span className="ns-logo">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={note.logo} alt={note.company} />
            </span>
            <span className="ns-brand-label">Eğitim Notları</span>
          </span>
          <Link href="/egitim-notlari" className="ns-back">
            <span aria-hidden>←</span> Tüm notlar
          </Link>
        </div>
      </header>

      {/* doküman başlığı */}
      <section className="ns-hero">
        <div className="ns-wrap">
          <span className="ns-co">
            {note.company} · {note.date}
          </span>
          <h1>{note.title}</h1>
          <p className="ns-lead">
            {note.company} ekibine özel hazırlanmış eğitim notları, materyaller
            ve programın saha çıktıları.
          </p>
          <div className="ns-meta">
            {note.meta.map((m) => (
              <div key={m.label}>
                <span>{m.label}</span>
                <strong>{m.value}</strong>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* içerik */}
      <main className="ns-main">
        <div className="ns-wrap ns-body">
          {/* Proje detayı */}
          <section className="ns-block">
            <span className="ns-kicker">Proje Detayı</span>
            <h2>Programın hikâyesi</h2>
            <p className="ns-text">{note.intro}</p>
          </section>

          {/* Eğitmen notu */}
          <section className="ns-block">
            <blockquote className="ns-quote">
              <Icon name="quote" />
              <p>{note.instructorNote}</p>
              <cite>Ali Özel · Baş Eğitmen</cite>
            </blockquote>
          </section>

          {/* Segmentler */}
          <section className="ns-block">
            <span className="ns-kicker">Segmentler</span>
            <h2>Program akışı</h2>
            <div className="ns-segments">
              {note.segments.map((s, i) => (
                <div className="ns-segment" key={s.title}>
                  <span className="ns-seg-num">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3>{s.title}</h3>
                    <p>{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Notlar */}
          <section className="ns-block">
            <span className="ns-kicker">Eğitim Notları</span>
            <h2>Akılda kalanlar</h2>
            <ul className="ns-notes">
              {note.notes.map((n) => (
                <li key={n}>
                  <Icon name="check" />
                  <span>{n}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Materyaller */}
          <section className="ns-block">
            <span className="ns-kicker">Materyaller</span>
            <h2>İndirilebilir dosyalar</h2>
            <div className="ns-files">
              {note.materials.map((f) => (
                <a className="ns-file" href="#" key={f.name}>
                  <span className="ns-file-ic">PDF</span>
                  <span className="ns-file-txt">
                    <strong>{f.name}</strong>
                    <small>{f.size}</small>
                  </span>
                  <Icon name="arrow-up-right" />
                </a>
              ))}
            </div>
          </section>

          {/* Galeri */}
          <section className="ns-block">
            <span className="ns-kicker">Galeri</span>
            <h2>Eğitimden kareler</h2>
            <div className="ns-slider">
              {note.gallery.map((g) => (
                <figure className="ns-slide" key={g.caption}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={g.src} alt={g.caption} />
                  <figcaption>{g.caption}</figcaption>
                </figure>
              ))}
            </div>
          </section>

          {/* Geri bildirim */}
          <section className="ns-block">
            <span className="ns-kicker">Katılımcı Geri Bildirimi</span>
            <h2>Ekipten yansımalar</h2>
            <div className="ns-feedback">
              {note.feedback.map((f) => (
                <div className="ns-fb" key={f.person}>
                  <p>“{f.quote}”</p>
                  <cite>{f.person}</cite>
                </div>
              ))}
            </div>
          </section>

          {/* Yorumlar */}
          <section className="ns-block">
            <span className="ns-kicker">Yorumlar</span>
            <h2>Katılımcı yorumları</h2>
            <div className="ns-comments">
              {note.comments.map((c) => (
                <div className="ns-comment" key={c.name + c.date}>
                  <span className="ns-avatar">{c.initials}</span>
                  <div className="ns-comment-body">
                    <div className="ns-comment-head">
                      <strong>{c.name}</strong>
                      <span>{c.date}</span>
                    </div>
                    <p>{c.text}</p>
                  </div>
                </div>
              ))}
            </div>

            <form className="ns-comment-form" action="#">
              <h3>Yorum bırakın</h3>
              <input type="text" placeholder="Adınız" aria-label="Adınız" />
              <textarea
                rows={3}
                placeholder="Eğitimle ilgili yorumunuzu yazın..."
                aria-label="Yorumunuz"
              />
              <button type="button">
                Yorum Gönder
                <Icon name="arrow-right" />
              </button>
            </form>
          </section>
        </div>
      </main>

      {/* kendine özel footer */}
      <footer className="ns-footer">
        <div className="ns-wrap ns-footer-inner">
          <div>
            <strong>Ali Özel · San Eğitim &amp; Danışmanlık</strong>
            <p>
              Bu sayfa {note.company} ekibine özeldir ve yalnızca erişim koduyla
              görüntülenir.
            </p>
          </div>
          <Link href="/egitim-notlari" className="ns-footer-link">
            Tüm eğitim notları <Icon name="arrow-right" />
          </Link>
        </div>
      </footer>
    </div>
  );
}
