"use client";

import { useRef, useState } from "react";

type GalleryImage = { src: string } & Record<string, string>;
type WithKey = { src: string; text: string; _key: string };

/**
 * Galeri bölümü için çoklu görsel yükleyici. Birden çok dosya seçilebilir /
 * sürüklenebilir; her dosya sırayla /api/admin/upload'a gider. Güncel liste
 * tek bir hidden input'ta JSON olarak taşınır ({src, [textKey]}[] —
 * galeri modülünde alt, eğitim notlarında caption).
 */
export default function GalleryImagesField({
  name,
  initialItems,
  textKey = "alt",
  textPlaceholder = "Alt yazı (isteğe bağlı)",
}: {
  name: string;
  initialItems: GalleryImage[];
  textKey?: string;
  textPlaceholder?: string;
}) {
  const [items, setItems] = useState<WithKey[]>(() =>
    initialItems.map((i) => ({
      src: i.src,
      text: i[textKey] ?? "",
      _key: crypto.randomUUID(),
    }))
  );
  const [busy, setBusy] = useState(0); // yüklenmekte olan dosya sayısı
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const serialized = JSON.stringify(
    items.map(({ src, text }) => ({ src, [textKey]: text }))
  );

  async function uploadFiles(files: FileList | File[]) {
    setError("");
    const list = Array.from(files).filter((f) => f.type.startsWith("image/"));
    if (list.length === 0) return;
    setBusy(list.length);
    for (const file of list) {
      try {
        const body = new FormData();
        body.append("file", file);
        const res = await fetch("/api/admin/upload", { method: "POST", body });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error ?? "Yükleme başarısız");
        setItems((prev) => [
          ...prev,
          { src: data.url, text: "", _key: crypto.randomUUID() },
        ]);
      } catch (e) {
        setError(
          `${file.name}: ${e instanceof Error ? e.message : "Yükleme başarısız"}`
        );
      } finally {
        setBusy((n) => n - 1);
      }
    }
  }

  function move(index: number, dir: -1 | 1) {
    const target = index + dir;
    if (target < 0 || target >= items.length) return;
    setItems((prev) => {
      const next = [...prev];
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  }

  return (
    <div className="adm-field">
      <input type="hidden" name={name} value={serialized} />
      <div
        className={`adm-dropzone${busy ? " is-busy" : ""}`}
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          uploadFiles(e.dataTransfer.files);
        }}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") inputRef.current?.click();
        }}
      >
        <span className="adm-dropzone-hint">
          {busy
            ? `Yükleniyor… (kalan ${busy})`
            : "Görselleri seç veya buraya sürükle — birden fazla dosya seçebilirsiniz"}
        </span>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        style={{ display: "none" }}
        onChange={(e) => {
          if (e.target.files) uploadFiles(e.target.files);
          e.target.value = "";
        }}
      />
      {error ? <span className="adm-field-error">{error}</span> : null}

      {items.length > 0 ? (
        <div className="adm-gal-grid">
          {items.map((item, i) => (
            <div className="adm-gal-item" key={item._key}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.src.replace(/\.webp$/, ".thumb.webp")}
                alt=""
                decoding="async"
                onError={(e) => {
                  const el = e.currentTarget;
                  if (!el.dataset.fb) {
                    el.dataset.fb = "1";
                    el.src = item.src;
                  }
                }}
              />
              <input
                type="text"
                placeholder={textPlaceholder}
                value={item.text}
                onChange={(e) =>
                  setItems((prev) =>
                    prev.map((p) =>
                      p._key === item._key ? { ...p, text: e.target.value } : p
                    )
                  )
                }
              />
              <div className="adm-gal-controls">
                <button
                  type="button"
                  className="adm-icon-btn"
                  disabled={i === 0}
                  onClick={() => move(i, -1)}
                  title="Öne al"
                >
                  ←
                </button>
                <button
                  type="button"
                  className="adm-icon-btn"
                  disabled={i === items.length - 1}
                  onClick={() => move(i, 1)}
                  title="Arkaya al"
                >
                  →
                </button>
                <button
                  type="button"
                  className="adm-icon-btn"
                  onClick={() =>
                    setItems((prev) => prev.filter((p) => p._key !== item._key))
                  }
                  title="Görseli çıkar"
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : null}
      <span className="adm-hint">
        {items.length} görsel — sıralamayı ok tuşlarıyla değiştirebilirsiniz.
      </span>
    </div>
  );
}
