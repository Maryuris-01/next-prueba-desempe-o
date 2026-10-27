import { SignJWT, jwtVerify } from 'jose';
import { createHash, randomBytes } from 'crypto';

const accessSecret = process.env.JWT_ACCESS_SECRET;
if (!accessSecret) throw new Error('JWT_ACCESS_SECRET no está definida');

const accessSecretKey = new TextEncoder().encode(accessSecret);
const accessExpiresIn = process.env.ACCESS_TOKEN_EXPIRES_IN ?? '15m';

export type AccessTokenPayload = {
  userId: string;
  role: 'USER' | 'ADMIN';
};

export async function signAccessToken(payload: AccessTokenPayload): Promise<string> {
  return new SignJWT({ role: payload.role })
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(payload.userId)
    .setIssuedAt()
    .setExpirationTime(accessExpiresIn)
    .sign(accessSecretKey);
}

export async function verifyAccessToken(token: string): Promise<AccessTokenPayload | null> {
  try {
    const { payload } = await jwtVerify(token, accessSecretKey);
    const userId = payload.sub;
    const role = payload.role;
    if (typeof userId !== 'string' || (role !== 'USER' && role !== 'ADMIN')) return null;
    return { userId, role };
  } catch {
    return null;
  }
}

export function generateRefreshToken(): string {
  return randomBytes(32).toString('hex');
}

export function hashRefreshToken(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}