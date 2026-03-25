import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-surface-dark px-4">
      <h1 className="font-heading text-6xl text-content-primary mb-4">404</h1>
      <p className="font-accent text-xl text-content-secondary mb-8 text-center">
        Esta página no existe o ha sido movida.
      </p>
      <Link
        href="/"
        className="border border-brand-accent text-brand-accent px-8 py-3 hover:bg-brand-accent hover:text-surface-dark transition-all duration-300"
      >
        Volver al inicio
      </Link>
    </div>
  );
}
