"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { eq, sql } from "drizzle-orm";
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
  // Yeni logo listenin başına gelir
  const [{ min }] = await db
    .select({ min: sql<number>`coalesce(min(${referenceLogos.sortOrder}), 1)` })
    .from(referenceLogos);
  await db.insert(referenceLogos).values({
    name: parsed.data.name,
    src: parsed.data.src,
    sortOrder: min - 1,
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

export async function reorderReferences(ids: number[]) {
  await requireUser();
  const parsed = z.array(z.number().int()).safeParse(ids);
  if (!parsed.success || parsed.data.length === 0) return;
  await db.transaction(async (tx) => {
    for (let i = 0; i < parsed.data.length; i++) {
      await tx
        .update(referenceLogos)
        .set({ sortOrder: i, updatedAt: new Date() })
        .where(eq(referenceLogos.id, parsed.data[i]));
    }
  });
  revalidateRefs();
}
