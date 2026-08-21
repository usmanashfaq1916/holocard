import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/config";

export async function middleware(req: Request) {
  const url = new URL(req.url);
  const pathname = url.pathname;

  if (pathname.startsWith("/dashboard") || pathname.startsWith("/admin")) {
    const session = await auth();

    if (!session?.user) {
      const loginUrl = new URL("/login", url.origin);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }

    if (pathname.startsWith("/admin") && (session.user as { role?: string }).role !== "ADMIN") {
      return NextResponse.redirect(new URL("/dashboard", url.origin));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*"],
};
