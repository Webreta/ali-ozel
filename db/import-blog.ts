/**
 * db/blog-content/posts.json içindeki blog yazılarını blog_posts tablosuna
 * upsert eder (slug bazlı). Idempotent — mevcut yazıları günceller.
 *
 *   npm run db:import-blog
 */
import "dotenv/config";
import { readFileSync } from "fs";
import path from "path";
import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import { asc, eq } from "drizzle-orm";
import { z } from "zod";
import * as schema from "./schema";

const FILE = path.join(__dirname, "blog-content", "posts.json");

const postSchema = z.object({
  slug: z.string().min(3),
  title: z.string().min(3),
  excerpt: z.string().min(10),
  body: z.string().min(100),
  publishedAt: z.string().datetime(),
  coverImage: z.string().nullable(),
});

const client = postgres(process.env.DATABASE_URL!, { max: 1 });
const db = drizzle(client, { schema });

async function main() {
  const raw = JSON.parse(readFileSync(FILE, "utf8"));
  const posts = z.array(postSchema).parse(raw);

  // yazar: seed'lenmiş ilk admin (yoksa null kalır)
  const [admin] = await db
    .select({ id: schema.users.id })
    .from(schema.users)
    .where(eq(schema.users.role, "admin"))
    .orderBy(asc(schema.users.createdAt))
    .limit(1);

  let ok = 0;
  for (const p of posts) {
    const values = {
      slug: p.slug,
      title: p.title,
      excerpt: p.excerpt,
      body: p.body,
      coverImage: p.coverImage,
      status: "published" as const,
      publishedAt: new Date(p.publishedAt),
      authorId: admin?.id ?? null,
    };
    await db
      .insert(schema.blogPosts)
      .values(values)
      .onConflictDoUpdate({
        target: schema.blogPosts.slug,
        set: {
          title: values.title,
          excerpt: values.excerpt,
          body: values.body,
          coverImage: values.coverImage,
          status: values.status,
          publishedAt: values.publishedAt,
          updatedAt: new Date(),
        },
      });
    ok++;
  }

  const [{ count }] =
    await client`SELECT count(*)::int AS count FROM blog_posts`;
  console.log(`✓ ${ok} yazı yüklendi/güncellendi — DB'de toplam: ${count}`);
  await client.end();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
