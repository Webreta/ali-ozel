import { trainingPages } from "./trainingPages";
// Tüm eğitim içeriği bu dosyada. Word kaynakları hizmetler/ klasöründe.
// İlk kategorinin (Yönetim) ilk eğitiminin tam detay sayfası `page` ile dolu;
// diğer eğitimler şimdilik kart olarak listeleniyor, onay sonrası detayları açılacak.

export type FaqItem = { q: string; a: string };

export type TrainingSection = {
  title: string;
  intro: string;
  bullets: string[];
};

export type TrainingPage = {
  seoTitle: string;
  seoDescription: string;
  heroQuote: string;
  intro: string[];
  audience: string;
  sections: TrainingSection[];
  outcomes: string[];
  format: { label: string; value: string }[];
  faq: FaqItem[];
};

export type Training = {
  slug: string;
  title: string;
  blurb: string;
  page?: TrainingPage;
};

export type Category = {
  slug: string;
  name: string;
  shortName: string;
  icon: string; // Icon.tsx anahtarı
  tagline: string;
  summary: string;
  forWhom: string[];
  trainings: Training[];
};


export const categories: Category[] = [
  {
    slug: "genel-katalog-egitimleri",
    name: "Genel Katalog Eğitimleri",
    shortName: "Genel Katalog",
    icon: "book",
    tagline: "Her seviyeye uygun temel liderlik kataloğu",
    summary:
      "Tüm kademelerde işe yarayan, en çok talep gören temel liderlik ve yönetim eğitimlerinden oluşan genel katalog. Kurumunuzun ihtiyacına göre tekil modül ya da bütün bir program olarak planlanabilir.",
    forWhom: [
      "Her seviyeden yönetici ve takım lideri",
      "Liderlik gelişimine yeni başlayan ekipler",
      "Karma kademelerden oluşan gruplar",
    ],
    trainings: [
      {
        slug: "lider-iliski-yonetimi-iletisim",
        title: "Liderin İlişki Yönetimi ve İletişim",
        blurb:
          "Güven inşa eden liderlik iletişimi, aktif dinleme ve paydaş ilişkileri.",
      },
      {
        slug: "takim-calismasi-aidiyet",
        title: "Takım Çalışması ve Aidiyet",
        blurb: "Yüksek performanslı takımlar ve kalıcı aidiyet kültürü.",
      },
      {
        slug: "lider-yonetici-temel-kurallar",
        title: "Lider ve Yöneticinin Temel Kuralları",
        blurb: "Etkili liderliğin değişmez ilkeleri ve günlük yönetim refleksleri.",
      },
      {
        slug: "liderlik-stratejisi-clinton-sidle",
        title: "Liderlik Stratejisi (Clinton Sidle Modeli)",
        blurb: "Bütünsel liderlik modeliyle stratejik yön ve denge.",
      },
      {
        slug: "karar-verme-kararlilik",
        title: "Karar Verme ve Kararlılık",
        blurb: "Belirsizlik altında hızlı, tutarlı ve sahiplenilen kararlar.",
      },
      {
        slug: "zor-insanlari-yonetme",
        title: "Zor İnsanları Yönetme",
        blurb: "Dirençli ve zorlu profillerle yapıcı biçimde başa çıkma.",
      },
      {
        slug: "ikna-gucu-psikolojisi",
        title: "İkna Gücü ve Psikolojisi",
        blurb: "Etki yaratmanın psikolojik temelleri ve etik ikna teknikleri.",
      },
      {
        slug: "catisma-yonetimi-problem-cozme",
        title: "Çatışma Yönetimi ve Problem Çözme",
        blurb: "Çatışmayı fırsata çevirme ve kök neden odaklı problem çözme.",
      },
      {
        slug: "performans-yonetimi-geribildirim",
        title: "Performans Yönetimi ve Geri Bildirim",
        blurb: "Gelişim odaklı geri bildirim ve etkili performans görüşmeleri.",
      },
      {
        slug: "planlama-organizasyon-zaman-yonetimi",
        title: "Planlama, Organize Olma ve Zaman Yönetimi",
        blurb: "Önceliklendirme, delege etme ve derin çalışma zamanı.",
      },
      {
        slug: "kocluk-mentorluk",
        title: "Koçluk ve Mentorluk",
        blurb: "GROW modeliyle ekipte kalıcı gelişim kültürü.",
      },
    ],
  },
  {
    slug: "yonetim-egitimleri",
    name: "Yönetim Eğitimleri",
    shortName: "Yönetim",
    icon: "compass",
    tagline: "Orta ve üst düzey yöneticiler için liderlik gelişimi",
    summary:
      "Yöneticilerin liderlik etkisini derinleştiren, iletişimden karar vermeye, çatışma yönetiminden koçluğa uzanan kapsamlı bir gelişim programı. Her modül davranışsal ve uygulamaya odaklıdır.",
    forWhom: [
      "Orta ve üst düzey yöneticiler",
      "Departman ve takım liderleri",
      "Yöneticiliğe hazırlanan yüksek potansiyelli çalışanlar",
    ],
    trainings: [
      {
        slug: "lider-iliski-yonetimi-iletisim",
        title: "Liderin İlişki Yönetimi ve İletişim",
        blurb:
          "Güven inşa eden liderlik iletişimi, aktif dinleme ve paydaş ilişkilerini yönetme.",
      },
      {
        slug: "takim-calismasi-aidiyet",
        title: "Takım Çalışması ve Aidiyet",
        blurb:
          "Yüksek performanslı takımlar kurma ve kalıcı aidiyet kültürü yaratma.",
      },
      {
        slug: "lider-yonetici-temel-kurallar",
        title: "Lider ve Yöneticinin Temel Kuralları",
        blurb: "Etkili liderliğin değişmez ilkeleri ve günlük yönetim refleksleri.",
      },
      {
        slug: "liderlik-stratejisi-clinton-sidle",
        title: "Liderlik Stratejisi (Clinton Sidle Modeli)",
        blurb: "Bütünsel liderlik modeliyle stratejik yön ve denge oluşturma.",
      },
      {
        slug: "karar-verme-kararlilik",
        title: "Karar Verme ve Kararlılık",
        blurb: "Belirsizlik altında hızlı, tutarlı ve sahiplenilen kararlar alma.",
      },
      {
        slug: "zor-insanlari-yonetme",
        title: "Zor İnsanları Yönetme",
        blurb: "Dirençli ve zorlu profillerle yapıcı biçimde başa çıkma stratejileri.",
      },
      {
        slug: "ikna-gucu-psikolojisi",
        title: "İkna Gücü ve Psikolojisi",
        blurb: "Etki yaratmanın psikolojik temelleri ve etik ikna teknikleri.",
      },
      {
        slug: "catisma-yonetimi-problem-cozme",
        title: "Çatışma Yönetimi ve Problem Çözme",
        blurb: "Çatışmayı fırsata çevirme ve kök neden odaklı problem çözme.",
      },
      {
        slug: "performans-yonetimi-geribildirim",
        title: "Performans Yönetimi ve Geri Bildirim",
        blurb: "Gelişim odaklı geri bildirim kültürü ve etkili performans görüşmeleri.",
      },
      {
        slug: "planlama-organizasyon-zaman-yonetimi",
        title: "Planlama, Organize Olma ve Zaman Yönetimi",
        blurb: "Önceliklendirme, delege etme ve derin çalışma zamanı oluşturma.",
      },
      {
        slug: "kocluk-mentorluk",
        title: "Koçluk ve Mentorluk",
        blurb: "GROW modeliyle ekipte kalıcı gelişim kültürü oluşturma.",
      },
    ],
  },
  {
    slug: "lider-muhendis-egitimleri",
    name: "Lider Mühendis Eğitimleri",
    shortName: "Lider Mühendis",
    icon: "cog",
    tagline: "Teknik uzmanlığı insan yönetimiyle birleştiren mühendisler için",
    summary:
      "İnsan yönetimi, iletişim, ikna ve koçluk mühendislik müfredatında yer almaz; ancak mühendis liderlerin her gün karşılaştığı gerçeklerdir. Bu program teknik düşünceyi liderlik becerileriyle buluşturur.",
    forWhom: [
      "Üretim, proje ve Ar-Ge mühendisleri",
      "Proje yöneticisi ve teknik lider pozisyonundaki mühendisler",
      "Mühendislik müdürleri ve departman şefleri",
    ],
    trainings: [
      {
        slug: "uretimde-iliski-yonetimi-verimlilik",
        title: "Üretimde İlişki Yönetimi ve Verimlilik",
        blurb: "Mühendis-operatör köprüsü, güven inşası ve ilişkiyi verimliliğe çevirme.",
      },
      {
        slug: "ekip-calismasi-aidiyet-yaratma",
        title: "Ekip Çalışması ve Takımda Aidiyet Yaratma",
        blurb: "Çok disiplinli ekiplerde uyum ve aidiyet kültürü oluşturma.",
      },
      {
        slug: "insan-yonetimi-egit-ogret-yonet",
        title: "Üretimde İnsan Yönetimi: Eğit-Öğret-Yönet",
        blurb: "Saha koçluğuyla çalışan geliştirme metodolojisi.",
      },
      {
        slug: "kusak-farkliliklari-uretimde-yonetim",
        title: "Kuşak Farklılıkları ve Üretimde Doğru Yönetim",
        blurb: "X, Y ve Z kuşaklarıyla etkili çalışma stratejileri.",
      },
      {
        slug: "problem-cozme-catisma-yonetimi",
        title: "Problem Çözme ve Çatışmaları Yönetme",
        blurb: "İnsan kaynaklı kök neden analizi ve paydaş direnci yönetimi.",
      },
      {
        slug: "is-planlama-organizasyon-zaman",
        title: "İş Planlama, Organizasyon ve Zaman Yönetimi",
        blurb: "Teknik-liderlik zaman dengesi, ekip planlaması ve delege etme.",
      },
      {
        slug: "etkileme-ikna-teknikleri",
        title: "Üretimde Etkileme ve İkna Teknikleri",
        blurb: "Teknik kararları üst yönetime ve sahaya kabul ettirme.",
      },
      {
        slug: "zor-durumlar-insanlarla-basa-cikma",
        title: "Zor Durumlar ve İnsanlarla Başa Çıkma",
        blurb: "Baskı altında liderlik ve zorlu paydaş stratejileri.",
      },
      {
        slug: "performans-yonetimi-etkin-geribildirim",
        title: "Performans Yönetimi ve Etkin Geri Bildirim",
        blurb: "OKR ile mühendislik hedefleri ve geri bildirim modelleri.",
      },
      {
        slug: "kocluk-mentorluk-danismanlik",
        title: "Koçluk, Mentorluk ve Danışmanlık",
        blurb: "GROW modeli ve teknik mentorluk ilişkisi.",
      },
    ],
  },
  {
    slug: "mavi-gri-yaka-lider-egitimleri",
    name: "Mavi Yaka ve Gri Yaka Lider Eğitimleri",
    shortName: "Mavi & Gri Yaka",
    icon: "wrench",
    tagline: "Üretim sahasının gerçek liderleri için Eğit-Öğret-Yönet",
    summary:
      "Formen, vardiya amiri, hat lideri ve üretim şefi kurumun operasyonel omurgasıdır. Bu program sahaya özgü Eğit-Öğret-Yönet metodolojisiyle, üretim ortamının diline ve temposuna uygun biçimde tasarlanmıştır.",
    forWhom: [
      "Formen ve kıdemli formenler",
      "Vardiya amirleri ve vardiya şefleri",
      "Hat liderleri, üretim şefleri ve atölye sorumluları",
    ],
    trainings: [
      {
        slug: "uretimde-iliski-yonetimi-verimlilik",
        title: "Üretimde İlişki Yönetimi ve Verimlilik",
        blurb: "Saha iletişimi, güven inşası ve verimlilik odaklı ilişki yönetimi.",
      },
      {
        slug: "ekip-calismasi-takim-yonetimi",
        title: "Ekip Çalışması ve Takımı Yönetebilme",
        blurb: "Saha ekip dinamikleri, görev dağılımı ve aidiyet kültürü.",
      },
      {
        slug: "uretimde-insan-yonetimi-dinamik",
        title: "Üretimde İnsan Yönetimi ve Dinamik Olma",
        blurb: "Değişime uyum, kriz anında liderlik ve dinamik karar verme.",
      },
      {
        slug: "is-guvenligi-lider-davranislari",
        title: "İş Güvenliği Odaklı Lider Davranışları",
        blurb: "Güvenli davranışı pekiştirme ve sahada güvenlik kültürü.",
      },
      {
        slug: "kusak-farkliliklari-uretimde-yonetim",
        title: "Kuşak Farklılıkları ve Üretimde Yönetim",
        blurb: "Çok kuşaklı saha ekiplerini motive etme ve yönetme.",
      },
      {
        slug: "problem-cozme-catisma-yonetimi",
        title: "Problem Çözme ve Çatışmaları Yönetme",
        blurb: "Saha problem çözme araçları ve hızlı müdahale.",
      },
      {
        slug: "is-planlama-zaman-yonetimi",
        title: "İş Planlama ve Zaman Yönetimi",
        blurb: "Vardiya planlaması, önceliklendirme ve zaman tuzakları.",
      },
      {
        slug: "operator-etkileme-ikna-teknikleri",
        title: "Operatörleri Etkileme ve İkna Teknikleri",
        blurb: "Emir vermek yerine ikna ederek sahada etki yaratma.",
      },
      {
        slug: "zor-calisanlarla-basa-cikma",
        title: "Zor Çalışanlarla Başa Çıkma",
        blurb: "Zorlu profilleri yönetme, sınır koyma ve ekip enerjisini koruma.",
      },
      {
        slug: "verimli-geribildirim-verme",
        title: "Çalışanlara Verimli Geri Bildirim Verme",
        blurb: "Anlık, davranış odaklı ve motive eden saha geri bildirimi.",
      },
    ],
  },
  {
    slug: "satis-pazarlama-egitimleri",
    name: "Satış ve Pazarlama Eğitimleri",
    shortName: "Satış & Pazarlama",
    icon: "chart",
    tagline: "Sürdürülebilir satış performansı için uygulamalı programlar",
    summary:
      "Satış; doğru insana doğru zamanda doğru değeri sunmaktır. Bu programlar satış profesyonellerinin hem teknik becerilerini hem de ilişki kurma kapasitelerini geliştirir ve müşteri değerini artırır.",
    forWhom: [
      "Satış direktörleri ve satış müdürleri",
      "Satış temsilcileri ve key account yöneticileri",
      "Pazarlama profesyonelleri",
    ],
    trainings: [
      {
        slug: "musteri-iliskileri-yonetimi-iletisim",
        title: "Müşteri İlişkileri Yönetimi ve İletişim",
        blurb: "Güvene dayalı, uzun vadeli müşteri ilişkileri kurma.",
      },
      {
        slug: "satis-teknikleri-deger-yaratma",
        title: "Satış Teknikleri ve Değer Yaratma",
        blurb: "Ürün satmaktan değer sunmaya geçiş ve modern satış teknikleri.",
      },
      {
        slug: "stratejik-muzakere-yonetimi",
        title: "Stratejik Müzakere Yönetimi",
        blurb: "Kazan-kazan müzakere stratejileri ve değer koruma.",
      },
      {
        slug: "zor-musteri-yonetimi",
        title: "Zor Müşteri Yönetimi",
        blurb: "İtirazları yönetme ve zorlu müşterilerle ilişkiyi sürdürme.",
      },
      {
        slug: "segmentasyon-planlama-zaman",
        title: "Segmentasyon, Planlama ve Zaman Yönetimi",
        blurb: "Doğru müşteriye doğru kaynağı ayıran satış planlaması.",
      },
      {
        slug: "yeni-musteri-olusturma-stratejisi",
        title: "Yeni Müşteri Oluşturma Stratejisi",
        blurb: "Sistematik müşteri kazanımı ve pipeline oluşturma.",
      },
      {
        slug: "noromarketing-satis-modeli",
        title: "Nöromarketing Satış Modeli",
        blurb: "Karar psikolojisine dayalı satış ve ikna modeli.",
      },
    ],
  },
  {
    slug: "takim-calismasi-indoor-outdoor",
    name: "Takım Çalışması — Indoor & Outdoor",
    shortName: "Takım Çalışması",
    icon: "users",
    tagline: "Yaşayarak öğrenme ile davranış dönüşümü",
    summary:
      "Söylenen şeyler unutulur; yaşananlar kişiliğe işlenir. Indoor ve outdoor deneyimsel aktiviteler; ekip uyumunu, iletişimi ve ortak sorumluluğu güçlendirir. Her aktivite kurumun gerçek ihtiyaçlarına göre uyarlanır.",
    forWhom: [
      "Ekip uyumunu güçlendirmek isteyen tüm kurumlar",
      "Departmanlar arası iş birliği hedefleyen ekipler",
      "Yeni kurulan veya birleşen takımlar",
    ],
    trainings: [
      {
        slug: "birlikte-yuruyelim",
        title: "Birlikte Yürüyelim",
        blurb: "Ortak ritim ve eşgüdüm gerektiren takım deneyimi.",
      },
      {
        slug: "pipetlerle-buyulu-dokunus",
        title: "Pipetlerle Büyülü Dokunuş",
        blurb: "Yaratıcılık ve iş birliğiyle ortak çözüm üretme.",
      },
      {
        slug: "kilit-taslari-hayatta-kalma",
        title: "Kilit Taşları: Hayatta Kalma",
        blurb: "Baskı altında ortak karar ve kaynak yönetimi.",
      },
      {
        slug: "ip-cambazi",
        title: "İp Cambazı",
        blurb: "Güven, denge ve takım desteği üzerine deneyim.",
      },
      {
        slug: "petrol-boru-hatti",
        title: "Petrol Boru Hattı",
        blurb: "Süreç planlama ve uçtan uca koordinasyon aktivitesi.",
      },
      {
        slug: "kule-yapma",
        title: "Kule Yapma",
        blurb: "Strateji, rol dağılımı ve ortak hedefe ulaşma.",
      },
      {
        slug: "kalas-ile-takim-olabilme",
        title: "Kalas ile Takım Olabilme",
        blurb: "Birlikte hareket etmeyi öğreten denge deneyimi.",
      },
      {
        slug: "gokkusaginda-yuruyebilme",
        title: "Gökkuşağında Yürüyebilme",
        blurb: "Cesaret, destek ve takım dayanışması temalı aktivite.",
      },
    ],
  },
  {
    slug: "turizm-isletme-egitimleri",
    name: "Turizm İşletme Eğitimleri",
    shortName: "Turizm İşletme",
    icon: "building",
    tagline: "Otel yönetimi ve konaklama sektörü için sistemli programlar",
    summary:
      "Konaklama sektörü; insan yoğun, hız gerektiren ve her temas noktasının marka değerini etkilediği dinamik bir sektördür. Bu programlar güçlü bir yönetim sistemi, net roller ve sürekli gelişen bir ekip kurmaya odaklanır.",
    forWhom: [
      "Otel müdürleri ve departman liderleri",
      "İK ve gelir yöneticileri",
      "Beş yıldızlı, butik ve bağımsız konaklama işletmeleri",
    ],
    trainings: [
      {
        slug: "sistemli-otel-egitimi",
        title: "Sistemli Otel Eğitimi",
        blurb: "Otel operasyonunu sistematik ve ölçülebilir biçimde yönetme.",
      },
      {
        slug: "kurum-kulturu-temsil-egitimi",
        title: "Kurum Kültürü ve Temsil Eğitimi",
        blurb: "Markayı her temas noktasında tutarlı biçimde temsil etme.",
      },
      {
        slug: "rekabet-stratejileri-pazar-konumlanmasi",
        title: "Rekabet Stratejileri ve Pazar Konumlanması",
        blurb: "Doğru konumlanma ve sürdürülebilir rekabet avantajı.",
      },
      {
        slug: "surec-rol-netligi-raci",
        title: "Süreç ve Rol Netliği (RACI)",
        blurb: "RACI ile net roller, sorumluluklar ve akıcı süreçler.",
      },
      {
        slug: "surekli-egitim-sistemi-kurmak",
        title: "Sürekli Eğitim Sistemi Kurmak",
        blurb: "Kurum içinde kendi kendini besleyen eğitim sistemi.",
      },
    ],
  },
  {
    slug: "yapay-zeka-liderlik-egitimleri",
    name: "Yapay Zekâ ve Liderlik Eğitimleri",
    shortName: "Yapay Zekâ",
    icon: "cpu",
    tagline: "YZ çağında insanı merkeze alan dönüşüm programları",
    summary:
      "Teknolojiyi satın almak ile onu kurumsal bir güce dönüştürmek arasındaki fark liderlikte, kültürde ve insan kapasitesinde yatar. Bu programlar yöneticileri, mühendisleri ve saha ekiplerini yapay zekâyı anlayan ve yönlendiren bireylere dönüştürür.",
    forWhom: [
      "Dijital dönüşümü yöneten üst ve orta düzey yöneticiler",
      "YZ ile çalışmaya hazırlanan saha ve ofis çalışanları",
      "Mühendisler ve takım liderleri",
    ],
    trainings: [
      {
        slug: "dijital-ayna-kisisel-farkindalik",
        title: "Dijital Ayna: Kişisel Farkındalık",
        blurb: "Yapay zekâ çağında kişisel farkındalık ve dijital kimlik.",
      },
      {
        slug: "gelecegin-operatoru-yz-verimlilik",
        title: "Geleceğin Operatörü: YZ ve Verimlilik",
        blurb: "Saha çalışanı için yapay zekâ destekli verimlilik.",
      },
      {
        slug: "algoritmik-liderlik-karar-verme",
        title: "Algoritmik Liderlik ve Karar Verme",
        blurb: "Veriyle güçlenen, insanı merkeze alan karar verme.",
      },
      {
        slug: "vicdanin-kodu-yz-etik-anayasasi",
        title: "Vicdanın Kodu: YZ Etik Anayasası",
        blurb: "Kurumda yapay zekânın etik sınırlarını çizme.",
      },
      {
        slug: "hibrid-isbirligi-insan-makine",
        title: "Hibrid İşbirliği: İnsan-Makine",
        blurb: "İnsan ve makinenin birlikte daha güçlü çalışması.",
      },
      {
        slug: "sessiz-devrim-mavi-yakali-dijital",
        title: "Sessiz Devrim: Mavi Yakalı Dijitalleşme",
        blurb: "Üretim sahasında dijital dönüşümü yönetme.",
      },
      {
        slug: "duygusal-zeka-vs-yapay-zeka",
        title: "Duygusal Zekâ vs Yapay Zekâ",
        blurb: "Makinelerin yapamadığı insani liderlik becerileri.",
      },
      {
        slug: "yarin-cok-gec-degisim-yonetimi",
        title: "Yarın Çok Geç: Değişim Yönetimi",
        blurb: "YZ dönüşümünde direnci aşma ve değişimi yönetme.",
      },
      {
        slug: "veri-ile-hikaye-anlaticiligi",
        title: "Veri ile Hikâye Anlatıcılığı",
        blurb: "Veriyi etkileyici ve harekete geçiren hikâyelere çevirme.",
      },
    ],
  },
];

export function getCategory(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}

export function getTraining(
  categorySlug: string,
  trainingSlug: string
): { category: Category; training: Training } | undefined {
  const category = getCategory(categorySlug);
  if (!category) return undefined;
  const training = category.trainings.find((t) => t.slug === trainingSlug);
  if (!training) return undefined;
  return { category, training };
}

// Detay sayfası içeriklerini haritadan eğitimlere bağla (kategori+slug eşleşmesi)
for (const _cat of categories) {
  for (const _t of _cat.trainings) {
    const _p = trainingPages[`${_cat.slug}/${_t.slug}`];
    if (_p) _t.page = _p;
  }
}
