"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth/session";
import { setSetting } from "@/lib/settings";

export async function saveCustomCode(formData: FormData) {
  await requireAdmin();
  await setSetting("customCode", {
    headerEnabled: formData.get("headerEnabled") === "on",
    headerCode: String(formData.get("headerCode") ?? ""),
    bodyEnabled: formData.get("bodyEnabled") === "on",
    bodyCode: String(formData.get("bodyCode") ?? ""),
  });
  revalidatePath("/", "layout");
  redirect("/admin/kod-ekleme?saved=1");
}

export async function saveAdsConversions(formData: FormData) {
  await requireAdmin();
  await setSetting("adsConversions", {
    enabled: formData.get("enabled") === "on",
    lead: String(formData.get("lead") ?? "").trim(),
    whatsapp: String(formData.get("whatsapp") ?? "").trim(),
    phone: String(formData.get("phone") ?? "").trim(),
  });
  revalidatePath("/", "layout");
  redirect("/admin/kod-ekleme?saved=1");
}
