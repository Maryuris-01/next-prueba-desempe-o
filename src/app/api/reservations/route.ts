import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { jsonOk, withErrorHandler } from '@/lib/api';
import { requireSession } from '@/lib/auth/session';
import { ConflictError, NotFoundError, ValidationError } from '@/lib/errors';
import { createReservationSchema } from '@/lib/validations';

 

export const GET = withErrorHandler(async (req: NextRequest) => {
  const session = await requireSession(req);

  const reservations = await prisma.reservation.findMany({
    where: { userId: session.userId },
    orderBy: { startAt: 'desc' },
    select: {
      id: true,
      startAt: true,
      endAt: true,
      hours: true,
      totalPrice: true,
      status: true,
      createdAt: true,
      cancelledAt: true,
      space: {
        select: { id: true, name: true, image: true, price: true },
      },
    },
  });

  return jsonOk({ reservations });
});

export const POST = withErrorHandler(async (req: NextRequest) => {
  const session = await requireSession(req);

  const body = await req.json().catch(() => null);
  const parsed = createReservationSchema.safeParse(body);

  if (!parsed.success) {
    throw new ValidationError('Datos inválidos', parsed.error.flatten().fieldErrors);
  }

  const { spaceId, startAt, hours } = parsed.data;
  const start = new Date(startAt);
  const end = new Date(start.getTime() + hours * 60 * 60 * 1000);

  // Regla 7: espacio existe y está activo
  const space = await prisma.space.findUnique({ where: { id: spaceId } });
  if (!space) throw new NotFoundError('Espacio no encontrado.');
  if (space.status === 'INACTIVE') {
    throw new ConflictError('El espacio está desactivado.');
  }

  // Regla 2: horario entre 7:00 y 21:00
  const startHour = start.getHours() + start.getMinutes() / 60;
  const endHour = end.getHours() + end.getMinutes() / 60;
  if (startHour < 7 || endHour > 21) {
    throw new ConflictError('Solo se puede reservar entre las 7:00 y las 21:00.');
  }

  // Regla 3: no en el pasado ni con más de 30 días
  const now = new Date();
  const maxDate = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
  if (start <= now) {
    throw new ConflictError('No se puede reservar en el pasado.');
  }
  if (start > maxDate) {
    throw new ConflictError('No se puede reservar con más de 30 días de anticipación.');
  }

  // Regla 4: solapamiento en el espacio
  const spaceOverlap = await prisma.reservation.findFirst({
    where: {
      spaceId,
      status: 'CONFIRMED',
      startAt: { lt: end },
      endAt: { gt: start },
    },
  });
  if (spaceOverlap) {
    throw new ConflictError('El espacio ya tiene una reserva en ese horario.');
  }

  // Regla 5: solapamiento del usuario en cualquier espacio
  const userOverlap = await prisma.reservation.findFirst({
    where: {
      userId: session.userId,
      status: 'CONFIRMED',
      startAt: { lt: end },
      endAt: { gt: start },
    },
  });
  if (userOverlap) {
    throw new ConflictError('Ya tienes otra reserva en ese horario.');
  }

  // Regla 6: máximo 3 reservas futuras confirmadas
  const futureCount = await prisma.reservation.count({
    where: {
      userId: session.userId,
      status: 'CONFIRMED',
      startAt: { gt: now },
    },
  });
  if (futureCount >= 3) {
    throw new ConflictError('Ya tienes 3 reservas futuras confirmadas.');
  }

  // Regla 8: precio calculado en el servidor
  const totalPrice = Number(space.price) * hours;

  const reservation = await prisma.reservation.create({
    data: {
      userId: session.userId,
      spaceId,
      startAt: start,
      endAt: end,
      hours,
      totalPrice,
      status: 'CONFIRMED',
    },
    select: {
      id: true,
      startAt: true,
      endAt: true,
      hours: true,
      totalPrice: true,
      status: true,
      space: { select: { id: true, name: true, price: true } },
    },
  });

  return jsonOk({ reservation }, 201);
});