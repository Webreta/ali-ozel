import type { Metadata } from "next";
import { asc } from "drizzle-orm";
import { db } from "@/db";
import { users } from "@/db/schema";
import { requireAdmin } from "@/lib/auth/session";
import ConfirmDelete from "@/components/admin/ConfirmDelete";
import UserForm from "./UserForm";
import ResetPasswordForm from "./ResetPasswordForm";
import { deleteUser, setUserRole } from "./actions";

export const metadata: Metadata = { title: "Kullanıcılar" };

export default async function KullanicilarPage() {
  const me = await requireAdmin();
  const rows = await db.select().from(users).orderBy(asc(users.createdAt));

  return (
    <>
      <div className="adm-page-head">
        <div>
          <h1>Kullanıcılar</h1>
          <p>
            {rows.length} hesap — yönetici her şeyi, editör yalnızca içerikleri
            yönetir.
          </p>
        </div>
      </div>

      <div className="adm-card">
        <h2>Yeni kullanıcı</h2>
        <UserForm />
      </div>

      <div className="adm-card">
        <table className="adm-table">
          <thead>
            <tr>
              <th>Ad</th>
              <th>E-posta</th>
              <th>Rol</th>
              <th style={{ width: 360 }}></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((u) => {
              const isMe = u.id === me.id;
              return (
                <tr key={u.id}>
                  <td>
                    {u.name}
                    {isMe ? <span className="adm-hint"> (siz)</span> : null}
                  </td>
                  <td>{u.email}</td>
                  <td>
                    <span className={`adm-badge ${u.role === "admin" ? "is-new" : "is-muted"}`}>
                      {u.role === "admin" ? "Yönetici" : "Editör"}
                    </span>
                  </td>
                  <td style={{ textAlign: "right" }}>
                    <div style={{ display: "inline-flex", gap: 8, flexWrap: "wrap", justifyContent: "flex-end" }}>
                      <ResetPasswordForm userId={u.id} />
                      {!isMe ? (
                        <>
                          <form
                            action={setUserRole.bind(
                              null,
                              u.id,
                              u.role === "admin" ? "editor" : "admin"
                            )}
                          >
                            <button type="submit" className="btn btn-outline">
                              {u.role === "admin" ? "Editör yap" : "Yönetici yap"}
                            </button>
                          </form>
                          <ConfirmDelete
                            action={deleteUser.bind(null, u.id)}
                            confirmText={`"${u.name}" hesabı silinecek. Emin misiniz?`}
                          />
                        </>
                      ) : null}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}
