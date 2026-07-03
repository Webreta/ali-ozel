"use client";

import { useActionState, useEffect, useState } from "react";
import ImageField from "@/components/admin/ImageField";
import SubmitButton from "@/components/admin/SubmitButton";
import { createReference, type RefFormState } from "./actions";

export default function ReferenceForm() {
  const [state, formAction] = useActionState<RefFormState, FormData>(
    createReference,
    {}
  );
  // Başarılı eklemede formu (ImageField dahil) remount ederek sıfırla
  const [resetKey, setResetKey] = useState(0);
  useEffect(() => {
    if (state.ok) setResetKey((k) => k + 1);
  }, [state]);

  return (
    <form key={resetKey} action={formAction} className="adm-form">
      <div className="adm-form-row">
        <div className="adm-field">
          <label htmlFor="ref-name">Kurum adı</label>
          <input id="ref-name" name="name" required placeholder="ör. Vestel" />
        </div>
        <ImageField name="src" label="Logo" hint="PNG/WebP, şeffaf arka plan önerilir." />
      </div>
      {state.error ? <p className="adm-form-error">{state.error}</p> : null}
      <div className="adm-form-actions">
        <SubmitButton>Referans ekle</SubmitButton>
      </div>
    </form>
  );
}
