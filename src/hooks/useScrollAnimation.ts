"use client";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FADE_UP, SCROLL_DEFAULTS } from "@/utils/animations";
gsap.registerPlugin(ScrollTrigger);

interface Animation {
  from: Record<string, unknown>;
  to: Record<string, unknown>;
}

export function useScrollAnimation(
  animation: Animation = FADE_UP,
  trigger = SCROLL_DEFAULTS
) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const ctx = gsap.context(() => {
      gsap.from(ref.current, {
        ...animation.from,
        scrollTrigger: { trigger: ref.current, ...trigger },
        ...animation.to,
      });
    });
    return () => ctx.revert();
  }, [animation, trigger]);
  return ref;
}
