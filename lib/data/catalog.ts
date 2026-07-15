import "server-only";
import { unstable_cache } from "next/cache";
import { asc, eq } from "drizzle-orm";
import { db } from "@/db";
import { categories } from "@/db/schema";
import type { Category, Training, TrainingPage } from "@/lib/content";

/**
 * Eğitim kataloğunu lib/content.ts'in Category/Training şekilleriyle döndürür —
 * mevcut component'ler (CategoryCardWide, TrainingCard, Faq...) değişmeden çalışır.
 * Tag bazlı cache: admin kaydettiğinde revalidateTag("catalog") tazeler.
 */
export const getCatalog = unstable_cache(
  async (): Promise<Category[]> => {
    const rows = await db.query.categories.findMany({
      where: eq(categories.published, true),
      orderBy: [asc(categories.sortOrder), asc(categories.id)],
      with: {
        trainings: {
          orderBy: (t, { asc: a }) => [a(t.sortOrder), a(t.id)],
          with: { page: true },
        },
      },
    });

    return rows.map((cat) => ({
      slug: cat.slug,
      name: cat.name,
      shortName: cat.shortName,
      icon: cat.icon,
      tagline: cat.tagline,
      summary: cat.summary,
      forWhom: cat.forWhom,
      heroImages: cat.heroImages,
      trainings: cat.trainings
        .filter((t) => t.published)
        .map(
          (t): Training => ({
            slug: t.slug,
            title: t.title,
            blurb: t.blurb,
            page: t.page
              ? ({
                  seoTitle: t.page.seoTitle,
                  seoDescription: t.page.seoDescription,
                  heroQuote: t.page.heroQuote,
                  intro: t.page.intro,
                  audience: t.page.audience,
                  sections: t.page.sections,
                  outcomes: t.page.outcomes,
                  format: t.page.format,
                  faq: t.page.faq,
                } satisfies TrainingPage)
              : undefined,
          })
        ),
    }));
  },
  ["catalog"],
  { tags: ["catalog"] }
);

export async function getCategory(slug: string) {
  const catalog = await getCatalog();
  return catalog.find((c) => c.slug === slug);
}

export async function getTraining(categorySlug: string, trainingSlug: string) {
  const category = await getCategory(categorySlug);
  if (!category) return undefined;
  const training = category.trainings.find((t) => t.slug === trainingSlug);
  if (!training) return undefined;
  return { category, training };
}

/** Header/Footer navigasyonu için hafif liste */
export async function getNavCategories() {
  const catalog = await getCatalog();
  return catalog.map(({ slug, shortName, icon, tagline }) => ({
    slug,
    shortName,
    icon,
    tagline,
  }));
}
