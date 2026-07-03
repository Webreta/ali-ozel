"use client";

import { useActionState } from "react";
import SubmitButton from "@/components/admin/SubmitButton";
import { changeOwnPassword, type PasswordState } from "./actions";

export default function PasswordForm() {
  const [state, formAction] = useActionState<PasswordState, FormData>(
    changeOwnPassword,
    {}
  );

  if (state.ok) {
    return (
      <p className="adm-form-error" style={{ background: "#e8f3ea", borderColor: "#cfe6d4", color: "#1e6b34" }}>
        ✓ Şifreniz güncellendi. Diğer cihazlardaki oturumlar kapatıldı.
      </p>
    );
  }

  return (
    <form action={formAction} className="adm-form" style={{ maxWidth: 420 }}>
      <div className="adm-field">
        <label htmlFor="current">Mevcut şifre</label>
        <input id="current" name="current" type="password" autoComplete="current-password" required />
      </div>
      <div className="adm-field">
        <label htmlFor="next">Yeni şifre</label>
        <input id="next" name="next" type="password" autoComplete="new-password" minLength={10} required />
        <span className="adm-hint">En az 10 karakter.</span>
      </div>
      <div className="adm-field">
        <label htmlFor="confirm">Yeni şifre (tekrar)</label>
        <input id="confirm" name="confirm" type="password" autoComplete="new-password" minLength={10} required />
      </div>
      {state.error ? <p className="adm-form-error">{state.error}</p> : null}
      <div className="adm-form-actions">
        <SubmitButton>Şifreyi güncelle</SubmitButton>
      </div>
    </form>
  );
}
