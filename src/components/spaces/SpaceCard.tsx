import Link from 'next/link';
import { SpaceImage } from '@/components/spaces/SpaceImage';

type SpaceCardProps = {
  id: string;
  name: string;
  description: string;
  price: string | number;
  image?: string | null;
};

export function SpaceCard({ id, name, description, price, image }: SpaceCardProps) {
  return (
    <Link href={`/spaces/${id}`} className="block">
      <div className="overflow-hidden rounded-2xl border border-[#eadbd3] bg-[#fffdfa] shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-lg hover:shadow-[#754b43]/10">
        <div className="relative h-48 w-full bg-[#efe2d8]">
          <SpaceImage src={image} alt={name} className="h-full w-full object-cover" />
        </div>
        <div className="p-5">
          <h3 className="text-lg font-semibold text-[#503b35]">{name}</h3>
          <p className="mt-2 line-clamp-2 min-h-10 text-sm leading-5 text-[#806b63]">{description}</p>
          <p className="mt-4 border-t border-[#f0e5df] pt-3 font-semibold text-[#8e514b]">${Number(price).toFixed(2)} <span className="text-sm font-normal text-[#9a847b]">/ hora</span></p>
        </div>
      </div>
    </Link>
  );
}