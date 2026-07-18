"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import ConfirmDelete from "@/components/admin/ConfirmDelete";
import { deleteReference, reorderReferences, toggleReference } from "./actions";

type Row = { id: number; name: string; src: string; published: boolean };

export default function ReferenceGrid({ rows }: { rows: Row[] }) {
  const [order, setOrder] = useState(rows);
  const [dragId, setDragId] = useState<number | null>(null);
  const [pending, startTransition] = useTransition();
  // Sunucudan yeni liste gelince (ekleme/silme/kayıt) yerel sırayı tazele
  const serverKey = rows.map((r) => r.id).join(",");
  const lastKey = useRef(serverKey);
  useEffect(() => {
    if (lastKey.current !== serverKey) {
      lastKey.current = serverKey;
      setOrder(rows);
    }
  }, [serverKey, rows]);

  function handleDragOver(overId: number) {
    if (dragId === null || dragId === overId) return;
    setOrder((prev) => {
      const from = prev.findIndex((r) => r.id === dragId);
      const to = prev.findIndex((r) => r.id === overId);
      if (from === -1 || to === -1) return prev;
      const next = [...prev];
      const [moved] = next.splice(from, 1);
      next.splice(to, 0, moved);
      return next;
    });
  }

  function handleDrop() {
    if (dragId === null) return;
    setDragId(null);
    startTransition(() => reorderReferences(order.map((r) => r.id)));
  }

  return (
    <div className={`adm-ref-grid${pending ? " is-saving" : ""}`}>
      {order.map((r) => (
        <figure
          className={`adm-ref-cell${dragId === r.id ? " is-dragging" : ""}`}
          key={r.id}
          draggable
          onDragStart={(e) => {
            setDragId(r.id);
            e.dataTransfer.effectAllowed = "move";
          }}
          onDragOver={(e) => {
            e.preventDefault();
            handleDragOver(r.id);
          }}
          onDrop={(e) => {
            e.preventDefault();
            handleDrop();
          }}
          onDragEnd={handleDrop}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={r.src} alt={r.name} />
          <figcaption>{r.name}</figcaption>
          <span className={`adm-badge ${r.published ? "is-done" : "is-muted"}`}>
            {r.published ? "Yayında" : "Gizli"}
          </span>
          <div className="adm-ref-actions">
            <form action={toggleReference.bind(null, r.id, !r.published)}>
              <button
                type="submit"
                className="adm-icon-btn"
                title={r.published ? "Gizle" : "Yayınla"}
              >
                {r.published ? "◎" : "○"}
              </button>
            </form>
            <ConfirmDelete
              action={deleteReference.bind(null, r.id)}
              label="Sil"
              confirmText={`"${r.name}" logosu silinecek. Emin misiniz?`}
            />
          </div>
        </figure>
      ))}
    </div>
  );
}
