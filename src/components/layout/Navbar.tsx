import Link from 'next/link';

export function Navbar() {
  return (
    <header className="sticky top-0 z-20 border-b border-[#eadbd3]/80 bg-[#fffdfa]/95 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 sm:px-8">
        <Link href="/" className="text-xl font-bold tracking-tight text-[#8e514b]">
          CoSpace
        </Link>
        <div className="flex items-center gap-3 sm:gap-5">
          <Link href="/catalog" className="text-sm font-medium text-[#654d44] hover:text-[#8e514b]">
            Catálogo
          </Link>
          <Link href="/login" className="hidden text-sm font-medium text-[#654d44] hover:text-[#8e514b] sm:inline">
            Iniciar sesión
          </Link>
          <Link
            href="/register"
            className="rounded-full bg-[#8e514b] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#74403b]"
          >
            <span className="sm:hidden">Cuenta</span>
            <span className="hidden sm:inline">Registrarse</span>
          </Link>
        </div>
      </nav>
    </header>
  );
}