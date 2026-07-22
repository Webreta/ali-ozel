import "server-only";
import { createHash } from "crypto";

// Ziyaretçi kimliği: ham IP hiç saklanmaz; hash AUTH_SECRET ile tuzlanır,
// panelde yalnızca maskeli IP gösterilir (KVKK).

export function getClientIp(headers: Headers): string {
  const fwd = headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return headers.get("x-real-ip") ?? "0.0.0.0";
}

export function maskIp(ip: string): string {
  if (ip === "::1" || ip === "127.0.0.1" || ip === "::ffff:127.0.0.1") {
    return "localhost";
  }
  if (ip.includes(".")) {
    const parts = ip.split(".");
    if (parts.length === 4) return `${parts[0]}.${parts[1]}.${parts[2]}.xxx`;
  }
  if (ip.includes(":")) {
    const groups = ip.split(":").filter(Boolean);
    return groups.slice(0, 3).join(":") + ":…";
  }
  return ip;
}

export function visitorHash(ip: string, ua: string): string {
  return createHash("sha256")
    .update(`${ip}|${ua}|${process.env.AUTH_SECRET ?? ""}`)
    .digest("hex");
}

export function isBotUa(ua: string): boolean {
  return /bot|crawl|spider|slurp|bingpreview|petalbot|semrush|ahrefs|facebookexternalhit|headless|lighthouse/i.test(
    ua
  );
}

export type UaInfo = {
  device: "desktop" | "mobile" | "tablet";
  browser: string | null;
  os: string | null;
};

export function parseUa(ua: string): UaInfo {
  const device: UaInfo["device"] = /ipad|tablet/i.test(ua)
    ? "tablet"
    : /mobi|android|iphone/i.test(ua)
      ? "mobile"
      : "desktop";

  let browser: string | null = null;
  if (/edg\//i.test(ua)) browser = "Edge";
  else if (/opr\/|opera/i.test(ua)) browser = "Opera";
  else if (/samsungbrowser/i.test(ua)) browser = "Samsung Internet";
  else if (/firefox\//i.test(ua)) browser = "Firefox";
  else if (/chrome\/|crios\//i.test(ua)) browser = "Chrome";
  else if (/safari\//i.test(ua)) browser = "Safari";

  let os: string | null = null;
  if (/windows/i.test(ua)) os = "Windows";
  else if (/iphone|ipad|ios/i.test(ua)) os = "iOS";
  else if (/mac os x|macintosh/i.test(ua)) os = "macOS";
  else if (/android/i.test(ua)) os = "Android";
  else if (/linux/i.test(ua)) os = "Linux";

  return { device, browser, os };
}
