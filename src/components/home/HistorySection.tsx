"use client";
import { useRef, useState, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { OdometerYear } from "@/components/home/OdometerYear";
import { SafeImage } from "@/components/ui/SafeImage";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { FADE_UP, FADE_IN } from "@/utils/animations";
gsap.registerPlugin(ScrollTrigger);

// ─── Types & data ─────────────────────────────────────────────────────────────

interface MilestoneAB {
  year: number;
  layout: "A" | "B";
  title: string;
  description: string;
  photo: string;
  photoAlt: string;
}
interface MilestoneC {
  year: number;
  layout: "C";
  title: string;
  description: string;
  photos: [string, string];
  photoAlts: [string, string];
}

// ─── Layout A — text left, framed photo right ─────────────────────────────────

function MilestoneLayoutA({
  milestone,
  elRef,
}: {
  milestone: MilestoneAB;
  elRef: React.RefObject<HTMLDivElement>;
}) {
  const textRef = useScrollAnimation(FADE_UP);
  const photoRef = useScrollAnimation(FADE_IN);

  return (
    <div
      ref={elRef}
      className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-surface-dark items-center"
    >
      <div ref={textRef} className="flex flex-col justify-center p-8 lg:p-16">
        <p className="font-body text-xs tracking-[0.3em] uppercase text-brand-accent mb-3">
          {milestone.year}
        </p>
        <h3 className="font-accent italic text-3xl uppercase text-brand-accent mb-5">
          {milestone.title}
        </h3>
        <div className="w-8 h-px bg-brand-accent mb-6" />
        <p className="font-accent text-lg text-content-secondary leading-relaxed font-light">
          {milestone.description}
        </p>
      </div>

      <div ref={photoRef} className="flex items-center justify-center px-10 py-8 lg:p-16">
        <div className="relative w-full max-w-[300px] lg:max-w-[420px] border-[5px] lg:border-[8px] border-brand-accent shadow-2xl rotate-[-1deg]">
          <SafeImage
            src={milestone.photo}
            alt={milestone.photoAlt}
            width={500}
            height={600}
            style={{ objectFit: "contain", width: "100%", height: "auto" }}
          />
        </div>
      </div>
    </div>
  );
}

// ─── Layout B — fullscreen background image ───────────────────────────────────

function MilestoneLayoutB({
  milestone,
  elRef,
}: {
  milestone: MilestoneAB;
  elRef: React.RefObject<HTMLDivElement>;
}) {
  const textRef = useScrollAnimation(FADE_UP);

  return (
    <div ref={elRef} className="min-h-screen relative bg-surface-dark max-lg:!ml-0 max-lg:!w-full" style={{ marginLeft: "calc(-280px - 2rem)", width: "100vw" }}>
      <div className="absolute inset-0">
        <SafeImage
          src={milestone.photo}
          alt={milestone.photoAlt}
          fill
          className="absolute inset-0 w-full h-full object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-black/50" />
      </div>

      <div className="relative z-10 min-h-screen flex flex-col justify-center items-center lg:items-end px-6 lg:px-16 py-20">
        <div ref={textRef} className="max-w-sm text-center lg:text-right">
          <p className="font-body text-xs tracking-[0.3em] uppercase text-brand-accent mb-3">
            {milestone.year}
          </p>
          <h3 className="font-accent italic text-3xl uppercase text-brand-accent mb-5">
            {milestone.title}
          </h3>
          <div className="w-8 h-px bg-brand-accent mx-auto lg:ml-auto lg:mr-0 mb-6" />
          <p className="font-accent text-lg text-white/80 leading-relaxed font-light">
            {milestone.description}
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Layout C — text left, photo collage right ────────────────────────────────

function MilestoneLayoutC({
  milestone,
  elRef,
}: {
  milestone: MilestoneC;
  elRef: React.RefObject<HTMLDivElement>;
}) {
  const textRef = useScrollAnimation(FADE_UP);
  const photo1Ref = useScrollAnimation(FADE_IN);
  const photo2Ref = useScrollAnimation(FADE_IN);

  return (
    <div
      ref={elRef}
      className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-surface-dark items-center"
    >
      <div
        ref={textRef}
        className="flex flex-col justify-center p-8 lg:p-16 order-2 lg:order-1"
      >
        <p className="font-body text-xs tracking-[0.3em] uppercase text-brand-accent mb-3">
          {milestone.year}
        </p>
        <h3 className="font-accent italic text-3xl uppercase text-brand-accent mb-5">
          {milestone.title}
        </h3>
        <div className="w-8 h-px bg-brand-accent mb-6" />
        <p className="font-accent text-lg text-content-secondary leading-relaxed font-light">
          {milestone.description}
        </p>
      </div>

      <div className="relative w-full max-w-[500px] mx-auto order-1 lg:order-2 py-8 lg:py-20 px-6 lg:px-0 lg:min-h-[500px]">
        <div ref={photo1Ref} className="relative w-full lg:w-[65%] z-0 shadow-2xl border-2 border-white/30">
          <SafeImage
            src={milestone.photos[0]}
            alt={milestone.photoAlts[0]}
            width={400}
            height={300}
            style={{ objectFit: "cover", width: "100%", height: "auto" }}
          />
        </div>
        <div
          ref={photo2Ref}
          className="relative w-full lg:w-[65%] mt-4 lg:-mt-[80px] ml-0 lg:ml-auto z-10 shadow-2xl border-2 border-white/30"
        >
          <SafeImage
            src={milestone.photos[1]}
            alt={milestone.photoAlts[1]}
            width={400}
            height={300}
            style={{ objectFit: "cover", width: "100%", height: "auto" }}
          />
        </div>
      </div>
    </div>
  );
}

// ─── Intro ────────────────────────────────────────────────────────────────────

function HistoryIntro() {
  const ref = useScrollAnimation(FADE_UP);
  return (
    <div
      id="historia"
      className="min-h-screen flex flex-col items-center justify-center px-6 bg-surface-dark text-center"
    >
      <div ref={ref}>
        <p className="font-heading text-sm tracking-[0.3em] text-brand-accent uppercase mb-8">
          Nuestra Historia
        </p>
        <p className="font-accent text-lg md:text-xl text-content-secondary max-w-[700px] leading-relaxed font-light mb-16 mx-auto">
          Tres generaciones de obsesión por la perfección gemológica. Desde los
          mercados de Bogotá hasta los ateliers de Ciudad de México, la historia
          de Hemenesy es la historia de las esmeraldas más extraordinarias del
          mundo.
        </p>
        <div className="animate-bounce text-brand-accent flex justify-center" aria-hidden="true">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>
      </div>
    </div>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────

export function HistorySection() {
  const [currentYear, setCurrentYear] = useState(1952);

  const hito1Ref = useRef<HTMLDivElement>(null);
  const hito2Ref = useRef<HTMLDivElement>(null);
  const hito3Ref = useRef<HTMLDivElement>(null);
  const hito4Ref = useRef<HTMLDivElement>(null);
  const hito5Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const hitoData: { ref: React.RefObject<HTMLDivElement>; year: number }[] = [
      { ref: hito1Ref, year: 1952 },
      { ref: hito2Ref, year: 1975 },
      { ref: hito3Ref, year: 1993 },
      { ref: hito4Ref, year: 2010 },
      { ref: hito5Ref, year: 2026 },
    ];

    const triggers = hitoData.map(({ ref, year }) =>
      ScrollTrigger.create({
        trigger: ref.current,
        start: "top center",
        end: "bottom center",
        onToggle: (self) => {
          if (self.isActive) setCurrentYear(year);
        },
      })
    );

    return () => triggers.forEach((t) => t.kill());
  }, []);

  const milestones = {
    m1: { year: 1952, layout: "A" as const, title: "Los Orígenes",
      description: "Don Alejandro Hemenesy descubre su primera esmeralda colombiana en el mercado de Bogotá. Una piedra de 8.3 quilates que cambiaría el rumbo de su vida y el de tres generaciones.",
      photo: "/images/historia-1.png", photoAlt: "Los orígenes de Hemenesy, 1952" },
    m2: { year: 1975, layout: "B" as const, title: "La Primera Mina",
      description: "La familia Hemenesy adquiere su primera participación en una mina del Cinturón Esmeraldífero Occidental, garantizando el origen y trazabilidad de cada piedra.",
      photo: "/images/historia-2.png", photoAlt: "La primera mina de esmeraldas, 1975" },
    m3: { year: 1993, layout: "C" as const, title: "Expansión",
      description: "Hemenesy abre su primer atelier en Ciudad de México y comienza la colaboración con maestros joyeros europeos, elevando cada pieza al nivel del lujo internacional.",
      photos: ["/images/historia-3.png", "/images/historia-4.png"] as [string, string],
      photoAlts: ["Expansión Hemenesy, atelier Ciudad de México 1993", "Colección de alta joyería Hemenesy 1993"] as [string, string] },
    m4: { year: 2010, layout: "A" as const, title: "Nueva Generación",
      description: "La tercera generación toma las riendas con una visión renovada: combinar la tradición gemológica con el diseño contemporáneo de lujo y los estándares internacionales más exigentes.",
      photo: "/images/historia-5.png", photoAlt: "Nueva generación Hemenesy, 2010" },
    m5: { year: 2026, layout: "B" as const, title: "Hemenesy Hoy",
      description: "Con inteligencia artificial y los más altos estándares de la joyería internacional, Hemenesy lleva la experiencia del lujo gemológico a una nueva dimensión.",
      photo: "/images/historia-6.png", photoAlt: "Hemenesy hoy, 2026" },
  };

  const milestonesJSX = (
    <>
      <MilestoneLayoutA milestone={milestones.m1} elRef={hito1Ref} />
      <MilestoneLayoutB milestone={milestones.m2} elRef={hito2Ref} />
      <MilestoneLayoutC milestone={milestones.m3} elRef={hito3Ref} />
      <MilestoneLayoutA milestone={milestones.m4} elRef={hito4Ref} />
      <MilestoneLayoutB milestone={milestones.m5} elRef={hito5Ref} />
    </>
  );

  return (
    <section aria-label="Historia de Hemenesy">
      <HistoryIntro />

      {/* ── Mobile: sticky odometer bar + milestones ── */}
      <div className="lg:hidden">
        <div className="sticky top-0 z-20 flex justify-center items-center bg-surface-dark/90 backdrop-blur-sm py-4">
          <OdometerYear year={currentYear} />
        </div>
        {milestonesJSX}
      </div>

      {/* ── Desktop: two-column grid ── */}
      <div className="hidden lg:grid lg:grid-cols-[280px_1fr] lg:gap-8">
        {/* Left: sticky odometer */}
        <div className="sticky top-[33vh] self-start h-fit z-30 flex justify-center pt-8">
          <OdometerYear year={currentYear} />
        </div>
        {/* Right: milestones */}
        <div>{milestonesJSX}</div>
      </div>
    </section>
  );
}
