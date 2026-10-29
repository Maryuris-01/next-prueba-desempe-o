import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyPassword } from '@/lib/auth/password';
import { signAccessToken, generateRefreshToken, hashRefreshToken } from '@/lib/auth/tokens';
import { setAuthCookies } from '@/lib/auth/cookies';
import { loginSchema } from '@/lib/validations';
import { jsonOk, withErrorHandler } from '@/lib/api';
import { UnauthorizedError, ValidationError } from '@/lib/errors';

export const POST = withErrorHandler(async (req: NextRequest) => {
  const body = await req.json().catch(() => null);
  const parsed = loginSchema.safeParse(body);

  if (!parsed.success) {    
    throw new ValidationError('Datos inválidos', parsed.error.flatten().fieldErrors);
  }

  const { email, password } = parsed.data;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new UnauthorizedError('Credenciales inválidas.');

  const valid = await verifyPassword(password, user.password);
  if (!valid) throw new UnauthorizedError('Credenciales inválidas.');

  const accessToken = await signAccessToken({ userId: user.id, role: user.role, name: user.name ?? 'Usuario' });

  const refreshToken = generateRefreshToken();
  const tokenHash = hashRefreshToken(refreshToken);

  const refreshDays = 7;
  const expiresAt = new Date(Date.now() + refreshDays * 24 * 60 * 60 * 1000);

  await prisma.refreshToken.create({
    data: { tokenHash, userId: user.id, expiresAt },
  });

  const res = jsonOk({
    user: { id: user.id, name: user.name, email: user.email, role: user.role },
  });

  setAuthCookies(res, accessToken, refreshToken);

  return res;
});