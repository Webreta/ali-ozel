"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Icon from "./Icon";

// kod → firma sayfası eşlemesi (yeni firma ekledikçe buraya kod eklenir)
const CODES: Record<string, string> = {
  "VESTEL-2025": "vestel",
};

export default function NoteAccessForm() {
  const [value, setValue] = useState("");
  const [error, setError] = useState(false);
  const router = useRouter();

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const slug = CODES[value.trim().toUpperCase()];
    if (slug) {
      router.push(`/egitim-notlari/${slug}`);
    } else {
      setError(true);
    }
  };

  return (
    <form className="access-form" onSubmit={submit}>
      <div className="access-input-row">
        <input
          type="text"
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            if (error) setError(false);
          }}
          placeholder="Erişim kodunuzu girin"
          aria-label="Erişim kodu"
          className={error ? "is-error" : ""}
        />
        <button type="submit">
          Görüntüle
          <Icon name="arrow-right" />
        </button>
      </div>
      {error && (
        <span className="access-error">
          Bu koda ait bir eğitim notu bulunamadı. Kodu kontrol edin.
        </span>
      )}
    </form>
  );
}
