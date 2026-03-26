"use client";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FADE_UP, STAGGER, LUXURY } from "@/utils/animations";
gsap.registerPlugin(ScrollTrigger);

const STAGES = [
  {
    num: "01",
    title: "Origen en la Mina",
    desc: "Todo comienza en las montañas de Colombia, donde nacen algunas de las esmeraldas más extraordinarias del mundo. Allí inicia el recorrido de una gema marcada por su origen, rareza y carácter irrepetible.",
  },
  {
    num: "02",
    title: "Selección de la Esmeralda",
    desc: "Cada piedra es cuidadosamente evaluada por su color, pureza, transparencia y potencial. Solo aquellas que expresan verdadera belleza y singularidad continúan el camino hacia una creación excepcional.",
  },
  {
    num: "03",
    title: "Talla y Revelación",
    desc: "La esmeralda en bruto se trabaja con precisión para revelar su luz, profundidad y equilibrio. La talla respeta la esencia natural de la gema y realza todo aquello que la hace única.",
  },
  {
    num: "04",
    title: "Certificación y Valoración",
    desc: "Antes de convertirse en joya, la esmeralda es examinada y documentada para validar su autenticidad, sus características y su valor. Este proceso resguarda su procedencia y confirma su distinción.",
  },
  {
    num: "05",
    title: "Creación de la Joya",
    desc: "A partir de la gema elegida, concebimos una pieza a medida que une diseño, intención y oficio artesanal. Oro, platino y esmeralda se encuentran en una obra creada exclusivamente para su portador.",
  },
  {
    num: "06",
    title: "Entrega al Cliente",
    desc: "La joya llega a tus manos como una creación única: una pieza de alta joyería concebida para ti, donde se unen origen, arte y significado en una forma destinada a permanecer.",
  },
];

function StageContent({
  stage,
  align,
}: {
  stage: (typeof STAGES)[0];
  align: "left" | "right";
}) {
  return (
    <div className={align === "right" ? "text-right" : ""}>
      <span className="font-heading text-4xl text-brand-accent block mb-1">
        {stage.num}
      </span>
      <h3 className="font-heading text-xl text-content-primary mb-2">
        {stage.title}
      </h3>
      <div className={`w-8 h-px bg-brand-accent mb-3 ${align === "right" ? "ml-auto" : ""}`} />
      <p className="font-accent text-base text-content-secondary leading-relaxed font-light max-w-xs">
        {stage.desc}
      </p>
    </div>
  );
}

export function ProcessSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Title
      gsap.fromTo(titleRef.current, FADE_UP.from, {
        ...FADE_UP.to,
        scrollTrigger: { trigger: titleRef.current, start: "top 80%" },
      });

      // Scrub line — origin-top, scaleY 0→1
      gsap.fromTo(
        lineRef.current,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 20%",
            end: "bottom 80%",
            scrub: 1,
          },
        }
      );

      // Desktop cards stagger
      const desktopCards = gsap.utils.toArray<HTMLElement>(
        '[data-step-card="desktop"]',
        sectionRef.current!
      );
      if (desktopCards.length) {
        gsap.fromTo(desktopCards, FADE_UP.from, {
          ...FADE_UP.to,
          stagger: STAGGER.stagger,
          scrollTrigger: { trigger: sectionRef.current, start: "top 60%" },
        });
      }

      // Mobile cards stagger
      const mobileCards = gsap.utils.toArray<HTMLElement>(
        '[data-step-card="mobile"]',
        sectionRef.current!
      );
      if (mobileCards.length) {
        gsap.fromTo(mobileCards, FADE_UP.from, {
          ...FADE_UP.to,
          stagger: STAGGER.stagger,
          scrollTrigger: { trigger: sectionRef.current, start: "top 60%" },
        });
      }

      // Nodes: gray → emerald green on enter
      gsap.utils
        .toArray<HTMLElement>("[data-step-node]", sectionRef.current!)
        .forEach((node) => {
          ScrollTrigger.create({
            trigger: node,
            start: "top 65%",
            onEnter: () =>
              gsap.to(node, {
                borderColor: "#D4AF37",
                backgroundColor: "#D4AF37",
                duration: 0.3,
                ease: LUXURY.ease.content,
              }),
            onLeaveBack: () =>
              gsap.to(node, {
                borderColor: "#2A2A2A",
                backgroundColor: "transparent",
                duration: 0.2,
              }),
          });
        });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="proceso"
      className="bg-surface-dark py-24 lg:py-32"
      aria-label="Proceso Hemenesy"
    >
      <div className="max-w-content mx-auto px-6 lg:px-12">
        <div ref={titleRef} className="text-center mb-20">
          <p className="font-body text-xs tracking-[0.3em] uppercase text-brand-accent mb-4">
            Nuestro Proceso
          </p>
          <h2 className="font-heading text-4xl md:text-5xl text-content-primary">
            Del origen a tus manos
          </h2>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line — mobile: left-[15px], desktop: center */}
          <div className="absolute left-[15px] top-0 bottom-0 w-px bg-line lg:left-1/2 lg:-translate-x-px">
            <div
              ref={lineRef}
              className="absolute inset-0 bg-brand-accent origin-top"
              style={{ transform: "scaleY(0)" }}
            />
          </div>

          {STAGES.map((stage, i) => {
            const isLeft = i % 2 === 0;
            return (
              <div key={stage.num} className="relative mb-12 lg:mb-20">
                {/* ── Mobile ── */}
                <div className="flex items-start gap-4 pl-9 lg:hidden">
                  <div
                    data-step-node
                    className="absolute left-[15px] top-1 w-3 h-3 rounded-full border-2 z-10 -translate-x-1/2"
                    style={{ borderColor: "#2A2A2A", backgroundColor: "transparent" }}
                  />
                  <div data-step-card="mobile">
                    <StageContent stage={stage} align="left" />
                  </div>
                </div>

                {/* ── Desktop: 3-col grid ── */}
                <div className="hidden lg:grid lg:grid-cols-[1fr_60px_1fr] lg:items-center">
                  {/* Left column */}
                  <div className={isLeft ? "flex justify-end pr-10" : ""}>
                    {isLeft && (
                      <div data-step-card="desktop" className="max-w-xs">
                        <StageContent stage={stage} align="right" />
                      </div>
                    )}
                  </div>

                  {/* Center node */}
                  <div className="flex justify-center">
                    <div
                      data-step-node
                      className="w-4 h-4 rounded-full border-2 z-10 relative"
                      style={{ borderColor: "#2A2A2A", backgroundColor: "transparent" }}
                    />
                  </div>

                  {/* Right column */}
                  <div className={!isLeft ? "pl-10" : ""}>
                    {!isLeft && (
                      <div data-step-card="desktop" className="max-w-xs">
                        <StageContent stage={stage} align="left" />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
