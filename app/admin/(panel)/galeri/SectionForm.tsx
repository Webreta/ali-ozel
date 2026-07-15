"use client";

import { useActionState } from "react";
import SubmitButton from "@/components/admin/SubmitButton";
import GalleryImagesField from "@/components/admin/GalleryImagesField";
import type { GalleryFormState } from "./actions";

type Section = {
  title: string;
  layout: "grid" | "masonry";
  columns: number;
  published: boolean;
  images: { src: string; alt: string }[];
};

export default function SectionForm({
  action,
  initialData,
}: {
  action: (
    prev: GalleryFormState,
    formData: FormData
  ) => Promise<GalleryFormState>;
  initialData?: Section;
}) {
  const [state, formAction] = useActionState<GalleryFormState, FormData>(
    action,
    {}
  );
  const err = state.fieldErrors ?? {};

  return (
    <form action={formAction} className="adm-form" style={{ maxWidth: 900 }}>
      <div className="adm-form-row">
        <div className="adm-field">
          <label htmlFor="title">Bölüm adı</label>
          <input
            id="title"
            name="title"
            defaultValue={initialData?.title}
            placeholder="ör. Takım Çalışması Eğitimleri"
            required
          />
          {err.title ? <span className="adm-field-error">{err.title}</span> : null}
          <span className="adm-hint">
            Galeri sayfasında tab başlığı olarak görünür.
          </span>
        </div>
      </div>

      <div className="adm-form-row">
        <div className="adm-field">
          <label htmlFor="layout">Dizilim</label>
          <select
            id="layout"
            name="layout"
            defaultValue={initialData?.layout ?? "masonry"}
          >
            <option value="masonry">Masonry (doğal oranlar)</option>
            <option value="grid">Kare grid</option>
          </select>
          <span className="adm-hint">
            Masonry fotoğrafları kendi oranlarında alt alta yerleştirir; kare
            grid tüm kareleri eşit boyutta kırpar.
          </span>
        </div>
        <div className="adm-field">
          <label htmlFor="columns">Sütun sayısı</label>
          <select
            id="columns"
            name="columns"
            defaultValue={String(initialData?.columns ?? 4)}
          >
            <option value="3">3 sütun</option>
            <option value="4">4 sütun</option>
            <option value="5">5 sütun</option>
            <option value="6">6 sütun</option>
          </select>
        </div>
      </div>

      <div className="adm-field">
        <label>Görseller</label>
        <GalleryImagesField
          name="images"
          initialItems={initialData?.images ?? []}
        />
      </div>

      <div className="adm-field">
        <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <input
            type="checkbox"
            name="published"
            defaultChecked={initialData?.published ?? true}
            style={{ width: "auto" }}
          />
          Sitede yayınla
        </label>
      </div>

      {state.error ? <p className="adm-form-error">{state.error}</p> : null}

      <div className="adm-form-actions">
        <SubmitButton>Kaydet</SubmitButton>
      </div>
    </form>
  );
}
