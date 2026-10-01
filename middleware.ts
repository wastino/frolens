import { NextRequest, NextResponse } from "next/server";

const cookieName = "frolens_admin_auth";
const defaultPassword = "frolens-admin";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isAdminRoute = pathname === "/admin" || pathname.startsWith("/admin/");
  const isAdminApiRoute = pathname.startsWith("/api/admin");

  if (!isAdminRoute && !isAdminApiRoute) {
    return NextResponse.next();
  }

  if (pathname === "/admin/login") {
    return NextResponse.next();
  }

  const expectedPassword = process.env.ADMIN_PASSWORD || defaultPassword;
  const isAuthenticated = request.cookies.get(cookieName)?.value === expectedPassword;

  if (isAuthenticated) {
    return NextResponse.next();
  }

  if (pathname === "/admin") {
    return NextResponse.redirect(new URL("/admin/login?next=/admin/blog", request.url));
  }

  if (isAdminApiRoute) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const nextPath = pathname === "/admin" ? "/admin/blog" : pathname;
  return NextResponse.redirect(new URL(`/admin/login?next=${encodeURIComponent(nextPath)}`, request.url));
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
