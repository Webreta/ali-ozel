import { NextResponse, type NextRequest } from "next/server";
import { createReadStream } from "fs";
import { stat } from "fs/promises";
import path from "path";
import { Readable } from "stream";
import { contentTypeFor, UPLOAD_DIR } from "@/lib/uploads";

/**
 * Yüklenen dosyaları diskten servis eder. Prod'da nginx'in
 * `location /uploads/` alias'ı bu handler'a hiç düşürmez; dev ortamı ve
 * nginx'siz kurulumlar için yedek yoldur.
 *
 * Gated materyaller (PDF) buradan SERVİS EDİLMEZ — onlar erişim kodu
 * kontrolü yapan /api/materials/[id] üzerinden iner.
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path: segments } = await params;

  // Path traversal koruması: normalize edip kök dizin altında kaldığını doğrula
  const relative = segments.join("/");
  const resolved = path.resolve(UPLOAD_DIR, relative);
  if (!resolved.startsWith(UPLOAD_DIR + path.sep)) {
    return new NextResponse("Geçersiz yol", { status: 400 });
  }
  // materials/ yalnızca erişim kontrollü uçtan iner
  if (!resolved.startsWith(path.join(UPLOAD_DIR, "images") + path.sep)) {
    return new NextResponse("Bulunamadı", { status: 404 });
  }

  try {
    const info = await stat(resolved);
    if (!info.isFile()) throw new Error("not a file");
    const stream = Readable.toWeb(
      createReadStream(resolved)
    ) as ReadableStream;
    return new NextResponse(stream, {
      headers: {
        "Content-Type": contentTypeFor(resolved),
        "Content-Length": String(info.size),
        "Cache-Control": "public, max-age=2592000, immutable",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch {
    return new NextResponse("Bulunamadı", { status: 404 });
  }
}
