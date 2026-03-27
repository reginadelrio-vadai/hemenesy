"use client";
import Link from "next/link";

interface AuthGateProps {
  onClose: () => void;
}

export function AuthGate({ onClose }: AuthGateProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal card */}
      <div className="relative bg-surface-dark border border-line/30 px-8 py-10 max-w-md w-full mx-4 text-center">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-content-secondary hover:text-content-primary transition-colors text-xl leading-none"
          aria-label="Cerrar"
        >
          ✕
        </button>

        {/* Content */}
        <h2 className="font-heading text-2xl md:text-3xl text-content-primary mb-3">
          Tu joya está casi lista
        </h2>
        <p className="font-accent text-content-secondary font-light mb-8 text-sm md:text-base">
          Crea una cuenta o inicia sesión para generar tu diseño personalizado con inteligencia artificial.
        </p>

        {/* Buttons */}
        <div className="flex flex-col gap-3">
          <Link
            href="/auth/register?redirect=/designer"
            className="block w-full py-3 bg-brand-accent text-surface-dark font-body text-sm tracking-widest uppercase hover:bg-brand-accent/90 transition-colors text-center"
          >
            Crear cuenta
          </Link>
          <Link
            href="/auth/login?redirect=/designer"
            className="block w-full py-3 border border-line/40 text-content-primary font-body text-sm tracking-widest uppercase hover:border-brand-accent hover:text-brand-accent transition-colors text-center"
          >
            Ya tengo cuenta
          </Link>
        </div>
      </div>
    </div>
  );
}
