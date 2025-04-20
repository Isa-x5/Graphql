import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  // Get the JWT token from the cookies
  const token = req.cookies.get('jwt') || '';

  // Define your protected paths
  const protectedPaths = ['/home'];

  // Define the login path
  const loginPath = '/login';

  // If the user is not logged in (no token) and tries to access protected paths
  if (!token && protectedPaths.includes(req.nextUrl.pathname)) {
    return NextResponse.redirect(new URL(loginPath, req.url));
  }

  // If the user is logged in (has a token) and tries to access the login page
  if (token && req.nextUrl.pathname === loginPath) {
    return NextResponse.redirect(new URL('/home', req.url));
  }

  // Allow the request to continue for other paths
  return NextResponse.next();
}

// The path patterns to which this middleware will apply
export const config = {
  matcher: ['/home', '/login'], // Add any other routes you want to protect
};
