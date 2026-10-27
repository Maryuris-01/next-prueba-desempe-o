import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { jsonOk, withErrorHandler, RouteContext } from '@/lib/api';
import { requireAdmin } from '@/lib/auth/session';
import { NotFoundError, ValidationError } from '@/lib/errors';
import { updateSpaceSchema } from '@/lib/validations';

export const GET = withErrorHandler(async (_req: NextRequest, ctx: RouteContext) => {
  const { id } = await ctx.params;

  const space = await prisma.space.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      description: true,
      price: true,
      image: true,
      status: true,
    },
  });

  if (!space) throw new NotFoundError('Espacio no encontrado.');

  return jsonOk({ space });
});

export const PATCH = withErrorHandler(async (req: NextRequest, ctx: RouteContext) => {
  await requireAdmin(req);

  const { id } = await ctx.params;

  const body = await req.json().catch(() => null);
  const parsed = updateSpaceSchema.safeParse(body);

  if (!parsed.success) {
    throw new ValidationError('Datos inválidos', parsed.error.flatten().fieldErrors);
  }

  const existing = await prisma.space.findUnique({ where: { id } });
  if (!existing) throw new NotFoundError('Espacio no encontrado.');

  const space = await prisma.space.update({
    where: { id },
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

  return jsonOk({ space });
});