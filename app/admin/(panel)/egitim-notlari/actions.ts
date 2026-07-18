"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { stat } from "fs/promises";
import path from "path";
import { eq, sql } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db";
import {
  accessCodes,
  brandNoteMaterials,
  brandNotes,
  noteComments,
} from "@/db/schema";
import { requireUser } from "@/lib/auth/session";
import { slugify } from "@/lib/slug";
import { UPLOAD_DIR } from "@/lib/uploads";

export type NoteFormState = {
  error?: string;
  fieldErrors?: Record<string, string>;
};

function revalidateNotes(id?: number) {
  revalidatePath("/admin/egitim-notlari");
  if (id) revalidatePath(`/admin/egitim-notlari/${id}`);
  // [brand] sayfası force-dynamic — path revalidate gerekmez
}

function fieldErrors(error: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? "");
    if (key && !out[key]) out[key] = issue.message;
  }
  return out;
}

const jsonField = <T extends z.ZodTypeAny>(schema: T) =>
  z
    .string()
    .transform((s, ctx) => {
      try {
        return JSON.parse(s || "[]");
      } catch {
        ctx.addIssue({ code: "custom", message: "Geçersiz veri" });
        return z.NEVER;
      }
    })
    .pipe(schema);

const metaRow = z.object({ label: z.string().trim(), value: z.string().trim() });
const segmentRow = z.object({ title: z.string().trim(), desc: z.string().trim() });
const galleryRow = z.object({ src: z.string().trim(), caption: z.string().trim() });

const noteSchema = z.object({
  company: z.string().trim().min(2, "Kurum adı gerekli").max(200),
  title: z.string().trim().min(3, "Başlık gerekli").max(300),
  logo: z.string().trim().max(500).optional().or(z.literal("")),
  eventDateLabel: z.string().trim().max(100).optional().or(z.literal("")),
  intro: z.string().trim().max(5000).optional().or(z.literal("")),
  instructorNote: z.string().trim().max(5000).optional().or(z.literal("")),
  notes: z
    .string()
    .transform((s) => s.split("\n").map((l) => l.trim()).filter(Boolean)),
  meta: jsonField(z.array(metaRow)).transform((r) =>
    r.filter((x) => x.label && x.value)
  ),
  segments: jsonField(z.array(segmentRow)).transform((r) =>
    r.filter((x) => x.title)
  ),
  gallery: jsonField(z.array(galleryRow)).transform((r) =>
    r.filter((x) => x.src)
  ),
  published: z.coerce.boolean(),
});

function parseNoteForm(formData: FormData) {
  return noteSchema.safeParse({
    company: formData.get("company"),
    title: formData.get("title"),
    logo: formData.get("logo"),
    eventDateLabel: formData.get("eventDateLabel"),
    intro: formData.get("intro"),
    instructorNote: formData.get("instructorNote"),
    notes: formData.get("notes") ?? "",
    meta: formData.get("meta") ?? "[]",
    segments: formData.get("segments") ?? "[]",
    gallery: formData.get("gallery") ?? "[]",
    published: formData.get("published") === "on",
  });
}

export async function createNote(
  _prev: NoteFormState,
  formData: FormData
): Promise<NoteFormState> {
  await requireUser();
  const parsed = parseNoteForm(formData);
  if (!parsed.success) return { fieldErrors: fieldErrors(parsed.error) };
  const d = parsed.data;

  const slug = slugify(d.company);
  const [existing] = await db
    .select({ id: brandNotes.id })
    .from(brandNotes)
    .where(eq(brandNotes.slug, slug))
    .limit(1);
  if (existing) {
    return { fieldErrors: { company: "Bu kurum için bir not sayfası zaten var" } };
  }

  const [created] = await db
    .insert(brandNotes)
    .values({ ...d, slug })
    .returning({ id: brandNotes.id });
  revalidateNotes();
  redirect(`/admin/egitim-notlari/${created.id}?saved=1`);
}

