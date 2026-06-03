"use client";

import { useEffect, useState } from "react";
import Icon from "./Icon";

type Item = { icon: string; title: string; text: string };

export default function ApproachList({ items }: { items: Item[] }) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setActive((a) => (a + 1) % items.length);
    }, 2000);
    return () => clearInterval(id);
  }, [items.length]);

  return (
    <div className="approach-list">
      {items.map((v, i) => (
        <div
          className={`approach-item${i === active ? " is-active" : ""}`}
          key={v.title}
        >
          <span className="approach-num">{String(i + 1).padStart(2, "0")}</span>
          <div className="approach-text">
            <h3>{v.title}</h3>
            <p>{v.text}</p>
          </div>
          <span className="approach-ic">
            <Icon name={v.icon} />
          </span>
        </div>
      ))}
    </div>
  );
}
