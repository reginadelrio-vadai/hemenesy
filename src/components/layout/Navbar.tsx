"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useAuth } from "@/components/layout/AuthProvider";
gsap.registerPlugin(ScrollTrigger);

const NAV_LINKS = [
  { href: "/#historia", label: "Historia" },
  { href: "/#galeria", label: "Galería" },
  { href: "/#proceso", label: "Proceso" },
  { href: "/#contacto", label: "Contacto" },
];

export function Navbar() {
  const { user, loading, signOut } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const mobileLinksRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();

  const handleDesignarClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (pathname === "/") {
      document.getElementById("disenar")?.scrollIntoView({ behavior: "smooth" });
    } else {
      router.push("/?section=disenar");
    }
  };

  useEffect(() => {
    const trigger = ScrollTrigger.create({
      trigger: "body",
      start: "100px top",
      onEnter: () => setScrolled(true),
      onLeaveBack: () => setScrolled(false),
    });
    return () => trigger.kill();
  }, []);

  useEffect(() => {
    if (!mobileLinksRef.current) return;
    const links = mobileLinksRef.current.querySelectorAll("a, button");
    if (menuOpen) {
      gsap.fromTo(
        links,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.08, duration: 0.4, ease: "power3.out" }
      );
    }
  }, [menuOpen]);

  const handleSignOut = async () => {
    await signOut();
    setMenuOpen(false);
    router.push("/");
  };

  return (
    <>
      <nav
        ref={navRef}
        role="navigation"
        aria-label="Navegación principal"
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-surface-dark/95 backdrop-blur-xl border-b border-line"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-content mx-auto px-6 lg:px-12 flex items-center justify-between h-20">
          {/* Logo */}
          <Link
            href="/"
            aria-label="Hemenesy — Inicio"
            className="font-heading text-xl tracking-[0.3em] text-content-primary uppercase hover:text-brand-accent transition-colors duration-300"
          >
            Hemenesy
          </Link>

          {/* Desktop links */}
          <div className="hidden lg:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="font-body text-sm tracking-widest uppercase text-content-secondary hover:text-content-primary transition-colors duration-300"
              >
                {link.label}
              </Link>
            ))}
            <button
              onClick={handleDesignarClick}
              className="font-body text-sm tracking-widest uppercase border border-brand-accent text-brand-accent px-5 py-2 hover:bg-brand-accent hover:text-surface-dark transition-all duration-300"
            >
              Diseñar
            </button>

            {!loading && (
              <>
                {user ? (
                  <div className="flex items-center gap-3">
                    <Link
                      href="/dashboard"
                      className="font-body text-sm tracking-widest uppercase text-content-secondary hover:text-content-primary transition-colors duration-300"
                    >
                      Mi cuenta
                    </Link>
                    <span className="text-content-secondary/30 text-xs">|</span>
                    <button
                      onClick={handleSignOut}
                      className="font-body text-sm tracking-widest uppercase text-content-secondary hover:text-content-primary transition-colors duration-300"
                    >
                      Salir
                    </button>
                  </div>
                ) : (
                  <Link
                    href="/auth/login"
                    className="font-body text-sm tracking-widest uppercase text-content-secondary hover:text-content-primary transition-colors duration-300"
                  >
                    Iniciar sesión
                  </Link>
                )}
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            className="lg:hidden flex flex-col gap-1.5 p-2"
            onClick={() => setMenuOpen((o) => !o)}
            aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={menuOpen}
          >
            <span
              className={`block w-6 h-px bg-content-primary transition-all duration-300 ${menuOpen ? "rotate-45 translate-y-2" : ""}`}
            />
            <span
              className={`block w-6 h-px bg-content-primary transition-all duration-300 ${menuOpen ? "opacity-0" : ""}`}
            />
            <span
              className={`block w-6 h-px bg-content-primary transition-all duration-300 ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`}
            />
          </button>
        </div>
      </nav>

      {/* Mobile overlay */}
      {menuOpen && (
        <div
          className="fixed inset-0 z-40 bg-surface-dark flex flex-col items-center justify-center"
          role="dialog"
          aria-modal="true"
          aria-label="Menú de navegación"
        >
          <div ref={mobileLinksRef} className="flex flex-col items-center gap-8">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="font-heading text-2xl tracking-widest uppercase text-content-primary hover:text-brand-accent transition-colors duration-300"
              >
                {link.label}
              </Link>
            ))}
            <button
              onClick={(e) => { setMenuOpen(false); handleDesignarClick(e); }}
              className="font-heading text-2xl tracking-widest uppercase text-brand-accent"
            >
              Diseñar
            </button>
            {!loading && (
              <>
                {user ? (
                  <>
                    <Link
                      href="/dashboard"
                      onClick={() => setMenuOpen(false)}
                      className="font-body text-base tracking-widest uppercase text-content-secondary hover:text-content-primary transition-colors"
                    >
                      Mi cuenta
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className="font-body text-base tracking-widest uppercase text-content-secondary hover:text-content-primary transition-colors"
                    >
                      Cerrar sesión
                    </button>
                  </>
                ) : (
                  <Link
                    href="/auth/login"
                    onClick={() => setMenuOpen(false)}
                    className="font-body text-base tracking-widest uppercase text-content-secondary hover:text-content-primary transition-colors"
                  >
                    Iniciar sesión
                  </Link>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
