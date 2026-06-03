"use client";

import { useEffect, useState } from "react";

// çark üzerindeki 12 çentik
const TICKS = Array.from({ length: 12 }, (_, i) => {
  const a = (i * 30 * Math.PI) / 180;
  return {
    x1: 120 + 86 * Math.cos(a),
    y1: 120 + 86 * Math.sin(a),
    x2: 120 + 104 * Math.cos(a),
    y2: 120 + 104 * Math.sin(a),
  };
});

export default function ApproachWheel() {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 2000);
    return () => clearInterval(id);
  }, []);

  return (
    <div
      className="approach-wheel"
      style={{ transform: `rotate(${tick * 30}deg)` }}
      aria-hidden
    >
      <svg viewBox="0 0 240 240">
        <circle cx="120" cy="120" r="110" />
        <circle cx="120" cy="120" r="72" />
        {TICKS.map((t, i) => (
          <line key={i} x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2} />
        ))}
        <circle className="aw-center" cx="120" cy="120" r="5" />
      </svg>
    </div>
  );
}
