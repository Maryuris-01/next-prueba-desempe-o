import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword } from '@/lib/auth/password';
import { registerSchema } from '@/lib/validations';
import { jsonOk, withErrorHandler } from '@/lib/api';
import { ConflictError, ValidationError } from '@/lib/errors';

export const POST = withErrorHandler(async (req: NextRequest) => {
  const body = await req.json().catch(() => null);
  const parsed = registerSchema.safeParse(body);

  if (!parsed.success) {
    throw new ValidationError('Datos inválidos', parsed.error.flatten().fieldErrors);
  }

  const { name, email, password } = parsed.data;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) throw new ConflictError('El email ya está registrado.');

  const hashed = await hashPassword(password);

  const user = await prisma.user.create({
    data: { name, email, password: hashed, role: 'USER' },
    select: { id: true, name: true, email: true, role: true, createdAt: true },
  });

  return jsonOk(user, 201);
});