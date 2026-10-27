import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { jsonOk, withErrorHandler, RouteContext } from '@/lib/api';
import { requireAdmin } from '@/lib/auth/session';
import { ConflictError, NotFoundError } from '@/lib/errors';

export const PATCH = withErrorHandler(async (req: NextRequest, ctx: RouteContext) => {
  await requireAdmin(req);

  const { id } = await ctx.params;

  const space = await prisma.space.findUnique({ where: { id } });
  if (!space) throw new NotFoundError('Espacio no encontrado.');

  if (space.status === 'INACTIVE') {
    throw new ConflictError('El espacio ya está desactivado.');
  }

  const futureReservations = await prisma.reservation.count({
    where: {
      spaceId: id,
      status: 'CONFIRMED',
      startAt: { gt: new Date() },
    },
  });

  if (futureReservations > 0) {
    throw new ConflictError(
      'No se puede desactivar un espacio con reservas futuras confirmadas.',
    );
  }

  const updated = await prisma.space.update({
    where: { id },
    data: { status: 'INACTIVE' },
    select: {
      id: true,
      name: true,
      status: true,
    },
  });

  return jsonOk({ space: updated });
});