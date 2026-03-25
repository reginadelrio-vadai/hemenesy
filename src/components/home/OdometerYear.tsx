"use client";
import { useRef, useLayoutEffect, useEffect } from "react";
import { gsap } from "gsap";

interface Props {
  year: number;
}

function getSteps(from: number, to: number): number[] {
  const result: number[] = [];
  const dir = to > from ? 1 : -1;
  for (let v = from + dir; dir > 0 ? v <= to : v >= to; v += dir) {
    result.push(v);
  }
  return result;
}

export function OdometerYear({ year }: Props) {
  const currentRefs = [
    useRef<HTMLSpanElement>(null),
    useRef<HTMLSpanElement>(null),
    useRef<HTMLSpanElement>(null),
    useRef<HTMLSpanElement>(null),
  ];
  const nextRefs = [
    useRef<HTMLSpanElement>(null),
    useRef<HTMLSpanElement>(null),
    useRef<HTMLSpanElement>(null),
    useRef<HTMLSpanElement>(null),
  ];

  const prevYearRef = useRef(1952);
  const isAnimating = useRef(false);

  const initialDigits = String(1952).split("");

  // Seed initial digits before first paint
  useLayoutEffect(() => {
    const str = String(1952);
    currentRefs.forEach((r, i) => {
      if (r.current) r.current.textContent = str[i];
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (prevYearRef.current === year) return;

    const prevStr = String(prevYearRef.current).padStart(4, "0");
    const nextStr = String(year).padStart(4, "0");

    // Kill in-flight tweens and reset positions
    if (isAnimating.current) {
      [...currentRefs, ...nextRefs].forEach((r) => {
        if (r.current) gsap.killTweensOf(r.current);
      });
      currentRefs.forEach((r) => {
        if (r.current) gsap.set(r.current, { top: "-0.09em" });
      });
      nextRefs.forEach((r) => {
        if (r.current) gsap.set(r.current, { top: "1em", opacity: 0 });
      });
    }
    isAnimating.current = true;
    prevYearRef.current = year;

    let lastMasterTl: gsap.core.Timeline | null = null;

    const rotateDigit = (
      i: number,
      newNum: number,
      duration: number,
      isLast: boolean
    ): gsap.core.Timeline => {
      const current = currentRefs[i].current!;
      const next = nextRefs[i].current!;

      next.textContent = newNum.toString();
      gsap.set(next, { top: "1em", opacity: 0 });

      const tl = gsap.timeline();
      tl.to(current, { top: "-1.1em", opacity: 0, duration, ease: "power2.inOut" }, 0)
        .to(next, { top: "-0.09em", opacity: 1, duration, ease: "power2.inOut" }, 0)
        .call(() => {
          current.textContent = newNum.toString();
          gsap.set(current, { top: "-0.09em", opacity: 1 });
          gsap.set(next, { top: "1em", opacity: 0 });
        });

      return tl;
    };

    currentRefs.forEach((_, i) => {
      const oldD = parseInt(prevStr[i]);
      const newD = parseInt(nextStr[i]);
      if (oldD === newD) return;

      const steps = getSteps(oldD, newD);
      const masterTl = gsap.timeline({ delay: 0.1 * i });

      steps.forEach((num, idx) => {
        const isLast = idx === steps.length - 1;
        const dur = isLast ? 0.7 : 0.22;
        masterTl.add(rotateDigit(i, num, dur, isLast));
      });

      lastMasterTl = masterTl;
    });

    if (lastMasterTl) {
      (lastMasterTl as gsap.core.Timeline).then(() => {
        isAnimating.current = false;
      });
    } else {
      isAnimating.current = false;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [year]);

  const sizeCls =
    "text-[36px] sm:text-[48px] md:text-[68px] lg:text-[86px] xl:text-[106px]";

  return (
    <div
      className={`flex flex-row font-heading font-light text-brand-accent ${sizeCls}`}
      style={{ gap: "0.05em" }}
      aria-hidden="true"
    >
      {[0, 1, 2, 3].map((i) => (
        <div
          key={i}
          style={{
            width: "0.6em",
            position: "relative",
            height: "0.82em",
            clipPath: "inset(-6px -5px -28px -5px)",
          }}
        >
          <span
            ref={currentRefs[i]}
            style={{
              position: "absolute",
              top: "-0.09em",
              left: 0,
              width: "100%",
              textAlign: "center",
              lineHeight: 1,
            }}
          >
            {initialDigits[i]}
          </span>
          <span
            ref={nextRefs[i]}
            style={{
              position: "absolute",
              top: "1em",
              left: 0,
              width: "100%",
              textAlign: "center",
              lineHeight: 1,
              opacity: 0,
            }}
          >
            0
          </span>
        </div>
      ))}
    </div>
  );
}
