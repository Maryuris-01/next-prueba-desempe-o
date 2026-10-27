import { NextRequest } from 'next/server';
import { getAccessToken } from './cookies';
import { verifyAccessToken, AccessTokenPayload } from './tokens';
import { UnauthorizedError, ForbiddenError } from '../errors';

export async function getSession(req: NextRequest): Promise<AccessTokenPayload | null> {
  const token = getAccessToken(req);
  if (!token) return null;
  return verifyAccessToken(token);
}

export async function requireSession(req: NextRequest): Promise<AccessTokenPayload> {
  const session = await getSession(req);
  if (!session) throw new UnauthorizedError('Sesión requerida.');
  return session;
}

export async function requireAdmin(req: NextRequest): Promise<AccessTokenPayload> {
  const session = await requireSession(req);
  if (session.role !== 'ADMIN') throw new ForbiddenError('Se requiere rol de administrador.');
  return session;
}