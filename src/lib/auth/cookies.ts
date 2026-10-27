import { NextRequest, NextResponse } from 'next/server';

const ACCESS_COOKIE = 'access_token';
const REFRESH_COOKIE = 'refresh_token';

const isProd = process.env.NODE_ENV === 'production';

const accessMaxAge = 60 * 15; // 15 min
const refreshMaxAge = 60 * 60 * 24 * 7; // 7 días

export function setAuthCookies(
  res: NextResponse,
  accessToken: string,
  refreshToken: string,
): void {
  res.cookies.set(ACCESS_COOKIE, accessToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: 'lax',
    path: '/',
    maxAge: accessMaxAge,
  });

  res.cookies.set(REFRESH_COOKIE, refreshToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: 'lax',
    path: '/api/auth',
    maxAge: refreshMaxAge,
  });
}

export function clearAuthCookies(res: NextResponse): void {
  res.cookies.set(ACCESS_COOKIE, '', { path: '/', maxAge: 0 });
  res.cookies.set(REFRESH_COOKIE, '', { path: '/api/auth', maxAge: 0 });
}

export function getAccessToken(req: NextRequest): string | null {
  return req.cookies.get(ACCESS_COOKIE)?.value ?? null;
}

export function getRefreshToken(req: NextRequest): string | null {
  return req.cookies.get(REFRESH_COOKIE)?.value ?? null;
}