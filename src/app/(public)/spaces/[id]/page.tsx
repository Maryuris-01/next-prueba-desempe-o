import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ReservationForm } from '@/components/spaces/ReservationForm';
import { SpaceImage } from '@/components/spaces/SpaceImage';
import { Card } from '@/components/ui/Card';
import { prisma } from '@/lib/prisma';

type Props = { params: Promise<{ id: string }> };

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const space = await prisma.space.findUnique({ where: { id }, select: { name: true } });
  return { title: space ? `${space.name} | CoSpace` : 'Espacio | CoSpace' };
}

export default async function SpaceDetailPage({ params }: Props) {
  const { id } = await params;
  const space = await prisma.space.findUnique({
    where: { id },
    select: { id: true, name: true, description: true, price: true, image: true, status: true },
  });

  if (!space || space.status !== 'ACTIVE') notFound();

  return (
    <section className="mx-auto max-w-6xl px-5 py-10 sm:px-8 sm:py-14">
      <Link href="/catalog" className="text-sm font-medium text-[#906159] hover:text-[#68443e]">← Volver al catálogo</Link>
      <div className="mt-6 grid gap-7 lg:grid-cols-[1.2fr_.8fr]">
        <div className="overflow-hidden rounded-[2rem] border border-[#eadbd3] bg-[#f0e2d7]">
          <div className="relative flex min-h-72 items-center justify-center sm:min-h-[28rem]">
            <SpaceImage src={space.image} alt={space.name} className="absolute inset-0 h-full w-full object-cover" />
          </div>
        </div>
        <div className="space-y-5">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[.18em] text-[#a66d63]">Conoce el espacio</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[#493631]">{space.name}</h1>
            <p className="mt-4 leading-7 text-[#806b63]">{space.description}</p>
            <p className="mt-5 text-2xl font-semibold text-[#8e514b]">${Number(space.price).toFixed(2)} <span className="text-sm font-normal text-[#806b63]">/ hora</span></p>
          </div>
          <Card className="border-[#eadbd3] bg-[#fffdfa] p-6">
            <h2 className="text-lg font-semibold text-[#503b35]">Reserva este espacio</h2>
            <p className="mt-1 text-sm text-[#806b63]">Selecciona el día, la hora y la duración.</p>
            <ReservationForm spaceId={space.id} hourlyPrice={Number(space.price)} />
          </Card>
        </div>
      </div>
    </section>
  );
}
