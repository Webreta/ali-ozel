"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db";
import { users } from "@/db/schema";
import { hashPassword } from "@/lib/auth/password";
import { destroyAllSessions, requireAdmin } from "@/lib/auth/session";

export type UserFormState = {
  error?: string;
  fieldErrors?: Record<string, string>;
  ok?: boolean;
};

const userSchema = z.object({
  name: z.string().trim().min(2, "İsim gerekli").max(200),
  email: z.string().trim().toLowerCase().email("Geçerli bir e-posta girin"),
  password: z.string().min(10, "Şifre en az 10 karakter olmalı").max(200),
  role: z.enum(["admin", "editor"]),
});

export async function createUser(
  _prev: UserFormState,
  formData: FormData
): Promise<UserFormState> {
  await requireAdmin();
  const parsed = userSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    role: formData.get("role"),
  });
  if (!parsed.success) {
    const out: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] ?? "");
      if (key && !out[key]) out[key] = issue.message;
    }
    return { fieldErrors: out };
  }
  const d = parsed.data;

  const [existing] = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.email, d.email))
    .limit(1);
  if (existing) return { fieldErrors: { email: "Bu e-posta zaten kayıtlı" } };

  await db.insert(users).values({
    name: d.name,
    email: d.email,
    passwordHash: await hashPassword(d.password),
    role: d.role,
  });
  revalidatePath("/admin/kullanicilar");
  return { ok: true };
}

export async function setUserRole(id: string, role: "admin" | "editor") {
  const me = await requireAdmin();
  if (me.id === id) return; // kendi rolünü düşüremesin
  await db.update(users).set({ role, updatedAt: new Date() }).where(eq(users.id, id));
  revalidatePath("/admin/kullanicilar");
}

export async function resetPassword(
  id: string,
  _prev: UserFormState,
  formData: FormData
): Promise<UserFormState> {
  await requireAdmin();
  const password = String(formData.get("password") ?? "");
  if (password.length < 10) {
    return { error: "Şifre en az 10 karakter olmalı" };
  }
  await db
    .update(users)
    .set({ passwordHash: await hashPassword(password), updatedAt: new Date() })
    .where(eq(users.id, id));
  // Şifre değişince tüm oturumlar kapanır
  await destroyAllSessions(id);
  revalidatePath("/admin/kullanicilar");
  return { ok: true };
}

export async function deleteUser(id: string) {
  const me = await requireAdmin();
  if (me.id === id) return; // kendini silemesin
  await db.delete(users).where(eq(users.id, id));
  revalidatePath("/admin/kullanicilar");
}
