"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { analyticsEvents, analyticsVisitors } from "@/db/schema";
import { requireAdmin } from "@/lib/auth/session";
import { setSetting } from "@/lib/settings";

export async function setAnalyticsEnabled(enabled: boolean) {
  await requireAdmin();
  await setSetting("analytics", { enabled });
  revalidatePath("/", "layout");
  redirect("/admin/analitik?saved=1");
}

export async function resetAnalytics() {
  await requireAdmin();
  await db.delete(analyticsEvents);
  await db.delete(analyticsVisitors);
  redirect("/admin/analitik?saved=1");
}
