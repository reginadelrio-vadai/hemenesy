"use client";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { LUXURY } from "@/utils/animations";

export function LoadingScreen() {
  const containerRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!containerRef.current || !logoRef.current) return;

    const tl = gsap.timeline();

    // Logo fade-in
    tl.fromTo(
      logoRef.current,
      { opacity: 0 },
      { opacity: 1, duration: LUXURY.duration.normal, ease: LUXURY.ease.hero }
    )
      // Pausa
      .to({}, { duration: 0.4 })
      // Pantalla sale hacia arriba
      .to(containerRef.current, {
        yPercent: -100,
        duration: LUXURY.duration.slow,
        ease: "power3.inOut",
      });
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-surface-dark"
      aria-hidden="true"
    >
      <span
        ref={logoRef}
        className="font-heading text-3xl md:text-5xl tracking-[0.4em] uppercase text-content-primary"
      >
        Hemenesy & Co.
      </span>
    </div>
  );
}
