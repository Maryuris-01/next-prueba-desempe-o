'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';

type UserMenuProps = {
  name: string;
  role: 'USER' | 'ADMIN';
};

export function UserMenu({ name, role }: UserMenuProps) {
  const router = useRouter();

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
    router.refresh();
  }

  return (
    <div className="flex items-center gap-4">
      <span className="hidden text-sm text-[#806b63] sm:inline">Hola, {name}</span>
      <Link href="/dashboard" className="text-sm font-medium text-[#654d44] hover:text-[#8e514b]">
        Mis reservas
      </Link>
      {role === 'ADMIN' && (
        <Link href="/admin" className="text-sm font-medium text-[#654d44] hover:text-[#8e514b]">
          Admin
        </Link>
      )}
      <button
        onClick={handleLogout}
        className="rounded-full bg-[#f0e5df] px-3 py-1.5 text-sm font-medium text-[#654d44] transition hover:bg-[#e8d8d0]"
      >
        Cerrar sesión
      </button>
    </div>
  );
}