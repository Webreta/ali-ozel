"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { and, asc, eq, sql } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db";
import { categories, trainings, trainingPages } from "@/db/schema";
import { requireUser } from "@/lib/auth/session";
import { slugify } from "@/lib/slug";

export type CatalogFormState = {
  error?: string;
  fieldErrors?: Record<string, string>;
};

function revalidateCatalog() {
  revalidateTag("catalog");
  revalidatePath("/");
  revalidatePath("/egitimler");
  revalidatePath("/egitimler/[category]", "page");
  revalidatePath("/egitimler/[category]/[training]", "page");
  revalidatePath("/admin/egitimler");
}

function fieldErrors(error: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? "");
    if (key && !out[key]) out[key] = issue.message;
  }
  return out;
}

// ---------- Kategori ----------

const categorySchema = z.object({
  name: z.string().trim().min(3, "Kategori adı gerekli").max(200),
  shortName: z.string().trim().min(2, "Kısa ad gerekli").max(100),
  icon: z.string().trim().min(1, "İkon seçin").max(50),
  tagline: z.string().trim().min(2, "Slogan gerekli").max(200),
  summary: z.string().trim().min(10, "Özet gerekli").max(2000),
  forWhom: z
    .string()
    .transform((s) => s.split("\n").map((l) => l.trim()).filter(Boolean)),
  published: z.coerce.boolean(),
});

function parseCategoryForm(formData: FormData) {
  return categorySchema.safeParse({
    name: formData.get("name"),
    shortName: formData.get("shortName"),
    icon: formData.get("icon"),
    tagline: formData.get("tagline"),
    summary: formData.get("summary"),
    forWhom: formData.get("forWhom") ?? "",
    published: formData.get("published") === "on",
  });
}

export async function createCategory(
  _prev: CatalogFormState,
  formData: FormData
): Promise<CatalogFormState> {
  await requireUser();
  const parsed = parseCategoryForm(formData);
  if (!parsed.success) return { fieldErrors: fieldErrors(parsed.error) };
  const d = parsed.data;

  const slug = slugify(d.name);
  const [existing] = await db
    .select({ id: categories.id })
    .from(categories)
    .where(eq(categories.slug, slug))
    .limit(1);
  if (existing) return { fieldErrors: { name: "Bu adla bir kategori zaten var" } };

  const [{ max }] = await db
    .select({ max: sql<number>`coalesce(max(${categories.sortOrder}), -1)` })
    .from(categories);
  await db.insert(categories).values({ ...d, slug, sortOrder: max + 1 });
  revalidateCatalog();
  redirect("/admin/egitimler?saved=1");
}

export async function updateCategory(
  id: number,
  _prev: CatalogFormState,
  formData: FormData
): Promise<CatalogFormState> {
  await requireUser();
  const parsed = parseCategoryForm(formData);
  if (!parsed.success) return { fieldErrors: fieldErrors(parsed.error) };

  // Slug OLUŞTURULDUĞU GİBİ KALIR (SEO)
  await db
    .update(categories)
    .set({ ...parsed.data, updatedAt: new Date() })
    .where(eq(categories.id, id));
  revalidateCatalog();
  redirect("/admin/egitimler?saved=1");
}

export async function deleteCategory(id: number): Promise<void> {
  await requireUser();
  const [{ n }] = await db
    .select({ n: sql<number>`count(*)` })
    .from(trainings)
    .where(eq(trainings.categoryId, id));
  if (Number(n) > 0) {
    // FK restrict — önce eğitimler taşınmalı/silinmeli
    throw new Error("İçinde eğitim olan kategori silinemez");
  }
  await db.delete(categories).where(eq(categories.id, id));
  revalidateCatalog();
  redirect("/admin/egitimler");
}

