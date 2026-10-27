import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { verifyAccessToken } from '@/lib/auth/tokens';
import { UserMenu } from '@/components/layout/UserMenu';

export default async function PrivateLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const token = cookieStore.get('access_token')?.value;

  if (!token) redirect('/login');

  const session = await verifyAccessToken(token);
  if (!session) redirect('/login');

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-[#eadbd3] bg-[#fffdfa]">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <Link href="/" className="text-xl font-bold text-[#8e514b]">
            CoSpace
          </Link>
          <UserMenu name={session.userId.slice(0, 8)} role={session.role} />
        </nav>
      </header>
      <main className="flex-1 bg-[#fbf7f3]">{children}</main>
    </div>
  );
}