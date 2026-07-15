import type { Metadata } from "next";
import Link from "next/link";
import { asc, eq, sql } from "drizzle-orm";
import { db } from "@/db";
import { galleryImages, gallerySections } from "@/db/schema";
import { requireUser } from "@/lib/auth/session";
import Icon from "@/components/Icon";
import { moveSection } from "./actions";

export const metadata: Metadata = { title: "Galeri" };

export default async function GaleriAdminPage() {
  await requireUser();

  const rows = await db
    .select({
      id: gallerySections.id,
      title: gallerySections.title,
      layout: gallerySections.layout,
      columns: gallerySections.columns,
      published: gallerySections.published,
      imageCount: sql<number>`count(${galleryImages.id})`,
    })
    .from(gallerySections)
    .leftJoin(galleryImages, eq(galleryImages.sectionId, gallerySections.id))
    .groupBy(gallerySections.id)
    .orderBy(asc(gallerySections.sortOrder), asc(gallerySections.id));

  return (
    <>
      <div className="adm-page-head">
        <div>
          <h1>Galeri</h1>
          <p>Bölümler galeri sayfasında tab olarak görünür.</p>
        </div>
        <div className="adm-quick">
          <Link href="/admin/galeri/yeni" className="btn btn-primary">
            <Icon name="plus" /> Yeni bölüm
          </Link>
          <Link href="/galeri" target="_blank" className="btn btn-outline">
            <Icon name="arrow-up-right" /> Sitede gör
          </Link>
        </div>
      </div>

      <div className="adm-card">
        <h2>Bölümler ({rows.length})</h2>
        {rows.length === 0 ? (
          <div className="adm-empty">
            <Icon name="layers" />
            <p>Henüz galeri bölümü yok.</p>
          </div>
        ) : (
          <table className="adm-table">
            <thead>
              <tr>
                <th style={{ width: 90 }}>Sıra</th>
                <th>Bölüm</th>
                <th>Dizilim</th>
                <th>Görsel</th>
                <th>Durum</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((s, i) => (
                <tr key={s.id}>
                  <td>
                    <div style={{ display: "flex", gap: 4 }}>
                      <form action={moveSection.bind(null, s.id, "up")}>
                        <button
                          type="submit"
                          className="adm-icon-btn"
                          disabled={i === 0}
                          title="Yukarı"
                        >
                          ↑
                        </button>
                      </form>
                      <form action={moveSection.bind(null, s.id, "down")}>
                        <button
                          type="submit"
                          className="adm-icon-btn"
                          disabled={i === rows.length - 1}
                          title="Aşağı"
                        >
                          ↓
                        </button>
                      </form>
                    </div>
                  </td>
                  <td>
                    <Link href={`/admin/galeri/${s.id}`} className="adm-row-link">
                      {s.title}
                    </Link>
                  </td>
                  <td>
                    {s.layout === "grid" ? "Kare grid" : "Masonry"} ·{" "}
                    {s.columns} sütun
                  </td>
                  <td>{s.imageCount}</td>
                  <td>
                    <span
                      className={`adm-badge ${s.published ? "is-done" : "is-muted"}`}
                    >
                      {s.published ? "Yayında" : "Gizli"}
                    </span>
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
