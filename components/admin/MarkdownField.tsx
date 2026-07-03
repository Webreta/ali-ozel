"use client";

import { useRef, useState } from "react";
import { marked } from "marked";

type ToolbarAction = {
  label: string;
  title: string;
  before: string;
  after?: string;
  block?: boolean;
};

const ACTIONS: ToolbarAction[] = [
  { label: "B", title: "Kalın", before: "**", after: "**" },
  { label: "I", title: "İtalik", before: "*", after: "*" },
  { label: "H2", title: "Başlık", before: "## ", block: true },
  { label: "H3", title: "Alt başlık", before: "### ", block: true },
  { label: "•", title: "Liste", before: "- ", block: true },
  { label: "❝", title: "Alıntı", before: "> ", block: true },
  { label: "🔗", title: "Bağlantı", before: "[", after: "](https://)" },
];

export default function MarkdownField({
  name,
  label,
  defaultValue = "",
  required,
}: {
  name: string;
  label: string;
  defaultValue?: string;
  required?: boolean;
}) {
  const [value, setValue] = useState(defaultValue);
  const [showPreview, setShowPreview] = useState(false);
  const [uploading, setUploading] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  function applyAction(a: ToolbarAction) {
    const ta = textareaRef.current;
    if (!ta) return;
    const { selectionStart: start, selectionEnd: end } = ta;
    const selected = value.slice(start, end);

    let next: string;
    let cursor: number;
    if (a.block) {
      // Satır başına ekle
      const lineStart = value.lastIndexOf("\n", start - 1) + 1;
      next = value.slice(0, lineStart) + a.before + value.slice(lineStart);
      cursor = end + a.before.length;
    } else {
      next =
        value.slice(0, start) +
        a.before +
        selected +
        (a.after ?? "") +
        value.slice(end);
      cursor = selected
        ? end + a.before.length + (a.after?.length ?? 0)
        : start + a.before.length;
    }
    setValue(next);
    requestAnimationFrame(() => {
      ta.focus();
      ta.setSelectionRange(cursor, cursor);
    });
  }

  async function insertImage(file: File) {
    setUploading(true);
    try {
      const body = new FormData();
      body.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Yükleme başarısız");
      const ta = textareaRef.current;
      const pos = ta?.selectionStart ?? value.length;
      setValue(
        value.slice(0, pos) + `\n![](${data.url})\n` + value.slice(pos)
      );
    } catch (e) {
      alert(e instanceof Error ? e.message : "Görsel yüklenemedi");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="adm-field">
      <label>{label}</label>
      <div className="adm-md">
        <div className="adm-md-toolbar">
          {ACTIONS.map((a) => (
            <button
              key={a.label}
              type="button"
              title={a.title}
              onClick={() => applyAction(a)}
            >
              {a.label}
            </button>
          ))}
          <button
            type="button"
            title="Görsel ekle"
            disabled={uploading}
            onClick={() => fileRef.current?.click()}
          >
            {uploading ? "…" : "🖼"}
          </button>
          <span style={{ flex: 1 }} />
          <button
            type="button"
            className={showPreview ? "is-on" : ""}
            onClick={() => setShowPreview((p) => !p)}
          >
            Önizleme
          </button>
        </div>
        <div className={`adm-md-body${showPreview ? " has-preview" : ""}`}>
          <textarea
            ref={textareaRef}
            name={name}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            required={required}
            rows={16}
            placeholder="Markdown ile yazın — araç çubuğundaki düğmeler biçimlendirmeyi ekler."
          />
          {showPreview ? (
            <div
              className="adm-md-preview prose"
              // Önizleme yalnızca panelde, yazarın kendi içeriğiyle render edilir
              dangerouslySetInnerHTML={{ __html: marked.parse(value) as string }}
            />
          ) : null}
        </div>
      </div>
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) insertImage(f);
          e.target.value = "";
        }}
      />
    </div>
  );
}
