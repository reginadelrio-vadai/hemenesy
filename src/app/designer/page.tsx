"use client";
import { useState, useRef, useEffect, useLayoutEffect } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { useDesigner } from "@/hooks/useDesigner";
import { useAuth } from "@/components/layout/AuthProvider";
import { LUXURY } from "@/utils/animations";
import { AuthGate } from "@/components/designer/AuthGate";
import { StepperDots } from "@/components/designer/StepperDots";
import { DesignerWelcome } from "@/components/designer/DesignerWelcome";
import { StepJewelryType } from "@/components/designer/StepJewelryType";
import { StepDesignStyle } from "@/components/designer/StepDesignStyle";
import { StepMetal } from "@/components/designer/StepMetal";
import { StepEmeraldType } from "@/components/designer/StepEmeraldType";
import { StepDetails } from "@/components/designer/StepDetails";
import { DesignSummary } from "@/components/designer/DesignSummary";
import { GenerationLoader } from "@/components/designer/GenerationLoader";
import { DesignResult } from "@/components/designer/DesignResult";

export default function DesignerPage() {
  const { user } = useAuth();
  const {
    state, editMode, setEditMode,
    setField, canAdvance, nextStep, prevStep, goToStep,
    submitGeneration, regenerate, modifyDesign, reset,
  } = useDesigner();

  const [showAuthGate, setShowAuthGate] = useState(false);

  // Handle mount: restore from auth redirect or start fresh
  useEffect(() => {
    const pendingGeneration = localStorage.getItem("hemenesy_auth_pending");
    if (pendingGeneration === "true" && user) {
      // Usuario volvió de auth con formulario pendiente — no resetear
      localStorage.removeItem("hemenesy_auth_pending");
      // El estado se restaura desde localStorage via useDesigner
      // Avanzar al resumen (step 6) para que confirme y genere
      goToStep(6);
    } else if (!pendingGeneration) {
      // Entrada normal — empezar de cero
      reset();
    }
    // Si pendingGeneration existe pero user es null, no hacer nada aún
    // (el AuthProvider está cargando, el user llegará en otro render)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  // Clear state if a different user logs in
  useEffect(() => {
    if (typeof window === "undefined") return;
    const savedUserId = localStorage.getItem("hemenesy_designer_user");
    const currentUserId = user?.id ?? null;
    if (currentUserId && savedUserId && savedUserId !== currentUserId) {
      reset();
    }
    if (currentUserId) {
      localStorage.setItem("hemenesy_designer_user", currentUserId);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  const step = state.currentStep;

  // Step panel refs
  const r0 = useRef<HTMLDivElement>(null);
  const r1 = useRef<HTMLDivElement>(null);
  const r2 = useRef<HTMLDivElement>(null);
  const r3 = useRef<HTMLDivElement>(null);
  const r4 = useRef<HTMLDivElement>(null);
  const r5 = useRef<HTMLDivElement>(null);
  const r6 = useRef<HTMLDivElement>(null);
  const r7 = useRef<HTMLDivElement>(null);
  const stepRefs = [r0, r1, r2, r3, r4, r5, r6, r7];

  const prevStepRef = useRef(step);

  // Initialize: step 0 visible, rest off right
  useLayoutEffect(() => {
    stepRefs.forEach((ref, i) => {
      if (!ref.current) return;
      gsap.set(ref.current, { x: i === 0 ? "0%" : "100%", opacity: i === 0 ? 1 : 0 });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // GSAP transition on step change
  useEffect(() => {
    const prev = prevStepRef.current;
    const curr = step;
    if (prev === curr) return;
    prevStepRef.current = curr;

    const prevEl = stepRefs[prev]?.current;
    const currEl = stepRefs[curr]?.current;
    if (!prevEl || !currEl) return;

    const dir = curr > prev ? 1 : -1;
    gsap.set(currEl, { x: `${dir * 100}%`, opacity: 1 });

    gsap.timeline()
      .to(prevEl, { x: `${-dir * 100}%`, opacity: 0, duration: 0.4, ease: LUXURY.ease.transition }, 0)
      .to(currEl, { x: "0%", opacity: 1, duration: 0.4, ease: LUXURY.ease.transition }, 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  // En editMode: auto-advance vuelve al resumen; en flujo normal: avanza al siguiente paso
  const handleAutoAdvance = () => {
    if (editMode) {
      goToStep(6);
    } else {
      nextStep();
    }
  };

  const handleNext = () => {
    if (step === 6) {
      if (!user) {
        // Usuario no autenticado — guardar flag y mostrar modal
        localStorage.setItem("hemenesy_auth_pending", "true");
        setShowAuthGate(true);
        return;
      }
      setEditMode(false);
      nextStep();
      submitGeneration();
    } else if (editMode && step >= 1 && step <= 5) {
      // En editMode, "Siguiente" manual también regresa al resumen
      goToStep(6);
    } else {
      nextStep();
    }
  };

  const showNav = step >= 1 && step <= 6;
  const canGoNext = canAdvance();

  return (
    <div className="bg-surface-dark" style={{ display: "flex", flexDirection: "column", minHeight: "100svh" }}>
      {/* Back to home */}
      <div className="flex-shrink-0 flex items-center px-6 pt-5 pb-2">
        <Link
          href="/"
          className="font-heading text-sm tracking-[0.2em] text-content-secondary hover:text-content-primary transition-colors"
        >
          ← HEMENESY & CO.
        </Link>
      </div>

      {/* Stepper header */}
      {showNav && (
        <div className="flex-shrink-0 flex justify-center pt-6 pb-4">
          <StepperDots currentStep={step} goToStep={goToStep} />
        </div>
      )}

      {/* Step panels */}
      <div className="flex-1 relative overflow-hidden" style={{ minHeight: 0 }}>
        {/* Step 0 — Welcome */}
        <div ref={r0} style={{ position: "absolute", inset: 0, overflowY: "auto", willChange: "transform, opacity" }}>
          <DesignerWelcome onStart={nextStep} />
        </div>

        {/* Step 1 — Jewelry type */}
        <div ref={r1} style={{ position: "absolute", inset: 0, overflowY: "auto", willChange: "transform, opacity" }}>
          <StepJewelryType
            value={state.jewelryType}
            onChange={(v) => setField("jewelryType", v)}
            onAutoAdvance={handleAutoAdvance}
          />
        </div>

        {/* Step 2 — Design style */}
        <div ref={r2} style={{ position: "absolute", inset: 0, overflowY: "auto", willChange: "transform, opacity" }}>
          <StepDesignStyle
            value={state.designStyle}
            onChange={(v) => setField("designStyle", v)}
            onAutoAdvance={handleAutoAdvance}
          />
        </div>

        {/* Step 3 — Metal */}
        <div ref={r3} style={{ position: "absolute", inset: 0, overflowY: "auto", willChange: "transform, opacity" }}>
          <StepMetal
            value={state.metal}
            onChange={(v) => setField("metal", v)}
            onAutoAdvance={handleAutoAdvance}
          />
        </div>

        {/* Step 4 — Emerald type */}
        <div ref={r4} style={{ position: "absolute", inset: 0, overflowY: "auto", willChange: "transform, opacity" }}>
          <StepEmeraldType
            value={state.emeraldType}
            onChange={(v) => setField("emeraldType", v)}
            onAutoAdvance={handleAutoAdvance}
          />
        </div>

        {/* Step 5 — Details */}
        <div ref={r5} style={{ position: "absolute", inset: 0, overflowY: "auto", willChange: "transform, opacity" }}>
          <StepDetails
            complementaryStones={state.complementaryStones}
            additionalNotes={state.additionalNotes}
            onChangeStones={(v) => setField("complementaryStones", v)}
            onChangeNotes={(v) => setField("additionalNotes", v)}
          />
        </div>

        {/* Step 6 — Summary */}
        <div ref={r6} style={{ position: "absolute", inset: 0, overflowY: "auto", willChange: "transform, opacity" }}>
          <DesignSummary
            state={state}
            generationsRemaining={state.generationsRemaining}
            editMode={editMode}
            onEditSection={(s) => goToStep(s)}
          />
        </div>

        {/* Step 7 — Generation / Result */}
        <div ref={r7} style={{ position: "absolute", inset: 0, overflowY: "auto", willChange: "transform, opacity" }}>
          {state.isGenerating ? (
            <GenerationLoader />
          ) : (
            <DesignResult
              state={state}
              onRegenerate={regenerate}
              onModify={modifyDesign}
              onReset={reset}
            />
          )}
        </div>
      </div>

      {/* Navigation footer */}
      {showNav && (
        <div className="flex-shrink-0 border-t border-line/20 px-8 py-5 flex items-center justify-between">
          <button
            type="button"
            onClick={editMode && step >= 1 && step <= 5 ? () => goToStep(6) : prevStep}
            className="font-body text-sm tracking-widest uppercase text-content-secondary hover:text-content-primary transition-colors"
          >
            {editMode && step >= 1 && step <= 5 ? "← Resumen" : "← Atrás"}
          </button>

          <button
            type="button"
            onClick={handleNext}
            disabled={!canGoNext}
            className={`font-body text-sm tracking-widest uppercase transition-all duration-300 ${
              canGoNext
                ? "text-brand-accent hover:text-brand-accent/80"
                : "text-content-secondary/40 cursor-not-allowed pointer-events-none"
            }`}
          >
            {step === 6 ? "Generar diseño →" : editMode ? "← Volver al resumen" : "Siguiente →"}
          </button>
        </div>
      )}

      {/* Auth gate modal */}
      {showAuthGate && (
        <AuthGate onClose={() => setShowAuthGate(false)} />
      )}
    </div>
  );
}
