'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

type Reservation = {
  id: string;
  startAt: string;
  endAt: string;
  hours: number;
  totalPrice: number | string;
  status: 'CONFIRMED' | 'CANCELLED';
  space: { id: string; name: string; image: string | null; price: number | string };
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat('es', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value));
}

export default function DashboardPage() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionError, setActionError] = useState('');
  const [cancellingId, setCancellingId] = useState('');
  const searchParams = useSearchParams();

  const loadReservations = useCallback(async () => {
    setError('');
    try {
      const response = await fetch('/api/reservations', { cache: 'no-store' });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error?.message ?? 'No fue posible cargar tus reservas.');
      setReservations(result.reservations);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'No fue posible cargar tus reservas.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;
    fetch('/api/reservations', { cache: 'no-store' })
      .then(async (response) => {
        const result = await response.json();
        if (!response.ok) throw new Error(result.error?.message ?? 'No fue posible cargar tus reservas.');
        if (active) setReservations(result.reservations);
      })
      .catch((cause: unknown) => {
        if (active) setError(cause instanceof Error ? cause.message : 'No fue posible cargar tus reservas.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, []);

  async function cancelReservation(id: string) {
    setActionError('');
    setCancellingId(id);
    try {
      const response = await fetch(`/api/reservations/${id}/cancel`, { method: 'PATCH' });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error?.message ?? 'No fue posible cancelar la reserva.');
      await loadReservations();
    } catch (cause) {
      setActionError(cause instanceof Error ? cause.message : 'No fue posible cancelar la reserva.');
    } finally {
      setCancellingId('');
    }
  }

  const upcoming = reservations.filter((reservation) => reservation.status === 'CONFIRMED');
  const cancelled = reservations.filter((reservation) => reservation.status === 'CANCELLED');

  return (
    <section className="mx-auto max-w-6xl px-5 py-10 sm:px-8 sm:py-14">
      <div className="flex flex-col gap-5 rounded-[2rem] bg-[#f7e8e2] p-7 sm:flex-row sm:items-end sm:justify-between sm:p-10">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[.18em] text-[#a66d63]">Tu rincón personal</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[#493631] sm:text-4xl">Mis reservas</h1>
          <p className="mt-2 text-[#806b63]">Todo listo para que tus próximos días fluyan.</p>
        </div>
        <Link href="/catalog" className="w-fit rounded-full bg-[#8e514b] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#74403b]">Explorar espacios</Link>
      </div>
      {searchParams.get('reserved') && <p role="status" className="mt-6 rounded-xl bg-[#e9eddf] px-4 py-3 text-sm text-[#566044]">¡Listo! Tu reserva quedó confirmada.</p>}
      {actionError && <p role="alert" className="mt-6 rounded-xl bg-[#f8e6e2] px-4 py-3 text-sm text-[#9b3f3c]">{actionError}</p>}

      <div className="mt-9">
        <h2 className="text-xl font-semibold text-[#503b35]">Reservas confirmadas <span className="ml-1 text-sm font-normal text-[#9b8177]">({upcoming.length})</span></h2>
        {loading ? <p className="mt-5 text-sm text-[#806b63]">Cargando tus reservas…</p> : error ? (
          <p role="alert" className="mt-5 rounded-xl bg-[#f8e6e2] px-4 py-3 text-sm text-[#9b3f3c]">{error} <button onClick={() => void loadReservations()} className="ml-2 font-semibold underline">Reintentar</button></p>
        ) : upcoming.length ? (
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {upcoming.map((reservation) => (
              <Card key={reservation.id} className="border-[#eadbd3] bg-[#fffdfa] p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <Link href={`/spaces/${reservation.space.id}`} className="text-lg font-semibold text-[#503b35] hover:text-[#8e514b]">{reservation.space.name}</Link>
                    <p className="mt-2 text-sm text-[#806b63]">{formatDate(reservation.startAt)}</p>
                    <p className="mt-1 text-sm text-[#806b63]">{reservation.hours} {reservation.hours === 1 ? 'hora' : 'horas'} · ${Number(reservation.totalPrice).toFixed(2)}</p>
                  </div>
                  <span className="rounded-full bg-[#e9eddf] px-3 py-1 text-xs font-medium text-[#566044]">Confirmada</span>
                </div>
                <div className="mt-5 border-t border-[#eee2dc] pt-4">
                  <Button variant="secondary" disabled={cancellingId === reservation.id} onClick={() => void cancelReservation(reservation.id)} className="rounded-full px-4 py-2 text-sm">
                    {cancellingId === reservation.id ? 'Cancelando…' : 'Cancelar reserva'}
                  </Button>
                  <p className="mt-2 text-xs text-[#9a847b]">Puedes cancelar hasta 2 horas antes del inicio.</p>
                </div>
              </Card>
            ))}
          </div>
        ) : !loading && !error ? (
          <Card className="mt-4 border-dashed border-[#d9c2b9] bg-[#fffdfa] py-10 text-center shadow-none">
            <p className="font-semibold text-[#503b35]">Todavía no tienes reservas próximas.</p>
            <p className="mt-1 text-sm text-[#806b63]">Encuentra un lugar que te inspire para tu próxima jornada.</p>
          </Card>
        ) : null}
      </div>

      {cancelled.length > 0 && (
        <div className="mt-10">
          <h2 className="text-xl font-semibold text-[#503b35]">Reservas canceladas <span className="ml-1 text-sm font-normal text-[#9b8177]">({cancelled.length})</span></h2>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {cancelled.map((reservation) => (
              <Card key={reservation.id} className="border-[#eee2dc] bg-white/70 p-5">
                <p className="font-semibold text-[#715d55]">{reservation.space.name}</p>
                <p className="mt-1 text-sm text-[#9a847b]">{formatDate(reservation.startAt)} · Cancelada</p>
              </Card>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
