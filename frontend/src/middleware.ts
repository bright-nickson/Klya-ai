import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  // Get the pathname of the request
  const { pathname } = request.nextUrl;

  // For now, we're not protecting any routes
  // All routes are accessible without authentication
  
  // Continue with the request
  return NextResponse.next();
}

// Only run middleware on specific paths
// Match all paths except for the ones that start with:
// - api (API routes)
// - _next/static (static files)
// - _next/image (image optimization files)
// - favicon.ico (favicon file)
// - image files
// - public pages (home, about, features, pricing, contact, etc.)
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon\.ico|.*\.(?:svg|png|jpg|jpeg|gif|webp)$|api/.*|features/.*|pricing/.*|about/.*|contact/.*|login/.*|signup/.*).*)',
  ],
};