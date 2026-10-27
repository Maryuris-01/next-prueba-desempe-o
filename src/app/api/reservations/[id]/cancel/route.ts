import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { jsonOk, withErrorHandler, RouteContext } from '@/lib/api';
import { requireSession } from '@/lib/auth/session';
import { ConflictError, ForbiddenError, NotFoundError } from '@/lib/errors';

export const PATCH = withErrorHandler(async (req: NextRequest, ctx: RouteContext) => {
  const session = await requireSession(req);
  const { id } = await ctx.params;

  const reservation = await prisma.reservation.findUnique({ where: { id } });
  if (!reservation) throw new NotFoundError('Reserva no encontrada.');

  // Regla 9: solo dueño o admin
  const isOwner = reservation.userId === session.userId;
  const isAdmin = session.role === 'ADMIN';
  if (!isOwner && !isAdmin) {
    throw new ForbiddenError('No puedes cancelar una reserva que no es tuya.');
  }

  // Regla 11: ya cancelada
  if (reservation.status === 'CANCELLED') {
    throw new ConflictError('La reserva ya está cancelada.');
  }

  // Regla 10: solo dueño hasta 2h antes; admin puede siempre
  if (isOwner && !isAdmin) {
    const twoHoursBefore = new Date(reservation.startAt.getTime() - 2 * 60 * 60 * 1000);
    if (new Date() > twoHoursBefore) {
      throw new ConflictError(
        'Solo puedes cancelar hasta 2 horas antes del inicio de la reserva.',
      );
    }
  }

  // Regla 11: cambiar estado, no borrar
  const cancelled = await prisma.reservation.update({
    where: { id },
    data: {
      status: 'CANCELLED',
      cancelledAt: new Date(),
    },
    select: {
      id: true,
      startAt: true,
      endAt: true,
      hours: true,
      totalPrice: true,
      status: true,
      cancelledAt: true,
      space: { select: { id: true, name: true } },
    },
  });

  return jsonOk({ reservation: cancelled });
});