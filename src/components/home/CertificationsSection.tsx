"use client";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { FADE_UP } from "@/utils/animations";
gsap.registerPlugin(ScrollTrigger);

const STATS = [
  { to: 25, label: "Años de experiencia" },
  { to: 1200, label: "Piezas únicas", from: 900 },
  { to: 12, label: "Países" },
];

const CERTS = [
  {
    name: "GIA",
    full: "Gemological Institute of America",
    desc: "El estándar mundial en graduación gemológica. Cada esmeralda con certificado GIA garantiza origen, color y claridad verificados.",
  },
  {
    name: "GRS",
    full: "Gem Research Swisslab",
    desc: "Laboratorio suizo especializado en piedras de color. Sus reportes son el referente para esmeraldas de alta calidad en el mercado internacional.",
  },
  {
    name: "AGL",
    full: "American Gemological Laboratories",
    desc: "Institución líder en análisis de tratamientos gemológicos. Certifica la naturalidad y el origen de cada piedra Hemenesy.",
  },
  {
    name: "CDTEC",
    full: "Centro de Diseño Tecnológico Industrial",
    desc: "Certificación de diseño y manufactura en joyería de lujo. Avala los procesos artesanales y el control de calidad de nuestros ateliers.",
  },
];

function StatCounter({
  to,
  from = 0,
  label,
}: {
  to: number;
  from?: number;
  label: string;
}) {
  const numRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!numRef.current) return;
    const obj = { val: from };
    const ctx = gsap.context(() => {
      gsap.to(obj, {
        val: to,
        duration: 2,
        ease: "power2.out",
        scrollTrigger: {
          trigger: numRef.current,
          start: "top 85%",
          once: true,
        },
        onUpdate: () => {
          if (numRef.current)
            numRef.current.textContent = Math.round(obj.val).toString();
        },
      });
    });
    return () => ctx.revert();
  }, [from, to]);

  return (
    <div className="text-center">
      <span
        ref={numRef}
        className="font-heading text-6xl md:text-8xl text-brand-accent"
        aria-label={`${to} ${label}`}
      >
        {from}
      </span>
      {/* opacity-80 on element — avoids CSS-variable color-opacity modifier */}
      <p className="font-body text-sm tracking-widest uppercase text-content-dark opacity-70 mt-2">
        {label}
      </p>
    </div>
  );
}

function CertBadge({
  name,
  full,
  desc,
}: {
  name: string;
  full: string;
  desc: string;
}) {
  const ref = useScrollAnimation(FADE_UP);
  return (
    <div
      ref={ref}
      className="group flex flex-col p-6 border border-content-dark/10 hover:border-brand-accent transition-all duration-500 max-w-xs"
      title={full}
    >
      {/* Grayscale → color: opacity on element, not on color value */}
      <span className="font-heading text-3xl text-content-dark opacity-40 group-hover:opacity-100 group-hover:text-brand-accent transition-all duration-500 mb-2">
        {name}
      </span>
      <span className="font-body text-xs text-content-dark opacity-50 group-hover:opacity-80 tracking-wide mb-3 transition-opacity duration-500">
        {full}
      </span>
      <div className="w-6 h-px bg-content-dark opacity-20 group-hover:opacity-60 mb-3 transition-opacity duration-500" />
      <p className="font-accent text-sm text-content-dark opacity-60 group-hover:opacity-80 leading-relaxed font-light transition-opacity duration-500">
        {desc}
      </p>
    </div>
  );
}

export function CertificationsSection() {
  const titleRef = useScrollAnimation(FADE_UP);

  return (
    /* text-content-dark on the section so all children inherit dark text */
    <section
      className="bg-surface-light text-content-dark py-24"
      aria-label="Certificaciones y estadísticas"
    >
      <div className="max-w-content mx-auto px-6 lg:px-12">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-24">
          {STATS.map((s) => (
            <StatCounter key={s.label} {...s} />
          ))}
        </div>

        {/* Certifications header */}
        <div ref={titleRef} className="text-center mb-12">
          <p className="font-body text-xs tracking-[0.3em] uppercase text-brand-accent mb-4">
            Garantía de Autenticidad
          </p>
          <h2 className="font-heading text-3xl md:text-4xl text-content-dark mb-4">
            Certificaciones internacionales
          </h2>
          <p className="font-accent text-base text-content-dark opacity-70 font-light max-w-lg mx-auto leading-relaxed">
            Cada esmeralda Hemenesy viene respaldada por los laboratorios
            gemológicos más exigentes del mundo.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-6">
          {CERTS.map((cert) => (
            <CertBadge key={cert.name} {...cert} />
          ))}
        </div>
      </div>
    </section>
  );
}
