'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';

export function AdminReservationActions({ id, status }: { id: string; status: 'CONFIRMED' | 'CANCELLED' }) {
  const router = useRouter();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function cancel() {
    setError('');
    setLoading(true);
    try {
      const response = await fetch(`/api/reservations/${id}/cancel`, { method: 'PATCH' });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error?.message ?? 'No fue posible cancelar la reserva.');
      router.refresh();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'No fue posible cancelar la reserva.');
    } finally {
      setLoading(false);
    }
  }

  return status === 'CONFIRMED' ? (
    <div>
      <Button variant="secondary" disabled={loading} onClick={() => void cancel()} className="rounded-full px-3 py-1.5 text-xs">
        {loading ? 'Cancelando…' : 'Cancelar'}
      </Button>
      {error && <p role="alert" className="mt-1 max-w-36 text-xs text-[#9b3f3c]">{error}</p>}
    </div>
  ) : <span className="text-xs text-[#9a847b]">—</span>;
}
