import { NextResponse } from "next/server"

export function middleware(request) {
  const token = request.cookies.get("auth-token")?.value
  const { pathname } = request.nextUrl

  // Public routes that don't need authentication
  const publicRoutes = ["/", "/user/login", "/user/register", "/admin/login", "/admin/register"]

  if (publicRoutes.includes(pathname)) {
    return NextResponse.next()
  }

  // Check if user is authenticated
  if (!token) {
    return NextResponse.redirect(new URL("/", request.url))
  }

  // For protected routes, let the API routes handle detailed authorization
  return NextResponse.next()
}

export const config = {
  matcher: ["/user/:path*", "/admin/:path*"],
}
