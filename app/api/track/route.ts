import { NextRequest, NextResponse } from "next/server";
import { sql } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db";
import { analyticsEvents, analyticsVisitors } from "@/db/schema";
import { getSetting } from "@/lib/settings";
import { getCurrentUser } from "@/lib/auth/session";
import { getClientIp, isBotUa, maskIp, parseUa, visitorHash } from "@/lib/analytics";

const eventSchema = z.object({
  type: z.enum([
    "pageview",
    "page_dwell",
    "section_view",
    "section_dwell",
    "click",
    "form",
  ]),
  path: z.string().min(1).max(300),
  key: z.string().max(160).optional(),
  label: z.string().max(200).optional(),
  value: z.number().int().min(0).max(21600).optional(),
  referrer: z.string().max(400).optional(),
});

const bodySchema = z.object({
  events: z.array(eventSchema).min(1).max(50),
});

const done = () => new NextResponse(null, { status: 204 });

export async function POST(req: NextRequest) {
  const cfg = await getSetting("analytics");
  if (!cfg.enabled) return done();

  const ua = req.headers.get("user-agent") ?? "";
  if (!ua || isBotUa(ua)) return done();

  let parsed;
  try {
    parsed = bodySchema.safeParse(await req.json());
  } catch {
    return done();
  }
  if (!parsed.success) return done();

  const ip = getClientIp(req.headers);
  const hash = visitorHash(ip, ua);
  const { device, browser, os } = parseUa(ua);
  // Admin oturumu açık ziyaretçi kalıcı işaretlenir ("SEN" rozeti)
  const isAdmin = (await getCurrentUser()) !== null;
  const events = parsed.data.events;

  const [visitor] = await db
    .insert(analyticsVisitors)
    .values({
      hash,
      ipMasked: maskIp(ip),
      device,
      browser,
      os,
      isAdmin,
      eventCount: events.length,
    })
    .onConflictDoUpdate({
      target: analyticsVisitors.hash,
      set: {
        lastSeenAt: new Date(),
        eventCount: sql`${analyticsVisitors.eventCount} + ${events.length}`,
        ...(isAdmin ? { isAdmin: true } : {}),
      },
    })
    .returning({ id: analyticsVisitors.id });

  await db.insert(analyticsEvents).values(
    events.map((e) => ({
      visitorId: visitor.id,
      type: e.type,
      path: e.path,
      key: e.key ?? null,
      label: e.label ?? null,
      value: e.value ?? null,
      referrer: e.referrer ?? null,
    }))
  );

  return done();
}
