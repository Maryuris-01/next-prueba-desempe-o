import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { signAccessToken, generateRefreshToken, hashRefreshToken } from '@/lib/auth/tokens';
import { getRefreshToken, setAuthCookies } from '@/lib/auth/cookies';
import { jsonOk, withErrorHandler } from '@/lib/api';
import { UnauthorizedError } from '@/lib/errors';

export const POST = withErrorHandler(async (req: NextRequest) => {
  const refreshToken = getRefreshToken(req);
  if (!refreshToken) throw new UnauthorizedError('Refresh token no encontrado.');

  const tokenHash = hashRefreshToken(refreshToken);

  const stored = await prisma.refreshToken.findUnique({
    where: { tokenHash },
    include: { user: true },
  });

  if (!stored) throw new UnauthorizedError('Refresh token inválido.');
  if (stored.revokedAt) throw new UnauthorizedError('Refresh token revocado.');
  if (stored.expiresAt < new Date()) throw new UnauthorizedError('Refresh token expirado.');

  // Rotación: revocar el viejo
  await prisma.refreshToken.update({
    where: { id: stored.id },
    data: { revokedAt: new Date() },
  });

  // Crear uno nuevo
  const newRefreshToken = generateRefreshToken();
  const newTokenHash = hashRefreshToken(newRefreshToken);
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  await prisma.refreshToken.create({
    data: { tokenHash: newTokenHash, userId: stored.userId, expiresAt },
  });

  // Nuevo access token con datos actuales del usuario
  const accessToken = await signAccessToken({
    userId: stored.user.id,
    role: stored.user.role,
  });

  const res = jsonOk({ ok: true });
  setAuthCookies(res, accessToken, newRefreshToken);
  return res;
});