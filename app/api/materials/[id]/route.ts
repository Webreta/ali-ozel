import { NextResponse, type NextRequest } from "next/server";
import { createReadStream } from "fs";
import { stat } from "fs/promises";
import path from "path";
import { Readable } from "stream";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { brandNoteMaterials } from "@/db/schema";
import { getAccessibleNoteIds } from "@/lib/noteAccess";
import { getCurrentUser } from "@/lib/auth/session";
import { UPLOAD_DIR } from "@/lib/uploads";

/**
 * Erişim kontrollü materyal indirme: dosya yolu asla istekten gelmez,
 * DB id'siyle bulunur; erişim cookie'si (veya panel oturumu) şarttır.
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const numericId = Number(id);
  if (!Number.isInteger(numericId)) {
    return new NextResponse("Geçersiz istek", { status: 400 });
  }

  const [material] = await db
    .select()
    .from(brandNoteMaterials)
    .where(eq(brandNoteMaterials.id, numericId))
    .limit(1);
  if (!material || !material.filePath) {
    return new NextResponse("Bulunamadı", { status: 404 });
  }

  const [accessible, user] = await Promise.all([
    getAccessibleNoteIds(),
    getCurrentUser(),
  ]);
  if (!accessible.includes(material.brandNoteId) && !user) {
    return new NextResponse("Erişim kodu gerekli", { status: 403 });
  }

  const resolved = path.resolve(UPLOAD_DIR, material.filePath);
  if (!resolved.startsWith(UPLOAD_DIR + path.sep)) {
    return new NextResponse("Geçersiz yol", { status: 400 });
  }

  try {
    const info = await stat(resolved);
    const stream = Readable.toWeb(createReadStream(resolved)) as ReadableStream;
    const safeName = material.name.replace(/[^\wçğıöşüÇĞİÖŞÜ .-]/g, "") + ".pdf";
    return new NextResponse(stream, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Length": String(info.size),
        "Content-Disposition": `attachment; filename*=UTF-8''${encodeURIComponent(safeName)}`,
        "X-Content-Type-Options": "nosniff",
        "Cache-Control": "private, no-store",
      },
    });
  } catch {
    return new NextResponse("Bulunamadı", { status: 404 });
  }
}
