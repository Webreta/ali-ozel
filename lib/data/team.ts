import "server-only";
import { unstable_cache } from "next/cache";
import { asc, eq } from "drizzle-orm";
import { db } from "@/db";
import { teamMembers } from "@/db/schema";

export const getTeam = unstable_cache(
  () =>
    db
      .select()
      .from(teamMembers)
      .where(eq(teamMembers.published, true))
      .orderBy(asc(teamMembers.sortOrder), asc(teamMembers.id)),
  ["team"],
  { tags: ["team"] }
);
