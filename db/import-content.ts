/**
 * db/content-fill/*.json içindeki eğitim detay içeriklerini training_pages
 * tablosuna upsert eder. Idempotent — mevcut sayfaları günceller.
 * Seed'den sonra çalıştırılır:
 *
 *   npx tsx db/seed.ts && npx tsx db/import-content.ts
 */
import "dotenv/config";
import { readdirSync, readFileSync } from "fs";
import path from "path";
import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import { and, eq } from "drizzle-orm";
import { z } from "zod";
import * as schema from "./schema";

const DIR = path.join(__dirname, "content-fill");

const pageSchema = z.object({
  seoTitle: z.string().min(5),
  seoDescription: z.string().min(30),
  heroQuote: z.string().min(5),
  intro: z.array(z.string().min(20)).min(1),
  audience: z.string().min(10),
  sections: z
    .array(
      z.object({
        title: z.string().min(2),
        intro: z.string(),
        bullets: z.array(z.string().min(2)).min(2),
      })
    )
    .min(3),
  outcomes: z.array(z.string().min(5)).min(4),
  format: z
    .array(z.object({ label: z.string().min(2), value: z.string().min(1) }))
    .min(2),
  faq: z.array(z.object({ q: z.string().min(5), a: z.string().min(10) })).min(2),
});

const client = postgres(process.env.DATABASE_URL!, { max: 1 });
const db = drizzle(client, { schema });

async function main() {
  const files = readdirSync(DIR).filter((f) => f.endsWith(".json"));
  let ok = 0;
  const problems: string[] = [];

  for (const file of files) {
    const categorySlug = path.basename(file, ".json");
    const [cat] = await db
      .select({ id: schema.categories.id })
      .from(schema.categories)
      .where(eq(schema.categories.slug, categorySlug))
      .limit(1);
    if (!cat) {
      problems.push(`${file}: '${categorySlug}' diye kategori yok`);
      continue;
    }

    const raw = JSON.parse(readFileSync(path.join(DIR, file), "utf8"));
    for (const [slug, pageRaw] of Object.entries(raw)) {
      const parsed = pageSchema.safeParse(pageRaw);
      if (!parsed.success) {
        problems.push(`${categorySlug}/${slug}: şema hatası`);
        continue;
      }
      const [training] = await db
        .select({ id: schema.trainings.id })
        .from(schema.trainings)
        .where(
          and(
            eq(schema.trainings.categoryId, cat.id),
            eq(schema.trainings.slug, slug)
          )
        )
        .limit(1);
      if (!training) {
        problems.push(`${categorySlug}/${slug}: eğitim DB'de bulunamadı`);
        continue;
      }

      const d = parsed.data;
      await db
        .insert(schema.trainingPages)
        .values({ trainingId: training.id, ...d })
        .onConflictDoUpdate({
          target: schema.trainingPages.trainingId,
          set: { ...d, updatedAt: new Date() },
        });
      ok++;
    }
  }

  const [{ count }] =
    await client`SELECT count(*)::int AS count FROM training_pages`;
  console.log(`✓ ${ok} sayfa yüklendi/güncellendi — DB'de toplam: ${count}`);
  if (problems.length) {
    console.log(`SORUNLAR (${problems.length}):`);
    problems.forEach((p) => console.log(" - " + p));
    process.exitCode = 1;
  }
  await client.end();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
