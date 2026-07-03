import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { asc, eq } from "drizzle-orm";
import { db } from "@/db";
import { categories, trainings, trainingPages } from "@/db/schema";
import { requireUser } from "@/lib/auth/session";
import Icon from "@/components/Icon";
import ConfirmDelete from "@/components/admin/ConfirmDelete";
import CategoryForm from "../CategoryForm";
import {
  updateCategory,
  deleteCategory,
  deleteTraining,
  moveTraining,
} from "../actions";

export const metadata: Metadata = { title: "Kategori" };

export default async function KategoriPage({
  params,
}: {
  params: Promise<{ categoryId: string }>;
}) {
  await requireUser();
  const { categoryId } = await params;
  const id = Number(categoryId);
  if (!Number.isInteger(id)) notFound();

  const [cat] = await db
    .select()
    .from(categories)
    .where(eq(categories.id, id))
    .limit(1);
  if (!cat) notFound();

  const rows = await db
    .select({
      id: trainings.id,
      slug: trainings.slug,
      title: trainings.title,
      published: trainings.published,
      hasPage: trainingPages.trainingId,
    })
    .from(trainings)
    .leftJoin(trainingPages, eq(trainingPages.trainingId, trainings.id))
    .where(eq(trainings.categoryId, id))
    .orderBy(asc(trainings.sortOrder), asc(trainings.id));

  return (
    <>
      <div className="adm-page-head">
        <div>
          <h1>{cat.name}</h1>
          <p>/egitimler/{cat.slug}</p>
        </div>
        <div className="adm-quick">
          <Link href={`/admin/egitimler/${id}/egitim/yeni`} className="btn btn-primary">
            <Icon name="plus" /> Yeni eğitim
          </Link>
          <Link href={`/egitimler/${cat.slug}`} target="_blank" className="btn btn-outline">
            <Icon name="arrow-up-right" /> Sitede gör
          </Link>
        </div>
      </div>

      <div className="adm-card">
        <h2>Eğitimler ({rows.length})</h2>
        {rows.length === 0 ? (
          <div className="adm-empty">
            <Icon name="book" />
            <p>Bu kategoride henüz eğitim yok.</p>
          </div>
        ) : (
          <table className="adm-table">
            <thead>
              <tr>
                <th style={{ width: 90 }}>Sıra</th>
                <th>Eğitim</th>
                <th>Detay sayfası</th>
                <th>Durum</th>
                <th style={{ width: 100 }}></th>
              </tr>
            </thead>
            <tbody>
              {rows.map((t, i) => (
                <tr key={t.id}>
                  <td>
                    <div style={{ display: "flex", gap: 4 }}>
                      <form action={moveTraining.bind(null, t.id, "up")}>
                        <button type="submit" className="adm-icon-btn" disabled={i === 0} title="Yukarı">
                          ↑
                        </button>
                      </form>
                      <form action={moveTraining.bind(null, t.id, "down")}>
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
                    <Link
                      href={`/admin/egitimler/${id}/egitim/${t.id}`}
                      className="adm-row-link"
                    >
                      {t.title}
                    </Link>
                  </td>
                  <td>
                    <span className={`adm-badge ${t.hasPage ? "is-done" : "is-muted"}`}>
                      {t.hasPage ? "Var" : "Yok"}
                    </span>
                  </td>
                  <td>
                    <span className={`adm-badge ${t.published ? "is-done" : "is-muted"}`}>
                      {t.published ? "Yayında" : "Gizli"}
                    </span>
                  </td>
                  <td style={{ textAlign: "right" }}>
                    <ConfirmDelete
                      action={deleteTraining.bind(null, t.id)}
                      confirmText={`"${t.title}" eğitimi silinecek. Emin misiniz?`}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="adm-card">
        <h2>Kategori bilgileri</h2>
        <CategoryForm action={updateCategory.bind(null, id)} initialData={cat} />
      </div>

      {rows.length === 0 ? (
        <div className="adm-form-actions">
          <ConfirmDelete
            action={deleteCategory.bind(null, id)}
            label="Kategoriyi sil"
            confirmText={`"${cat.name}" kategorisi silinecek. Emin misiniz?`}
          />
        </div>
      ) : null}
    </>
  );
}
