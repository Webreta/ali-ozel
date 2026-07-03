"use server";

import { eq } from "drizzle-orm";
import { db } from "@/db";
import { users } from "@/db/schema";
import { hashPassword, verifyPassword } from "@/lib/auth/password";
import {
  createSession,
  destroyAllSessions,
  requireUser,
} from "@/lib/auth/session";

export type PasswordState = { ok?: boolean; error?: string };

export async function changeOwnPassword(
  _prev: PasswordState,
  formData: FormData
): Promise<PasswordState> {
  const me = await requireUser();
  const current = String(formData.get("current") ?? "");
  const next = String(formData.get("next") ?? "");
  const confirm = String(formData.get("confirm") ?? "");

  if (next.length < 10) return { error: "Yeni şifre en az 10 karakter olmalı." };
  if (next !== confirm) return { error: "Yeni şifreler birbiriyle uyuşmuyor." };

  const [row] = await db
    .select({ passwordHash: users.passwordHash })
    .from(users)
    .where(eq(users.id, me.id))
    .limit(1);
  if (!row || !(await verifyPassword(current, row.passwordHash))) {
    return { error: "Mevcut şifreniz hatalı." };
  }

  await db
    .update(users)
    .set({ passwordHash: await hashPassword(next), updatedAt: new Date() })
    .where(eq(users.id, me.id));

  // Tüm eski oturumlar (başka cihazlar dahil) kapanır; bu cihaz için yenisi açılır
  await destroyAllSessions(me.id);
  await createSession(me.id);

  return { ok: true };
}
