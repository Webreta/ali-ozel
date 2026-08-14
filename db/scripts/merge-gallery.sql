-- Galeri bölümlerini tek bir "Galeri" bölümünde birleştirir.
--
-- Ne yapar:
--   1) Tüm görselleri orijinal düzene göre (bölüm sırası -> görsel sırası)
--      tek bir global sıraya dizer (Ali Özel'in görselleri önce, sonra diğerleri).
--   2) Bütün görselleri en eski (ilk oluşturulan) bölüme taşır.
--   3) O bölümü "Galeri" olarak yeniden adlandırır.
--   4) Boşalan diğer bölümleri siler.
--
-- Sonuç: admin panelde tek "Galeri" bölümü (tüm fotoğraflar) görünür ve
-- yönetilebilir; sitede galeri tek liste halinde gelir.
--
-- ÇALIŞTIRMA: Easypanel > db (postgres) servisi > Console:
--   psql -U aliozel -d sanegitim-w -f -   (ya da psql'e girip aşağıyı yapıştır)
-- BİR KEZ çalıştırılır. Geri alınamaz — önce DB yedeği almanız önerilir.

BEGIN;

-- 1) Görselleri global tek sıraya diz
WITH ordered AS (
  SELECT gi.id,
         ROW_NUMBER() OVER (
           ORDER BY gs.sort_order, gs.id, gi.sort_order, gi.id
         ) - 1 AS rn
  FROM gallery_images gi
  JOIN gallery_sections gs ON gs.id = gi.section_id
)
UPDATE gallery_images gi
SET sort_order = o.rn
FROM ordered o
WHERE gi.id = o.id;

-- 2) Tüm görselleri en eski bölüme taşı (diğer bölümler boşalır)
UPDATE gallery_images
SET section_id = (SELECT MIN(id) FROM gallery_sections);

-- 3) Hedef bölümü "Galeri" yap
UPDATE gallery_sections
SET title = 'Galeri', updated_at = now()
WHERE id = (SELECT MIN(id) FROM gallery_sections);

-- 4) Boşalan diğer bölümleri sil
DELETE FROM gallery_sections
WHERE id <> (SELECT MIN(id) FROM gallery_sections);

COMMIT;

-- Kontrol: tek bölüm ve toplam görsel sayısı
-- SELECT gs.id, gs.title, count(gi.id)
-- FROM gallery_sections gs LEFT JOIN gallery_images gi ON gi.section_id = gs.id
-- GROUP BY gs.id, gs.title;
