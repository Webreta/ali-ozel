import "server-only";
import path from "path";

export const UPLOAD_DIR = path.resolve(process.env.UPLOAD_DIR ?? "./.uploads");

// Magic byte imzaları — Content-Type header'ına güvenilmez
const SIGNATURES: { ext: string; mime: string; check: (b: Buffer) => boolean }[] = [
  { ext: "jpg", mime: "image/jpeg", check: (b) => b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff },
  { ext: "png", mime: "image/png", check: (b) => b.subarray(0, 4).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47])) },
  {
    ext: "webp",
    mime: "image/webp",
    check: (b) =>
      b.subarray(0, 4).toString("ascii") === "RIFF" &&
      b.subarray(8, 12).toString("ascii") === "WEBP",
  },
  { ext: "pdf", mime: "application/pdf", check: (b) => b.subarray(0, 4).toString("ascii") === "%PDF" },
];

export function sniffFile(buffer: Buffer) {
  if (buffer.length < 12) return null;
  return SIGNATURES.find((s) => s.check(buffer)) ?? null;
}

export const MAX_UPLOAD_BYTES = 15 * 1024 * 1024;

export function contentTypeFor(filePath: string): string {
  const ext = path.extname(filePath).toLowerCase();
  return (
    {
      ".jpg": "image/jpeg",
      ".jpeg": "image/jpeg",
      ".png": "image/png",
      ".webp": "image/webp",
      ".pdf": "application/pdf",
    }[ext] ?? "application/octet-stream"
  );
}
