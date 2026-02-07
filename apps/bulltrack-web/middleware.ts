import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  AUTH_COOKIE_NAME,
  DEFAULT_AUTHENTICATED_PATH,
  LOGIN_PATH,
  PROTECTED_PATH_PREFIXES,
} from "@/lib/auth-constants";

const isMockMode = process.env.NEXT_PUBLIC_USE_MOCK_DATA === "true";

function isProtectedPath(pathname: string): boolean {
  return PROTECTED_PATH_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );
}

function hasAuthCookie(request: NextRequest): boolean {
  return request.cookies.has(AUTH_COOKIE_NAME);
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (isMockMode) {
    return NextResponse.next();
  }

  const authenticated = hasAuthCookie(request);

  if (isProtectedPath(pathname)) {
    if (!authenticated) {
      const loginUrl = new URL(LOGIN_PATH, request.url);
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  if (pathname === LOGIN_PATH && authenticated) {
    return NextResponse.redirect(
      new URL(DEFAULT_AUTHENTICATED_PATH, request.url)
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/classification-results",
    "/classification-results/:path*",
    "/login",
  ],
};
