import type { Metadata } from "next";
import Link from "next/link";
import { desc } from "drizzle-orm";
import { db } from "@/db";
import { blogPosts } from "@/db/schema";
import { requireUser } from "@/lib/auth/session";
import Icon from "@/components/Icon";
import ConfirmDelete from "@/components/admin/ConfirmDelete";
import { deletePost } from "./actions";

export const metadata: Metadata = { title: "Blog" };

export default async function BlogAdminPage() {
  await requireUser();
  const rows = await db
    .select()
    .from(blogPosts)
    .orderBy(desc(blogPosts.createdAt));

  return (
    <>
      <div className="adm-page-head">
        <div>
          <h1>Blog</h1>
          <p>{rows.length} yazı</p>
        </div>
        <Link href="/admin/blog/yeni" className="btn btn-primary">
          <Icon name="plus" /> Yeni yazı
        </Link>
      </div>

      <div className="adm-card">
        {rows.length === 0 ? (
          <div className="adm-empty">
            <Icon name="megaphone" />
            <p>Henüz yazı yok. İlk blog yazınızı ekleyin.</p>
          </div>
        ) : (
          <table className="adm-table">
            <thead>
              <tr>
                <th>Başlık</th>
                <th>Adres</th>
                <th>Durum</th>
                <th>Tarih</th>
                <th style={{ width: 120 }}></th>
              </tr>
            </thead>
            <tbody>
              {rows.map((p) => (
                <tr key={p.id}>
                  <td>
                    <Link href={`/admin/blog/${p.id}`} className="adm-row-link">
                      {p.title}
                    </Link>
                  </td>
                  <td style={{ color: "var(--muted)" }}>/blog/{p.slug}</td>
                  <td>
                    <span className={`adm-badge ${p.status === "published" ? "is-done" : "is-muted"}`}>
                      {p.status === "published" ? "Yayında" : "Taslak"}
                    </span>
                  </td>
                  <td>
                    {(p.publishedAt ?? p.createdAt).toLocaleDateString("tr-TR", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td style={{ textAlign: "right" }}>
                    <ConfirmDelete
                      action={deletePost.bind(null, p.id)}
                      confirmText={`"${p.title}" yazısı silinecek. Emin misiniz?`}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}
