"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { asc, eq, sql } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db";
import { teamMembers } from "@/db/schema";
import { requireUser } from "@/lib/auth/session";
import { slugify } from "@/lib/slug";

export type TeamFormState = {
  error?: string;
  fieldErrors?: Record<string, string>;
};

const teamSchema = z.object({
  name: z.string().trim().min(2, "İsim gerekli").max(200),
  roleTitle: z.string().trim().min(2, "Unvan gerekli").max(200),
  bio: z.string().trim().min(10, "Kısa bir tanıtım yazın").max(2000),
  photo: z.string().trim().max(500).optional().or(z.literal("")),
  initials: z.string().trim().max(4).optional().or(z.literal("")),
  detailBio: z.string().trim().max(40000).optional().or(z.literal("")),
  expertise: z
    .string()
    .transform((s) => s.split("\n").map((l) => l.trim()).filter(Boolean)),
  highlights: z
    .string()
    .transform((s, ctx) => {
      try {
        return JSON.parse(s || "[]");
      } catch {
        ctx.addIssue({ code: "custom", message: "Geçersiz veri" });
        return z.NEVER;
      }
    })
    .pipe(z.array(z.object({ label: z.string().trim(), value: z.string().trim() })))
    .transform((rows) => rows.filter((r) => r.label && r.value)),
  published: z.coerce.boolean(),
});

function revalidateTeam() {
  revalidateTag("team");
  revalidatePath("/ekibimiz");
  revalidatePath("/ekibimiz/[slug]", "page");
  revalidatePath("/admin/ekip");
}

function parseForm(formData: FormData) {
  return teamSchema.safeParse({
    name: formData.get("name"),
    roleTitle: formData.get("roleTitle"),
    bio: formData.get("bio"),
    photo: formData.get("photo"),
    initials: formData.get("initials"),
    detailBio: formData.get("detailBio") ?? "",
    expertise: formData.get("expertise") ?? "",
    highlights: formData.get("highlights") ?? "[]",
    published: formData.get("published") === "on",
  });
}

/** Ad çakışırsa -2, -3... ekleyerek benzersiz slug üretir */
async function uniqueMemberSlug(name: string) {
  const base = slugify(name);
  let slug = base;
  for (let i = 2; ; i++) {
    const [existing] = await db
      .select({ id: teamMembers.id })
      .from(teamMembers)
      .where(eq(teamMembers.slug, slug))
      .limit(1);
    if (!existing) return slug;
    slug = `${base}-${i}`;
  }
}

function fieldErrors(error: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? "");
    if (key && !out[key]) out[key] = issue.message;
  }
  return out;
}

export async function createMember(
  _prev: TeamFormState,
  formData: FormData
): Promise<TeamFormState> {
  await requireUser();
  const parsed = parseForm(formData);
  if (!parsed.success) return { fieldErrors: fieldErrors(parsed.error) };

  const d = parsed.data;
  const [{ max }] = await db
    .select({ max: sql<number>`coalesce(max(${teamMembers.sortOrder}), -1)` })
    .from(teamMembers);
  await db.insert(teamMembers).values({
    slug: await uniqueMemberSlug(d.name),
    name: d.name,
    roleTitle: d.roleTitle,
    bio: d.bio,
    photo: d.photo || null,
    initials: d.initials || null,
    detailBio: d.detailBio || "",
    expertise: d.expertise,
    highlights: d.highlights,
    published: d.published,
    sortOrder: max + 1,
  });
  revalidateTeam();
  redirect("/admin/ekip?saved=1");
}

export async function updateMember(
  id: number,
  _prev: TeamFormState,
  formData: FormData
): Promise<TeamFormState> {
  await requireUser();
  const parsed = parseForm(formData);
  if (!parsed.success) return { fieldErrors: fieldErrors(parsed.error) };

  const d = parsed.data;
  // Slug OLUŞTURULDUĞU GİBİ KALIR (SEO); slug'sız eski kayda bir kez üretilir
  const [current] = await db
    .select({ slug: teamMembers.slug })
    .from(teamMembers)
    .where(eq(teamMembers.id, id))
    .limit(1);
  await db
    .update(teamMembers)
    .set({
      slug: current?.slug ?? (await uniqueMemberSlug(d.name)),
      name: d.name,
      roleTitle: d.roleTitle,
      bio: d.bio,
      photo: d.photo || null,
      initials: d.initials || null,
      detailBio: d.detailBio || "",
      expertise: d.expertise,
      highlights: d.highlights,
      published: d.published,
      updatedAt: new Date(),
    })
    .where(eq(teamMembers.id, id));
  revalidateTeam();
  redirect("/admin/ekip?saved=1");
}

export async function deleteMember(id: number) {
  await requireUser();
  await db.delete(teamMembers).where(eq(teamMembers.id, id));
  revalidateTeam();
}

export async function moveMember(id: number, direction: "up" | "down") {
  await requireUser();
  const rows = await db
    .select({ id: teamMembers.id, sortOrder: teamMembers.sortOrder })
    .from(teamMembers)
    .orderBy(asc(teamMembers.sortOrder), asc(teamMembers.id));
  const idx = rows.findIndex((r) => r.id === id);
  const swap = direction === "up" ? idx - 1 : idx + 1;
  if (idx === -1 || swap < 0 || swap >= rows.length) return;
  await db.transaction(async (tx) => {
    await tx
      .update(teamMembers)
      .set({ sortOrder: rows[swap].sortOrder })
      .where(eq(teamMembers.id, rows[idx].id));
    await tx
      .update(teamMembers)
      .set({ sortOrder: rows[idx].sortOrder })
      .where(eq(teamMembers.id, rows[swap].id));
  });
  revalidateTeam();
}
