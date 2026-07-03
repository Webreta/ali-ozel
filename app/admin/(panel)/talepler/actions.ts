"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { submissions } from "@/db/schema";
import { requireAdmin } from "@/lib/auth/session";

export async function setHandled(id: number, handled: boolean) {
  const user = await requireAdmin();
  await db
    .update(submissions)
    .set({ handled, handledBy: handled ? user.id : null })
    .where(eq(submissions.id, id));
  revalidatePath("/admin/talepler");
  revalidatePath(`/admin/talepler/${id}`);
  revalidatePath("/admin");
}

export async function deleteSubmission(id: number) {
  await requireAdmin();
  await db.delete(submissions).where(eq(submissions.id, id));
  revalidatePath("/admin/talepler");
  revalidatePath("/admin");
  redirect("/admin/talepler");
}
