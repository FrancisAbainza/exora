import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { decodeJwt } from "jose";

function refreshAuthToken(token: string, request: NextRequest) {
  // We use decodeJwt() instead of auth.verifyIdToken() to prevent errors if token is expired.
  const decodedToken = decodeJwt(token);

  if (decodedToken.exp && (decodedToken.exp - 300) * 1000 < Date.now()) {
    return NextResponse.redirect(
      new URL(
        `/api/refresh-token?redirect=${encodeURIComponent(
          request.nextUrl.pathname
        )}`,
        request.url
      )
    );
  }
}

export async function middleware(request: NextRequest) {
  if (request.method === "POST") {
    return NextResponse.next();
  }

  const cookieStore = await cookies();
  const token = cookieStore.get("firebaseAuthToken")?.value;

  if (!token && (
    request.nextUrl.pathname === "/" ||
    request.nextUrl.pathname.startsWith("/login") ||
    request.nextUrl.pathname.startsWith("/register")
  )) {
    return NextResponse.next();
  }

  if (token && (
    request.nextUrl.pathname === "/" ||
    request.nextUrl.pathname.startsWith("/login") ||
    request.nextUrl.pathname.startsWith("/register")
  )) {
    return NextResponse.redirect(new URL("/home", request.url));
  }

  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Refresh the auth token
  // If the token is only 5 mins away from expiring, refresh the token
  // auth.verifyIdToken(token) will error if token isn't refreshed
  refreshAuthToken(token, request);

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/login",
    "/register",
    "/home",
    "/create-post",
    "/account",
    "/project/:path*",
    "/user/:path*",
  ],
};