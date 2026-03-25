"use client";
import { useState, useCallback, useEffect } from "react";
import { useAuth } from "@/components/layout/AuthProvider";
import type { DesignerState } from "@/types";

const KEY = "hemenesy_designer_state";
const INIT: DesignerState = {
  currentStep: 0,
  jewelryType: null,
  designStyle: null,
  metal: null,
  emeraldType: null,
  complementaryStones: null,
  engraving: false,
  additionalNotes: "",
  generatedImageUrl: null,
  designId: null,
  isGenerating: false,
  error: null,
  generationsRemaining: 3,
};
const FIELD: Record<number, keyof DesignerState | null> = {
  0: null,
  1: "jewelryType",
  2: "designStyle",
  3: "metal",
  4: "emeraldType",
  5: null,
  6: null,
  7: null,
};

export function useDesigner() {
  const { refetchProfile } = useAuth();
  const [state, setState] = useState<DesignerState>(INIT);
  const [editMode, setEditMode] = useState(false);

  // Cargar localStorage solo en cliente (evita hydration mismatch)
  useEffect(() => {
    try {
      const s = localStorage.getItem(KEY);
      if (s) {
        const p = JSON.parse(s);
        setState((prev) => ({ ...prev, ...p, isGenerating: false, error: null, generatedImageUrl: null, designId: null }));
      }
    } catch {}
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (typeof window === "undefined" || state.currentStep <= 0 || state.currentStep >= 7) return;
    localStorage.setItem(
      KEY,
      JSON.stringify({
        currentStep: state.currentStep,
        jewelryType: state.jewelryType,
        designStyle: state.designStyle,
        metal: state.metal,
        emeraldType: state.emeraldType,
        complementaryStones: state.complementaryStones,
        additionalNotes: state.additionalNotes,
      })
    );
  }, [
    state.jewelryType,
    state.designStyle,
    state.metal,
    state.emeraldType,
    state.complementaryStones,
    state.additionalNotes,
    state.currentStep,
  ]);

  useEffect(() => {
    if (!(state.jewelryType || state.designStyle || state.metal) || state.currentStep === 7) return;
    const h = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", h);
    return () => window.removeEventListener("beforeunload", h);
  }, [state.jewelryType, state.designStyle, state.metal, state.currentStep]);

  const setField = useCallback(<K extends keyof DesignerState>(f: K, v: DesignerState[K]) => {
    setState((p) => ({ ...p, [f]: v, error: null }));
  }, []);

  const canAdvance = useCallback((): boolean => {
    const f = FIELD[state.currentStep];
    return !f || state[f] !== null;
  }, [state.currentStep, state.jewelryType, state.designStyle, state.metal, state.emeraldType]);

  const nextStep = useCallback(() => {
    if (canAdvance()) setState((p) => ({ ...p, currentStep: Math.min(p.currentStep + 1, 7), error: null }));
  }, [canAdvance]);

  const prevStep = useCallback(() => {
    setState((p) => ({ ...p, currentStep: Math.max(p.currentStep - 1, 0), error: null }));
  }, []);

  const goToStep = useCallback(
    (s: number) => {
      if (editMode || s <= state.currentStep) setState((p) => ({ ...p, currentStep: s, error: null }));
    },
    [state.currentStep, editMode]
  );

  const submitGeneration = useCallback(async () => {
    setState((p) => ({ ...p, isGenerating: true, error: null }));
    try {
      const r = await fetch("/api/generate-design", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jewelryType: state.jewelryType,
          designStyle: state.designStyle,
          metal: state.metal,
          emeraldType: state.emeraldType,
          complementaryStones: state.complementaryStones || "ninguna",
          engraving: false,
          additionalNotes: state.additionalNotes,
        }),
      });
      const d = await r.json();
      if (!r.ok) {
        setState((p) => ({ ...p, isGenerating: false, error: d.error }));
        return;
      }
      localStorage.removeItem(KEY);
      localStorage.setItem("hemenesy_last_result", JSON.stringify({ designId: d.designId, imageUrl: d.imageUrl }));
      setState((p) => ({
        ...p,
        isGenerating: false,
        generatedImageUrl: d.imageUrl,
        designId: d.designId,
        generationsRemaining: d.generationsRemaining,
        currentStep: 7,
      }));
      refetchProfile();
    } catch {
      setState((p) => ({ ...p, isGenerating: false, error: "Error de conexión." }));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.jewelryType, state.designStyle, state.metal, state.emeraldType, state.complementaryStones, state.additionalNotes, refetchProfile]);

  const regenerate = useCallback(() => submitGeneration(), [submitGeneration]);

  const modifyDesign = useCallback(() => {
    setEditMode(true);
    setState((p) => ({ ...p, currentStep: 6, generatedImageUrl: null, designId: null, error: null }));
  }, []);

  const reset = useCallback(() => {
    localStorage.removeItem(KEY);
    localStorage.removeItem("hemenesy_last_result");
    setEditMode(false);
    setState(INIT);
  }, []);

  return { state, editMode, setEditMode, setField, canAdvance, nextStep, prevStep, goToStep, submitGeneration, regenerate, modifyDesign, reset };
}
