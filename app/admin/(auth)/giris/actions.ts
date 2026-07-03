"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db";
import { users } from "@/db/schema";
import { verifyPassword, DUMMY_HASH } from "@/lib/auth/password";
import { createSession, sweepExpiredSessions } from "@/lib/auth/session";
import { checkRateLimit } from "@/lib/auth/rate-limit";

export type LoginState = { error?: string };

const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email(),
  password: z.string().min(1),
});

const GENERIC_ERROR = "E-posta veya şifre hatalı.";

export async function login(
  _prev: LoginState,
  formData: FormData
): Promise<LoginState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) return { error: GENERIC_ERROR };
  const { email, password } = parsed.data;

  const hdrs = await headers();
  const ip =
    hdrs.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (!checkRateLimit(`login:${ip}:${email}`)) {
    return {
      error: "Çok fazla deneme yapıldı. Lütfen 15 dakika sonra tekrar deneyin.",
    };
  }

  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  // Kullanıcı yoksa da compare çalışır — yanıt süresi bilgi sızdırmaz
  const valid = await verifyPassword(
    password,
    user?.passwordHash ?? DUMMY_HASH
  );
  if (!user || !valid) return { error: GENERIC_ERROR };

  await sweepExpiredSessions();
  await createSession(user.id);

  // Open-redirect koruması: yalnızca /admin altı hedefler
  const next = formData.get("next");
  const target =
    typeof next === "string" && next.startsWith("/admin") && !next.includes("//")
      ? next
      : "/admin";
  redirect(target);
}
