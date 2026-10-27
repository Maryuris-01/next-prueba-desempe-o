import { Card } from '@/components/ui/Card';
import { CreateSpaceForm } from '@/components/admin/CreateSpaceForm';
import { DeactivateSpaceButton } from '@/components/admin/DeactivateSpaceButton';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export default async function AdminSpacesPage() {
  const spaces = await prisma.space.findMany({
    orderBy: [{ status: 'asc' }, { createdAt: 'desc' }],
    select: { id: true, name: true, description: true, price: true, image: true, status: true },
  });

  return (
    <div className="mx-auto max-w-6xl">
      <p className="text-sm font-semibold uppercase tracking-[.18em] text-[#a66d63]">Administración</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[#493631]">Espacios</h1>
      <p className="mt-2 text-[#806b63]">Publica nuevos lugares y gestiona su disponibilidad.</p>

      <Card className="mt-7 border-[#eadbd3] bg-[#fffdfa] p-6 sm:p-8">
        <h2 className="mb-5 text-lg font-semibold text-[#503b35]">Añadir un espacio</h2>
        <CreateSpaceForm />
      </Card>

      <div className="mt-9 flex items-end justify-between">
        <div>
          <h2 className="text-xl font-semibold text-[#503b35]">Espacios publicados</h2>
          <p className="mt-1 text-sm text-[#806b63]">{spaces.filter((space) => space.status === 'ACTIVE').length} activos · {spaces.length} en total</p>
        </div>
      </div>

      {spaces.length ? (
        <div className="mt-4 space-y-3">
          {spaces.map((space) => (
            <Card key={space.id} className="flex flex-col gap-4 border-[#eadbd3] bg-[#fffdfa] p-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-semibold text-[#503b35]">{space.name}</h3>
                  <span className={`rounded-full px-3 py-1 text-xs ${space.status === 'ACTIVE' ? 'bg-[#e9eddf] text-[#566044]' : 'bg-[#f0e9e5] text-[#806b63]'}`}>
                    {space.status === 'ACTIVE' ? 'Activo' : 'Inactivo'}
                  </span>
                </div>
                <p className="mt-1 line-clamp-2 text-sm text-[#806b63]">{space.description}</p>
                <p className="mt-2 text-sm font-semibold text-[#8e514b]">${Number(space.price).toFixed(2)} <span className="font-normal text-[#9a847b]">/ hora</span></p>
              </div>
              {space.status === 'ACTIVE' && <DeactivateSpaceButton id={space.id} />}
            </Card>
          ))}
        </div>
      ) : (
        <Card className="mt-4 border-dashed border-[#d9c2b9] bg-[#fffdfa] py-10 text-center shadow-none">
          <p className="font-semibold text-[#503b35]">Aún no has publicado espacios.</p>
          <p className="mt-1 text-sm text-[#806b63]">Completa el formulario para crear el primero.</p>
        </Card>
      )}
    </div>
  );
}
