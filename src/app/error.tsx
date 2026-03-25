"use client";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-surface-dark px-4 text-center">
      <h2 className="font-heading text-3xl text-content-primary mb-4">
        Algo salió mal
      </h2>
      <p className="font-accent text-content-secondary font-light mb-8">
        Ocurrió un error inesperado. Por favor intenta de nuevo.
      </p>
      <button
        onClick={reset}
        className="font-body text-sm tracking-widest uppercase border border-brand-accent text-brand-accent px-8 py-3 hover:bg-brand-accent hover:text-surface-dark transition-all duration-300"
      >
        Reintentar
      </button>
    </div>
  );
}
