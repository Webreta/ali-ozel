"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { asc, eq, sql } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db";
import { referenceLogos } from "@/db/schema";
import { requireUser } from "@/lib/auth/session";

export type RefFormState = { error?: string; ok?: boolean };

const refSchema = z.object({
  name: z.string().trim().min(2, "Kurum adı gerekli").max(200),
  src: z.string().trim().min(1, "Logo görseli yükleyin").max(500),
});

function revalidateRefs() {
  revalidateTag("references");
  revalidatePath("/referanslar");
  revalidatePath("/");
  revalidatePath("/admin/referanslar");
}

export async function createReference(
  _prev: RefFormState,
  formData: FormData
): Promise<RefFormState> {
  await requireUser();
  const parsed = refSchema.safeParse({
    name: formData.get("name"),
    src: formData.get("src"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Formu kontrol edin" };
  }
  const [{ max }] = await db
    .select({ max: sql<number>`coalesce(max(${referenceLogos.sortOrder}), -1)` })
    .from(referenceLogos);
  await db.insert(referenceLogos).values({
    name: parsed.data.name,
    src: parsed.data.src,
    sortOrder: max + 1,
  });
  revalidateRefs();
  return { ok: true };
}

export async function deleteReference(id: number) {
  await requireUser();
  await db.delete(referenceLogos).where(eq(referenceLogos.id, id));
  revalidateRefs();
}

export async function toggleReference(id: number, published: boolean) {
  await requireUser();
  await db
    .update(referenceLogos)
    .set({ published, updatedAt: new Date() })
    .where(eq(referenceLogos.id, id));
  revalidateRefs();
}

export async function moveReference(id: number, direction: "up" | "down") {
  await requireUser();
  const rows = await db
    .select({ id: referenceLogos.id, sortOrder: referenceLogos.sortOrder })
    .from(referenceLogos)
    .orderBy(asc(referenceLogos.sortOrder), asc(referenceLogos.id));
  const idx = rows.findIndex((r) => r.id === id);
  const swap = direction === "up" ? idx - 1 : idx + 1;
  if (idx === -1 || swap < 0 || swap >= rows.length) return;
  await db.transaction(async (tx) => {
    await tx
      .update(referenceLogos)
      .set({ sortOrder: rows[swap].sortOrder })
      .where(eq(referenceLogos.id, rows[idx].id));
    await tx
      .update(referenceLogos)
      .set({ sortOrder: rows[idx].sortOrder })
      .where(eq(referenceLogos.id, rows[swap].id));
  });
  revalidateRefs();
}
