"use client";

import { useActionState, useRef } from "react";
import ImageField from "@/components/admin/ImageField";
import MarkdownField from "@/components/admin/MarkdownField";
import SubmitButton from "@/components/admin/SubmitButton";
import { PREVIEW_STORAGE_KEY } from "@/app/(site)/blog/onizleme/BlogPreview";
import type { BlogFormState } from "./actions";

type Post = {
  title: string;
  excerpt: string | null;
  body: string;
  coverImage: string | null;
  status: "draft" | "published";
  seoTitle: string | null;
  seoDescription: string | null;
};

export default function BlogForm({
  action,
  initialData,
}: {
  action: (prev: BlogFormState, formData: FormData) => Promise<BlogFormState>;
  initialData?: Post;
}) {
  const [state, formAction] = useActionState<BlogFormState, FormData>(
    action,
    {}
  );
  const err = state.fieldErrors ?? {};
  const formRef = useRef<HTMLFormElement>(null);

  // Formdaki güncel (kaydedilmemiş olabilir) içeriği yeni sekmede sitedeki
  // görünümüyle açar
  function openPreview() {
    if (!formRef.current) return;
    const fd = new FormData(formRef.current);
    try {
      localStorage.setItem(
        PREVIEW_STORAGE_KEY,
        JSON.stringify({
          title: String(fd.get("title") ?? ""),
          body: String(fd.get("body") ?? ""),
          coverImage: String(fd.get("coverImage") ?? ""),
        })
      );
    } catch {
      alert("Önizleme açılamadı: tarayıcı depolaması kullanılamıyor.");
      return;
    }
    window.open("/blog/onizleme", "blog-onizleme");
  }

  return (
    <form ref={formRef} action={formAction} className="adm-form" style={{ maxWidth: 900 }}>
      <div className="adm-field">
        <label htmlFor="title">Başlık</label>
        <input id="title" name="title" defaultValue={initialData?.title} required />
        {err.title ? <span className="adm-field-error">{err.title}</span> : null}
        {!initialData ? (
          <span className="adm-hint">
            Yazının adresi başlıktan otomatik üretilir ve sonradan değişmez.
          </span>
        ) : null}
      </div>

      <div className="adm-field">
        <label htmlFor="excerpt">Özet</label>
        <textarea
          id="excerpt"
          name="excerpt"
          defaultValue={initialData?.excerpt ?? ""}
          rows={2}
          placeholder="Listelerde görünen 1-2 cümlelik özet"
        />
      </div>

      <ImageField
        name="coverImage"
        label="Kapak görseli"
        defaultValue={initialData?.coverImage}
      />

      <MarkdownField
        name="body"
        label="İçerik"
        defaultValue={initialData?.body}
        required
      />
      {err.body ? <span className="adm-field-error">{err.body}</span> : null}

      <details className="adm-details">
        <summary>SEO ayarları (isteğe bağlı)</summary>
        <div className="adm-form" style={{ paddingTop: 14 }}>
          <div className="adm-field">
            <label htmlFor="seoTitle">SEO başlığı</label>
            <input
              id="seoTitle"
              name="seoTitle"
              defaultValue={initialData?.seoTitle ?? ""}
            />
          </div>
          <div className="adm-field">
            <label htmlFor="seoDescription">SEO açıklaması</label>
            <textarea
              id="seoDescription"
              name="seoDescription"
              defaultValue={initialData?.seoDescription ?? ""}
              rows={2}
            />
          </div>
        </div>
      </details>

      <div className="adm-field">
        <label htmlFor="status">Durum</label>
        <select id="status" name="status" defaultValue={initialData?.status ?? "draft"}>
          <option value="draft">Taslak</option>
          <option value="published">Yayında</option>
        </select>
      </div>

      {state.error ? <p className="adm-form-error">{state.error}</p> : null}

      <div className="adm-form-actions">
        <SubmitButton>Kaydet</SubmitButton>
        <button type="button" className="btn btn-outline" onClick={openPreview}>
          Önizle ↗
        </button>
      </div>
    </form>
  );
}
