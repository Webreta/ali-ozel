"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth/session";
import { setSetting } from "@/lib/settings";

const floatBarSchema = z.object({
  enabled: z.boolean(),
  item1Label: z.string().trim().max(30),
  item1Href: z.string().trim().max(300),
  item2Label: z.string().trim().max(30),
  item2Href: z.string().trim().max(300),
  contactLabel: z.string().trim().min(1).max(30),
  popTitle: z.string().trim().min(1).max(60),
  phone: z.string().trim().min(1).max(30),
  whatsapp: z
    .string()
    .trim()
    .transform((v) => v.replace(/\D/g, ""))
    .pipe(z.string().min(10).max(15)),
  whatsappText: z.string().trim().max(300),
});

export async function saveFloatBarSettings(formData: FormData) {
  await requireAdmin();
  const parsed = floatBarSchema.parse({
    enabled: formData.get("enabled") === "on",
    item1Label: formData.get("item1Label") ?? "",
    item1Href: formData.get("item1Href") ?? "",
    item2Label: formData.get("item2Label") ?? "",
    item2Href: formData.get("item2Href") ?? "",
    contactLabel: formData.get("contactLabel") || "İletişim",
    popTitle: formData.get("popTitle") || "Hemen Bağlan",
    phone: formData.get("phone") || "",
    whatsapp: formData.get("whatsapp") || "",
    whatsappText: formData.get("whatsappText") ?? "",
  });

  await setSetting("floatBar", parsed);
  revalidatePath("/", "layout");
  redirect("/admin/iletisim-bari?saved=1");
}
