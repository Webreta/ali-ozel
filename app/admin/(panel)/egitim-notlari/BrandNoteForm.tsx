"use client";

import { useActionState } from "react";
import GalleryImagesField from "@/components/admin/GalleryImagesField";
import ImageField from "@/components/admin/ImageField";
import RepeatableList from "@/components/admin/RepeatableList";
import SubmitButton from "@/components/admin/SubmitButton";
import type { NoteFormState } from "./actions";

type MetaRow = { label: string; value: string };
type SegmentRow = { title: string; desc: string };
type GalleryRow = { src: string; caption: string };

export type BrandNoteFormData = {
  company: string;
  title: string;
  logo: string | null;
  eventDateLabel: string | null;
  intro: string | null;
  instructorNote: string | null;
  notes: string[];
  meta: MetaRow[];
  segments: SegmentRow[];
  gallery: GalleryRow[];
  published: boolean;
};

export default function BrandNoteForm({
  action,
  initialData,
}: {
  action: (prev: NoteFormState, formData: FormData) => Promise<NoteFormState>;
  initialData?: BrandNoteFormData;
}) {
  const [state, formAction] = useActionState<NoteFormState, FormData>(
    action,
    {}
  );
  const err = state.fieldErrors ?? {};

  return (
    <form action={formAction} className="adm-form" style={{ maxWidth: 900 }}>
      <div className="adm-form-row">
        <div className="adm-field">
          <label htmlFor="company">Kurum</label>
          <input id="company" name="company" defaultValue={initialData?.company} required />
          {err.company ? <span className="adm-field-error">{err.company}</span> : null}
          {!initialData ? (
            <span className="adm-hint">Adres kurum adından üretilir ve değişmez.</span>
          ) : null}
        </div>
        <div className="adm-field">
          <label htmlFor="title">Program başlığı</label>
          <input id="title" name="title" defaultValue={initialData?.title} required />
          {err.title ? <span className="adm-field-error">{err.title}</span> : null}
        </div>
      </div>

      <div className="adm-form-row">
        <ImageField name="logo" label="Kurum logosu" defaultValue={initialData?.logo} />
        <div className="adm-field">
          <label htmlFor="eventDateLabel">Tarih etiketi</label>
          <input
            id="eventDateLabel"
            name="eventDateLabel"
            defaultValue={initialData?.eventDateLabel ?? ""}
            placeholder="ör. Mart 2025"
          />
        </div>
      </div>

      <fieldset className="adm-fieldset">
        <legend>Özet bilgiler (süre, katılımcı...)</legend>
        <RepeatableList<MetaRow>
          name="meta"
          addLabel="+ Bilgi ekle"
          initialItems={initialData?.meta ?? []}
          empty={{ label: "", value: "" }}
          renderRow={(item, update) => (
            <div className="adm-form-row">
              <input
                placeholder="Etiket (ör. Süre)"
                value={item.label}
                onChange={(e) => update({ label: e.target.value })}
              />
              <input
                placeholder="Değer (ör. 2 gün / 12 saat)"
                value={item.value}
                onChange={(e) => update({ value: e.target.value })}
              />
            </div>
          )}
        />
      </fieldset>

      <div className="adm-field">
        <label htmlFor="intro">Programın hikâyesi</label>
        <textarea id="intro" name="intro" defaultValue={initialData?.intro ?? ""} rows={4} />
      </div>

      <div className="adm-field">
        <label htmlFor="instructorNote">Eğitmen notu</label>
        <textarea
          id="instructorNote"
          name="instructorNote"
          defaultValue={initialData?.instructorNote ?? ""}
          rows={3}
        />
      </div>

      <fieldset className="adm-fieldset">
        <legend>Program akışı (segmentler)</legend>
        <RepeatableList<SegmentRow>
          name="segments"
          addLabel="+ Segment ekle"
          initialItems={initialData?.segments ?? []}
          empty={{ title: "", desc: "" }}
          renderRow={(item, update) => (
            <>
              <input
                placeholder="Segment başlığı"
                value={item.title}
                onChange={(e) => update({ title: e.target.value })}
              />
              <textarea
                placeholder="Açıklama"
                value={item.desc}
                rows={2}
                onChange={(e) => update({ desc: e.target.value })}
              />
            </>
          )}
        />
      </fieldset>

      <div className="adm-field">
        <label htmlFor="notes">Akılda kalanlar (her satıra bir not)</label>
        <textarea
          id="notes"
          name="notes"
          defaultValue={initialData?.notes.join("\n")}
          rows={5}
        />
      </div>

      <fieldset className="adm-fieldset">
        <legend>Galeri</legend>
        <GalleryImagesField
          name="gallery"
          textKey="caption"
          textPlaceholder="Alt yazı"
          initialItems={initialData?.gallery ?? []}
        />
      </fieldset>

      <div className="adm-field">
        <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <input
            type="checkbox"
            name="published"
            defaultChecked={initialData?.published ?? true}
            style={{ width: "auto" }}
          />
          Yayında (erişim koduyla görüntülenebilir)
        </label>
      </div>

      {state.error ? <p className="adm-form-error">{state.error}</p> : null}

      <div className="adm-savebar">
        <SubmitButton>Kaydet</SubmitButton>
      </div>
    </form>
  );
}