export async function updateNote(
  id: number,
  _prev: NoteFormState,
  formData: FormData
): Promise<NoteFormState> {
  await requireUser();
  const parsed = parseNoteForm(formData);
  if (!parsed.success) return { fieldErrors: fieldErrors(parsed.error) };

  await db
    .update(brandNotes)
    .set({ ...parsed.data, updatedAt: new Date() })
    .where(eq(brandNotes.id, id));
  revalidateNotes(id);
  redirect("/admin/egitim-notlari?saved=1");
}

export async function deleteNote(id: number) {
  await requireUser();
  await db.delete(brandNotes).where(eq(brandNotes.id, id));
  revalidateNotes();
  redirect("/admin/egitim-notlari");
}

// ---------- Erişim kodları ----------

export async function addAccessCode(noteId: number, formData: FormData) {
  await requireUser();
  const raw = formData.get("code");
  const code = typeof raw === "string" ? raw.trim().toUpperCase() : "";
  if (!code) return;
  await db
    .insert(accessCodes)
    .values({ code, brandNoteId: noteId })
    .onConflictDoNothing({ target: accessCodes.code });
  revalidateNotes(noteId);
}

export async function toggleAccessCode(id: number, active: boolean) {
  await requireUser();
  const [row] = await db
    .update(accessCodes)
    .set({ active })
    .where(eq(accessCodes.id, id))
    .returning({ noteId: accessCodes.brandNoteId });
  revalidateNotes(row?.noteId);
}

export async function deleteAccessCode(id: number) {
  await requireUser();
  const [row] = await db
    .delete(accessCodes)
    .where(eq(accessCodes.id, id))
    .returning({ noteId: accessCodes.brandNoteId });
  revalidateNotes(row?.noteId);
}

// ---------- Materyaller ----------

export async function addMaterial(noteId: number, formData: FormData) {
  await requireUser();
  const name = String(formData.get("name") ?? "").trim();
  const fileUrl = String(formData.get("fileUrl") ?? "").trim();
  if (!name) return;

  // Upload ucu "/uploads/materials/x.pdf" döner; DB UPLOAD_DIR'e göre tutar
  const filePath = fileUrl.replace(/^\/uploads\//, "");
  let sizeBytes: number | null = null;
  if (filePath) {
    try {
      const resolved = path.resolve(UPLOAD_DIR, filePath);
      if (resolved.startsWith(UPLOAD_DIR + path.sep)) {
        sizeBytes = (await stat(resolved)).size;
      }
    } catch {
      /* dosya bulunamadı — boyutsuz kaydet */
    }
  }

  const [{ max }] = await db
    .select({ max: sql<number>`coalesce(max(${brandNoteMaterials.sortOrder}), -1)` })
    .from(brandNoteMaterials)
    .where(eq(brandNoteMaterials.brandNoteId, noteId));
  await db.insert(brandNoteMaterials).values({
    brandNoteId: noteId,
    name,
    filePath,
    sizeBytes,
    sortOrder: max + 1,
  });
  revalidateNotes(noteId);
}

export async function deleteMaterial(id: number) {
  await requireUser();
  const [row] = await db
    .delete(brandNoteMaterials)
    .where(eq(brandNoteMaterials.id, id))
    .returning({ noteId: brandNoteMaterials.brandNoteId });
  revalidateNotes(row?.noteId);
}

// ---------- Yorum moderasyonu ----------

export async function setCommentApproved(id: number, approved: boolean) {
  await requireUser();
  const [row] = await db
    .update(noteComments)
    .set({ approved })
    .where(eq(noteComments.id, id))
    .returning({ noteId: noteComments.brandNoteId });
  revalidateNotes(row?.noteId);
}

export async function deleteComment(id: number) {
  await requireUser();
  const [row] = await db
    .delete(noteComments)
    .where(eq(noteComments.id, id))
    .returning({ noteId: noteComments.brandNoteId });
  revalidateNotes(row?.noteId);
}
