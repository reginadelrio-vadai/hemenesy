"use client";
import { useEffect, useRef, useState } from "react";
import { SafeImage } from "@/components/ui/SafeImage";

interface LightboxItem {
  src: string;
  alt: string;
  title?: string;
  desc?: string;
}

interface LightboxProps {
  items: LightboxItem[];
  initialIndex: number;
  onClose: () => void;
}

export function Lightbox({ items, initialIndex, onClose }: LightboxProps) {
  const [current, setCurrent] = useState(initialIndex);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  const hasPrev = current > 0;
  const hasNext = current < items.length - 1;

  const go = (idx: number) => {
    if (idx >= 0 && idx < items.length) setCurrent(idx);
  };

  useEffect(() => {
    closeRef.current?.focus();

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { onClose(); return; }
      if (e.key === "ArrowLeft") { go(current - 1); return; }
      if (e.key === "ArrowRight") { go(current + 1); return; }

      if (e.key === "Tab" && dialogRef.current) {
        const focusable = Array.from(
          dialogRef.current.querySelectorAll<HTMLElement>(
            "button:not([disabled]), [tabindex]:not([tabindex='-1'])"
          )
        );
        if (!focusable.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey) {
          if (document.activeElement === first) { e.preventDefault(); last.focus(); }
        } else {
          if (document.activeElement === last) { e.preventDefault(); first.focus(); }
        }
      }
    };

    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [current, onClose]); // eslint-disable-line react-hooks/exhaustive-deps

  const item = items[current];

  return (
    /* Overlay — click outside image closes. blur keeps focus on image. */
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label="Imagen ampliada"
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/80 backdrop-blur-md"
      onClick={onClose}
    >
      {/* Counter */}
      {items.length > 1 && (
        <div className="absolute top-5 left-6 z-20 pointer-events-none">
          <span className="font-body text-xs tracking-[0.3em] uppercase text-white/50">
            {current + 1} / {items.length}
          </span>
        </div>
      )}

      {/*
        Wrapper: relative so the X button can sit just outside the image's
        top-right corner. stopPropagation prevents closing when clicking here.
      */}
      <div
        className="relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* X button — anchored to image top-right corner */}
        <button
          ref={closeRef}
          onClick={onClose}
          aria-label="Cerrar"
          className="absolute -top-4 -right-4 z-20 w-9 h-9 rounded-full bg-black/60 hover:bg-black/80 flex items-center justify-center text-white transition-colors duration-200"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {/*
          Image container. key=current forces SafeImage to remount on navigation
          (resets its internal imgSrc state to the new src prop).
          min() ensures the image is at least 70vh tall or 70vw wide, whichever
          fills first, while never exceeding viewport bounds.
        */}
        <div
          key={current}
          className="relative"
          style={{
            width: "min(70vw, 700px)",
            height: "min(70vh, 850px)",
          }}
        >
          <SafeImage
            src={item.src}
            alt={item.alt}
            fill
            className="object-contain"
            sizes="(max-width: 768px) 70vw, 700px"
            priority
          />
        </div>

        {/* Caption */}
        {(item.title || item.desc) && (
          <div className="mt-4 text-center">
            {item.title && (
              <p className="font-heading text-base text-white">{item.title}</p>
            )}
            {item.desc && (
              <p className="font-accent text-sm text-white/55 mt-1 font-light">
                {item.desc}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Navigation arrows — outside the content wrapper, pointer-events-none container */}
      {items.length > 1 && (
        <div className="absolute inset-y-0 left-0 right-0 flex items-center justify-between px-3 pointer-events-none">
          <button
            onClick={(e) => { e.stopPropagation(); go(current - 1); }}
            disabled={!hasPrev}
            aria-label="Anterior"
            className="pointer-events-auto w-10 h-10 flex items-center justify-center border border-white/20 text-white/60 hover:border-brand-accent hover:text-brand-accent transition-all duration-200 disabled:opacity-20 disabled:pointer-events-none"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>

          <button
            onClick={(e) => { e.stopPropagation(); go(current + 1); }}
            disabled={!hasNext}
            aria-label="Siguiente"
            className="pointer-events-auto w-10 h-10 flex items-center justify-center border border-white/20 text-white/60 hover:border-brand-accent hover:text-brand-accent transition-all duration-200 disabled:opacity-20 disabled:pointer-events-none"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}
