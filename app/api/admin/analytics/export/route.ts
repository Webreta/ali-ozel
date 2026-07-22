import { NextResponse } from "next/server";
import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { analyticsEvents, analyticsVisitors } from "@/db/schema";
import { getCurrentUser } from "@/lib/auth/session";

const esc = (v: unknown) => {
  const s = v == null ? "" : String(v);
  return /[",;\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};

export async function GET() {
  const user = await getCurrentUser();
  if (!user || user.role !== "admin") {
    return NextResponse.json({ error: "unauthorized" }, { status: 403 });
  }

  const rows = await db
    .select({
      id: analyticsEvents.id,
      createdAt: analyticsEvents.createdAt,
      visitorId: analyticsEvents.visitorId,
      ipMasked: analyticsVisitors.ipMasked,
      device: analyticsVisitors.device,
      isAdmin: analyticsVisitors.isAdmin,
      type: analyticsEvents.type,
      path: analyticsEvents.path,
      key: analyticsEvents.key,
      label: analyticsEvents.label,
      value: analyticsEvents.value,
      referrer: analyticsEvents.referrer,
    })
    .from(analyticsEvents)
    .innerJoin(analyticsVisitors, eq(analyticsEvents.visitorId, analyticsVisitors.id))
    .orderBy(desc(analyticsEvents.createdAt))
    .limit(50000);

  const header =
    "id;zaman;ziyaretci_id;ip;cihaz;yonetici;tip;sayfa;anahtar;etiket;deger_sn;kaynak";
  const lines = rows.map((r) =>
    [
      r.id,
      r.createdAt.toISOString(),
      r.visitorId,
      r.ipMasked,
      r.device,
      r.isAdmin ? "evet" : "",
      r.type,
      r.path,
      r.key,
      r.label,
      r.value,
      r.referrer,
    ]
      .map(esc)
      .join(";")
  );
  // BOM: Excel'in Türkçe karakterleri doğru açması için
  const csv = "﻿" + [header, ...lines].join("\r\n");

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="analitik.csv"',
    },
  });
}
