export const FADE_UP = {
  from: { y: 40, opacity: 0 },
  to: { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" },
};
export const FADE_IN = {
  from: { opacity: 0 },
  to: { opacity: 1, duration: 0.6, ease: "power3.out" },
};
export const SLIDE_LEFT = {
  from: { x: -60, opacity: 0 },
  to: { x: 0, opacity: 1, duration: 0.8, ease: "power3.out" },
};
export const SLIDE_RIGHT = {
  from: { x: 60, opacity: 0 },
  to: { x: 0, opacity: 1, duration: 0.8, ease: "power3.out" },
};
export const STAGGER = { stagger: 0.12, duration: 0.6, ease: "power3.out" };
export const SCROLL_DEFAULTS = {
  start: "top 80%",
  end: "bottom 20%",
  toggleActions: "play none none none",
};

export const LUXURY = {
  ease: {
    hero: "power4.out",
    content: "power3.out",
    transition: "expo.out",
  },
  duration: {
    fast: 0.5,
    normal: 0.8,
    slow: 1.2,
    dramatic: 1.8,
  },
};