export async function moveCategory(id: number, direction: "up" | "down") {
  await requireUser();
  const rows = await db
    .select({ id: categories.id, sortOrder: categories.sortOrder })
    .from(categories)
    .orderBy(asc(categories.sortOrder), asc(categories.id));
  const idx = rows.findIndex((r) => r.id === id);
  const swap = direction === "up" ? idx - 1 : idx + 1;
  if (idx === -1 || swap < 0 || swap >= rows.length) return;
  await db.transaction(async (tx) => {
    await tx
      .update(categories)
      .set({ sortOrder: rows[swap].sortOrder })
      .where(eq(categories.id, rows[idx].id));
    await tx
      .update(categories)
      .set({ sortOrder: rows[idx].sortOrder })
      .where(eq(categories.id, rows[swap].id));
  });
  revalidateCatalog();
}

// ---------- Eğitim ----------

const sectionSchema = z.object({
  title: z.string().trim().min(1),
  intro: z.string().trim(),
  bullets: z.array(z.string().trim().min(1)),
});
const faqSchema = z.object({ q: z.string().trim().min(1), a: z.string().trim().min(1) });
const formatSchema = z.object({ label: z.string().trim().min(1), value: z.string().trim().min(1) });

const jsonField = <T extends z.ZodTypeAny>(schema: T) =>
  z.string().transform((s, ctx) => {
    try {
      return JSON.parse(s || "[]");
    } catch {
      ctx.addIssue({ code: "custom", message: "Geçersiz veri" });
      return z.NEVER;
    }
  }).pipe(schema);

const trainingSchema = z.object({
  title: z.string().trim().min(3, "Eğitim adı gerekli").max(300),
  blurb: z.string().trim().min(10, "Kart açıklaması gerekli").max(1000),
  published: z.coerce.boolean(),
  hasPage: z.coerce.boolean(),
  // Detay sayfası alanları (hasPage=true iken zorunlu)
  seoTitle: z.string().trim().max(300).optional().or(z.literal("")),
  seoDescription: z.string().trim().max(500).optional().or(z.literal("")),
  heroQuote: z.string().trim().max(500).optional().or(z.literal("")),
  audience: z.string().trim().max(2000).optional().or(z.literal("")),
  intro: z
    .string()
    .transform((s) => s.split("\n\n").map((p) => p.trim()).filter(Boolean)),
  outcomes: z
    .string()
    .transform((s) => s.split("\n").map((l) => l.trim()).filter(Boolean)),
  sections: jsonField(
    z.array(
      z.object({
        title: z.string().trim(),
        intro: z.string().trim(),
        bullets: z.string(),
      })
    )
  ).transform((rows) =>
    rows
      .filter((r) => r.title)
      .map((r) => ({
        title: r.title,
        intro: r.intro,
        bullets: r.bullets.split("\n").map((b) => b.trim()).filter(Boolean),
      }))
  ).pipe(z.array(sectionSchema)),
  // İç şema gevşek (min yok) — boş bırakılan satırlar önce filtrelenir,
  // doğrulama filtreden SONRA yapılır
  faq: jsonField(
    z.array(z.object({ q: z.string().trim(), a: z.string().trim() }))
  ).transform((rows) => rows.filter((r) => r.q && r.a)).pipe(z.array(faqSchema)),
  format: jsonField(
    z.array(z.object({ label: z.string().trim(), value: z.string().trim() }))
  ).transform((rows) => rows.filter((r) => r.label && r.value)).pipe(z.array(formatSchema)),
});

function parseTrainingForm(formData: FormData) {
  return trainingSchema.safeParse({
    title: formData.get("title"),
    blurb: formData.get("blurb"),
    published: formData.get("published") === "on",
    hasPage: formData.get("hasPage") === "on",
    // Detay kapalıyken bu input'lar formda yok — null gelir; zod null kabul etmez
    seoTitle: formData.get("seoTitle") ?? "",
    seoDescription: formData.get("seoDescription") ?? "",
    heroQuote: formData.get("heroQuote") ?? "",
    audience: formData.get("audience") ?? "",
    intro: formData.get("intro") ?? "",
    outcomes: formData.get("outcomes") ?? "",
    sections: formData.get("sections") ?? "[]",
    faq: formData.get("faq") ?? "[]",
    format: formData.get("format") ?? "[]",
  });
}

