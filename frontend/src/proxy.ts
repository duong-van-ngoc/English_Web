import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

interface DecodedToken {
  role?: string;
  exp?: number;
}

function decodeJwt(token: string): DecodedToken | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = atob(base64);
    return JSON.parse(jsonPayload) as DecodedToken;
  } catch (e) {
    return null;
  }
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/admin")) {
    const tokenCookie = request.cookies.get("accessToken");
    const token = tokenCookie?.value;

    if (!token) {
      const url = new URL("/login", request.url);
      url.searchParams.set("next", pathname);
      return NextResponse.redirect(url);
    }

    const decoded = decodeJwt(token);
    if (!decoded) {
      const url = new URL("/login", request.url);
      return NextResponse.redirect(url);
    }

    if (decoded.exp && decoded.exp * 1000 < Date.now()) {
      const url = new URL("/login", request.url);
      return NextResponse.redirect(url);
    }

    const userRole = decoded.role?.toUpperCase();
    if (userRole !== "ADMIN") {
      const url = new URL("/403", request.url);
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
