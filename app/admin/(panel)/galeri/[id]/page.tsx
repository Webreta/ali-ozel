import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { asc, eq } from "drizzle-orm";
import { db } from "@/db";
import { galleryImages, gallerySections } from "@/db/schema";
import { requireUser } from "@/lib/auth/session";
import ConfirmDelete from "@/components/admin/ConfirmDelete";
import SectionForm from "../SectionForm";
import { deleteSection, updateSection } from "../actions";

export const metadata: Metadata = { title: "Galeri Bölümü" };

export default async function BolumPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireUser();
  const { id: idParam } = await params;
  const id = Number(idParam);
  if (!Number.isInteger(id)) notFound();

  const [section] = await db
    .select()
    .from(gallerySections)
    .where(eq(gallerySections.id, id))
    .limit(1);
  if (!section) notFound();

  const images = await db
    .select({ src: galleryImages.src, alt: galleryImages.alt })
    .from(galleryImages)
    .where(eq(galleryImages.sectionId, id))
    .orderBy(asc(galleryImages.sortOrder), asc(galleryImages.id));

  return (
    <>
      <div className="adm-page-head">
        <div>
          <h1>{section.title}</h1>
          <p>Galeri bölümü — {images.length} görsel</p>
        </div>
      </div>
      <div className="adm-card">
        <SectionForm
          action={updateSection.bind(null, id)}
          initialData={{
            title: section.title,
            layout: section.layout,
            columns: section.columns,
            published: section.published,
            images: images.map((i) => ({ src: i.src, alt: i.alt ?? "" })),
          }}
        />
      </div>
      <div className="adm-form-actions">
        <ConfirmDelete
          action={deleteSection.bind(null, id)}
          label="Bölümü sil"
          confirmText={`"${section.title}" bölümü ve içindeki görsel kayıtları silinecek. Emin misiniz?`}
        />
      </div>
    </>
  );
}
