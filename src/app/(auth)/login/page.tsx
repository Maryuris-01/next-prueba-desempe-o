import Link from 'next/link';
import { AuthForm } from '@/components/auth/AuthForm';
import { Card } from '@/components/ui/Card';

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ registered?: string }>;
}) {
  const { registered } = await searchParams;
  return (
    <Card className="rounded-[2rem] border-[#eadbd3] bg-[#fffdfa] p-7 shadow-lg shadow-[#754b43]/5 sm:p-9">
      <Link href="/" className="text-sm font-semibold text-[#9b625a]">← CoSpace</Link>
      <p className="mt-7 text-sm font-semibold uppercase tracking-[.18em] text-[#a66d63]">Qué bueno verte</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[#493631]">Inicia sesión</h1>
      <p className="mt-2 text-sm leading-6 text-[#806b63]">Entra a tu cuenta para gestionar tus reservas y encontrar tu próximo espacio.</p>
      {registered === '1' && (
        <p role="status" className="mt-5 rounded-xl bg-[#e9eddf] px-4 py-3 text-sm text-[#566044]">Tu cuenta está lista. Inicia sesión para continuar.</p>
      )}
      <AuthForm mode="login" />
    </Card>
  );
}
