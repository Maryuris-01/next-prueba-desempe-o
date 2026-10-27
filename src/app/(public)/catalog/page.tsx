import type { Metadata } from 'next';
import { SpaceCard } from '@/components/spaces/SpaceCard';
import { prisma } from '@/lib/prisma';

export const metadata: Metadata = {
  title: 'Catálogo de espacios | CoSpace',
  description: 'Encuentra y reserva un espacio para trabajar, reunirte o crear.',
};

export const dynamic = 'force-dynamic';

export default async function CatalogPage() {
  const spaces = await prisma.space.findMany({
    where: { status: 'ACTIVE' },
    orderBy: { createdAt: 'desc' },
    select: { id: true, name: true, description: true, price: true, image: true },
  });

  return (
    <section className="mx-auto max-w-6xl px-5 py-12 sm:px-8 sm:py-16">
      <div className="rounded-[2rem] bg-[#f7e8e2] px-6 py-9 sm:px-10">
        <p className="text-sm font-semibold uppercase tracking-[.18em] text-[#a66d63]">Catálogo</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[#493631] sm:text-4xl">Encuentra tu espacio ideal</h1>
        <p className="mt-3 max-w-2xl leading-7 text-[#806b63]">Desde una mesa tranquila hasta un lugar para compartir ideas. Explora opciones y reserva a tu ritmo.</p>
      </div>

      {spaces.length ? (
        <div className="mt-9 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {spaces.map((space) => (
            <SpaceCard
              key={space.id}
              id={space.id}
              name={space.name}
              description={space.description}
              price={space.price.toString()}
              image={space.image}
            />
          ))}
        </div>
      ) : (
        <div className="mt-9 rounded-3xl border border-dashed border-[#d9c2b9] bg-[#fffdfa] px-6 py-16 text-center">
          <span className="text-3xl" aria-hidden="true">⌂</span>
          <h2 className="mt-3 text-xl font-semibold text-[#503b35]">Pronto habrá nuevos espacios</h2>
          <p className="mt-2 text-sm text-[#806b63]">Estamos preparando lugares para que tengas un gran día de trabajo.</p>
        </div>
      )}
    </section>
  );
}
