"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { eq, ne, and } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db";
import { blogPosts } from "@/db/schema";
import { requireUser } from "@/lib/auth/session";
import { slugify } from "@/lib/slug";

export type BlogFormState = {
  error?: string;
  fieldErrors?: Record<string, string>;
};

const blogSchema = z.object({
  title: z.string().trim().min(3, "Başlık gerekli").max(300),
  excerpt: z.string().trim().max(500).optional().or(z.literal("")),
  body: z.string().trim().min(10, "İçerik gerekli"),
  coverImage: z.string().trim().max(500).optional().or(z.literal("")),
  status: z.enum(["draft", "published"]),
  seoTitle: z.string().trim().max(300).optional().or(z.literal("")),
  seoDescription: z.string().trim().max(500).optional().or(z.literal("")),
});

function parseForm(formData: FormData) {
  return blogSchema.safeParse({
    title: formData.get("title"),
    excerpt: formData.get("excerpt"),
    body: formData.get("body"),
    coverImage: formData.get("coverImage"),
    status: formData.get("status") ?? "draft",
    seoTitle: formData.get("seoTitle"),
    seoDescription: formData.get("seoDescription"),
  });
}

function fieldErrors(error: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? "");
    if (key && !out[key]) out[key] = issue.message;
  }
  return out;
}

function revalidateBlog(slug?: string) {
  revalidateTag("blog");
  if (slug) revalidateTag(`blog:${slug}`);
  revalidatePath("/blog");
  revalidatePath("/admin/blog");
}

export async function createPost(
  _prev: BlogFormState,
  formData: FormData
): Promise<BlogFormState> {
  const user = await requireUser();
  const parsed = parseForm(formData);
  if (!parsed.success) return { fieldErrors: fieldErrors(parsed.error) };
  const d = parsed.data;

  const slug = slugify(d.title);
  if (!slug) return { fieldErrors: { title: "Başlıktan geçerli bir adres üretilemedi" } };
  const [existing] = await db
    .select({ id: blogPosts.id })
    .from(blogPosts)
    .where(eq(blogPosts.slug, slug))
    .limit(1);
  if (existing) {
    return { fieldErrors: { title: "Bu başlıkla bir yazı zaten var" } };
  }

  await db.insert(blogPosts).values({
    slug,
    title: d.title,
    excerpt: d.excerpt || null,
    body: d.body,
    coverImage: d.coverImage || null,
    status: d.status,
    publishedAt: d.status === "published" ? new Date() : null,
    authorId: user.id,
    seoTitle: d.seoTitle || null,
    seoDescription: d.seoDescription || null,
  });
  revalidateBlog(slug);
  redirect("/admin/blog?saved=1");
}

export async function updatePost(
  id: number,
  _prev: BlogFormState,
  formData: FormData
): Promise<BlogFormState> {
  await requireUser();
  const parsed = parseForm(formData);
  if (!parsed.success) return { fieldErrors: fieldErrors(parsed.error) };
  const d = parsed.data;

  const [current] = await db
    .select({ slug: blogPosts.slug, publishedAt: blogPosts.publishedAt })
    .from(blogPosts)
    .where(eq(blogPosts.id, id))
    .limit(1);
  if (!current) return { error: "Yazı bulunamadı" };

  // Slug OLUŞTURULDUĞU GİBİ KALIR (SEO) — başlık değişse bile adres değişmez
  await db
    .update(blogPosts)
    .set({
      title: d.title,
      excerpt: d.excerpt || null,
      body: d.body,
      coverImage: d.coverImage || null,
      status: d.status,
      publishedAt:
        d.status === "published"
          ? (current.publishedAt ?? new Date())
          : current.publishedAt,
      seoTitle: d.seoTitle || null,
      seoDescription: d.seoDescription || null,
      updatedAt: new Date(),
    })
    .where(eq(blogPosts.id, id));
  revalidateBlog(current.slug);
  redirect("/admin/blog?saved=1");
}

export async function deletePost(id: number) {
  await requireUser();
  const [row] = await db
    .select({ slug: blogPosts.slug })
    .from(blogPosts)
    .where(eq(blogPosts.id, id))
    .limit(1);
  await db.delete(blogPosts).where(eq(blogPosts.id, id));
  revalidateBlog(row?.slug);
}
