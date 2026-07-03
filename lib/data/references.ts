import "server-only";
import { unstable_cache } from "next/cache";
import { asc, eq } from "drizzle-orm";
import { db } from "@/db";
import { referenceLogos } from "@/db/schema";

export const getReferences = unstable_cache(
  () =>
    db
      .select()
      .from(referenceLogos)
      .where(eq(referenceLogos.published, true))
      .orderBy(asc(referenceLogos.sortOrder), asc(referenceLogos.id)),
  ["references"],
  { tags: ["references"] }
);
