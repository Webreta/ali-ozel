"use server";

import { headers } from "next/headers";
import { z } from "zod";
import { db } from "@/db";
import { submissions } from "@/db/schema";
import { checkRateLimit } from "@/lib/auth/rate-limit";
import { sendSubmissionEmail } from "@/lib/email";
import { getFormConsents } from "@/lib/settings";

export type SubmitState = {
  ok?: boolean;
  error?: string;
};

const submissionSchema = z.object({
  kind: z.enum(["contact", "teklif"]),
  name: z.string().trim().min(2, "Ad Soyad gerekli").max(200),
  email: z.string().trim().toLowerCase().email("Geçerli bir e-posta girin"),
  phone: z.string().trim().max(40).optional(),
  message: z.string().trim().max(5000).optional(),
  pagePath: z.string().max(300).optional(),
});

export async function submitContact(
  _prev: SubmitState,
  formData: FormData
): Promise<SubmitState> {
  const parsed = submissionSchema.safeParse({
    kind: formData.get("kind") ?? "teklif",
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone") || undefined,
    message: formData.get("message") || undefined,
    pagePath: formData.get("pagePath") || undefined,
  });
  if (!parsed.success) {
    return {
      error:
        parsed.error.issues[0]?.message ?? "Form bilgilerini kontrol edin.",
    };
  }

  const hdrs = await headers();
  const ip = hdrs.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (!checkRateLimit(`submit:${ip}`)) {
    return {
      error: "Çok fazla gönderim yapıldı. Lütfen daha sonra tekrar deneyin.",
    };
  }

  // Panelde bu form için seçilmiş yasal onaylar işaretlenmiş olmalı
  const requiredConsents = await getFormConsents(parsed.data.kind);
  for (const consent of requiredConsents) {
    if (formData.get(`consent-${consent.id}`) !== "on") {
      return { error: `Devam etmek için "${consent.title}" onayı gerekli.` };
    }
  }

  const { kind, name, email, phone, message, pagePath } = parsed.data;
  await db.insert(submissions).values({
    kind,
    name,
    email,
    phone,
    message,
    pagePath,
  });

  // Mail hatası kaydı etkilemez (env yoksa no-op)
  await sendSubmissionEmail({ kind, name, email, phone, message, pagePath });

  return { ok: true };
}
