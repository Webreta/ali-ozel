"use client";

import { useState } from "react";

type WithKey<T> = T & { _key: string };

/**
 * Tekrarlı satır düzenleyici (bölümler, SSS, format...). Satır ekleme/silme ve
 * ↑/↓ ile sıralama sağlar; güncel durumu tek bir hidden input'ta JSON olarak
 * taşır — server action `z.string().transform(JSON.parse)` ile doğrular.
 */
export default function RepeatableList<T extends object>({
  name,
  initialItems,
  empty,
  renderRow,
  addLabel = "+ Satır ekle",
}: {
  name: string;
  initialItems: T[];
  /** Yeni satır şablonu */
  empty: T;
  renderRow: (item: T, update: (patch: Partial<T>) => void) => React.ReactNode;
  addLabel?: string;
}) {
  const [items, setItems] = useState<WithKey<T>[]>(() =>
    initialItems.map((item) => ({ ...item, _key: crypto.randomUUID() }))
  );

  const serialized = JSON.stringify(
    items.map(({ _key, ...rest }) => rest)
  );

  function move(index: number, dir: -1 | 1) {
    const target = index + dir;
    if (target < 0 || target >= items.length) return;
    const next = [...items];
    [next[index], next[target]] = [next[target], next[index]];
    setItems(next);
  }

  return (
    <div className="adm-repeat">
      <input type="hidden" name={name} value={serialized} />
      {items.map((item, i) => (
        <div className="adm-repeat-row" key={item._key}>
          <div className="adm-repeat-body">
            {renderRow(item, (patch) =>
              setItems((prev) =>
                prev.map((p) => (p._key === item._key ? { ...p, ...patch } : p))
              )
            )}
          </div>
          <div className="adm-repeat-controls">
            <button
              type="button"
              className="adm-icon-btn"
              disabled={i === 0}
              onClick={() => move(i, -1)}
              title="Yukarı"
            >
              ↑
            </button>
            <button
              type="button"
              className="adm-icon-btn"
              disabled={i === items.length - 1}
              onClick={() => move(i, 1)}
              title="Aşağı"
            >
              ↓
            </button>
            <button
              type="button"
              className="adm-icon-btn"
              onClick={() =>
                setItems((prev) => prev.filter((p) => p._key !== item._key))
              }
              title="Satırı sil"
            >
              ✕
            </button>
          </div>
        </div>
      ))}
      <button
        type="button"
        className="btn btn-outline adm-repeat-add"
        onClick={() =>
          setItems((prev) => [...prev, { ...empty, _key: crypto.randomUUID() }])
        }
      >
        {addLabel}
      </button>
    </div>
  );
}
