import "server-only";
import { unstable_cache } from "next/cache";
import { and, desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { blogPosts } from "@/db/schema";

// NOT: unstable_cache sonucu JSON'a serileştirir — Date alanları cache
// isabetinde string'e döner. Bu yüzden tarihler bilinçli olarak ISO string
// taşınır; tüketen sayfa new Date(...) ile açar.

export const getPublishedPosts = unstable_cache(
  async () => {
    const rows = await db
      .select({
        id: blogPosts.id,
        slug: blogPosts.slug,
        title: blogPosts.title,
        excerpt: blogPosts.excerpt,
        coverImage: blogPosts.coverImage,
        publishedAt: blogPosts.publishedAt,
      })
      .from(blogPosts)
      .where(eq(blogPosts.status, "published"))
      .orderBy(desc(blogPosts.publishedAt));
    return rows.map((r) => ({
      ...r,
      publishedAt: r.publishedAt?.toISOString() ?? null,
    }));
  },
  ["blog-list"],
  { tags: ["blog"] }
);

export const getPublishedPost = (slug: string) =>
  unstable_cache(
    async () => {
      const [row] = await db
        .select()
        .from(blogPosts)
        .where(and(eq(blogPosts.slug, slug), eq(blogPosts.status, "published")))
        .limit(1);
      if (!row) return null;
      return {
        slug: row.slug,
        title: row.title,
        excerpt: row.excerpt,
        body: row.body,
        coverImage: row.coverImage,
        seoTitle: row.seoTitle,
        seoDescription: row.seoDescription,
        publishedAt: row.publishedAt?.toISOString() ?? null,
      };
    },
    ["blog-post", slug],
    { tags: ["blog", `blog:${slug}`] }
  )();
