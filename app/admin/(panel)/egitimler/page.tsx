import type { Metadata } from "next";
import Link from "next/link";
import { asc, count, eq, ilike } from "drizzle-orm";
import { db } from "@/db";
import { categories, trainings } from "@/db/schema";
import { requireUser } from "@/lib/auth/session";
import Icon from "@/components/Icon";
import { moveCategory } from "./actions";

export const metadata: Metadata = { title: "Eğitimler" };

export default async function EgitimlerAdminPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  await requireUser();
  const { q } = await searchParams;
  const query = q?.trim();

  const found = query
    ? await db
        .select({
          id: trainings.id,
          title: trainings.title,
          slug: trainings.slug,
          published: trainings.published,
          categoryId: trainings.categoryId,
          categoryName: categories.shortName,
        })
        .from(trainings)
        .innerJoin(categories, eq(categories.id, trainings.categoryId))
        .where(ilike(trainings.title, `%${query}%`))
        .orderBy(asc(categories.sortOrder), asc(trainings.sortOrder))
    : [];

  const rows = await db
    .select({
      id: categories.id,
      slug: categories.slug,
      name: categories.name,
      shortName: categories.shortName,
      icon: categories.icon,
      published: categories.published,
      trainingCount: count(trainings.id),
    })
    .from(categories)
    .leftJoin(trainings, eq(trainings.categoryId, categories.id))
    .groupBy(categories.id)
    .orderBy(asc(categories.sortOrder), asc(categories.id));

  return (
    <>
      <div className="adm-page-head">
        <div>
          <h1>Eğitim kataloğu</h1>
          <p>
            {rows.length} kategori,{" "}
            {rows.reduce((n, r) => n + Number(r.trainingCount), 0)} eğitim
          </p>
        </div>
        <Link href="/admin/egitimler/yeni" className="btn btn-primary">
          <Icon name="plus" /> Yeni kategori
        </Link>
      </div>

      <div className="adm-card">
        <form method="get" className="adm-search">
          <input
            type="search"
            name="q"
            defaultValue={q ?? ""}
            placeholder="Eğitim adında ara… (ör. liderlik)"
            aria-label="Eğitimlerde ara"
          />
          <button type="submit" className="btn btn-outline">Ara</button>
        </form>

        {query ? (
          found.length === 0 ? (
            <div className="adm-empty">
              <Icon name="book" />
              <p>&quot;{query}&quot; ile eşleşen eğitim yok.</p>
            </div>
          ) : (
            <table className="adm-table" style={{ marginBottom: 18 }}>
              <thead>
                <tr>
                  <th>Eğitim</th>
                  <th>Kategori</th>
                  <th>Durum</th>
                </tr>
              </thead>
              <tbody>
                {found.map((t) => (
                  <tr key={t.id}>
                    <td>
                      <Link
                        href={`/admin/egitimler/${t.categoryId}/egitim/${t.id}`}
                        className="adm-row-link"
                      >
                        {t.title}
                      </Link>
                    </td>
                    <td>{t.categoryName}</td>
                    <td>
                      <span className={`adm-badge ${t.published ? "is-done" : "is-muted"}`}>
                        {t.published ? "Yayında" : "Gizli"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )
        ) : null}

        <table className="adm-table">
          <thead>
            <tr>
              <th style={{ width: 90 }}>Sıra</th>
              <th>Kategori</th>
              <th>Eğitim sayısı</th>
              <th>Durum</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((c, i) => (
              <tr key={c.id}>
                <td>
                  <div style={{ display: "flex", gap: 4 }}>
                    <form action={moveCategory.bind(null, c.id, "up")}>
                      <button type="submit" className="adm-icon-btn" disabled={i === 0} title="Yukarı">
                        ↑
                      </button>
                    </form>
                    <form action={moveCategory.bind(null, c.id, "down")}>
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
                  <Link href={`/admin/egitimler/${c.id}`} className="adm-row-link">
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                      <Icon name={c.icon} style={{ width: 16, height: 16 }} />
                      {c.name}
                    </span>
                  </Link>
                </td>
                <td>{c.trainingCount}</td>
                <td>
                  <span className={`adm-badge ${c.published ? "is-done" : "is-muted"}`}>
                    {c.published ? "Yayında" : "Gizli"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
