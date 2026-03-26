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
            aria-label="Hemenesy & Co. — Inicio"
            className="font-heading text-lg tracking-[0.3em] uppercase text-content-primary hover:text-brand-accent transition-colors duration-300"
          >
            Hemenesy & Co.
          </Link>

          {/* Redes sociales */}
          <div className="flex items-center gap-4">
            <a
              href="https://www.instagram.com/hemenesy_oficial?igsh=MTl4bjBvaWh4c2dpag=="
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Hemenesy & Co. en Instagram"
              className="font-body text-sm tracking-widest uppercase text-content-secondary hover:text-brand-accent transition-colors duration-300"
            >
              Instagram
            </a>
            <span className="text-line" aria-hidden="true">|</span>
            <a
              href="https://wa.me/525500000000"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Contactar Hemenesy & Co. por WhatsApp"
              className="font-body text-sm tracking-widest uppercase text-content-secondary hover:text-brand-accent transition-colors duration-300"
            >
              WhatsApp
            </a>
          </div>
        </div>

        {/* Legal */}
        <div className="mt-8 pt-6 border-t border-line text-center">
          <p className="font-body text-xs text-content-secondary tracking-wide">
            © {year} Hemenesy & Co. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
