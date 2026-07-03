"use client";

import { useActionState, useState } from "react";
import SubmitButton from "@/components/admin/SubmitButton";
import RepeatableList from "@/components/admin/RepeatableList";
import type { CatalogFormState } from "./actions";

type SectionRow = { title: string; intro: string; bullets: string };
type FaqRow = { q: string; a: string };
type FormatRow = { label: string; value: string };

export type TrainingFormData = {
  title: string;
  blurb: string;
  published: boolean;
  page: {
    seoTitle: string;
    seoDescription: string;
    heroQuote: string;
    audience: string;
    intro: string[];
    sections: { title: string; intro: string; bullets: string[] }[];
    outcomes: string[];
    format: FormatRow[];
    faq: FaqRow[];
  } | null;
};

export default function TrainingForm({
  action,
  initialData,
}: {
  action: (
    prev: CatalogFormState,
    formData: FormData
  ) => Promise<CatalogFormState>;
  initialData?: TrainingFormData;
}) {
  const [state, formAction] = useActionState<CatalogFormState, FormData>(
    action,
    {}
  );
  const [hasPage, setHasPage] = useState(Boolean(initialData?.page));
  const err = state.fieldErrors ?? {};
  const p = initialData?.page;

  return (
    <form action={formAction} className="adm-form" style={{ maxWidth: 900 }}>
      <div className="adm-field">
        <label htmlFor="title">Eğitim adı</label>
        <input id="title" name="title" defaultValue={initialData?.title} required />
        {err.title ? <span className="adm-field-error">{err.title}</span> : null}
        {!initialData ? (
          <span className="adm-hint">Adres addan otomatik üretilir ve değişmez.</span>
        ) : null}
      </div>

      <div className="adm-field">
        <label htmlFor="blurb">Kart açıklaması</label>
        <textarea
          id="blurb"
          name="blurb"
          defaultValue={initialData?.blurb}
          rows={2}
          required
          placeholder="Liste kartlarında görünen 1-2 cümle"
        />
        {err.blurb ? <span className="adm-field-error">{err.blurb}</span> : null}
      </div>

      <div className="adm-form-row">
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
        <div className="adm-field">
          <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <input
              type="checkbox"
              name="hasPage"
              checked={hasPage}
              onChange={(e) => setHasPage(e.target.checked)}
              style={{ width: "auto" }}
            />
            Detay sayfası var
          </label>
          <span className="adm-hint">
            Kapalıysa eğitim kartına tıklayan ziyaretçi &quot;içerik hazırlanıyor&quot;
            sayfası görür.
          </span>
        </div>
      </div>

      {hasPage ? (
        <>
          <fieldset className="adm-fieldset">
            <legend>Giriş</legend>
            <div className="adm-field">
              <label htmlFor="heroQuote">Vurucu söz (hero alıntısı)</label>
              <input id="heroQuote" name="heroQuote" defaultValue={p?.heroQuote} />
            </div>
            <div className="adm-field">
              <label htmlFor="intro">Giriş paragrafları (boş satırla ayırın)</label>
              <textarea
                id="intro"
                name="intro"
                defaultValue={p?.intro.join("\n\n")}
                rows={5}
              />
            </div>
            <div className="adm-field">
              <label htmlFor="audience">Kimler için?</label>
              <textarea id="audience" name="audience" defaultValue={p?.audience} rows={2} />
            </div>
          </fieldset>

          <fieldset className="adm-fieldset">
            <legend>Program modülleri</legend>
            <RepeatableList<SectionRow>
              name="sections"
              addLabel="+ Modül ekle"
              initialItems={
                p?.sections.map((s) => ({
                  title: s.title,
                  intro: s.intro,
                  bullets: s.bullets.join("\n"),
                })) ?? []
              }
              empty={{ title: "", intro: "", bullets: "" }}
              renderRow={(item, update) => (
                <>
                  <input
                    placeholder="Modül başlığı"
                    value={item.title}
                    onChange={(e) => update({ title: e.target.value })}
                  />
                  <textarea
                    placeholder="Modül tanıtım cümlesi"
                    value={item.intro}
                    rows={2}
                    onChange={(e) => update({ intro: e.target.value })}
                  />
                  <textarea
                    placeholder={"Alt maddeler — her satıra bir madde"}
                    value={item.bullets}
                    rows={3}
                    onChange={(e) => update({ bullets: e.target.value })}
                  />
                </>
              )}
            />
          </fieldset>

          <fieldset className="adm-fieldset">
            <legend>Kazanımlar</legend>
            <div className="adm-field">
              <label htmlFor="outcomes">Her satıra bir kazanım</label>
              <textarea
                id="outcomes"
                name="outcomes"
                defaultValue={p?.outcomes.join("\n")}
                rows={5}
              />
            </div>
          </fieldset>

          <fieldset className="adm-fieldset">
            <legend>Eğitim bilgileri (süre, format...)</legend>
            <RepeatableList<FormatRow>
              name="format"
              addLabel="+ Bilgi ekle"
              initialItems={p?.format ?? []}
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

          <fieldset className="adm-fieldset">
            <legend>Sık sorulan sorular</legend>
            <RepeatableList<FaqRow>
              name="faq"
              addLabel="+ Soru ekle"
              initialItems={p?.faq ?? []}
              empty={{ q: "", a: "" }}
              renderRow={(item, update) => (
                <>
                  <input
                    placeholder="Soru"
                    value={item.q}
                    onChange={(e) => update({ q: e.target.value })}
                  />
                  <textarea
                    placeholder="Yanıt"
                    value={item.a}
                    rows={2}
                    onChange={(e) => update({ a: e.target.value })}
                  />
                </>
              )}
            />
          </fieldset>

          <details className="adm-details">
            <summary>SEO ayarları (isteğe bağlı)</summary>
            <div className="adm-form" style={{ paddingTop: 14 }}>
              <div className="adm-field">
                <label htmlFor="seoTitle">SEO başlığı</label>
                <input id="seoTitle" name="seoTitle" defaultValue={p?.seoTitle} />
              </div>
              <div className="adm-field">
                <label htmlFor="seoDescription">SEO açıklaması</label>
                <textarea
                  id="seoDescription"
                  name="seoDescription"
                  defaultValue={p?.seoDescription}
                  rows={2}
                />
              </div>
            </div>
          </details>
        </>
      ) : null}

      {state.error ? <p className="adm-form-error">{state.error}</p> : null}
      {/* Görünen alanlara bağlanamayan doğrulama hataları sessiz kalmasın */}
      {!state.error && Object.keys(err).some((k) => !["title", "blurb"].includes(k)) ? (
        <p className="adm-form-error">
          Formda düzeltilmesi gereken alanlar var:{" "}
          {Object.entries(err)
            .map(([k, v]) => `${k}: ${v}`)
            .join(" · ")}
        </p>
      ) : null}

      <div className="adm-savebar">
        <SubmitButton>Kaydet</SubmitButton>
      </div>
    </form>
  );
}
