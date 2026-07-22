import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import type { SessionData } from "@/lib/types";

export function proxy(request: NextRequest) {
  const sessionCookie = request.cookies.get("farmfresh_session");

  const path = request.nextUrl.pathname;

  const isProtectedPath =
    path.startsWith("/dashboard") ||
    path.startsWith("/admin") ||
    path === "/cart" ||
    path === "/checkout" ||
    path.startsWith("/orders");

  if (!sessionCookie && isProtectedPath) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (sessionCookie && sessionCookie.value) {
    try {
      const sessionValue = Buffer.from(sessionCookie.value, "base64").toString(
        "utf-8",
      );
      const session = JSON.parse(sessionValue) as SessionData;

      // Role-based redirects
      if (session.role === "farmer") {
        if (path.startsWith("/admin")) {
          return NextResponse.redirect(new URL("/dashboard", request.url));
        }
        if (path === "/cart" || path === "/checkout") {
          return NextResponse.redirect(new URL("/dashboard", request.url));
        }
      } else if (session.role === "consumer") {
        if (path.startsWith("/admin")) {
          return NextResponse.redirect(new URL("/products", request.url));
        }
        if (path.startsWith("/dashboard")) {
          return NextResponse.redirect(new URL("/products", request.url));
        }
      }
    } catch (error) {
      console.error("Error parsing session in proxy:", error);
      // Optional: Clear invalid cookie or just redirect to login if protected path
      if (isProtectedPath) {
        return NextResponse.redirect(new URL("/login", request.url));
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/admin/:path*",
    "/cart",
    "/checkout",
    "/orders/:path*",
  ],
};
