import "server-only";
import { cache } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createHash, randomBytes } from "crypto";
import { eq, lt } from "drizzle-orm";
import { db } from "@/db";
import { sessions, users } from "@/db/schema";

const COOKIE_NAME = "session";
const SESSION_TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30 gün
const RENEW_THRESHOLD_MS = 15 * 24 * 60 * 60 * 1000; // 15 günden az kaldıysa uzat

export type SessionUser = {
  id: string;
  name: string;
  email: string;
  role: "admin" | "editor";
};

const hashToken = (token: string) =>
  createHash("sha256").update(token).digest("hex");

export async function createSession(userId: string) {
  const token = randomBytes(32).toString("base64url");
  const expiresAt = new Date(Date.now() + SESSION_TTL_MS);
  await db.insert(sessions).values({
    id: hashToken(token),
    userId,
    expiresAt,
  });
  const jar = await cookies();
  jar.set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: expiresAt,
  });
}

export async function destroySession() {
  const jar = await cookies();
  const token = jar.get(COOKIE_NAME)?.value;
  if (token) {
    await db.delete(sessions).where(eq(sessions.id, hashToken(token)));
  }
  jar.delete(COOKIE_NAME);
}

export async function destroyAllSessions(userId: string) {
  await db.delete(sessions).where(eq(sessions.userId, userId));
}

// Aynı render ağacında tekrar tekrar çağrılabilir — tek DB sorgusu atar.
export const getCurrentUser = cache(
  async (): Promise<SessionUser | null> => {
    const jar = await cookies();
    const token = jar.get(COOKIE_NAME)?.value;
    if (!token) return null;

    const rows = await db
      .select({
        sessionId: sessions.id,
        expiresAt: sessions.expiresAt,
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role,
      })
      .from(sessions)
      .innerJoin(users, eq(sessions.userId, users.id))
      .where(eq(sessions.id, hashToken(token)))
      .limit(1);

    const row = rows[0];
    if (!row) return null;
    if (row.expiresAt.getTime() < Date.now()) {
      await db.delete(sessions).where(eq(sessions.id, row.sessionId));
      return null;
    }
    // Kayan yenileme: süresi yarıdan az kaldıysa uzat (cookie'ye dokunamayız
    // — render sırasında set yasak; DB tarafını uzatmak yeterli)
    if (row.expiresAt.getTime() - Date.now() < RENEW_THRESHOLD_MS) {
      await db
        .update(sessions)
        .set({ expiresAt: new Date(Date.now() + SESSION_TTL_MS) })
        .where(eq(sessions.id, row.sessionId));
    }
    return { id: row.id, name: row.name, email: row.email, role: row.role };
  }
);

export async function requireUser(): Promise<SessionUser> {
  const user = await getCurrentUser();
  if (!user) redirect("/admin/giris");
  return user;
}

export async function requireAdmin(): Promise<SessionUser> {
  const user = await requireUser();
  if (user.role !== "admin") redirect("/admin");
  return user;
}

// Ara sıra çağrılacak temizlik (login action'ında tetiklenir)
export async function sweepExpiredSessions() {
  await db.delete(sessions).where(lt(sessions.expiresAt, new Date()));
}
