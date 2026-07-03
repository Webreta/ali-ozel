"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth/session";
import { getSetting, setSetting } from "@/lib/settings";

const cookieSchema = z.object({
  enabled: z.boolean(),
  title: z.string().trim().min(1).max(200),
  text: z.string().trim().min(1).max(1000),
  buttonLabel: z.string().trim().min(1).max(60),
  intervalHours: z.coerce.number().int().min(1).max(8760).catch(24),
  policyLink: z.string().trim().max(300),
  policyLabel: z.string().trim().max(100),
});

export async function saveCookieSettings(formData: FormData) {
  await requireAdmin();
  const current = await getSetting("cookieBanner");
  const parsed = cookieSchema.parse({
    enabled: formData.get("enabled") === "on",
    title: formData.get("title") || "Çerez Bildirimi",
    text: formData.get("text") || current.text,
    buttonLabel: formData.get("buttonLabel") || "Tamam",
    intervalHours: formData.get("intervalHours") ?? 24,
    policyLink: formData.get("policyLink") ?? "",
    policyLabel: formData.get("policyLabel") ?? "",
  });

  await setSetting("cookieBanner", { ...parsed, version: current.version });
  revalidatePath("/", "layout");
  redirect("/admin/cerez?saved=1");
}

export async function resetCookieConsents() {
  await requireAdmin();
  const current = await getSetting("cookieBanner");
  // Versiyon artınca daha önce "Tamam" diyenlerde de banner yeniden çıkar
  await setSetting("cookieBanner", { ...current, version: current.version + 1 });
  revalidatePath("/", "layout");
  redirect("/admin/cerez?saved=1");
}
