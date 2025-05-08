import { Session } from "inspector/promises";
import { NextRequest, NextResponse } from "next/server";
import { auth, signOut } from "@/app/api/auth/[...nextauth]/options";

export { auth as authMiddleware } from "@/app/api/auth/[...nextauth]/options";
const protectedRoutes = ["/dashboard"];
const publicRoutes = ["/signin", "/signup", "/"];

export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const isProtectedRoute = protectedRoutes.includes(path);
  const isPublicRoute = publicRoutes.includes(path);

  const session = await auth();
  const currentTime = new Date();
  const sessionExpiry = session?.expires ? new Date(session.expires) : null;

  if (
    isProtectedRoute &&
    (!session || (sessionExpiry && currentTime > sessionExpiry))
  ) {
    return NextResponse.redirect(new URL("/signin", req.nextUrl));
  }
  if (
    isPublicRoute &&
    session &&
    !req.nextUrl.pathname.startsWith("/dashboard")
  ) {
    return NextResponse.redirect(new URL("/dashboard", req.nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
