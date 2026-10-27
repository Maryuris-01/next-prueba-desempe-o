import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { AdminReservationActions } from '@/components/admin/AdminReservationActions';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

function formatDate(value: Date) {
  return new Intl.DateTimeFormat('es', { dateStyle: 'medium', timeStyle: 'short' }).format(value);
}

export default async function AdminPage() {
  const [spaceCount, activeSpaceCount, reservationCount, confirmedCount, reservations] = await Promise.all([
    prisma.space.count(),
    prisma.space.count({ where: { status: 'ACTIVE' } }),
    prisma.reservation.count(),
    prisma.reservation.count({ where: { status: 'CONFIRMED' } }),
    prisma.reservation.findMany({
      orderBy: { createdAt: 'desc' },
      take: 8,
      select: {
        id: true,
        startAt: true,
        hours: true,
        totalPrice: true,
        status: true,
        space: { select: { name: true } },
        user: { select: { name: true, email: true } },
      },
    }),
  ]);

  const metrics = [
    { label: 'Espacios publicados', value: activeSpaceCount, note: `${spaceCount} en total`, color: 'bg-[#f7e8e2]' },
    { label: 'Reservas registradas', value: reservationCount, note: 'Histórico completo', color: 'bg-[#e9eddf]' },
    { label: 'Reservas confirmadas', value: confirmedCount, note: 'Pendientes de realizar', color: 'bg-[#f2eadc]' },
  ];

  return (
    <div className="mx-auto max-w-6xl">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[.18em] text-[#a66d63]">Administración</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[#493631]">Resumen de CoSpace</h1>
          <p className="mt-2 text-[#806b63]">Una mirada rápida a tus espacios y reservas.</p>
        </div>
        <Link href="/admin/spaces" className="w-fit rounded-full bg-[#8e514b] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#74403b]">Gestionar espacios</Link>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {metrics.map((metric) => (
          <Card key={metric.label} className={`border-transparent ${metric.color} p-6 shadow-none`}>
            <p className="text-sm font-medium text-[#765f55]">{metric.label}</p>
            <p className="mt-2 text-4xl font-semibold tracking-tight text-[#493631]">{metric.value}</p>
            <p className="mt-1 text-xs text-[#8c7770]">{metric.note}</p>
          </Card>
        ))}
      </div>

      <div className="mt-10">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-[#503b35]">Actividad reciente</h2>
          <Link href="/admin/spaces" className="text-sm font-semibold text-[#8e514b] hover:underline">Administrar espacios →</Link>
        </div>
        <Card className="overflow-x-auto border-[#eadbd3] bg-[#fffdfa] p-0 shadow-none">
          {reservations.length ? (
            <table className="w-full min-w-[700px] text-left text-sm">
              <thead className="border-b border-[#eee2dc] bg-[#fbf6f2] text-xs uppercase tracking-wide text-[#8a746b]">
                <tr><th className="px-5 py-4 font-medium">Cliente</th><th className="px-5 py-4 font-medium">Espacio</th><th className="px-5 py-4 font-medium">Inicio</th><th className="px-5 py-4 font-medium">Estado</th><th className="px-5 py-4 font-medium">Total</th><th className="px-5 py-4 font-medium">Acción</th></tr>
              </thead>
              <tbody className="divide-y divide-[#f0e5df]">
                {reservations.map((reservation) => (
                  <tr key={reservation.id} className="text-[#614d45]">
                    <td className="px-5 py-4"><p className="font-medium">{reservation.user.name ?? 'Sin nombre'}</p><p className="text-xs text-[#9a847b]">{reservation.user.email}</p></td>
                    <td className="px-5 py-4">{reservation.space.name}</td>
                    <td className="px-5 py-4">{formatDate(reservation.startAt)}</td>
                    <td className="px-5 py-4"><span className={`rounded-full px-3 py-1 text-xs ${reservation.status === 'CONFIRMED' ? 'bg-[#e9eddf] text-[#566044]' : 'bg-[#f0e9e5] text-[#806b63]'}`}>{reservation.status === 'CONFIRMED' ? 'Confirmada' : 'Cancelada'}</span></td>
                    <td className="px-5 py-4">${Number(reservation.totalPrice).toFixed(2)}</td>
                    <td className="px-5 py-4"><AdminReservationActions id={reservation.id} status={reservation.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : <p className="px-6 py-12 text-center text-sm text-[#806b63]">Aún no hay reservas registradas.</p>}
        </Card>
      </div>
    </div>
  );
}
