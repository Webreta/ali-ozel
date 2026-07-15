"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { asc, eq, sql } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db";
import { galleryImages, gallerySections } from "@/db/schema";
import { requireUser } from "@/lib/auth/session";

export type GalleryFormState = {
  error?: string;
  fieldErrors?: Record<string, string>;
};

function revalidateGallery() {
  revalidateTag("gallery");
  revalidatePath("/galeri");
  revalidatePath("/admin/galeri");
}

function fieldErrors(error: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? "");
    if (key && !out[key]) out[key] = issue.message;
  }
  return out;
}

const sectionSchema = z.object({
  title: z.string().trim().min(2, "Bölüm adı gerekli").max(200),
  layout: z.enum(["grid", "masonry"]),
  columns: z.coerce.number().int().min(3).max(6),
  published: z.coerce.boolean(),
  images: z
    .string()
    .transform((s, ctx) => {
      try {
        return JSON.parse(s || "[]");
      } catch {
        ctx.addIssue({ code: "custom", message: "Geçersiz görsel verisi" });
        return z.NEVER;
      }
    })
    .pipe(z.array(z.object({ src: z.string(), alt: z.string() })))
    .transform((rows) =>
      rows
        .map((r) => ({ src: r.src.trim(), alt: r.alt.trim() }))
        .filter((r) => r.src)
    ),
});

function parseSectionForm(formData: FormData) {
  return sectionSchema.safeParse({
    title: formData.get("title"),
    layout: formData.get("layout"),
    columns: formData.get("columns"),
    published: formData.get("published") === "on",
    images: formData.get("images") ?? "[]",
  });
}

async function replaceImages(
  sectionId: number,
  images: { src: string; alt: string }[]
) {
  await db.delete(galleryImages).where(eq(galleryImages.sectionId, sectionId));
  if (images.length === 0) return;
  await db.insert(galleryImages).values(
    images.map((img, i) => ({
      sectionId,
      src: img.src,
      alt: img.alt || null,
      sortOrder: i,
    }))
  );
}

export async function createSection(
  _prev: GalleryFormState,
  formData: FormData
): Promise<GalleryFormState> {
  await requireUser();
  const parsed = parseSectionForm(formData);
  if (!parsed.success) return { fieldErrors: fieldErrors(parsed.error) };
  const d = parsed.data;

  const [{ max }] = await db
    .select({ max: sql<number>`coalesce(max(${gallerySections.sortOrder}), -1)` })
    .from(gallerySections);
  const [created] = await db
    .insert(gallerySections)
    .values({
      title: d.title,
      layout: d.layout,
      columns: d.columns,
      published: d.published,
      sortOrder: max + 1,
    })
    .returning({ id: gallerySections.id });
  await replaceImages(created.id, d.images);
  revalidateGallery();
  redirect("/admin/galeri?saved=1");
}

export async function updateSection(
  id: number,
  _prev: GalleryFormState,
  formData: FormData
): Promise<GalleryFormState> {
  await requireUser();
  const parsed = parseSectionForm(formData);
  if (!parsed.success) return { fieldErrors: fieldErrors(parsed.error) };
  const d = parsed.data;

  await db
    .update(gallerySections)
    .set({
      title: d.title,
      layout: d.layout,
      columns: d.columns,
      published: d.published,
      updatedAt: new Date(),
    })
    .where(eq(gallerySections.id, id));
  await replaceImages(id, d.images);
  revalidateGallery();
  redirect("/admin/galeri?saved=1");
}

export async function deleteSection(id: number): Promise<void> {
  await requireUser();
  // FK cascade — bölümle birlikte görsel kayıtları da silinir
  await db.delete(gallerySections).where(eq(gallerySections.id, id));
  revalidateGallery();
  redirect("/admin/galeri");
}

export async function moveSection(id: number, direction: "up" | "down") {
  await requireUser();
  const rows = await db
    .select({ id: gallerySections.id, sortOrder: gallerySections.sortOrder })
    .from(gallerySections)
    .orderBy(asc(gallerySections.sortOrder), asc(gallerySections.id));
  const idx = rows.findIndex((r) => r.id === id);
  const swap = direction === "up" ? idx - 1 : idx + 1;
  if (idx === -1 || swap < 0 || swap >= rows.length) return;
  await db.transaction(async (tx) => {
    await tx
      .update(gallerySections)
      .set({ sortOrder: rows[swap].sortOrder })
      .where(eq(gallerySections.id, rows[idx].id));
    await tx
      .update(gallerySections)
      .set({ sortOrder: rows[idx].sortOrder })
      .where(eq(gallerySections.id, rows[swap].id));
  });
  revalidateGallery();
}
