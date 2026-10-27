'use client';

import { useState, type FormEvent } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

type AuthFormProps = { mode: 'login' | 'register' };

export function AuthForm({ mode }: AuthFormProps) {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const isRegister = mode === 'register';

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setLoading(true);
    const formData = new FormData(event.currentTarget);
    const payload = Object.fromEntries(formData.entries());

    try {
      const response = await fetch(`/api/auth/${mode}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        setError(result.error?.message ?? 'No fue posible completar la solicitud.');
        return;
      }

      // Usamos window.location.href para forzar una recarga completa.
      // Esto asegura que las cookies httpOnly se hayan guardado antes de ir a la ruta protegida.
      if (isRegister) {
        window.location.href = '/login?registered=1';
      } else {
        window.location.href = '/dashboard';
      }
    } catch {
      setError('No pudimos conectarnos. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-7 space-y-4">
      {isRegister && <Input label="Nombre" name="name" autoComplete="name" required maxLength={80} />}
      <Input label="Correo electrónico" name="email" type="email" autoComplete="email" required />
      <Input label="Contraseña" name="password" type="password" autoComplete={isRegister ? 'new-password' : 'current-password'} required minLength={isRegister ? 8 : 1} />
      {error && <p role="alert" className="rounded-xl bg-[#f8e6e2] px-4 py-3 text-sm text-[#9b3f3c]">{error}</p>}
      <Button type="submit" disabled={loading} className="w-full rounded-full py-3">
        {loading ? 'Un momento…' : isRegister ? 'Crear cuenta' : 'Iniciar sesión'}
      </Button>
      <p className="pt-2 text-center text-sm text-[#806b63]">
        {isRegister ? '¿Ya tienes una cuenta?' : '¿Aún no tienes cuenta?'}{' '}
        <Link href={isRegister ? '/login' : '/register'} className="font-semibold text-[#8e514b] hover:underline">
          {isRegister ? 'Inicia sesión' : 'Regístrate'}
        </Link>
      </p>
    </form>
  );
}