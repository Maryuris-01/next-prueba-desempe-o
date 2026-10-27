'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';

export function DeactivateSpaceButton({ id }: { id: string }) {
  const router = useRouter();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function deactivate() {
    if (!window.confirm('¿Quieres desactivar este espacio? Ya no aparecerá en el catálogo.')) return;
    setError('');
    setLoading(true);
    try {
      const response = await fetch(`/api/spaces/${id}/desactivate`, { method: 'PATCH' });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error?.message ?? 'No fue posible desactivar el espacio.');
      router.refresh();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'No fue posible desactivar el espacio.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <Button variant="secondary" disabled={loading} onClick={() => void deactivate()} className="rounded-full px-4 py-2 text-sm">
        {loading ? 'Desactivando…' : 'Desactivar'}
      </Button>
      {error && <p role="alert" className="mt-2 text-xs text-[#9b3f3c]">{error}</p>}
    </div>
  );
}
