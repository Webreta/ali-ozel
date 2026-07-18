import "server-only";
import { unstable_cache } from "next/cache";
import { asc } from "drizzle-orm";
import { db } from "@/db";
import { legalPages } from "@/db/schema";

/** Footer listesi — admin yasal CRUD'u "legal" tag'ini revalidate eder */
export const getLegalPages = unstable_cache(
  () =>
    db
      .select({ id: legalPages.id, slug: legalPages.slug, title: legalPages.title })
      .from(legalPages)
      .orderBy(asc(legalPages.id)),
  ["legal-pages"],
  { tags: ["legal"] }
);
