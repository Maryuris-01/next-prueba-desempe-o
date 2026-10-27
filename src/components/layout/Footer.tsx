export function Footer() {
  return (
    <footer className="border-t border-[#eadbd3] bg-[#fffdfa] py-7 text-center text-sm text-[#8c7770]">
      <p>© {new Date().getFullYear()} CoSpace <span aria-hidden="true">·</span> Un espacio para cada idea.</p>
    </footer>
  );
}