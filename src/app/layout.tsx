import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'CoSpace — Reserva tu espacio de coworking',
  description: 'Plataforma de reservas de espacios de coworking',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="min-h-screen bg-[#fbf7f3] text-[#493631] antialiased">
        {children}
      </body>
    </html>
  );
}