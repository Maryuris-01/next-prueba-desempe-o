import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyAccessToken } from '@/lib/auth/tokens';

const PUBLIC_ROUTES = ['/', '/catalog', '/login', '/register'];
const AUTH_ROUTES = ['/login', '/register'];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('access_token')?.value;

  const isPublic = PUBLIC_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );
  const isAuthRoute = AUTH_ROUTES.includes(pathname);

  // Si ya hay sesión y va a login/register, redirigir al dashboard
  if (token && isAuthRoute) {
    const session = await verifyAccessToken(token);
    if (session) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }

  // Rutas públicas: dejar pasar
  if (isPublic) {
    return NextResponse.next();
  }

  // Rutas privadas: exigir sesión
  if (!token) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  const session = await verifyAccessToken(token);
  if (!session) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    const res = NextResponse.redirect(loginUrl);
    res.cookies.set('access_token', '', { path: '/', maxAge: 0 });
    return res;
  }

  // Rutas de admin: exigir rol ADMIN
  if (pathname.startsWith('/admin') && session.role !== 'ADMIN') {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};