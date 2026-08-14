import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PROTECTED = ["/dashboard", "/form"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect dashboard and form submissions (not the public form itself)
  const isProtected =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/account") ||
    pathname.match(/^\/form\/[^/]+\/submissions/);

  if (!isProtected) return NextResponse.next();

  // Auth token is stored in httpOnly cookie named "token"
  const token = request.cookies.get("token")?.value;

  if (!token) {
    // Redirect to home with a ?redirect param so after login we can go back
    const url = request.nextUrl.clone();
    url.pathname = "/";
    url.searchParams.set("redirect", pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/form/:id/submissions", "/account/:path*", "/account"],
};
