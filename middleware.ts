import { NextResponse, type NextRequest } from "next/server";

/**
 * /admin için İYİMSER kontrol: yalnızca cookie'nin varlığına bakar (edge'de DB yok).
 * Gerçek doğrulama her zaman panel layout'unda ve server action'larda yapılır
 * (requireUser/requireAdmin) — middleware tek başına güvenlik sınırı değildir.
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isLoginPage = pathname === "/admin/giris";
  const hasSessionCookie = request.cookies.has("session");

  if (!isLoginPage && !hasSessionCookie) {
    const loginUrl = new URL("/admin/giris", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  const response = NextResponse.next();
  response.headers.set("Cache-Control", "no-store");
  response.headers.set("X-Robots-Tag", "noindex, nofollow");
  response.headers.set("X-Frame-Options", "DENY");
  return response;
}

export const config = {
  matcher: ["/admin/:path*"],
};
