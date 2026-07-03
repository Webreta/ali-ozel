"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { and, eq, gt, isNull, or, sql } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db";
import { accessCodes, brandNotes, noteComments } from "@/db/schema";
import { checkRateLimit } from "@/lib/auth/rate-limit";
import { grantNoteAccess } from "@/lib/noteAccess";

export type AccessState = { error?: string };

export async function submitAccessCode(
  _prev: AccessState,
  formData: FormData
): Promise<AccessState> {
  const raw = formData.get("code");
  const code = typeof raw === "string" ? raw.trim().toUpperCase() : "";
  if (!code) return { error: "Erişim kodunuzu girin." };

  const hdrs = await headers();
  const ip = hdrs.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (!checkRateLimit(`note-access:${ip}`)) {
    return { error: "Çok fazla deneme yapıldı. Lütfen daha sonra tekrar deneyin." };
  }

  const [row] = await db
    .select({
      noteId: accessCodes.brandNoteId,
      slug: brandNotes.slug,
      published: brandNotes.published,
    })
    .from(accessCodes)
    .innerJoin(brandNotes, eq(brandNotes.id, accessCodes.brandNoteId))
    .where(
      and(
        eq(accessCodes.code, code),
        eq(accessCodes.active, true),
        or(isNull(accessCodes.expiresAt), gt(accessCodes.expiresAt, sql`now()`))
      )
    )
    .limit(1);

  if (!row || !row.published) {
    return { error: "Bu koda ait bir eğitim notu bulunamadı. Kodu kontrol edin." };
  }

  await grantNoteAccess(row.noteId);
  redirect(`/egitim-notlari/${row.slug}`);
}

export type CommentState = { ok?: boolean; error?: string };

const commentSchema = z.object({
  name: z.string().trim().min(2, "Adınızı yazın").max(120),
  body: z.string().trim().min(5, "Yorumunuzu yazın").max(2000),
});

export async function submitNoteComment(
  noteId: number,
  _prev: CommentState,
  formData: FormData
): Promise<CommentState> {
  const parsed = commentSchema.safeParse({
    name: formData.get("name"),
    body: formData.get("body"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Formu kontrol edin." };
  }

  const hdrs = await headers();
  const ip = hdrs.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (!checkRateLimit(`note-comment:${ip}`)) {
    return { error: "Çok fazla gönderim yapıldı. Lütfen daha sonra deneyin." };
  }

  // Erişim kanıtı olmayan ziyaretçi yorum bırakamaz
  const { getAccessibleNoteIds } = await import("@/lib/noteAccess");
  const accessible = await getAccessibleNoteIds();
  if (!accessible.includes(noteId)) {
    return { error: "Yorum bırakmak için erişim kodunuzla giriş yapın." };
  }

  const { name, body } = parsed.data;
  const initials = name
    .split(/\s+/)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("")
    .slice(0, 2);

  await db.insert(noteComments).values({
    brandNoteId: noteId,
    name,
    initials,
    body,
    approved: false, // moderasyon: panelde onaylanınca görünür
  });
  return { ok: true };
}
