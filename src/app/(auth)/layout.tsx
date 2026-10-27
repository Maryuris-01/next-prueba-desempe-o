export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#f7e8e2] px-4 py-10">
      <div className="absolute -left-24 -top-24 h-80 w-80 rounded-full bg-[#e8b8ae]/40 blur-3xl" />
      <div className="absolute -bottom-28 -right-16 h-96 w-96 rounded-full bg-[#d7dfca]/50 blur-3xl" />
      <div className="relative w-full max-w-md">{children}</div>
    </div>
  );
}