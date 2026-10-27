import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { verifyAccessToken } from '@/lib/auth/tokens';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const token = cookieStore.get('access_token')?.value;

  if (!token) redirect('/login');

  const session = await verifyAccessToken(token);
  if (!session || session.role !== 'ADMIN') redirect('/dashboard');

  return (
    <div className="flex min-h-screen">
      <aside className="w-64 shrink-0 border-r border-[#eadbd3] bg-[#fffdfa] p-6">
        <Link href="/" className="text-xl font-bold text-[#8e514b]">
          CoSpace Admin
        </Link>
        <nav className="mt-8 flex flex-col gap-2">
          <Link href="/admin" className="rounded-xl px-3 py-2 text-sm text-[#654d44] hover:bg-[#f7e8e2]">
            Panel
          </Link>
          <Link href="/admin/spaces" className="rounded-xl px-3 py-2 text-sm text-[#654d44] hover:bg-[#f7e8e2]">
            Espacios
          </Link>
          <Link href="/dashboard" className="rounded-xl px-3 py-2 text-sm text-[#654d44] hover:bg-[#f7e8e2]">
            Mis reservas
          </Link>
        </nav>
      </aside>
      <main className="min-w-0 flex-1 bg-[#fbf7f3] p-5 sm:p-8">{children}</main>
    </div>
  );
}