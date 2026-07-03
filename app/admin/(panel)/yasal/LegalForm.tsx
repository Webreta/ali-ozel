"use client";

import { useActionState } from "react";
import SubmitButton from "@/components/admin/SubmitButton";
import type { LegalFormState } from "./actions";

export default function LegalForm({
  action,
  initialData,
  submitLabel = "Sayfayı ekle",
}: {
  action: (prev: LegalFormState, formData: FormData) => Promise<LegalFormState>;
  initialData?: { title: string; body: string };
  submitLabel?: string;
}) {
  const [state, formAction] = useActionState<LegalFormState, FormData>(
    action,
    {}
  );

  return (
    <form action={formAction} className="adm-form" style={{ maxWidth: 820 }}>
      <div className="adm-field">
        <label htmlFor="legal-title">Başlık</label>
        <input
          id="legal-title"
          name="title"
          defaultValue={initialData?.title}
          placeholder="Örn. Gizlilik Politikası"
          required
        />
        {!initialData ? (
          <span className="adm-hint">URL otomatik bu başlıktan üretilir.</span>
        ) : null}
      </div>
      <div className="adm-field">
        <label htmlFor="legal-body">Metin</label>
        <textarea
          id="legal-body"
          name="body"
          defaultValue={initialData?.body}
          rows={14}
          placeholder="Sayfanın gövdesi"
          required
        />
        <span className="adm-hint">
          Boş satır = paragraf ayracı. Tek satır boşluğu yeni satır olarak korunur.
        </span>
      </div>
      {state.error ? <p className="adm-form-error">{state.error}</p> : null}
      <div className="adm-form-actions">
        <SubmitButton>{submitLabel}</SubmitButton>
      </div>
    </form>
  );
}
