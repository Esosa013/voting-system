import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
    if (req.nextUrl.pathname.startsWith("/api/")) {
    return NextResponse.next();
  }

  const cookieHeader = req.headers.get("cookie") || "";
  const token = cookieHeader
    .split("; ")
    .find((c) => c.startsWith("token="))
    ?.split("=")[1];

    if (req.nextUrl.pathname === "/login" || req.nextUrl.pathname === "/signup") {
        return NextResponse.next();
  }


  if (!token) {
        return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

// ✅ Fix: Exclude API routes from middleware
export const config = {
  matcher: ["/((?!api/|_next/static|_next/image|favicon.ico).*)"], // Exclude API calls
};
