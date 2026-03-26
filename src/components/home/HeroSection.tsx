"use client";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SafeImage } from "@/components/ui/SafeImage";
import { PLACEHOLDERS } from "@/utils/placeholders";
import { LUXURY } from "@/utils/animations";
gsap.registerPlugin(ScrollTrigger);

export function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const taglineRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Parallax background — scrub true, y 20%
      if (bgRef.current && sectionRef.current) {
        gsap.to(bgRef.current, {
          yPercent: 20,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });
      }

      // Entrance — delay 0.2s
      const tl = gsap.timeline({ delay: 0.2 });
      if (titleRef.current) {
        tl.from(titleRef.current, {
          y: 60,
          opacity: 0,
          duration: LUXURY.duration.dramatic,
          ease: LUXURY.ease.hero,
        });
      }
      if (taglineRef.current) {
        tl.from(
          taglineRef.current,
          {
            y: 30,
            opacity: 0,
            duration: LUXURY.duration.slow,
            ease: LUXURY.ease.content,
          },
          `-=${LUXURY.duration.dramatic * 0.5}`
        );
      }
      if (ctaRef.current) {
        tl.from(
          ctaRef.current,
          {
            y: 20,
            opacity: 0,
            duration: LUXURY.duration.normal,
            ease: LUXURY.ease.content,
          },
          `-=${LUXURY.duration.slow * 0.5}`
        );
      }
    });

    return () => ctx.revert();
  }, []);

  const handleDescubrir = () => {
    const el = document.getElementById("historia");
    if (el) window.scrollTo({ top: el.offsetTop, behavior: "smooth" });
  };

  const handleScrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      ref={sectionRef}
      className="relative h-screen overflow-hidden flex items-center justify-center"
      aria-label="Hemenesy & Co. — Esmeraldas de lujo colombianas"
    >
      {/* Parallax bg — scale-110 evita bordes blancos en el extremo del parallax */}
      <div ref={bgRef} className="absolute inset-0 scale-110">
        <SafeImage
          src={PLACEHOLDERS.hero}
          alt="Esmeralda colombiana de primera calidad seleccionada por Hemenesy"
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        <h1
          ref={titleRef}
          className="font-heading text-6xl md:text-8xl tracking-[0.2em] text-content-primary uppercase mb-6"
        >
          Hemenesy & Co.
        </h1>
        <p
          ref={taglineRef}
          className="font-accent italic text-xl md:text-2xl text-content-secondary mb-10 font-light"
        >
          The Luxury of the Divine
        </p>
        <div ref={ctaRef} className="flex flex-col items-center">
          <div className="flex flex-row items-center justify-center gap-4 w-full max-w-sm">
            <button
              onClick={() => handleScrollTo("disenar")}
              className="flex-1 font-body text-sm tracking-widest uppercase border border-brand-accent text-brand-accent py-4 hover:bg-brand-accent hover:text-surface-dark transition-all duration-300"
            >
              Diseñar
            </button>
            <button
              onClick={() => handleScrollTo("contacto")}
              className="flex-1 font-body text-sm tracking-widest uppercase border border-brand-accent text-brand-accent py-4 hover:bg-brand-accent hover:text-surface-dark transition-all duration-300"
            >
              Contacto
            </button>
          </div>
          <button
            onClick={handleDescubrir}
            className="mt-16 flex flex-col items-center gap-2 group"
            aria-label="Descubrir la historia de Hemenesy & Co."
          >
            <span className="font-accent text-sm tracking-[0.2em] text-content-secondary group-hover:text-content-primary transition-colors">
              Descubrir
            </span>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-5 h-5 text-brand-accent animate-bounce"
              aria-hidden="true"
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>
        </div>
      </div>

      {/* Scroll indicator — línea dorada */}
      <div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        aria-hidden="true"
      >
        <div className="w-px h-16 bg-brand-accent animate-pulse" />
      </div>
    </section>
  );
}
