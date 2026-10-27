import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Footer } from '@/components/layout/Footer';
import { Navbar } from '@/components/layout/Navbar';

const highlights = [
  { icon: '☀', title: 'Un espacio para cada idea', text: 'Encuentra rincones tranquilos, salas de reunión y espacios para crear.' },
  { icon: '♡', title: 'Reserva sin complicaciones', text: 'Elige el horario que necesitas y deja el resto en nuestras manos.' },
  { icon: '⌂', title: 'Cerca de ti', text: 'Descubre espacios pensados para trabajar bien y sentirte mejor.' },
];

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <section className="relative overflow-hidden bg-[#f7e5df]">
          <div className="absolute -right-20 -top-32 h-96 w-96 rounded-full bg-[#e8b8ae]/50 blur-3xl" />
          <div className="absolute -bottom-48 left-1/3 h-96 w-96 rounded-full bg-[#d7dfca]/70 blur-3xl" />
          <div className="relative mx-auto grid max-w-6xl gap-12 px-5 py-20 sm:px-8 sm:py-28 lg:grid-cols-[1.05fr_.95fr] lg:items-center">
            <div>
              <p className="mb-5 text-sm font-semibold uppercase tracking-[.2em] text-[#9b625a]">Tu próximo lugar favorito</p>
              <h1 className="max-w-2xl text-5xl font-semibold leading-[1.08] tracking-tight text-[#432f2b] sm:text-6xl">
                Trabaja a tu manera. <span className="font-serif italic text-[#a75f59]">Siéntete en casa.</span>
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-8 text-[#705650]">
                Espacios cálidos, cómodos y listos para tus ideas. Encuentra el lugar perfecto para concentrarte, reunirte o crear.
              </p>
              <div className="mt-9 flex flex-wrap gap-3">
                <Link href="/catalog" className="rounded-full bg-[#8e514b] px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#74403b]">
                  Explorar espacios
                </Link>
                <Link href="/register" className="rounded-full border border-[#bd8d83] bg-white/70 px-6 py-3 text-sm font-semibold text-[#69423c] transition hover:bg-white">
                  Crear una cuenta
                </Link>
              </div>
              <p className="mt-7 text-sm text-[#876d64]">Buenos espacios. Mejores días de trabajo.</p>
            </div>
            <div className="relative mx-auto w-full max-w-lg">
              <div className="absolute -inset-4 rotate-3 rounded-[2rem] bg-[#c48e80]/20" />
              <div className="relative overflow-hidden rounded-[2rem] border border-white/70 bg-[#e9d8c8] p-5 shadow-xl shadow-[#74403b]/10">
                <div className="flex aspect-[4/3] flex-col justify-between rounded-[1.5rem] bg-[radial-gradient(ellipse_at_68%_30%,#f7efe5_0%,#d7c3ad_37%,#a97f69_100%)] p-6">
                  <div className="flex items-center justify-between">
                    <span className="rounded-full bg-white/75 px-3 py-1 text-xs font-medium text-[#66483e]">Un lugar para enfocarte</span>
                    <span className="text-2xl text-white">✳</span>
                  </div>
                  <div className="rounded-2xl bg-[#fffaf2]/90 p-5 backdrop-blur-sm">
                    <p className="font-serif text-2xl text-[#513b33]">Ideas que encuentran su espacio.</p>
                    <p className="mt-2 text-sm text-[#80685d]">Reserva tu próximo rincón de inspiración.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
          <div className="mb-9 max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[.18em] text-[#a66d63]">Hecho para tus días</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[#493631] sm:text-4xl">Un espacio que acompaña tu ritmo</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {highlights.map((item) => (
              <Card key={item.title} className="border-[#eadbd3] bg-[#fffdfa] p-6 shadow-none">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[#f5e4df] text-xl text-[#9e625a]">{item.icon}</span>
                <h3 className="mt-5 text-lg font-semibold text-[#503b35]">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-[#806b63]">{item.text}</p>
              </Card>
            ))}
          </div>
        </section>

        <section className="mx-5 mb-16 rounded-[2rem] bg-[#e7e9dc] px-6 py-12 sm:mx-8 sm:px-12 lg:mx-auto lg:max-w-6xl">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[.18em] text-[#788064]">Empieza hoy</p>
              <h2 className="mt-2 text-2xl font-semibold text-[#454b3b] sm:text-3xl">Tu próximo buen día de trabajo está cerca.</h2>
            </div>
            <Link href="/catalog" className="w-fit rounded-full bg-[#657052] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#505a40]">
              Ver catálogo <span aria-hidden="true">→</span>
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
