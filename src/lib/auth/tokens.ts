import { SignJWT, jwtVerify } from 'jose';
import crypto from 'crypto';

// Clave secreta leyendo exactamente tu variable de entorno
const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_ACCESS_SECRET || 'tu_secreto_super_seguro_cambialo_en_produccion'
);

// Tipo de los datos que viajan dentro del Access Token
export type AccessTokenPayload = {
  userId: string;
  role: 'USER' | 'ADMIN';
  name?: string | null;
};

/**
 * Genera y firma un nuevo Access Token (JWT) de corta duración.
 */
export async function signAccessToken(payload: AccessTokenPayload): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('15m')
    .sign(JWT_SECRET);
}

/**
 * Verifica y decodifica un Access Token. Retorna el payload si es válido, o null si falla.
 */
export async function verifyAccessToken(token: string): Promise<AccessTokenPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as AccessTokenPayload;
  } catch (error) {
    return null;
  }
}

/**
 * Genera un string aleatorio y seguro para usar como Refresh Token.
 */
export function generateRefreshToken(): string {
  return crypto.randomBytes(64).toString('hex');
}

/**
 * Aplica un hash SHA-256 al Refresh Token antes de guardarlo en la base de datos.
 */
export function hashRefreshToken(refreshToken: string): string {
  return crypto.createHash('sha256').update(refreshToken).digest('hex');
}