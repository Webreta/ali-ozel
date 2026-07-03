"use client";

import { useActionState, useEffect, useState } from "react";
import SubmitButton from "@/components/admin/SubmitButton";
import { createUser, type UserFormState } from "./actions";

export default function UserForm() {
  const [state, formAction] = useActionState<UserFormState, FormData>(
    createUser,
    {}
  );
  const [resetKey, setResetKey] = useState(0);
  useEffect(() => {
    if (state.ok) setResetKey((k) => k + 1);
  }, [state]);
  const err = state.fieldErrors ?? {};

  return (
    <form key={resetKey} action={formAction} className="adm-form">
      <div className="adm-form-row">
        <div className="adm-field">
          <label htmlFor="u-name">Ad Soyad</label>
          <input id="u-name" name="name" required />
          {err.name ? <span className="adm-field-error">{err.name}</span> : null}
        </div>
        <div className="adm-field">
          <label htmlFor="u-email">E-posta</label>
          <input id="u-email" name="email" type="email" required />
          {err.email ? <span className="adm-field-error">{err.email}</span> : null}
        </div>
      </div>
      <div className="adm-form-row">
        <div className="adm-field">
          <label htmlFor="u-password">Şifre</label>
          <input id="u-password" name="password" type="password" minLength={10} required />
          {err.password ? (
            <span className="adm-field-error">{err.password}</span>
          ) : (
            <span className="adm-hint">En az 10 karakter.</span>
          )}
        </div>
        <div className="adm-field">
          <label htmlFor="u-role">Rol</label>
          <select id="u-role" name="role" defaultValue="editor">
            <option value="editor">Editör — içerik yönetimi</option>
            <option value="admin">Yönetici — her şey + talepler + kullanıcılar</option>
          </select>
        </div>
      </div>
      {state.error ? <p className="adm-form-error">{state.error}</p> : null}
      <div className="adm-form-actions">
        <SubmitButton>Kullanıcı ekle</SubmitButton>
      </div>
    </form>
  );
}
