"use client";

import { useActionState } from "react";
import SubmitButton from "@/components/admin/SubmitButton";
import Icon from "@/components/Icon";
import type { CatalogFormState } from "./actions";

const ICONS = [
  "compass", "cog", "helmet", "trending", "users", "building",
  "cpu", "book", "megaphone", "chart", "wrench", "target",
  "layers", "shield", "sparkle",
];

type Category = {
  name: string;
  shortName: string;
  icon: string;
  tagline: string;
  summary: string;
  forWhom: string[];
  published: boolean;
};

export default function CategoryForm({
  action,
  initialData,
}: {
  action: (
    prev: CatalogFormState,
    formData: FormData
  ) => Promise<CatalogFormState>;
  initialData?: Category;
}) {
  const [state, formAction] = useActionState<CatalogFormState, FormData>(
    action,
    {}
  );
  const err = state.fieldErrors ?? {};

  return (
    <form action={formAction} className="adm-form">
      <div className="adm-form-row">
        <div className="adm-field">
          <label htmlFor="name">Kategori adı</label>
          <input id="name" name="name" defaultValue={initialData?.name} required />
          {err.name ? <span className="adm-field-error">{err.name}</span> : null}
          {!initialData ? (
            <span className="adm-hint">Adres addan otomatik üretilir ve değişmez.</span>
          ) : null}
        </div>
        <div className="adm-field">
          <label htmlFor="shortName">Kısa ad</label>
          <input
            id="shortName"
            name="shortName"
            defaultValue={initialData?.shortName}
            placeholder="Menüde görünen ad"
            required
          />
          {err.shortName ? (
            <span className="adm-field-error">{err.shortName}</span>
          ) : null}
        </div>
      </div>

      <div className="adm-form-row">
        <div className="adm-field">
          <label htmlFor="icon">İkon</label>
          <select id="icon" name="icon" defaultValue={initialData?.icon ?? "compass"}>
            {ICONS.map((i) => (
              <option key={i} value={i}>
                {i}
              </option>
            ))}
          </select>
          <span className="adm-hint" style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 4 }}>
            {ICONS.map((i) => (
              <Icon key={i} name={i} style={{ width: 16, height: 16 }} />
            ))}
          </span>
        </div>
        <div className="adm-field">
          <label htmlFor="tagline">Slogan</label>
          <input
            id="tagline"
            name="tagline"
            defaultValue={initialData?.tagline}
            placeholder="Menüde ikonun altındaki kısa cümle"
            required
          />
          {err.tagline ? <span className="adm-field-error">{err.tagline}</span> : null}
        </div>
      </div>

      <div className="adm-field">
        <label htmlFor="summary">Özet</label>
        <textarea id="summary" name="summary" defaultValue={initialData?.summary} required />
        {err.summary ? <span className="adm-field-error">{err.summary}</span> : null}
      </div>

      <div className="adm-field">
        <label htmlFor="forWhom">Kimler için? (her satıra bir madde)</label>
        <textarea
          id="forWhom"
          name="forWhom"
          defaultValue={initialData?.forWhom.join("\n")}
          placeholder={"Vardiya liderleri\nFormenler\nTakım liderleri"}
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
