"use client";

import { useEffect, useState } from "react";
import type { Reference } from "@/lib/references";

export default function ReferenceMarquee({ items }: { items: Reference[] }) {
  const N = items.length;
  const ITEMCOUNT = N * 2; // iki kopya -> kusursuz döngü
  const [visible, setVisible] = useState(5);
  const [step, setStep] = useState(0);
  const [anim, setAnim] = useState(true);

  // ekran boyutuna göre görünür logo sayısı
  useEffect(() => {
    const small = window.matchMedia("(max-width: 720px)");
    const mid = window.matchMedia("(max-width: 1024px)");
    const apply = () => setVisible(small.matches ? 3 : mid.matches ? 5 : 7);
    apply();
    small.addEventListener("change", apply);
    mid.addEventListener("change", apply);
    return () => {
      small.removeEventListener("change", apply);
      mid.removeEventListener("change", apply);
    };
  }, []);

  // her 2.5 sn'de bir adım kay
  useEffect(() => {
    const id = setInterval(() => {
      setAnim(true);
      setStep((s) => s + 1);
    }, 2500);
    return () => clearInterval(id);
  }, []);

  // bir tam tur dönünce görünmez şekilde başa sar
  useEffect(() => {
    if (!anim) {
      const r = requestAnimationFrame(() => setAnim(true));
      return () => cancelAnimationFrame(r);
    }
  }, [anim]);

  const center = Math.floor(visible / 2);
  const track = [...items, ...items];

  return (
    <div className="ref-marquee">
      <span className="ref-zone" aria-hidden />
      <div
        className="ref-track"
        onTransitionEnd={() => {
          if (step >= N) {
            setAnim(false);
            setStep((s) => s - N);
          }
        }}
        style={{
          width: `calc(${ITEMCOUNT} / ${visible} * 100%)`,
          transform: `translateX(calc(${-step} * 100% / ${ITEMCOUNT}))`,
          transition: anim
            ? "transform 0.7s cubic-bezier(0.4, 0, 0.2, 1)"
            : "none",
        }}
      >
        {track.map((ref, j) => (
          <div
            className={`ref-item${j === step + center ? " is-center" : ""}`}
            style={{ width: `calc(100% / ${ITEMCOUNT})` }}
            key={j}
          >
            <span className="ref-logo">
              {/* logolar farklı oranlarda; basit img ile object-contain */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={ref.src} alt={ref.name} loading="lazy" />
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
