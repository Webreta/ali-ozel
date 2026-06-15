import type { TrainingPage } from "./content";

// Eğitim detay sayfası içerikleri. Anahtar: `${kategoriSlug}/${egitimSlug}`.
// Kaynak: hizmetler/ klasöründeki Word dosyaları.
export const trainingPages: Record<string, TrainingPage> = {
  "yonetim-egitimleri/lider-iliski-yonetimi-iletisim": {
    seoTitle:
      "Liderin İlişki Yönetimi ve İletişim Eğitimi | Kurumsal Liderlik Programı",
    seoDescription:
      "Yöneticiler için ilişki yönetimi ve iletişim eğitimi. Güven inşa eden liderlik iletişimi, aktif dinleme ve ekip içi iletişim becerilerini geliştirin.",
    heroQuote:
      "Bir liderin en güçlü aracı, söylediği değil; kurduğu bağlantıdır.",
    intro: [
      "Ekibinizle, yöneticilerinizle ve paydaşlarınızla kurduğunuz ilişkilerin kalitesi; motivasyonu, bağlılığı ve performansı doğrudan belirler.",
      "Bu eğitim, yöneticilerin iletişim tarzlarını bilinçli biçimde şekillendirmelerine ve güvene dayalı ilişki ağları oluşturmalarına yardımcı olmak amacıyla tasarlanmıştır.",
    ],
    audience:
      "Bu program; ekip yönetiminde iletişim zorluğu yaşayan, farklı kişilik tipleriyle çalışmak durumunda olan veya liderlik etkisini derinleştirmek isteyen orta ve üst düzey yöneticiler için tasarlanmıştır.",
    sections: [
      {
        title: "Liderlik İletişiminin Temelleri",
        intro:
          "Liderlik iletişimi sıradan iletişimden farklıdır. Yöneticiler; mesaj iletmenin ötesinde anlam yaratmayı, bağlam kurmayı ve güven ortamı oluşturmayı öğrenir.",
        bullets: [
          "Liderlik iletişimi ile yöneticilik iletişimi arasındaki fark",
          "Sözlü, sözsüz ve yazılı iletişimde liderlik izlenimi",
          "Kurumsal iletişimde güven ve şeffaflık ilkesi",
        ],
      },
      {
        title: "Aktif Dinleme ve Empati",
        intro:
          "Etkili liderler konuşmaktan çok dinlemesini bilir. Aktif dinleme; çalışan bağlılığını artıran, çatışmaları önleyen ve güven inşa eden bir liderlik becerisidir.",
        bullets: [
          "Aktif dinleme teknikleri ve engelleri",
          "Empatik iletişim: anlamak ile katılmak arasındaki fark",
          "Sözsüz iletişim ipuçlarını okuma ve yönetme",
        ],
      },
      {
        title: "İlişki Yönetimi ve Etki Alanı",
        intro:
          "Güçlü liderler yalnızca ekipleriyle değil; iç paydaşlar, üst yönetim ve dış çevreyle de sağlıklı ilişkiler sürdürür. Kurumsal ilişki haritası oluşturma ve etkiyi yönetme ele alınır.",
        bullets: [
          "Kurumsal ilişki haritası ve paydaş analizi",
          "Güven inşasının 3 temel bileşeni",
          "Zor konuşmaları yapıcı biçimde yönetme",
        ],
      },
      {
        title: "Ekip İçi ve Grupla İletişim",
        intro:
          "Bireysel iletişim becerileri grup dinamiklerinde farklı bir boyut kazanır. Toplantı yönetimi, geri bildirim kültürü ve açık iletişim ortamı oluşturma ele alınır.",
        bullets: [
          "Etkili toplantı yönetimi ve katılım sağlama",
          "Ekip içi açık iletişim kültürü nasıl oluşturulur",
          "Zor mesajları net ve yapıcı biçimde iletme",
        ],
      },
    ],
    outcomes: [
      "Liderlik etkisini iletişim üzerinden güçlendirir",
      "Ekip içinde güven ve açıklık kültürü oluşturur",
      "Farklı kişilik ve iletişim stilleriyle uyumlu çalışır",
      "Zor konuşmaları yönetir, çatışmayı önler",
      "Kurumsal paydaş ilişkilerini stratejik biçimde yönetir",
    ],
    format: [
      { label: "Süre", value: "2 gün (12 saat)" },
      { label: "Format", value: "Şirket içi veya açık grup" },
      {
        label: "Yöntem",
        value: "Rol yapma ve vaka çalışmaları",
      },
      { label: "Katılımcı", value: "8–20 kişi" },
    ],
    faq: [
      {
        q: "Bu eğitim teknik mi yoksa davranışsal mı?",
        a: "Tamamen davranışsal ve deneyimsel bir eğitimdir. İçerik psikoloji ve iletişim bilimine dayanmakla birlikte uygulamaya odaklıdır.",
      },
      {
        q: "Eğitim sektöre özel uyarlanabilir mi?",
        a: "Evet. İhtiyaç analizi görüşmesinin ardından kurumunuzun sektörüne, kültürüne ve gerçek vakalarına göre içerik özelleştirilir.",
      },
      {
        q: "Eğitim sonrası destek var mı?",
        a: "Evet. Uygulama rehberi ve isteğe bağlı online takip seansı tüm programlara dahildir.",
      },
    ],
  },
  "yonetim-egitimleri/takim-calismasi-aidiyet": {
    seoTitle:
      "Takım Çalışması ve Aidiyet Eğitimi | Ekip Motivasyonu ve Bağlılık",
    seoDescription:
      "Kurumsal aidiyet ve takım çalışması eğitimi. Yüksek performanslı ekipler inşa edin, çalışan bağlılığını artırın. Şirket içi eğitim teklifi alın.",
    heroQuote:
      "Yüksek performanslı ekipler tesadüfen değil; bilinçli liderlikle kurulur.",
    intro: [
      "Ortak bir amaç etrafında birleşen, birbirine güvenen ve kurumuna ait hisseden takımlar; bilinçli bir liderlik anlayışının ürünüdür.",
      "Bu eğitim; yöneticilere, ekiplerinde gerçek bir aidiyet kültürü oluşturmanın ve sürdürmenin pratik yollarını gösterir.",
    ],
    audience:
      "Ekip uyumunu ve motivasyonunu artırmak isteyen yöneticiler, yeni kurulan ya da yeniden yapılanan ekiplerin liderleri, çalışan bağlılığı düşük olan departmanların yöneticileri ve İK profesyonelleri için uygundur.",
    sections: [
      {
        title: "Yüksek Performanslı Ekibin Anatomisi",
        intro:
          "Araştırmalar, yüksek performanslı ekiplerin belirli ortak özellikleri paylaştığını göstermektedir. Bu bölümde Google'ın Project Aristotle bulguları ve Tuckman'ın ekip gelişim modeli ele alınır.",
        bullets: [
          "Yüksek performanslı ekibin 5 temel özelliği",
          "Psikolojik güvenlik ve performans ilişkisi",
          "Ekip olgunluk aşamaları: Oluşum, çatışma, uyum, performans",
        ],
      },
      {
        title: "Aidiyet Kültürü Oluşturma",
        intro:
          "Aidiyet; çalışanların kendilerini değerli, görünür ve dahil hissettikleri bir ortamın ürünüdür. Bu bölüm, yöneticilere aidiyet kültürünü inşa etmenin somut adımlarını sunar.",
        bullets: [
          "Aidiyet ile bağlılık arasındaki fark",
          "Çeşitlilik içinde dahil edici liderlik",
          "Takım içi tanınma ve değer görme ritüelleri",
        ],
      },
      {
        title: "Ortak Amaç ve Hedef Belirleme",
        intro:
          "Ekip üyeleri, bütünün parçası olduklarını hissettiklerinde daha yüksek performans gösterir. Bu bölümde ortak anlam yaratma ve hedefleri birlikte sahiplenme ele alınır.",
        bullets: [
          "Vizyon ve misyonu ekiple buluşturma",
          "OKR temelli ekip hedefleri oluşturma",
          "Bireysel katkıyı büyük resme bağlama",
        ],
      },
      {
        title: "Ekip Dinamikleri ve İş birliği",
        intro:
          "İş birliği, kendiliğinden gelişmez; yapılandırılmış bir ortam gerektirir. Bu bölümde güven inşası, şeffaflık ve etkili iş birliği mekanizmaları ele alınır.",
        bullets: [
          "Güven döngüsü: Nasıl kırılır, nasıl onarılır",
          "Ekip toplantılarında katılım ve eşit söz hakkı",
          "Uzaktan ve hibrit çalışmada aidiyet yönetimi",
        ],
      },
    ],
    outcomes: [
      "Ekipte psikolojik güvenlik ve aidiyet ortamı oluşturur",
      "Takım motivasyonunu sürdürülebilir kılan pratik araçlar kullanır",
      "Çeşitlilik içinde uyumu ve dahil ediciliği yönetir",
      "Ortak hedef etrafında ekip enerjisini yönlendirir",
      "Uzaktan ve hibrit çalışmada ekip bağlılığını korur",
    ],
    format: [
      { label: "Süre", value: "1-2 gün (6-12 saat)" },
      { label: "Format", value: "Şirket içi veya açık grup" },
      {
        label: "Yöntem",
        value:
          "Simülasyon ve grup çalışmaları",
      },
      { label: "Katılımcı", value: "8–20 kişi" },
    ],
    faq: [
      {
        q: "Bu eğitimi tüm ekiple birlikte mi alsak daha iyi olur?",
        a: "İdeal olan, yöneticilerin bu eğitimi önce kendilerinin alması, ardından ekiplerine yönelik uygulamalı atölye düzenlenmesidir. Her iki format da mevcuttur.",
      },
      {
        q: "Hibrit çalışan ekipler için uyarlanabilir mi?",
        a: "Evet. Eğitim içeriği, uzaktan ve yüz yüze çalışmanın karışık olduğu ekipler için özel senaryolar içerecek şekilde düzenlenebilir.",
      },
    ],
  },
  "yonetim-egitimleri/lider-yonetici-temel-kurallar": {
    seoTitle:
      "Lider Yönetici Olmanın Temel Kuralları Eğitimi | Yöneticilik ve Liderlik",
    seoDescription:
      "Yöneticilikten liderliğe geçiş eğitimi. Lider yönetici olmanın temel kuralları, liderlik kimliği ve otorite yönetimi. Kurumsal eğitim programı için teklif alın.",
    heroQuote:
      "Yönetici ile lider arasındaki fark; bir unvan değil, bir duruş meselesidir.",
    intro: [
      "Yöneticiler pozisyon gücüyle hareket ederken, liderler etki güçleriyle öne çıkar.",
      "Bu eğitim; yöneticilik rolünü liderlik perspektifiyle yeniden çerçeveler ve katılımcılara uygulanabilir, güçlü bir liderlik altyapısı sunar.",
    ],
    audience:
      "Yönetici pozisyonuna yeni atanan bireyler, liderlik tarzını sorgulayan ve geliştirmek isteyen deneyimli yöneticiler, üst yönetime hazırlanan yüksek potansiyelli çalışanlar ve İK tarafından liderlik geliştirme programına dahil edilen kişiler için tasarlanmıştır.",
    sections: [
      {
        title: "Yöneticilik ile Liderlik: Temel Farklar",
        intro:
          "Pozisyon, otorite verir; liderlik ise güven kazanır. Bu bölümde yöneticilik ve liderlik rolleri arasındaki kritik farklar somut örneklerle ele alınır.",
        bullets: [
          "Yönetici ve lider profili: Karşılaştırmalı analiz",
          "Pozisyon gücü ile etki gücü arasındaki fark",
          "Günlük yönetim pratiklerinde liderlik fırsatları",
        ],
      },
      {
        title: "Liderlik Kimliğini Tanımlama",
        intro:
          "Etkili liderler, kendi güçlü yönlerini bilerek hareket eder. Bu bölümde katılımcılar bireysel liderlik profillerini keşfeder ve özgün liderlik kimliklerini netleştirir.",
        bullets: [
          "Kişisel liderlik değerleri ve ilkeler",
          "Güçlü yönler temelli liderlik yaklaşımı",
          "Liderlik tarzı öz değerlendirmesi",
        ],
      },
      {
        title: "Otorite ve Etki Alanı Yönetimi",
        intro:
          "Otoritenin kaynağı ne ise, etkinin sınırı da odur. Bu bölümde yöneticiler, sahip oldukları etkiyi bilinçli ve etik biçimde nasıl kullanacaklarını öğrenir.",
        bullets: [
          "Otorite türleri: Yasal, uzman, karizmatik, ödül, zorlayıcı",
          "Etki alanını genişletmenin 3 yolu",
          "Güven kazanma ve koruma stratejileri",
        ],
      },
      {
        title: "Lider Yöneticinin Temel Sorumlulukları",
        intro:
          "Lider yöneticinin sorumluluğu, yalnızca sonuçları değil; insanları da geliştirmektir. Bu bölümde liderlik sorumluluklarının kapsamı ve önceliklendirme ele alınır.",
        bullets: [
          "Sonuç odaklılık ile insan odaklılık dengesi",
          "Psikolojik güvenlik ve hesap verebilirlik kültürü",
          "Lider yöneticinin 5 temel önceliği",
        ],
      },
      {
        title: "Yöneticilikten Liderliğe Geçiş Yol Haritası",
        intro:
          "Liderlik bir varış noktası değil, süregelen bir yolculuktur. Bu bölümde katılımcılar, eğitim sonrası uygulamaya dönük bireysel bir gelişim planı oluşturur.",
        bullets: [
          "Liderlik gelişim planı: 30-60-90 gün çerçevesi",
          "Geri bildirim almayı alışkanlık haline getirme",
          "Liderlik yolculuğunda mentorluktan yararlanma",
        ],
      },
    ],
    outcomes: [
      "Liderlik ile yöneticilik rolleri arasındaki farkı kavrar ve uygulamaya taşır",
      "Bireysel liderlik kimliğini ve değerlerini netleştirir",
      "Otorite ve etki alanını stratejik biçimde kullanır",
      "Ekibinde güven ve hesap verebilirlik kültürü oluşturur",
      "Kişisel liderlik gelişim planıyla eğitimden çıkar",
    ],
    format: [
      { label: "Süre", value: "1–2 gün (esnek)" },
      { label: "Format", value: "Şirket içi veya açık grup" },
      {
        label: "Yöntem",
        value:
          "Öz değerlendirme ve rol yapma",
      },
      { label: "Katılımcı", value: "8–20 kişi" },
    ],
    faq: [
      {
        q: "Deneyimli yöneticiler için de uygun mu?",
        a: "Evet. Eğitim; hem yeni atanan yöneticiler için temel bir çerçeve sunar, hem de deneyimli yöneticilerin liderlik anlayışlarını taze bir perspektifle gözden geçirmelerini sağlar.",
      },
      {
        q: "Eğitimde kullanılan araçlar nelerdir?",
        a: "Liderlik tarzı envanteri, kişisel değerler kartları ve 30-60-90 gün gelişim planı şablonu eğitimde kullanılan başlıca araçlardır.",
      },
    ],
  },
  "yonetim-egitimleri/liderlik-stratejisi-clinton-sidle": {
    seoTitle:
      "Clinton Sidle Liderlik Modeli Eğitimi | Liderlik Stratejisi Programı",
    seoDescription:
      "Clinton Sidle liderlik modeline dayalı kurumsal eğitim. Liderlik yönelimini keşfedin, kişisel profilinizi netleştirin ve stratejik liderlik anlayışı geliştirin. Teklif alın.",
    heroQuote:
      "Liderlik, tek bir doğru tarz değil; duruma göre hareket etme becerisidir.",
    intro: [
      "Clinton Sidle'ın dünyaca tanınan liderlik modeli, bu bilinçli liderliğin temelini oluşturur.",
      "Bu eğitimde katılımcılar, kendi liderlik profillerini keşfeder; güçlü yanlarını stratejik avantaja, gelişime açık alanlarını ise fırsata dönüştürür.",
    ],
    audience:
      "Kendi liderlik yönelimini keşfetmek ve stratejik avantaja dönüştürmek isteyen orta ve üst düzey yöneticiler, farklı liderlik profillerinden oluşan ekipleri yöneten liderler ve liderlik tarzı esnekliği kazanmak isteyen yöneticiler için tasarlanmıştır.",
    sections: [
      {
        title: "Dört Liderlik Yönelimi",
        intro:
          "Cornell Üniversitesi'nden Clinton Sidle, liderliği dört temel yönelim üzerinden inceler. Her yönelim; güçlü yönleri, körleşme noktaları ve durumlara göre ne zaman öne çıktığıyla birlikte ele alınır.",
        bullets: [
          "Anlam odaklı liderlik: Vizyon, değerler ve ilham verme",
          "İlişki odaklı liderlik: Empati, bağlantı ve güven",
          "Güç odaklı liderlik: Yönlendirme, kararlılık ve etki",
          "Süreç odaklı liderlik: Planlama, sistem ve güvenilirlik",
        ],
      },
      {
        title: "Kişisel Liderlik Profili Keşfi",
        intro:
          "Katılımcılar; yapılandırılmış bir öz değerlendirme aracıyla kendi liderlik profillerini belirler. Bu profil; baskın yönelimleri, ikincil güçleri ve körleşme noktalarını ortaya koyar.",
        bullets: [
          "Clinton Sidle liderlik profil envanteri uygulaması",
          "Profil yorumlama ve kişisel anlam çıkarma",
          "Güçlü yönler ile gelişim alanlarının belirlenmesi",
        ],
      },
      {
        title: "Liderlik Profilini Stratejik Avantaja Dönüştürme",
        intro:
          "Profil bilmek yetmez; onu uygulamaya taşımak asıl beceridir. Bu bölümde katılımcılar, profillerini günlük yönetim kararlarında, ekip yönetiminde ve kurumsal ilişkilerde nasıl kullanacaklarını öğrenir.",
        bullets: [
          "Profil temelli liderlik davranışları geliştirme",
          "Takım tamamlayıcılığı: Farklı profillerin birbirini güçlendirmesi",
          "Baskı altında liderlik profili nasıl değişir?",
        ],
      },
      {
        title: "Karma Ekiplerde Profil Çeşitliliğini Yönetme",
        intro:
          "Bir ekipte farklı liderlik yönelimlerine sahip bireyler bir arada çalışır. Bu bölümde yöneticiler, profil çeşitliliğini çatışma kaynağı değil; ekip gücü olarak nasıl kullanacaklarını keşfeder.",
        bullets: [
          "Ekip profil haritası oluşturma",
          "Profil farklılıklarını köprüleme stratejileri",
          "Liderlik tarzı esnekliği nasıl kazanılır",
        ],
      },
    ],
    outcomes: [
      "Kendi liderlik yönelimini ve profilini net biçimde tanır",
      "Güçlü yönlerini stratejik avantaja dönüştürür",
      "Körleşme noktalarını farkındalıkla yönetir",
      "Farklı liderlik profillerine sahip bireylerle etkili çalışır",
      "Durumlara göre liderlik tarzı esnekliği geliştirir",
    ],
    format: [
      { label: "Süre", value: "1-2 gün (6-12 saat)" },
      { label: "Format", value: "Şirket içi veya açık grup" },
      {
        label: "Yöntem",
        value:
          "Profil envanteri ve vaka analizi",
      },
      { label: "Katılımcı", value: "8–14 kişi" },
    ],
    faq: [
      {
        q: "Clinton Sidle modeli başka modellerden ne farkı var?",
        a: "MBTI veya DISC gibi kişilik modellerinden farklı olarak Sidle modeli, doğrudan liderlik davranışlarına ve yönetim durumlarına odaklanır. Sonuçlar daha uygulanabilir ve liderlik gelişimine daha doğrudan katkı sağlar.",
      },
      {
        q: "Profil zamanla değişir mi?",
        a: "Temel yönelimler oldukça kararlıdır, ancak bilinçli gelişimle esneklik kazanılabilir. Eğitimde bu esnekliği nasıl geliştireceğiniz de ele alınır.",
      },
    ],
  },
  "yonetim-egitimleri/karar-verme-kararlilik": {
    seoTitle:
      "Karar Verme ve Kararlılık Eğitimi | Yöneticiler İçin Karar Alma Programı",
    seoDescription:
      "Yöneticiler için karar verme ve kararlılık eğitimi. Belirsizlik altında doğru karar alma, bilişsel önyargıları yönetme ve stratejik kararlılık. Kurumsal eğitim teklifi alın.",
    heroQuote:
      "Belirsizlik altında doğru karar vermek, liderliğin en zorlu sınavıdır.",
    intro: [
      "Yanlış kararlar kurumu geri götürür; kararsızlık ise fırsat kaybettirir.",
      "Bu eğitim; yöneticilere, karar alma süreçlerini yapılandıran, bilişsel tuzaklardan koruyan ve baskı altında bile kararlı kalmayı mümkün kılan pratik araçlar sunar.",
    ],
    audience:
      "Stratejik kararlar almak zorunda olan üst yönetim, zaman baskısı altında hızlı karar vermesi gereken orta düzey yöneticiler, proje ve kriz yönetimi sorumluluğu taşıyan liderler ile karar kalitesini sistematik biçimde artırmak isteyen tüm yöneticiler için tasarlanmıştır.",
    sections: [
      {
        title: "Karar Verme Psikolojisi",
        intro:
          "Her karar, bilinçli ve bilinçdışı süreçlerin bir ürünüdür. Bu bölümde yöneticiler, zihinsel kısayolları ve bilişsel önyargıları tanıyarak daha sağlıklı kararlar almayı öğrenir.",
        bullets: [
          "Sistem 1 ve Sistem 2 düşünce: Sezgi ve analiz dengesi",
          "En yaygın bilişsel önyargılar: Onay yanlılığı, çıpalama, kayıptan kaçınma",
          "Grup kararlarındaki tuzaklar: beyin fırtınası ve polarizasyon",
        ],
      },
      {
        title: "Karar Verme Modelleri ve Araçları",
        intro:
          "İyi kararlar; yapılandırılmış bir sürecin ürünüdür. Bu bölümde farklı karar türleri için uygun modeller ve pratik araçlar ele alınır.",
        bullets: [
          "OODA döngüsü: Gözlemle, yönlen, karar ver, uygula",
          "Karar matrisi ve ağırlıklı seçim araçları",
          "Senaryo planlama: En kötü, en iyi, en olası",
          "Pre-mortem tekniği: Kararı geleceğe taşıyıp geri bakmak",
        ],
      },
      {
        title: "Belirsizlik Altında Karar Verme",
        intro:
          "Liderlik kararlarının büyük çoğunluğu, tam bilgiyle değil; yeterli bilgiyle alınmak zorundadır. Bu bölümde belirsizliği yönetme ve risk toleransını geliştirme ele alınır.",
        bullets: [
          "Yeterli bilgi eşiği: Ne zaman yeterli veri var?",
          "Risk değerlendirme çerçeveleri",
          "Geri alınamaz kararlar için güvenli zemin oluşturma",
        ],
      },
      {
        title: "Kararlılık: Kararın Ardındaki Yürütme",
        intro:
          "Karar vermek başlangıçtır; kararlılık ise o kararı hayata geçirme ısrarıdır. Bu bölümde kararlılık kültürü, uygulama takibi ve direktif iletişimi ele alınır.",
        bullets: [
          "Kararı ekibe açıklama ve sahiplenme yaratma",
          "Direnç yönetimi: Karşı görüşleri yapıcı biçimde ele alma",
          "Uygulama takibi ve hesap verebilirlik döngüsü",
        ],
      },
    ],
    outcomes: [
      "Karar alma süreçlerini yapılandırır ve hızlandırır",
      "Bilişsel önyargıları tanır ve etkisini azaltır",
      "Belirsizlik ortamında güvenle karar verir",
      "Grup kararlarını daha sağlıklı biçimde yönetir",
      "Kararların uygulanmasında kararlılık ve tutarlılık gösterir",
    ],
    format: [
      { label: "Süre", value: "2 gün (12 saat)" },
      { label: "Format", value: "Şirket içi veya açık grup" },
      {
        label: "Yöntem",
        value:
          "Karar egzersizleri ve simülasyon",
      },
      { label: "Katılımcı", value: "8–20 kişi" },
    ],
    faq: [
      {
        q: "Bu eğitim analitik araçlar mı öğretiyor yoksa davranışsal mı?",
        a: "Her ikisini de kapsar. Hem pratik karar araçları hem de karar psikolojisi ele alınır; böylece katılımcılar hem araçları hem de bilinçli farkındalığı kazanır.",
      },
      {
        q: "Kriz yönetimi senaryoları var mı?",
        a: "Evet. Eğitimin bir bölümü, baskı altında hızlı karar gerektiren simülasyon senaryolarına ayrılmıştır.",
      },
    ],
  },
  "yonetim-egitimleri/zor-insanlari-yonetme": {
    seoTitle: "Zor İnsanları Yönetme Eğitimi | Güç Kişiliklerle Başa Çıkma",
    seoDescription:
      "Zor karakterleri yönetme ve zorlayıcı kişiliklerle başa çıkma eğitimi. Ekip dinamiklerini koruyun, sınır koyun ve üretken ilişkiler kurun. Kurumsal eğitim teklifi alın.",
    heroQuote:
      "Tek bir zorlu kişi ekibi yorar; mesele bireyi değil, davranışı yönetmektir.",
    intro: [
      "Her ekipte zorlayıcı kişilikler vardır: her şeyi bilen, sürekli muhalif olan, pasif agresif davranan ya da performansından bağımsız biçimde ekip enerjisini tüketen bireyler.",
      "Bu eğitim; yöneticilere, bu kişilikleri tanıma, onlarla üretken ilişkiler kurma ve ekip dinamiklerini sağlıklı biçimde koruma becerisi kazandırır.",
    ],
    audience:
      "Ekibinde zorlayıcı bir çalışanla başa çıkmakta güçlük çeken yöneticiler, insan ilişkilerinde daha sağlıklı sınırlar koymak isteyenler ve zorlu kişiliklerden kaynaklanan çatışmaları yönetmek zorunda kalan liderler için uygundur.",
    sections: [
      {
        title: "Zorlayıcı Kişilik Tiplerini Tanıma",
        intro:
          "Zor davranışların arkasında genellikle belirli örüntüler yatar. Bu bölümde en yaygın zorlayıcı kişilik tipleri ve bu tiplerin tetikleyicileri ele alınır.",
        bullets: [
          "Her şeyi bilen: Uzmanlık ile tahakküm arasındaki ince çizgi",
          "Pasif agresif davranış: Görünmez direnç nasıl okunur",
          "Sürekli muhalif: Eleştiri ile sabotaj arasındaki fark",
          "Kurban rolü ve sorumluluktan kaçınma",
          "Yıldız performans yanılgısı: Sonuç getiren ama ekibi yıpratanlar",
        ],
      },
      {
        title: "Yapıcı Müdahale Stratejileri",
        intro:
          "Zor davranışla başa çıkmanın en etkili yolu; tepkisel değil, stratejik yaklaşmaktır. Bu bölümde bireysel müdahale teknikleri ve adım adım görüşme rehberi sunulur.",
        bullets: [
          "Davranışa odaklanma: Kişiyi değil, davranışı ele alma",
          "SBI modeli: Durum, Davranış, Etki",
          "Sınır koyma konuşmaları nasıl yapılır",
          "Savunmacı tepkileri yönetme teknikleri",
        ],
      },
      {
        title: "Sınır Koyma ve Hesap Verebilirlik",
        intro:
          "Etkili yöneticiler, zorlayıcı kişilikler karşısında sınırlarını net biçimde belirler ve bu sınırları tutarlı biçimde korur.",
        bullets: [
          "Sınır ile ceza arasındaki fark",
          "Beklentiyi netleştirme ve sonuçları tanımlama",
          "Düzeltici eylem süreci: Uyarı, plan, takip",
        ],
      },
      {
        title: "Ekip Dinamiklerini ve Enerjiyi Koruma",
        intro:
          "Tek bir zorlayıcı birey, tüm ekip enerjisini tüketebilir. Bu bölümde yöneticiler, bireysel sorunu çözerken ekip dengesini nasıl koruyacaklarını öğrenir.",
        bullets: [
          "Gruba verilen zararı sınırlama stratejileri",
          "Gözlemci ekip üyelerini koruma ve destekleme",
          "Ekipte adalet ve eşit muamele algısını yönetme",
        ],
      },
    ],
    outcomes: [
      "Zorlayıcı kişilik tiplerini erkenden tanır",
      "Yapıcı ve stratejik müdahale becerisini geliştirir",
      "Net sınırlar koyar ve tutarlı biçimde korur",
      "Zor konuşmaları güvenle ve etkili biçimde yürütür",
      "Ekip enerjisini ve dengesini korur",
    ],
    format: [
      { label: "Süre", value: "2 gün (12 saat)" },
      { label: "Format", value: "Şirket içi veya açık grup" },
      {
        label: "Yöntem",
        value:
          "Rol yapma ve vaka senaryoları",
      },
      { label: "Katılımcı", value: "8–18 kişi" },
    ],
    faq: [
      {
        q: "Bu eğitim yalnızca sorunlu çalışanlar için mi?",
        a: "Hayır. Eğitim, her yöneticinin karşılaşabileceği zorlayıcı davranış örüntülerine odaklanır. Mevcut bir sorun olmasa bile erken farkındalık ve hazırlık açısından değerlidir.",
      },
      {
        q: "İnsan kaynakları süreçleriyle nasıl entegre olur?",
        a: "Eğitimde ele alınan düzeltici eylem süreci, kurumunuzun İK politikalarıyla uyumlu biçimde uyarlanabilir.",
      },
    ],
  },
  "yonetim-egitimleri/ikna-gucu-psikolojisi": {
    seoTitle:
      "İkna Eğitimi ve İknanın Psikolojisi | Liderler İçin Etki Gücü Programı",
    seoDescription:
      "Liderler için ikna eğitimi ve ikna psikolojisi programı. Cialdini ilkeleri, paydaş ikna teknikleri ve müzakere becerileri. Kurumsal eğitim teklifi alın.",
    heroQuote:
      "Gerçek ikna baskı değildir; ortak bir zemin inşa etmektir.",
    intro: [
      "En etkili liderler, emirle değil; anlam yaratarak, güven kazanarak ve doğru çerçeve kurarak insanları harekete geçirir.",
      "Bu eğitim; yöneticilere, psikoloji bilimiyle desteklenmiş ikna tekniklerini ve kurumsal etki alanını genişletmenin stratejik yollarını sunar.",
    ],
    audience:
      "Üst yönetime fikir ve proje onaylatmak zorunda olan yöneticiler, müşteri ve tedarikçilerle müzakere yürüten profesyoneller, ekibini değişime ikna etmesi gereken liderler ve satış liderliği rolündeki yöneticiler için tasarlanmıştır.",
    sections: [
      {
        title: "İknanın Psikolojik Temelleri",
        intro:
          "İnsan beyni, mantıkla değil; duygu ve hikayeyle ikna olur. Bu bölümde ikna psikolojisinin bilimsel temelleri ve gündelik liderlik pratiğine yansımaları ele alınır.",
        bullets: [
          "Dual-process theory: Duygusal ve rasyonel ikna yolları",
          "Sosyal kanıt, otorite ve kıtlık ilkelerinin iş hayatındaki yansımaları",
          "Güven ve inanılırlık: İknanın altyapısı",
        ],
      },
      {
        title: "Cialdini'nin 7 İkna İlkesi",
        intro:
          "Robert Cialdini'nin evrensel ikna ilkeleri; kurumsal müzakereden ekip ikna süreçlerine kadar geniş bir uygulama alanına sahiptir. Her ilke, iş hayatından somut örneklerle ele alınır.",
        bullets: [
          "Mütekabiliyet: Önce ver, sonra al",
          "Bağlılık ve tutarlılık: Küçük adımdan büyük Evet'e",
          "Sosyal kanıt: Herkes yapıyorsa doğrudur algısı",
          "Otorite: Uzmanlık ve güvenilirliği sergileme",
          "Sevme: Beğenilen insanlar daha kolay ikna eder",
          "Kıtlık: Azlık değer yaratır",
          "Birlik: Aidiyet ve ortak kimlik üzerinden ikna",
        ],
      },
      {
        title: "Kurumsal Paydaş İkna Teknikleri",
        intro:
          "Kurumsal ortamda ikna; farklı çıkarları, farklı güç dengelerini ve farklı iletişim stillerini yönetmeyi gerektirir. Bu bölümde üst yönetim, eşdüzey yöneticiler ve ekip üyeleriyle ikna süreçleri ayrı ayrı ele alınır.",
        bullets: [
          "Üst yönetime fikir ve proje sunma: Mantık + duygu dengesi",
          "Dirençli paydaşları kazanma stratejileri",
          "Çerçeveleme etkisi: Aynı fikri farklı anlatmak",
        ],
      },
      {
        title: "Müzakere ve Uzlaşma Becerileri",
        intro:
          "İkna ve müzakere, ayrılmaz ikizlerdir. Bu bölümde kazan-kazan odaklı müzakere yaklaşımları ve uzlaşma stratejileri ele alınır.",
        bullets: [
          "BATNA: En iyi alternatif anlaşmanın önemi",
          "İlgi bazlı müzakere: Pozisyonun arkasındaki ihtiyacı bulmak",
          "Zor müzakere ortamlarında soğukkanlılığı koruma",
        ],
      },
    ],
    outcomes: [
      "İkna psikolojisini anlayarak bilinçli uygular",
      "Farklı paydaşlara yönelik ikna stratejisi geliştirir",
      "Kurumsal müzakerelerde daha etkili sonuçlar alır",
      "Ekibini değişime ve yeniliğe ikna eder",
      "Etik ikna ile manipülasyon arasındaki sınırı korur",
    ],
    format: [
      { label: "Süre", value: "2 gün (12 saat)" },
      { label: "Format", value: "Şirket içi veya açık grup" },
      {
        label: "Yöntem",
        value:
          "İkna egzersizleri ve simülasyon",
      },
      { label: "Katılımcı", value: "8–16 kişi" },
    ],
    faq: [
      {
        q: "Bu eğitim etik sınırları ele alıyor mu?",
        a: "Evet. Etik ikna ile manipülasyon arasındaki fark, eğitimin temel eksenlerinden birini oluşturur. Uzun vadeli güven inşası ön planda tutulur.",
      },
      {
        q: "Satış ekipleri için de uygun mu?",
        a: "Kesinlikle. İçerik hem yöneticilere hem de müşteri ilişkileri yürüten profesyonellere uyarlanabilir.",
      },
    ],
  },
  "yonetim-egitimleri/catisma-yonetimi-problem-cozme": {
    seoTitle:
      "Çatışma Yönetimi ve Problem Çözme Eğitimi | Kurumsal Çatışma Çözümü",
    seoDescription:
      "Kurumsal çatışma yönetimi ve problem çözme eğitimi. Ekip içi çatışmaları yapıcı biçimde yönetin, arabuluculuk becerisi kazanın. Şirket içi eğitim teklifi alın.",
    heroQuote:
      "Sorun, çatışmanın varlığı değil; yönetilmemiş olmasıdır.",
    intro: [
      "Çatışma, kaçınılması gereken bir tehlike değil; doğru yönetildiğinde ekipleri güçlendiren ve yeniliği besleyen bir dinamiktir.",
      "Bu eğitim; yöneticilere, ekip içi ve kurumlar arası çatışmaları erkenden tanıma, yapıcı biçimde müdahale etme ve sistematik problem çözme araçlarını kullanma becerisi kazandırır.",
    ],
    audience:
      "Ekipte veya departmanlar arasında çatışma yaşayan yöneticiler, arabuluculuk rolü üstlenmek zorunda kalan liderler, çatışma yönetimini kurum kültürüne taşımak isteyen İK profesyonelleri ve problem çözme süreçlerini sistematik hale getirmek isteyen tüm yöneticiler için uygundur.",
    sections: [
      {
        title: "Çatışmanın Anatomisi",
        intro:
          "Her çatışmanın altında bir ihtiyaç, bir beklenti ya da bir değer farkı yatar. Bu bölümde çatışma türleri, kaynakları ve tırmanma dinamikleri ele alınır.",
        bullets: [
          "Görev çatışması, ilişki çatışması ve süreç çatışması",
          "Çatışma tırmanma modeli: Erken uyarı işaretleri",
          "Sessiz çatışma: Gizli gerginlik nasıl okunur",
        ],
      },
      {
        title: "Çatışma Yönetim Stilleri",
        intro:
          "Thomas-Kilmann modeline göre beş farklı çatışma yönetim stili vardır ve her birinin uygun olduğu farklı durumlar mevcuttur. Yöneticiler, kendi baskın stillerini keşfeder ve esneklik kazanır.",
        bullets: [
          "Rekabet, uyum, kaçınma, uzlaşma ve iş birliği stilleri",
          "Hangi stili ne zaman kullanmalı?",
          "Baskı altında stil değişimi ve farkındalık",
        ],
      },
      {
        title: "Yapıcı Müdahale ve Arabuluculuk",
        intro:
          "Yöneticinin rolü, çatışmayı bastırmak değil; tarafları dinleyerek ortak zemini keşfetmelerine yardımcı olmaktır. Bu bölümde adım adım arabuluculuk süreci ele alınır.",
        bullets: [
          "Tarafsız zemin hazırlama: Görüşme ortamı ve kuralları",
          "İlgi bazlı yaklaşım: Pozisyonun arkasındaki ihtiyacı bulmak",
          "Anlaşma belgesi oluşturma ve takip",
        ],
      },
      {
        title: "Problem Çözme Döngüsü",
        intro:
          "Çatışma çözüldükten sonra asıl sorunun sistematik biçimde ele alınması gerekir. Bu bölümde yapılandırılmış problem çözme araçları ve kök neden analizi sunulur.",
        bullets: [
          "5 Neden analizi ve kök neden tespiti",
          "Balık kılçığı diyagramı (Ishikawa) ile sorun haritası",
          "Çözüm önceliklendirme: Etki-çaba matrisi",
          "Uygulama planı ve başarı kriterleri",
        ],
      },
    ],
    outcomes: [
      "Çatışmayı erkenden tanır ve tırmanmadan önce müdahale eder",
      "Kendi çatışma stilini bilir ve duruma göre esneklik kazanır",
      "Yapıcı arabuluculuk sürecini başarıyla yürütür",
      "Ekip içi çatışmaları fırsata dönüştürür",
      "Problemi kök nedeninden çözen sistematik araçlar kullanır",
    ],
    format: [
      { label: "Süre", value: "1–2 gün (esnek)" },
      { label: "Format", value: "Şirket içi veya açık grup" },
      {
        label: "Yöntem",
        value:
          "Çatışma simülasyonları ve atölye",
      },
      { label: "Katılımcı", value: "8–20 kişi" },
    ],
    faq: [
      {
        q: "Bu eğitim hukuki bir süreç olan arabuluculuk mu?",
        a: "Hayır. Eğitimdeki arabuluculuk, yöneticilerin ekip içi çatışmalarda uygulayabileceği yapıcı müdahale becerilerini kapsar; hukuki arabuluculuk eğitimi değildir.",
      },
      {
        q: "Gerçek bir çatışma durumuyla eğitime gelebilir miyiz?",
        a: "Evet, şirket içi eğitimlerde gerçek vakalar anonim biçimde simülasyona taşınabilir. Bu yaklaşım eğitimi çok daha uygulamalı kılar.",
      },
    ],
  },
  "yonetim-egitimleri/performans-yonetimi-geribildirim": {
    seoTitle:
      "Performans Yönetimi ve Geribildirim Eğitimi | Yöneticiler İçin Geri Bildirim",
    seoDescription:
      "Yöneticiler için performans yönetimi ve etkili geribildirim eğitimi. OKR, performans görüşmesi teknikleri ve sürekli geribildirim kültürü. Kurumsal eğitim teklifi alın.",
    heroQuote:
      "Performans kültürü; sürekli geri bildirim ve net beklentilerle şekillenir.",
    intro: [
      "Performans yönetimi; yılda bir doldurulan değerlendirme formlarından çok daha fazlasıdır.",
      "Bu eğitim; yöneticilere, bireyin ve ekibin potansiyelini ortaya çıkaran, motivasyonu artıran ve kurumsal sonuçlara katkıda bulunan bir performans yönetimi anlayışı kazandırır.",
    ],
    audience:
      "Ekip performansını sistematik biçimde yönetmek isteyen orta ve üst düzey yöneticiler, geribildirim kültürü oluşturmaya çalışan liderler, performans görüşmelerini daha etkili yürütmek isteyen yöneticiler ve İK süreçlerini güçlendirmek isteyen profesyoneller için tasarlanmıştır.",
    sections: [
      {
        title: "Sürekli Performans Kültürü Oluşturma",
        intro:
          "Performans yönetimi, anlık bir değerlendirmeden çok; süregelen bir diyalog ve gelişim sürecidir. Bu bölümde sürekli performans kültürünün temelleri ve yöneticinin rolü ele alınır.",
        bullets: [
          "Performans yönetiminde geleneksel yaklaşımın sınırları",
          "Sürekli geribildirim döngüsü: Check-in kültürü",
          "Psikolojik güvenlik ve performans ilişkisi",
        ],
      },
      {
        title: "Hedef Belirleme: OKR ve SMART",
        intro:
          "Net ve ilham verici hedefler, performansın motorudur. Bu bölümde OKR (Hedefler ve Anahtar Sonuçlar) çerçevesi ve SMART hedef belirleme yaklaşımı uygulamalı biçimde ele alınır.",
        bullets: [
          "OKR nedir ve nasıl uygulanır?",
          "Bireysel hedefleri kurumsal hedeflerle hizalama",
          "Gerçekçi ama zorlayıcı hedef belirleme dengesi",
        ],
      },
      {
        title: "Etkili Geribildirim Modelleri",
        intro:
          "Geribildirim, savunmacılığa yol açmadan gelişimi tetiklediğinde değerlidir. Bu bölümde yapıcı geribildirim modelleri ve zor geri bildirim konuşmaları ele alınır.",
        bullets: [
          "SBI modeli: Durum, Davranış, Etki",
          "Feedforward: Geçmişe değil, geleceğe odaklanmak",
          "Olumlu geribildirim: Takdirin gücü ve zamanlaması",
          "Zor geribildirim konuşmalarını hazırlama ve yürütme",
        ],
      },
      {
        title: "Performans Görüşmesi Teknikleri",
        intro:
          "Performans görüşmesi; çalışanın yıllık değerlendirildiği tek yönlü bir süreç değil; gelişimi birlikte planladığınız stratejik bir diyalogdur. Bu bölümde etkili görüşme yapısı ve sık yapılan hatalar ele alınır.",
        bullets: [
          "Görüşme öncesi hazırlık ve çerçeveleme",
          "Açık uçlu sorularla diyaloğu yönetme",
          "Düşük performansı doğrudan ve saygılı biçimde ele alma",
          "Gelişim planı oluşturma ve taahhüt alma",
        ],
      },
    ],
    outcomes: [
      "Sürekli geribildirim döngüsü oluşturur ve sürdürür",
      "OKR ve SMART ile net, ölçülebilir hedefler belirler",
      "Yapıcı ve motive edici geribildirim verir",
      "Performans görüşmelerini etkili biçimde yürütür",
      "Düşük performansı adil ve doğrudan ele alır",
    ],
    format: [
      { label: "Süre", value: "2 gün (12 saat)" },
      { label: "Format", value: "Şirket içi veya açık grup" },
      {
        label: "Yöntem",
        value:
          "Geribildirim ve OKR atölyesi",
      },
      { label: "Katılımcı", value: "8–20 kişi" },
    ],
    faq: [
      {
        q: "OKR sistemini uygulamak isteyen kurumlar için uygun mu?",
        a: "Evet. Eğitim; OKR'yi sıfırdan uygulamaya başlamak isteyen kurumlar için temel bir hazırlık programı olarak da kullanılabilir.",
      },
      {
        q: "360 derece geribildirim sistemleriyle entegre edilebilir mi?",
        a: "Evet. Eğitim içeriği, kurumunuzda kullandığınız performans yönetim sistemiyle uyumlu biçimde uyarlanabilir.",
      },
    ],
  },
  "yonetim-egitimleri/planlama-organizasyon-zaman-yonetimi": {
    seoTitle:
      "Planlama ve Zaman Yönetimi Eğitimi | Yöneticiler İçin Verimlilik Programı",
    seoDescription:
      "Yöneticiler için planlama, organize olma ve zaman yönetimi eğitimi. Önceliklendirme, delege etme ve verimlilik araçları. Kurumsal eğitim teklifi alın.",
    heroQuote:
      "Bir yöneticinin zamanı yönetişi; ekibinin enerjisini ve odağını belirler.",
    intro: [
      "Yöneticiler için zaman, en kıt ve en kritik kaynaktır.",
      "Bu eğitim; yöneticilere, operasyonel yoğunluk içinde stratejik önceliklere odaklanmayı, iş yükünü etkili biçimde organize etmeyi ve zamanı gerçek değer yaratan işlere ayırmayı öğretir.",
    ],
    audience:
      "Yoğun iş temposunda stratejik öncelikleri kaybeden yöneticiler, toplantı ve operasyonel görevler arasında boğulan liderler, delege etmekte güçlük çeken yöneticiler ve ekiplerinin verimliliğini artırmak isteyen liderler için tasarlanmıştır.",
    sections: [
      {
        title: "Stratejik Önceliklendirme",
        intro:
          "Her şey önemliyse, hiçbir şey önemli değildir. Bu bölümde yöneticiler, acil ile önemli arasındaki farkı kavrar ve zamanlarını gerçek önceliklerine göre yapılandırmayı öğrenir.",
        bullets: [
          "Eisenhower matrisi: Önemli ve acil dörtlüsü",
          "Yöneticinin zaman tuzakları: Sahte aciller ve kaçırılan önemliler",
          "Haftalık öncelik belirleme ritüeli",
        ],
      },
      {
        title: "Planlama ve Hedef Yönetimi",
        intro:
          "Etkili planlama; yapılacaklar listesi tutmaktan çok, doğru şeylere odaklanmayı sağlayan bir sistem kurmaktır. Bu bölümde yönetici düzeyinde planlama araçları ve zaman blokları ele alınır.",
        bullets: [
          "Haftalık ve aylık planlama yapısı kurma",
          "Derin iş (deep work) blokları ve odak zamanı koruma",
          "Planlama ile gerçeklik arasındaki boşluğu kapatma",
        ],
      },
      {
        title: "Organize Olma: Sistem ve Yapı",
        intro:
          "Organize bir yönetici, ekibini de organize eder. Bu bölümde bilgi yönetimi, görev takibi ve iş akışı yapılandırması ele alınır.",
        bullets: [
          "GTD (Getting Things Done) metodunun yönetici versiyonu",
          "E-posta ve toplantı yönetimi: Zaman hırsızları ile başa çıkma",
          "Dijital araçlarla iş akışını yapılandırma",
        ],
      },
      {
        title: "Delege Etme: Zamanı Çoğaltmanın Yolu",
        intro:
          "Delege etmemek; hem zamanı hem de ekip gelişimini tüketir. Bu bölümde neyi, kime, nasıl delege edeceğiniz ve takibini nasıl yürüteceğiniz ele alınır.",
        bullets: [
          "Delege etme kararı: Hangi görevler delege edilmeli?",
          "Kişiye uygun delege etme: Yetenek ve isteklilik matrisi",
          "Kontrolü bırakmadan takip: Hesap verebilirlik döngüsü",
        ],
      },
      {
        title: "Enerji Yönetimi ve Sürdürülebilirlik",
        intro:
          "Zaman yönetimi tek başına yeterli değildir; enerjinin de yönetilmesi gerekir. Bu bölümde yöneticinin zihinsel performansını koruyan alışkanlıklar ve tükenmişliği önleme stratejileri ele alınır.",
        bullets: [
          "Enerji döngüleri: En verimli saatinizi tanıma",
          "Yönetici tükenmişliğinin erken belirtileri",
          "Yüksek performanslı yönetici alışkanlıkları",
        ],
      },
    ],
    outcomes: [
      "Stratejik önceliklere odaklanır ve sahte acillerden korunur",
      "Haftalık ve aylık planlama sistemi kurar",
      "İş yükünü etkili biçimde organize eder ve yapılandırır",
      "Delege etmeyi alışkanlık haline getirir",
      "Zihinsel enerjiyi ve sürdürülebilir performansı yönetir",
    ],
    format: [
      { label: "Süre", value: "2 gün (12 saat)" },
      { label: "Format", value: "Şirket içi veya açık grup" },
      {
        label: "Yöntem",
        value:
          "Zaman analizi ve planlama",
      },
      { label: "Katılımcı", value: "8–20 kişi" },
    ],
    faq: [
      {
        q: "Bu eğitim yalnızca bireysel verimlilik için mi?",
        a: "Hayır. Eğitim; yöneticinin kişisel verimliliğini artırmanın yanı sıra ekip organizasyonu ve delege etme boyutlarını da kapsar.",
      },
      {
        q: "Dijital araç önerileri de içeriyor mu?",
        a: "Evet. Katılımcıların kurumlarında kullandıkları araçlara uygun öneriler sunulur; belirli bir uygulamaya bağımlı bir içerik değildir.",
      },
    ],
  },
  "yonetim-egitimleri/kocluk-mentorluk": {
    seoTitle: "Koçluk ve Mentorluk Eğitimi | Yöneticiler İçin Koçluk Becerileri",
    seoDescription:
      "Yöneticiler için koçluk ve mentorluk eğitimi. GROW modeli, koçluk konuşmaları ve mentorluk ilişkisi kurma. Kurumsal yetenek geliştirme programı için teklif alın.",
    heroQuote:
      "Liderliğin en kalıcı izini bıraktığı alan; yetiştirdiği insanlardır.",
    intro: [
      "Sonuç üreten bir yönetici ile gerçek bir lider arasındaki fark; çoğunlukla koçluk ve mentorluk kapasitesinde saklıdır.",
      "Bu eğitim; yöneticilere, koçluk ve mentorluk arasındaki farkı kavratır ve her iki yaklaşımı da ekip gelişimi ile kurumsal büyüme için etkin biçimde kullanma becerisi kazandırır.",
    ],
    audience:
      "Ekibindeki bireylerin potansiyelini ortaya çıkarmak isteyen yöneticiler, yüksek potansiyelli çalışanlara rehberlik eden liderler, kurumsal mentorluk programı kurmak veya güçlendirmek isteyen İK profesyonelleri ve liderlik tarzını koçluk ekseninde geliştirmek isteyen yöneticiler için tasarlanmıştır.",
    sections: [
      {
        title: "Koçluk Temelleri ve Koçluk Zihniyeti",
        intro:
          "Koçluk; cevap vermek değil, doğru soruyu sormaktır. Bu bölümde koçluk zihniyeti, koçun rolü ve yönetici-koç denge noktası ele alınır.",
        bullets: [
          "Koçluk ile yöneticilik arasındaki geçiş noktası",
          "Direktif vermek yerine keşfettirmenin gücü",
          "Koçluk için psikolojik güvenlik ortamı oluşturma",
        ],
      },
      {
        title: "GROW Modeli ile Koçluk Konuşmaları",
        intro:
          "GROW modeli; dünyanın en yaygın kullanılan koçluk çerçevesidir. Bu bölümde model adım adım uygulanır ve katılımcılar gerçek senaryolarla pratik yapar.",
        bullets: [
          "Goal (Hedef): Konuşmanın amacını netleştirme",
          "Reality (Mevcut Durum): Bugünü tarafsız biçimde değerlendirme",
          "Options (Seçenekler): Olasılıkları birlikte keşfetme",
          "Will (İrade): Taahhüt ve aksiyon planı oluşturma",
        ],
      },
      {
        title: "Güçlü Sorular Sorma Sanatı",
        intro:
          "Koçluğun kalbi, güçlü sorularda yatar. Bu bölümde katılımcılar; düşündüren, derinleştiren ve harekete geçiren soru tiplerini öğrenir ve pratik yapar.",
        bullets: [
          "Açık uçlu sorular ile kapalı uçlu soruların farkı",
          "Varsayımı sorgulayan sorular",
          "Koçluk konuşmasında aktif dinleme ve yansıtma",
        ],
      },
      {
        title: "Mentorluk İlişkisi Kurma ve Sürdürme",
        intro:
          "Mentorluk; anlık bir tavsiyenin çok ötesinde, güven ve süreklilik gerektiren bir ilişkidir. Bu bölümde etkili mentorluk ilişkisinin yapısı ve dinamikleri ele alınır.",
        bullets: [
          "Mentorluk ilişkisinde roller ve sınırlar",
          "Mentorluk görüşmelerini yapılandırma",
          "Mentinin gelişimini izleme ve geri bildirim verme",
          "Mentorluk ilişkisini sona erdirme ve kapanış",
        ],
      },
      {
        title: "Kurumsal Yetenek Geliştirme",
        intro:
          "Bireysel koçluk ve mentorluk becerileri, kurumsal ölçeğe taşındığında sistematik bir yetenek geliştirme kültürüne dönüşür. Bu bölümde kurumsal koçluk kültürü ve mentorluk programı tasarımı ele alınır.",
        bullets: [
          "Koçluk kültürünü kuruma yaymak: Yöneticiden role model olmak",
          "Kurumsal mentorluk programı tasarlama ve yönetme",
          "Yüksek potansiyelli çalışanlarla koçluk ve mentorluk stratejisi",
        ],
      },
    ],
    outcomes: [
      "Koçluk ve mentorluk arasındaki farkı kavrar ve doğru zamanda uygulamaya geçer",
      "GROW modeli ile yapılandırılmış koçluk konuşmaları yürütür",
      "Güçlü sorular sorar ve aktif dinleme becerisini geliştirir",
      "Sürdürülebilir mentorluk ilişkileri kurar ve yönetir",
      "Kurumda koçluk ve mentorluk kültürünü yaygınlaştırır",
    ],
    format: [
      {
        label: "Süre",
        value: "2 gün (esnek)",
      },
      { label: "Format", value: "Şirket içi veya açık grup" },
      {
        label: "Yöntem",
        value:
          "GROW modeli ve koçluk egzersizleri",
      },
      {
        label: "Katılımcı",
        value:
          "8–16 kişi",
      },
    ],
    faq: [
      {
        q: "ICF sertifikalı koçluk eğitimi mi?",
        a: "Bu eğitim, yöneticilere koçluk becerisi kazandırmayı hedefler; ICF veya benzeri bir profesyonel koçluk sertifikası vermez. Profesyonel koçluk sertifikası arıyorsanız bu konuda yönlendirme yapabiliriz.",
      },
      {
        q: "Kurumsal mentorluk programı kurmak için yeterli mi?",
        a: "Evet. Eğitim; mentorluk programı tasarımı modülünü de içerdiğinden kurumunuzda bir programı başlatmak veya güçlendirmek için sağlam bir temel oluşturur.",
      },
      {
        q: "Mentorluk programı olmayan kurumlar için de uygun mu?",
        a: "Kesinlikle. Eğitim; hem mevcut mentorluk programını güçlendirmek isteyen hem de sıfırdan başlamayı planlayan kurumlar için uygundur.",
      },
    ],
  },
};
