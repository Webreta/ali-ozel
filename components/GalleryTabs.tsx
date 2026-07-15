"use client";

import { useCallback, useEffect, useState } from "react";
import Icon from "@/components/Icon";
import type { GallerySectionData } from "@/lib/data/gallery";

/**
 * Galeri bölümleri: üstte tab'lar, altta seçili bölümün görselleri.
 * Bölümün layout ayarına göre kare grid ya da masonry dizilir;
 * görsele tıklanınca lightbox açılır.
 */
export default function GalleryTabs({
  sections,
}: {
  sections: GallerySectionData[];
}) {
  const [active, setActive] = useState(0);
  const [lightbox, setLightbox] = useState<number | null>(null);

  const section = sections[active];
  const images = section?.images ?? [];

  const step = useCallback(
    (dir: -1 | 1) => {
      setLightbox((cur) =>
        cur === null ? cur : (cur + dir + images.length) % images.length
      );
    },
    [images.length]
  );

  useEffect(() => {
    if (lightbox === null) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setLightbox(null);
      if (e.key === "ArrowLeft") step(-1);
      if (e.key === "ArrowRight") step(1);
    }
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [lightbox, step]);

  if (!section) return null;

  // Grid'de küçük önizleme dosyası kullanılır (varsa) — tam boy lightbox'ta
  const thumbOf = (src: string) => src.replace(/\.webp$/, ".thumb.webp");

  const listClass =
    section.layout === "grid"
      ? `gal-grid cols-${section.columns}`
      : `gal-masonry cols-${section.columns}`;

  return (
    <>
      {sections.length > 1 ? (
        <div className="gal-tabs" role="tablist">
          {sections.map((s, i) => (
            <button
              key={s.id}
              type="button"
              role="tab"
              aria-selected={i === active}
              className={`gal-tab${i === active ? " is-active" : ""}`}
              onClick={() => {
                setActive(i);
                setLightbox(null);
              }}
            >
              {s.title}
            </button>
          ))}
        </div>
      ) : null}

      <div className={listClass}>
        {images.map((img, i) => (
          <button
            key={img.src + i}
            type="button"
            className="gal-item"
            onClick={() => setLightbox(i)}
            aria-label={img.alt ?? `${section.title} — fotoğraf ${i + 1}`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={thumbOf(img.src)}
              alt={img.alt ?? `${section.title} — fotoğraf ${i + 1}`}
              decoding="async"
              onError={(e) => {
                // eski görsellerde .thumb yoksa tam boya düş (tek sefer)
                const el = e.currentTarget;
                if (!el.dataset.fb) {
                  el.dataset.fb = "1";
                  el.src = img.src;
                }
              }}
            />
          </button>
        ))}
      </div>

      {lightbox !== null && images[lightbox] ? (
        <div
          className="gal-lightbox"
          role="dialog"
          aria-modal="true"
          onClick={(e) => {
            if (e.target === e.currentTarget) setLightbox(null);
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={images[lightbox].src}
            alt={images[lightbox].alt ?? `${section.title} — fotoğraf ${lightbox + 1}`}
          />
          <button
            type="button"
            className="gal-lb-close"
            aria-label="Kapat"
            onClick={() => setLightbox(null)}
          >
            <Icon name="close" />
          </button>
          {images.length > 1 ? (
            <>
              <button
                type="button"
                className="gal-lb-arrow gal-lb-prev"
                aria-label="Önceki"
                onClick={() => step(-1)}
              >
                <Icon name="arrow-right" style={{ transform: "rotate(180deg)" }} />
              </button>
              <button
                type="button"
                className="gal-lb-arrow gal-lb-next"
                aria-label="Sonraki"
                onClick={() => step(1)}
              >
                <Icon name="arrow-right" />
              </button>
            </>
          ) : null}
        </div>
      ) : null}
    </>
  );
}
