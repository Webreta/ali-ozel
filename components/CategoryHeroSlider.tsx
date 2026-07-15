"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Icon from "@/components/Icon";

/**
 * Kategori hero'sundaki mini görsel slider'ı (ör. Takım Çalışması fotoğrafları).
 * Otomatik ilerler; ok ve noktalarla elle gezilebilir.
 */
export default function CategoryHeroSlider({
  images,
  alt,
}: {
  images: string[];
  alt: string;
}) {
  const [index, setIndex] = useState(0);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const go = useCallback(
    (next: number) => {
      setIndex((next + images.length) % images.length);
    },
    [images.length]
  );

  useEffect(() => {
    if (images.length < 2) return;
    timer.current = setInterval(() => {
      setIndex((i) => (i + 1) % images.length);
    }, 4500);
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [images.length, index]);

  if (images.length === 0) return null;

  return (
    <div className="cat-hero-slider" aria-label={`${alt} görselleri`}>
      <div className="chs-frame">
        {images.map((src, i) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={src + i}
            src={src}
            alt={`${alt} — fotoğraf ${i + 1}`}
            className={i === index ? "is-active" : ""}
            loading={i === 0 ? "eager" : "lazy"}
            draggable={false}
          />
        ))}
      </div>
      {images.length > 1 ? (
        <>
          <button
            type="button"
            className="chs-arrow chs-prev"
            aria-label="Önceki görsel"
            onClick={() => go(index - 1)}
          >
            <Icon name="arrow-right" style={{ transform: "rotate(180deg)" }} />
          </button>
          <button
            type="button"
            className="chs-arrow chs-next"
            aria-label="Sonraki görsel"
            onClick={() => go(index + 1)}
          >
            <Icon name="arrow-right" />
          </button>
          <div className="chs-dots">
            {images.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Görsel ${i + 1}`}
                className={i === index ? "is-active" : ""}
                onClick={() => go(i)}
              />
            ))}
          </div>
        </>
      ) : null}
    </div>
  );
}
