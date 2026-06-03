import type { Reference } from "@/lib/references";

export default function ReferenceMarquee({ items }: { items: Reference[] }) {
  // iki kopya -> animasyon %50'de dikişsiz başa sarar
  const track = [...items, ...items];
  return (
    <div className="ref-marquee">
      <div className="ref-track">
        {track.map((ref, j) => (
          <span className="ref-logo" key={j}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={ref.src} alt={ref.name} loading="lazy" />
          </span>
        ))}
      </div>
    </div>
  );
}
