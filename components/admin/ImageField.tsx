"use client";

import { useRef, useState } from "react";

type Props = {
  /** Form'a gidecek hidden input adı (ör. "photo"); boşsa hidden input basılmaz */
  name?: string;
  label?: string;
  defaultValue?: string | null;
  accept?: string;
  hint?: string;
  /** RepeatableList gibi state tabanlı kullanım için */
  onChange?: (url: string) => void;
};

/**
 * Dosya seç / sürükle-bırak → anında /api/admin/upload'a yükler,
 * dönen URL'i hidden input'a yazar. Form kaydedilince yalnızca URL gider.
 */
export default function ImageField({
  name,
  label,
  defaultValue,
  accept = "image/*",
  hint,
  onChange,
}: Props) {
  const [value, setValue] = useState(defaultValue ?? "");
  const [preview, setPreview] = useState(defaultValue ?? "");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const isPdf = accept.includes("pdf");

  async function upload(file: File) {
    setError("");
    setBusy(true);
    if (!isPdf) setPreview(URL.createObjectURL(file));
    try {
      const body = new FormData();
      body.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Yükleme başarısız");
      setValue(data.url);
      onChange?.(data.url);
      if (!isPdf) setPreview(data.url);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Yükleme başarısız");
      setPreview(value);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="adm-field">
      {label ? <label>{label}</label> : null}
      {name ? <input type="hidden" name={name} value={value} /> : null}
      <div
        className={`adm-dropzone${busy ? " is-busy" : ""}`}
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          const file = e.dataTransfer.files[0];
          if (file) upload(file);
        }}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") inputRef.current?.click();
        }}
      >
        {preview && !isPdf ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={preview} alt="" className="adm-dropzone-preview" />
        ) : value && isPdf ? (
          <span className="adm-dropzone-file">📄 {value.split("/").pop()}</span>
        ) : (
          <span className="adm-dropzone-hint">
            {busy ? "Yükleniyor…" : "Dosya seç veya buraya sürükle"}
          </span>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        style={{ display: "none" }}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) upload(file);
          e.target.value = "";
        }}
      />
      <div className="adm-dropzone-actions">
        {busy ? <span className="adm-hint">Yükleniyor…</span> : null}
        {value && !busy ? (
          <button
            type="button"
            className="adm-link-btn"
            onClick={() => {
              setValue("");
              setPreview("");
              onChange?.("");
            }}
          >
            Kaldır
          </button>
        ) : null}
      </div>
      {hint ? <span className="adm-hint">{hint}</span> : null}
      {error ? <span className="adm-field-error">{error}</span> : null}
    </div>
  );
}
