import Link from 'next/link';
import { AuthForm } from '@/components/auth/AuthForm';
import { Card } from '@/components/ui/Card';

export default function RegisterPage() {
  return (
    <Card className="rounded-[2rem] border-[#eadbd3] bg-[#fffdfa] p-7 shadow-lg shadow-[#754b43]/5 sm:p-9">
      <Link href="/" className="text-sm font-semibold text-[#9b625a]">← CoSpace</Link>
      <p className="mt-7 text-sm font-semibold uppercase tracking-[.18em] text-[#a66d63]">Tu espacio comienza aquí</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[#493631]">Crea tu cuenta</h1>
      <p className="mt-2 text-sm leading-6 text-[#806b63]">Regístrate para guardar tus reservas y acceder a todos nuestros espacios.</p>
      <AuthForm mode="register" />
    </Card>
  );
}