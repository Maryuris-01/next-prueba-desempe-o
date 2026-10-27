'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export function CreateSpaceForm() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setLoading(true);
    const form = event.currentTarget;
    const formData = new FormData(form);
    const image = String(formData.get('image') ?? '').trim();
    const payload = {
      name: String(formData.get('name') ?? '').trim(),
      description: String(formData.get('description') ?? '').trim(),
      price: Number(formData.get('price')),
      ...(image ? { image } : {}),
    };

    try {
      const response = await fetch('/api/spaces', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error?.message ?? 'No fue posible crear el espacio.');
      form.reset();
      router.refresh();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'No fue posible crear el espacio.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
      <Input label="Nombre del espacio" name="name" required maxLength={100} />
      <Input label="Precio por hora" name="price" type="number" min="0.01" step="0.01" required />
      <label className="flex flex-col gap-1 text-sm font-medium text-[#59463f] sm:col-span-2">
        Descripción
        <textarea name="description" rows={3} maxLength={500} required className="rounded-xl border border-[#dfcbc2] bg-white px-3 py-2.5 focus:border-[#a66d63] focus:outline-none" />
      </label>
      <div className="sm:col-span-2">
        <Input label="Imagen (URL, opcional)" name="image" type="url" />
      </div>
      {error && <p role="alert" className="rounded-xl bg-[#f8e6e2] px-4 py-3 text-sm text-[#9b3f3c] sm:col-span-2">{error}</p>}
      <div className="sm:col-span-2">
        <Button type="submit" disabled={loading} className="rounded-full px-5">{loading ? 'Guardando…' : 'Publicar espacio'}</Button>
      </div>
    </form>
  );
}
