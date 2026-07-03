import type { Metadata } from "next";
import Link from "next/link";
import { asc } from "drizzle-orm";
import { db } from "@/db";
import { teamMembers } from "@/db/schema";
import { requireUser } from "@/lib/auth/session";
import Icon from "@/components/Icon";
import ConfirmDelete from "@/components/admin/ConfirmDelete";
import { deleteMember, moveMember } from "./actions";

export const metadata: Metadata = { title: "Ekip" };

export default async function EkipPage() {
  await requireUser();
  const rows = await db
    .select()
    .from(teamMembers)
    .orderBy(asc(teamMembers.sortOrder), asc(teamMembers.id));

  return (
    <>
      <div className="adm-page-head">
        <div>
          <h1>Ekip</h1>
          <p>{rows.length} üye — sıralama sitedeki görünüm sırasıdır.</p>
        </div>
        <Link href="/admin/ekip/yeni" className="btn btn-primary">
          <Icon name="plus" /> Yeni üye
        </Link>
      </div>

      <div className="adm-card">
        <table className="adm-table">
          <thead>
            <tr>
              <th style={{ width: 90 }}>Sıra</th>
              <th>Ad</th>
              <th>Unvan</th>
              <th>Durum</th>
              <th style={{ width: 160 }}></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((m, i) => (
              <tr key={m.id}>
                <td>
                  <div style={{ display: "flex", gap: 4 }}>
                    <form action={moveMember.bind(null, m.id, "up")}>
                      <button
                        type="submit"
                        className="adm-icon-btn"
                        disabled={i === 0}
                        title="Yukarı taşı"
                      >
                        ↑
                      </button>
                    </form>
                    <form action={moveMember.bind(null, m.id, "down")}>
                      <button
                        type="submit"
                        className="adm-icon-btn"
                        disabled={i === rows.length - 1}
                        title="Aşağı taşı"
                      >
                        ↓
                      </button>
                    </form>
                  </div>
                </td>
                <td>
                  <Link href={`/admin/ekip/${m.id}`} className="adm-row-link">
                    {m.name}
                  </Link>
                </td>
                <td>{m.roleTitle}</td>
                <td>
                  <span className={`adm-badge ${m.published ? "is-done" : "is-muted"}`}>
                    {m.published ? "Yayında" : "Gizli"}
                  </span>
                </td>
                <td style={{ textAlign: "right" }}>
                  <ConfirmDelete
                    action={deleteMember.bind(null, m.id)}
                    confirmText={`"${m.name}" ekipten silinecek. Emin misiniz?`}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
