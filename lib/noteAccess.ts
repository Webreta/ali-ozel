import "server-only";
import { cookies } from "next/headers";
import { createHmac, timingSafeEqual } from "crypto";

/**
 * Ziyaretçi erişim kanıtı: httpOnly cookie'de HMAC imzalı {noteIds, exp}.
 * Kod zaten kimlik bilgisi olduğundan ziyaretçiler için DB session tutulmaz.
 */
const COOKIE_NAME = "note_access";
const TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30 gün

type Payload = { noteIds: number[]; exp: number };

function secret() {
  const s = process.env.AUTH_SECRET;
  if (!s) throw new Error("AUTH_SECRET tanımlı değil");
  return s;
}

function sign(data: string) {
  return createHmac("sha256", secret()).update(data).digest("base64url");
}

function encode(payload: Payload) {
  const data = Buffer.from(JSON.stringify(payload)).toString("base64url");
  return `${data}.${sign(data)}`;
}

function decode(token: string): Payload | null {
  const dot = token.lastIndexOf(".");
  if (dot === -1) return null;
  const data = token.slice(0, dot);
  const mac = token.slice(dot + 1);
  const expected = sign(data);
  const a = Buffer.from(mac);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  try {
    const payload = JSON.parse(
      Buffer.from(data, "base64url").toString()
    ) as Payload;
    if (!Array.isArray(payload.noteIds) || typeof payload.exp !== "number")
      return null;
    if (payload.exp < Date.now()) return null;
    return payload;
  } catch {
    return null;
  }
}

export async function getAccessibleNoteIds(): Promise<number[]> {
  const jar = await cookies();
  const token = jar.get(COOKIE_NAME)?.value;
  if (!token) return [];
  return decode(token)?.noteIds ?? [];
}

/** Yeni notu mevcut erişimlere ekleyip cookie'yi tazeler */
export async function grantNoteAccess(noteId: number) {
  const current = await getAccessibleNoteIds();
  const noteIds = [...new Set([...current, noteId])];
  const exp = Date.now() + TTL_MS;
  const jar = await cookies();
  jar.set(COOKIE_NAME, encode({ noteIds, exp }), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: new Date(exp),
  });
}
