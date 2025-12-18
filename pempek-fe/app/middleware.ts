// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get("admin_token");
  const pathname = request.nextUrl.pathname;

  // Protected routes
  const protectedRoutes = ['/dashboard', '/orders', '/products', '/info'];
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));

  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (pathname === '/login' && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/(dashboard|orders|products|info|login)/:path*', '/dashboard', '/orders', '/products', '/info', '/login']
};