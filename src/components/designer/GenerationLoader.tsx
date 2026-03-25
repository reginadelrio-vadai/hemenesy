"use client";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

const TEXTS = [
  "Seleccionando la esmeralda perfecta...",
  "El maestro joyero trabaja en tu diseño...",
  "Puliendo cada detalle...",
  "Tu pieza única está casi lista...",
];

export function GenerationLoader() {
  const pathRef = useRef<SVGPathElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const [textIndex, setTextIndex] = useState(0);
  const [fadeIn, setFadeIn] = useState(true);

  // SVG draw animation
  useEffect(() => {
    const path = pathRef.current;
    if (!path) return;
    const ctx = gsap.context(() => {
      gsap.set(path, { strokeDasharray: 490, strokeDashoffset: 490 });
      gsap.timeline({ repeat: -1, repeatDelay: 0.5 })
        .to(path, { strokeDashoffset: 0, duration: 2.5, ease: "power2.inOut" })
        .to(path, { strokeDashoffset: -490, duration: 2.5, ease: "power2.inOut" });
    });
    return () => ctx.revert();
  }, []);

  // Progress bar 0 → 85% over 60s
  useEffect(() => {
    const bar = barRef.current;
    if (!bar) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(bar, { width: "0%" }, { width: "85%", duration: 60, ease: "none" });
    });
    return () => ctx.revert();
  }, []);

  // Crossfade texts every 2.5s
  useEffect(() => {
    const interval = setInterval(() => {
      setFadeIn(false);
      setTimeout(() => {
        setTextIndex((i) => (i + 1) % TEXTS.length);
        setFadeIn(true);
      }, 400);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-full flex flex-col items-center justify-center px-6 py-20">
      {/* Octagonal emerald SVG */}
      <div className="mb-10 w-[160px] md:w-[200px]" aria-hidden="true">
        <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          {/* Background fill */}
          <path
            d="M 173.9,69.5 L 173.9,130.5 L 130.5,173.9 L 69.5,173.9 L 26.1,130.5 L 26.1,69.5 L 69.5,26.1 L 130.5,26.1 Z"
            fill="var(--color-primary, #0F2818)"
            fillOpacity="0.15"
          />
          {/* Animated stroke */}
          <path
            ref={pathRef}
            d="M 173.9,69.5 L 173.9,130.5 L 130.5,173.9 L 69.5,173.9 L 26.1,130.5 L 26.1,69.5 L 69.5,26.1 L 130.5,26.1 Z"
            stroke="var(--color-accent, #C8A96E)"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Inner facet lines */}
          <path
            d="M 130.5,26.1 L 100,50 L 69.5,26.1 M 173.9,69.5 L 150,100 L 173.9,130.5 M 130.5,173.9 L 100,150 L 69.5,173.9 M 26.1,130.5 L 50,100 L 26.1,69.5 M 100,50 L 100,150 M 50,100 L 150,100"
            stroke="var(--color-accent, #C8A96E)"
            strokeWidth="0.5"
            strokeOpacity="0.3"
          />
        </svg>
      </div>

      {/* Crossfading text */}
      <p
        aria-live="polite"
        aria-atomic="true"
        className="font-accent italic text-lg text-content-secondary text-center max-w-xs transition-opacity duration-300"
        style={{ opacity: fadeIn ? 1 : 0 }}
      >
        {TEXTS[textIndex]}
      </p>

      {/* Progress bar */}
      <div
        role="progressbar"
        aria-label="Progreso de generación"
        aria-valuemin={0}
        aria-valuemax={100}
        className="mt-10 w-[200px] h-px bg-line/20 relative overflow-hidden"
      >
        <div ref={barRef} className="absolute left-0 top-0 h-full bg-brand-accent" style={{ width: "0%" }} />
      </div>
    </div>
  );
}
