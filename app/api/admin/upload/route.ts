import { NextResponse, type NextRequest } from "next/server";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";
import sharp from "sharp";
import { getCurrentUser } from "@/lib/auth/session";
import { sniffFile, UPLOAD_DIR, MAX_UPLOAD_BYTES } from "@/lib/uploads";

/**
 * Panel dosya yükleme ucu. Server action DEĞİL — Next'in yerleşik Origin
 * koruması burada geçerli olmadığından Origin/Host kontrolü elle yapılır.
 */
export async function POST(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  }

  const origin = request.headers.get("origin");
  const host = request.headers.get("host");
  if (!origin || !host || new URL(origin).host !== host) {
    return NextResponse.json({ error: "Geçersiz istek kaynağı" }, { status: 403 });
  }

  const formData = await request.formData();
  const file = formData.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Dosya bulunamadı" }, { status: 400 });
  }
  if (file.size > MAX_UPLOAD_BYTES) {
    return NextResponse.json(
      { error: "Dosya 15 MB'den büyük olamaz" },
      { status: 413 }
    );
  }

  let buffer = Buffer.from(await file.arrayBuffer());
  const kind = sniffFile(buffer);
  if (!kind) {
    return NextResponse.json(
      { error: "Yalnızca JPG, PNG, WebP ve PDF yüklenebilir" },
      { status: 415 }
    );
  }

  let ext = kind.ext;
  if (ext !== "pdf") {
    // Görseller normalize edilir: EXIF'e göre döndür, 1920px'e sığdır,
    // webp'ye çevir. Yeniden kodlama olası zararlı payload'ları da temizler.
    try {
      buffer = Buffer.from(
        await sharp(buffer)
          .rotate()
          .resize({ width: 1920, height: 1920, fit: "inside", withoutEnlargement: true })
          .webp({ quality: 82 })
          .toBuffer()
      );
      ext = "webp";
    } catch {
      return NextResponse.json(
        { error: "Görsel işlenemedi — dosya bozuk olabilir" },
        { status: 422 }
      );
    }
  }

  const subdir = ext === "pdf" ? "materials" : "images";
  const fileName = `${randomUUID()}.${ext}`;
  const dir = path.join(UPLOAD_DIR, subdir);
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, fileName), buffer);

  return NextResponse.json({
    url: `/uploads/${subdir}/${fileName}`,
    size: buffer.length,
  });
}
