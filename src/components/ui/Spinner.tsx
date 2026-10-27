export function Spinner({ label = 'Cargando...' }: { label?: string }) {
  return <p role="status">{label}</p>;
}