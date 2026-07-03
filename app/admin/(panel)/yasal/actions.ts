"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db";
import { legalPages } from "@/db/schema";
import { requireUser } from "@/lib/auth/session";
import { slugify } from "@/lib/slug";

export type LegalFormState = { error?: string };

const legalSchema = z.object({
  title: z.string().trim().min(3, "Başlık gerekli").max(300),
  body: z.string().trim().min(20, "Sayfa metni gerekli"),
});

function revalidateLegal(slug?: string) {
  revalidateTag("legal");
  revalidatePath("/admin/yasal");
  if (slug) revalidatePath(`/yasal/${slug}`);
}

export async function createLegalPage(
  _prev: LegalFormState,
  formData: FormData
): Promise<LegalFormState> {
  await requireUser();
  const parsed = legalSchema.safeParse({
    title: formData.get("title"),
    body: formData.get("body"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Formu kontrol edin" };
  }

  const slug = slugify(parsed.data.title);
  const [existing] = await db
    .select({ id: legalPages.id })
    .from(legalPages)
    .where(eq(legalPages.slug, slug))
    .limit(1);
  if (existing) return { error: "Bu başlıkla bir sayfa zaten var" };

  await db.insert(legalPages).values({ slug, ...parsed.data });
  revalidateLegal(slug);
  redirect("/admin/yasal?saved=1");
}

export async function updateLegalPage(
  id: number,
  _prev: LegalFormState,
  formData: FormData
): Promise<LegalFormState> {
  await requireUser();
  const parsed = legalSchema.safeParse({
    title: formData.get("title"),
    body: formData.get("body"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Formu kontrol edin" };
  }

  const [current] = await db
    .select({ slug: legalPages.slug })
    .from(legalPages)
    .where(eq(legalPages.id, id))
    .limit(1);
  if (!current) return { error: "Sayfa bulunamadı" };

  // Slug sabit kalır — formlarda onay linki olarak kullanılıyor olabilir
  await db
    .update(legalPages)
    .set({ ...parsed.data, updatedAt: new Date() })
    .where(eq(legalPages.id, id));
  revalidateLegal(current.slug);
  redirect("/admin/yasal?saved=1");
}

export async function deleteLegalPage(id: number) {
  await requireUser();
  const [row] = await db
    .delete(legalPages)
    .where(eq(legalPages.id, id))
    .returning({ slug: legalPages.slug });
  revalidateLegal(row?.slug);
}
