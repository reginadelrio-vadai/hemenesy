"use client";
import Link from "next/link";
import { SafeImage } from "@/components/ui/SafeImage";
import { PLACEHOLDERS } from "@/utils/placeholders";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { SLIDE_LEFT, SLIDE_RIGHT } from "@/utils/animations";
import { useAuth } from "@/components/layout/AuthProvider";

export function DesignerTeaser() {
  const { user, loading } = useAuth();
  const textRef = useScrollAnimation(SLIDE_LEFT);
  const imageRef = useScrollAnimation(SLIDE_RIGHT);

  const ctaHref = user ? "/designer" : "/auth/login";
  const ctaLabel = user ? "Comenzar diseño" : "Crear cuenta gratis";

  return (
    <section
      className="min-h-screen flex items-center bg-surface-dark"
      aria-label="Diseñador de joyas con IA"
    >
      <div className="max-w-content mx-auto px-6 lg:px-12 w-full py-24 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div ref={textRef} className="order-2 lg:order-1">
          <p className="font-body text-xs tracking-[0.3em] uppercase text-brand-accent mb-4">
            Tecnología &amp; Lujo
          </p>
          <h2 className="font-heading text-4xl md:text-5xl text-content-primary mb-6 leading-tight">
            Diseña tu joya<br />con inteligencia artificial
          </h2>
          <div className="w-12 h-px bg-brand-accent mb-8" />
          <p className="font-accent text-lg text-content-secondary leading-relaxed mb-8 font-light">
            Por primera vez, visualiza tu joya perfecta antes de crearla. Nuestro diseñador con IA
            transforma tus ideas en imágenes fotorrealistas. Elige el tipo de joya, el metal, la
            esmeralda, y en segundos tendrás tu visión hecha imagen.
          </p>

          {!loading && (
            <Link
              href={ctaHref}
              className="inline-block font-body text-sm tracking-widest uppercase bg-brand-accent text-surface-dark px-10 py-4 hover:brightness-110 transition-all duration-300"
            >
              {ctaLabel}
            </Link>
          )}
        </div>

        <div
          ref={imageRef}
          className="order-1 lg:order-2 relative aspect-square w-full max-w-md mx-auto lg:max-w-none overflow-hidden"
        >
          <SafeImage
            src={PLACEHOLDERS.jewelry2}
            alt="Diseñador de joyas con IA — Hemenesy"
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
          <div className="absolute inset-0 bg-gradient-to-tr from-brand-primary/50 to-transparent" />
          {/* Emerald accent frame — bottom-left corner */}
          <div className="absolute bottom-0 left-0 w-16 h-16 border-b-2 border-l-2 border-brand-accent pointer-events-none" />
        </div>
      </div>
    </section>
  );
}
