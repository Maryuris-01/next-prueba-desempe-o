import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getRefreshToken, clearAuthCookies } from '@/lib/auth/cookies';
import { hashRefreshToken } from '@/lib/auth/tokens';
import { jsonOk, withErrorHandler } from '@/lib/api';

export const POST = withErrorHandler(async (req: NextRequest) => {
  const refreshToken = getRefreshToken(req);

  if (refreshToken) {
    const tokenHash = hashRefreshToken(refreshToken);
    await prisma.refreshToken.updateMany({
      where: { tokenHash, revokedAt: null },
      data: { revokedAt: new Date() },
    });
  }

  const res = jsonOk({ ok: true });
  clearAuthCookies(res);
  return res;
});