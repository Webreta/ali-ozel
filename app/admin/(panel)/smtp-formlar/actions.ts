"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth/session";
import { getSetting, setSetting } from "@/lib/settings";

const smtpSchema = z.object({
  enabled: z.boolean(),
  host: z.string().trim().max(300),
  port: z.coerce.number().int().min(1).max(65535).catch(465),
  encryption: z.enum(["ssl", "tls", "none"]).catch("ssl"),
  authEnabled: z.boolean(),
  username: z.string().trim().max(300),
  password: z.string().max(300),
  fromEmail: z.string().trim().max(300),
  fromName: z.string().trim().max(300),
  forceFrom: z.boolean(),
  skipTlsVerify: z.boolean(),
  notifyTo: z.string().trim().max(300),
});

export async function saveSmtpSettings(formData: FormData) {
  await requireAdmin();
  const current = await getSetting("smtp");

  const submittedPassword = String(formData.get("password") ?? "");
  const parsed = smtpSchema.parse({
    enabled: formData.get("enabled") === "on",
    host: formData.get("host") ?? "",
    port: formData.get("port") ?? 465,
    encryption: formData.get("encryption") ?? "ssl",
    authEnabled: formData.get("authEnabled") === "on",
    username: formData.get("username") ?? "",
    // Boş bırakılırsa kayıtlı şifre korunur
    password: submittedPassword || current.password,
    fromEmail: formData.get("fromEmail") ?? "",
    fromName: formData.get("fromName") ?? "",
    forceFrom: formData.get("forceFrom") === "on",
    skipTlsVerify: formData.get("skipTlsVerify") === "on",
    notifyTo: formData.get("notifyTo") ?? "",
  });

  await setSetting("smtp", parsed);
  redirect("/admin/smtp-formlar?saved=1");
}

export async function saveFormLegal(formData: FormData) {
  await requireAdmin();
  const toIds = (name: string) =>
    formData
      .getAll(name)
      .map((v) => Number(v))
      .filter((n) => Number.isInteger(n));

  await setSetting("formLegal", {
    contact: toIds("contact"),
    teklif: toIds("teklif"),
  });
  // Onay kutuları public formlarda göründüğü için ilgili sayfaları tazele
  revalidatePath("/iletisim");
  revalidatePath("/", "layout");
  redirect("/admin/smtp-formlar?saved=1");
}
