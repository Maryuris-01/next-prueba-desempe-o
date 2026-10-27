'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export function ReservationForm({ spaceId, hourlyPrice }: { spaceId: string; hourlyPrice: number }) {
  const router = useRouter();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [hours, setHours] = useState(1);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setLoading(true);
    const formData = new FormData(event.currentTarget);
    const date = new Date(String(formData.get('startAt')));
    try {
      const response = await fetch('/api/reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ spaceId, startAt: date.toISOString(), hours }),
      });
      const result = await response.json();
      if (response.status === 401) {
        router.push('/login?returnTo=' + encodeURIComponent(window.location.pathname));
        return;
      }
      if (!response.ok) {
        setError(result.error?.message ?? 'No fue posible crear la reserva.');
        return;
      }
      router.push('/dashboard?reserved=1');
      router.refresh();
    } catch {
      setError('No pudimos conectarnos. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-5 space-y-4">
      <Input
        label="Fecha y hora de inicio"
        name="startAt"
        type="datetime-local"
        required
      />
      <label className="flex flex-col gap-1 text-sm font-medium text-[#59463f]">
        Duración
        <select
          value={hours}
          onChange={(event) => setHours(Number(event.target.value))}
          className="rounded-xl border border-[#dfcbc2] bg-white px-3 py-2.5 focus:border-[#a66d63] focus:outline-none"
        >
          {[1, 2, 3, 4].map((value) => <option key={value} value={value}>{value} {value === 1 ? 'hora' : 'horas'}</option>)}
        </select>
      </label>
      <div className="flex items-center justify-between border-t border-[#eee2dc] pt-3 text-sm">
        <span className="text-[#806b63]">Total estimado</span>
        <strong className="text-[#68443e]">${(hourlyPrice * hours).toFixed(2)}</strong>
      </div>
      {error && <p role="alert" className="rounded-xl bg-[#f8e6e2] px-4 py-3 text-sm text-[#9b3f3c]">{error}</p>}
      <Button type="submit" disabled={loading} className="w-full rounded-full py-3">
        {loading ? 'Reservando…' : 'Confirmar reserva'}
      </Button>
      <p className="text-xs leading-5 text-[#8c7770]">Las reservas están disponibles de 7:00 a 21:00, hasta 30 días por adelantado.</p>
    </form>
  );
}
