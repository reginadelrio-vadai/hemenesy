// Server component — fuera del client boundary
import Link from "next/link";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      className="bg-surface-dark border-t border-brand-accent"
      role="contentinfo"
      aria-label="Pie de página"
    >
      <div className="max-w-content mx-auto px-6 lg:px-12 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo */}
          <Link
            href="/"
            aria-label="Hemenesy — Inicio"
            className="font-heading text-lg tracking-[0.3em] uppercase text-content-primary hover:text-brand-accent transition-colors duration-300"
          >
            Hemenesy
          </Link>

          {/* Ubicación */}
          <p className="font-body text-sm text-content-secondary tracking-wide text-center">
            Ciudad de México, México
          </p>

          {/* Redes sociales */}
          <div className="flex items-center gap-4">
            <a
              href="https://instagram.com/hemenesy"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Hemenesy en Instagram"
              className="font-body text-sm tracking-widest uppercase text-content-secondary hover:text-brand-accent transition-colors duration-300"
            >
              Instagram
            </a>
            <span className="text-line" aria-hidden="true">|</span>
            <a
              href="https://wa.me/525500000000"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Contactar Hemenesy por WhatsApp"
              className="font-body text-sm tracking-widest uppercase text-content-secondary hover:text-brand-accent transition-colors duration-300"
            >
              WhatsApp
            </a>
          </div>
        </div>

        {/* Legal */}
        <div className="mt-8 pt-6 border-t border-line text-center">
          <p className="font-body text-xs text-content-secondary tracking-wide">
            © {year} Hemenesy. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
