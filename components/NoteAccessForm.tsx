"use client";

import { useActionState } from "react";
import Icon from "./Icon";
import { submitAccessCode, type AccessState } from "@/app/actions/noteAccess";

export default function NoteAccessForm() {
  const [state, formAction, pending] = useActionState<AccessState, FormData>(
    submitAccessCode,
    {}
  );

  return (
    <form className="access-form" action={formAction}>
      <div className="access-input-row">
        <input
          type="text"
          name="code"
          placeholder="Erişim kodunuzu girin"
          aria-label="Erişim kodu"
          className={state.error ? "is-error" : ""}
          required
        />
        <button
          type="submit"
          disabled={pending}
          data-ev="note:code-try"
          data-ev-label="Erişim kodu denemesi"
        >
          {pending ? "Kontrol ediliyor…" : "Görüntüle"}
          <Icon name="arrow-right" />
        </button>
      </div>
      {state.error && <span className="access-error">{state.error}</span>}
    </form>
  );
}
