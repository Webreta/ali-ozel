"use client";

import { useActionState } from "react";
import Icon from "./Icon";
import {
  submitNoteComment,
  type CommentState,
} from "@/app/actions/noteAccess";

export default function NoteCommentForm({ noteId }: { noteId: number }) {
  const action = submitNoteComment.bind(null, noteId);
  const [state, formAction, pending] = useActionState<CommentState, FormData>(
    action,
    {}
  );

  if (state.ok) {
    return (
      <div className="ns-comment-form">
        <h3>Teşekkürler!</h3>
        <p style={{ color: "var(--muted)" }}>
          Yorumunuz alındı; onaylandıktan sonra burada görünecek.
        </p>
      </div>
    );
  }

  return (
    <form className="ns-comment-form" action={formAction}>
      <h3>Yorum bırakın</h3>
      <input type="text" name="name" placeholder="Adınız" aria-label="Adınız" required />
      <textarea
        name="body"
        rows={3}
        placeholder="Eğitimle ilgili yorumunuzu yazın..."
        aria-label="Yorumunuz"
        required
      />
      {state.error ? <span className="access-error">{state.error}</span> : null}
      <button type="submit" disabled={pending}>
        {pending ? "Gönderiliyor…" : "Yorum Gönder"}
        <Icon name="arrow-right" />
      </button>
    </form>
  );
}
