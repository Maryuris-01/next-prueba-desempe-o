import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { jsonOk, withErrorHandler } from '@/lib/api';
import { requireAdmin } from '@/lib/auth/session';
import { ValidationError } from '@/lib/errors';
import { createSpaceSchema } from '@/lib/validations';

export const GET = withErrorHandler(async (_req: NextRequest) => {
  const spaces = await prisma.space.findMany({
    where: { status: 'ACTIVE' },
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      name: true,
      description: true,
      price: true,
      image: true,
      status: true,
    },
  });
  return jsonOk({ spaces });
});

export const POST = withErrorHandler(async (req: NextRequest) => {
  await requireAdmin(req);

  const body = await req.json().catch(() => null);
  const parsed = createSpaceSchema.safeParse(body);

  if (!parsed.success) {
    throw new ValidationError('Datos inválidos', parsed.error.flatten().fieldErrors);
  }

  const space = await prisma.space.create({
    data: parsed.data,
    select: {
      id: true,
      name: true,
      description: true,
      price: true,
      image: true,
      status: true,
    },
  });

  return jsonOk({ space }, 201);
});