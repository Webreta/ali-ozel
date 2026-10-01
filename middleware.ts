import { NextResponse, type NextRequest } from "next/server";

/**
 * Alan adının önceki sahibinden kalan spam WordPress adresleri (/14/1,
 * /category/..., /tag/..., /wp-content/... vb.). Bu sitede karşılıkları yok;
 * Google'ın eski kayıtları kalıcı olarak düşürmesi için 404 yerine 410 döner.
 */
const LEGACY_SPAM =
  /^\/(?:category|tag|author|date|comments|wp-content|wp-includes|wp-json|wp-admin)(?:\/|$)|^\/(?:feed|wp-login\.php|xmlrpc\.php)$|^\/\d+\/\d+$/;

/**
 * /admin için İYİMSER kontrol: yalnızca cookie'nin varlığına bakar (edge'de DB yok).
 * Gerçek doğrulama her zaman panel layout'unda ve server action'larda yapılır
 * (requireUser/requireAdmin) — middleware tek başına güvenlik sınırı değildir.
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (LEGACY_SPAM.test(pathname)) {
    return new NextResponse("410 Gone", {
      status: 410,
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "X-Robots-Tag": "noindex",
      },
    });
  }

  if (!pathname.startsWith("/admin")) return NextResponse.next();

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
  matcher: [
    "/admin/:path*",
    "/(category|tag|author|date|comments|wp-content|wp-includes|wp-json|wp-admin)/:path*",
    "/(feed|wp-login.php|xmlrpc.php)",
    "/:a(\\d+)/:b(\\d+)",
  ],
};
