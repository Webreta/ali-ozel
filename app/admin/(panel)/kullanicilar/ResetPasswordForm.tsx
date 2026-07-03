"use client";

import { useActionState } from "react";
import { resetPassword, type UserFormState } from "./actions";

export default function ResetPasswordForm({ userId }: { userId: string }) {
  const action = resetPassword.bind(null, userId);
  const [state, formAction, pending] = useActionState<UserFormState, FormData>(
    action,
    {}
  );

  if (state.ok) {
    return <span className="adm-hint">Şifre güncellendi; oturumları kapatıldı.</span>;
  }

  return (
    <form action={formAction} style={{ display: "inline-flex", gap: 8 }}>
      <input
        name="password"
        type="password"
        placeholder="Yeni şifre"
        minLength={10}
        required
        style={{
          padding: "6px 10px",
          border: "1px solid var(--line-strong)",
          borderRadius: 8,
          font: "inherit",
          fontSize: "0.85rem",
        }}
      />
      <button type="submit" className="btn btn-outline" disabled={pending}>
        {pending ? "…" : "Şifre sıfırla"}
      </button>
      {state.error ? <span className="adm-field-error">{state.error}</span> : null}
    </form>
  );
}
