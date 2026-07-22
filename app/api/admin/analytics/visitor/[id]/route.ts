import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/session";
import { getVisitorEvents } from "@/lib/data/analytics";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser();
  if (!user || user.role !== "admin") {
    return NextResponse.json({ error: "unauthorized" }, { status: 403 });
  }
  const { id } = await params;
  const visitorId = Number(id);
  if (!Number.isInteger(visitorId)) {
    return NextResponse.json({ error: "bad id" }, { status: 400 });
  }
  const events = await getVisitorEvents(visitorId);
  return NextResponse.json({
    events: events.map((e) => ({
      id: e.id,
      type: e.type,
      path: e.path,
      key: e.key,
      label: e.label,
      value: e.value,
      referrer: e.referrer,
      createdAt: e.createdAt.toISOString(),
    })),
  });
}
