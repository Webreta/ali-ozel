-- Ali Özel'in ekip sayfasındaki detay biyografisini (CV) yeni metinle değiştirir.
-- Kaynak: "Yeni-Ali Özel CV.docx". Yalnızca detail_bio güncellenir; kısa bio,
-- fotoğraf, uzmanlık alanları ve öne çıkan rakamlar olduğu gibi kalır.
--
-- ÇALIŞTIRMA: Easypanel > db (postgres) servisi > Console:
--   psql -U aliozel -d sanegitim-w -f -   (ya da psql'e girip aşağıyı yapıştır)
-- Aynı metni tekrar yazdığı için birden fazla çalıştırmak zararsızdır.
-- Not: site ekip verisini cache'ler; güncelleme sonrası görünmezse panelden
-- Ali Özel kaydını bir kez "Kaydet"mek ya da uygulamayı yeniden başlatmak yeterli.

BEGIN;

UPDATE team_members
SET detail_bio = 'Ali Özel, profesyonel hayatının büyük bölümünü sahada, gerçek ekiplerin içinde geçirdi. 1990''da Eczacıbaşı İlaç Pazarlama''da satış temsilcisi olarak başladığı kariyerine Bristol-Myers Squibb''de satış uzmanı, satış eğitim müdür yardımcısı ve bölgeler satış müdürü olarak devam etti. 2010''da eğitim sektörüne geçti ve MTI Group''ta kıdemli danışman olarak görev yaptı. Bu yolculuk ona liderliğin slaytlarda değil, sahada, insanların arasında öğrenildiğini gösterdi. Bugün verdiği her eğitimin arkasında bu sahada yaşanmış deneyim birikimi var.

2017''de kurduğu **SAN Eğitim & Danışmanlık**''ı tek bir eğitmenin sınırlarına bağlı kalmayan bir model üzerine inşa etti. Bu modelde farklı disiplinlerden gelen uzmanlıklar kurumların gerçek ihtiyaçlarıyla eşleşiyor. Gelişim süreci eğitimle başlıyor, danışmanlık ve ölçümlemeyle tamamlanıyor. Kurucu, eğitmen ve koordinatör rollerini bir arada üstleniyor. Her programın kuruma özel kurgulanmasını ve eğitim sonrası saha takibiyle kalıcı davranış değişimine dönüşmesini bizzat yönetiyor.

Geliştirdiği **Eğit-Öğret-Yönet** metodolojisi bilgiyi aktarmakla yetinmiyor, öğretiyor ve sahada uygulatıyor. Liderlik ve yönetimden satışa, takım çalışmasından yapay zekâ çağında liderliğe kadar tüm eğitim alanları bu ortak metodolojiden besleniyor. Bugün üretim tesislerinden hizmet sektörüne geniş bir yelpazede kurumla çalışıyor ve 8 eğitim alanında 70''in üzerinde modülü ve eğitmen kadrosunu koordine ediyor. Mavi yaka çalışanlarına ve formen, vardiya amiri, takım lideri gibi mavi yaka yöneticilerine 2.500''ü aşkın eğitim verdi. İtirazım Var kitabının yazarıdır, nöropazarlama uzmanı ve TEGEP üyesidir.',
    updated_at = now()
WHERE slug = 'ali-ozel';

COMMIT;