async function upsertTrainingPage(
  trainingId: number,
  d: z.infer<typeof trainingSchema>
) {
  if (!d.hasPage) {
    await db.delete(trainingPages).where(eq(trainingPages.trainingId, trainingId));
    return;
  }
  const values = {
    trainingId,
    seoTitle: d.seoTitle || d.title,
    seoDescription: d.seoDescription || d.blurb,
    heroQuote: d.heroQuote || "",
    audience: d.audience || "",
    intro: d.intro,
    sections: d.sections,
    outcomes: d.outcomes,
    format: d.format,
    faq: d.faq,
  };
  await db
    .insert(trainingPages)
    .values(values)
    .onConflictDoUpdate({
      target: trainingPages.trainingId,
      set: { ...values, updatedAt: new Date() },
    });
}

export async function createTraining(
  categoryId: number,
  _prev: CatalogFormState,
  formData: FormData
): Promise<CatalogFormState> {
  await requireUser();
  const parsed = parseTrainingForm(formData);
  if (!parsed.success) return { fieldErrors: fieldErrors(parsed.error) };
  const d = parsed.data;

  const slug = slugify(d.title);
  const [existing] = await db
    .select({ id: trainings.id })
    .from(trainings)
    .where(and(eq(trainings.categoryId, categoryId), eq(trainings.slug, slug)))
    .limit(1);
  if (existing) {
    return { fieldErrors: { title: "Bu kategoride aynı adla bir eğitim var" } };
  }

  const [{ max }] = await db
    .select({ max: sql<number>`coalesce(max(${trainings.sortOrder}), -1)` })
    .from(trainings)
    .where(eq(trainings.categoryId, categoryId));
  const [created] = await db
    .insert(trainings)
    .values({
      categoryId,
      slug,
      title: d.title,
      blurb: d.blurb,
      published: d.published,
      sortOrder: max + 1,
    })
    .returning({ id: trainings.id });
  await upsertTrainingPage(created.id, d);
  revalidateCatalog();
  redirect(`/admin/egitimler/${categoryId}?saved=1`);
}

export async function updateTraining(
  id: number,
  _prev: CatalogFormState,
  formData: FormData
): Promise<CatalogFormState> {
  await requireUser();
  const parsed = parseTrainingForm(formData);
  if (!parsed.success) return { fieldErrors: fieldErrors(parsed.error) };
  const d = parsed.data;

  const [current] = await db
    .select({ categoryId: trainings.categoryId })
    .from(trainings)
    .where(eq(trainings.id, id))
    .limit(1);
  if (!current) return { error: "Eğitim bulunamadı" };

  // Slug OLUŞTURULDUĞU GİBİ KALIR (SEO)
  await db
    .update(trainings)
    .set({
      title: d.title,
      blurb: d.blurb,
      published: d.published,
      updatedAt: new Date(),
    })
    .where(eq(trainings.id, id));
  await upsertTrainingPage(id, d);
  revalidateCatalog();
  redirect(`/admin/egitimler/${current.categoryId}?saved=1`);
}

export async function deleteTraining(id: number) {
  await requireUser();
  await db.delete(trainings).where(eq(trainings.id, id));
  revalidateCatalog();
}

export async function moveTraining(id: number, direction: "up" | "down") {
  await requireUser();
  const [row] = await db
    .select({ categoryId: trainings.categoryId })
    .from(trainings)
    .where(eq(trainings.id, id))
    .limit(1);
  if (!row) return;
  const rows = await db
    .select({ id: trainings.id, sortOrder: trainings.sortOrder })
    .from(trainings)
    .where(eq(trainings.categoryId, row.categoryId))
    .orderBy(asc(trainings.sortOrder), asc(trainings.id));
  const idx = rows.findIndex((r) => r.id === id);
  const swap = direction === "up" ? idx - 1 : idx + 1;
  if (idx === -1 || swap < 0 || swap >= rows.length) return;
  await db.transaction(async (tx) => {
    await tx
      .update(trainings)
      .set({ sortOrder: rows[swap].sortOrder })
      .where(eq(trainings.id, rows[idx].id));
    await tx
      .update(trainings)
      .set({ sortOrder: rows[idx].sortOrder })
      .where(eq(trainings.id, rows[swap].id));
  });
  revalidateCatalog();
}
