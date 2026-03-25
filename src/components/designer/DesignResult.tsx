"use client";
import { useState } from "react";
import { SafeImage } from "@/components/ui/SafeImage";
import { Button } from "@/components/ui/Button";
import { QuoteRequestForm } from "@/components/shared/QuoteRequestForm";
import { DESIGNER_OPTIONS } from "@/utils/constants";
import type { DesignerState } from "@/types";

interface Props {
  state: DesignerState;
  onRegenerate: () => void;
  onModify: () => void;
  onReset: () => void;
}

const LABELS: Record<string, Record<string, string>> = {
  jewelryType: Object.fromEntries(DESIGNER_OPTIONS.jewelryType.map((o) => [o.id, o.label])),
  designStyle: Object.fromEntries(DESIGNER_OPTIONS.designStyle.map((o) => [o.id, o.label])),
  metal: Object.fromEntries(DESIGNER_OPTIONS.metal.map((o) => [o.id, o.label])),
  emeraldType: Object.fromEntries(DESIGNER_OPTIONS.emeraldType.map((o) => [o.id, o.label])),
};

export function DesignResult({ state, onRegenerate, onModify, onReset }: Props) {
  const [showQuote, setShowQuote] = useState(false);
  const [quoteSuccess, setQuoteSuccess] = useState(false);

  const designLabel = [
    state.jewelryType ? LABELS.jewelryType[state.jewelryType] : null,
    state.designStyle ? LABELS.designStyle[state.designStyle] : null,
    state.metal ? LABELS.metal[state.metal] : null,
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <div className="min-h-full flex flex-col items-center justify-center px-6 py-16">
      <p className="font-body text-xs tracking-[0.3em] uppercase text-brand-accent mb-6 text-center">
        Tu diseño exclusivo
      </p>

      {/* Generated image */}
      {state.generatedImageUrl && (
        <div className="relative w-full max-w-sm aspect-square mb-8 shadow-2xl">
          <SafeImage
            src={state.generatedImageUrl}
            alt="Tu diseño Hemenesy generado por IA"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 90vw, 400px"
            unoptimized
          />
        </div>
      )}

      {designLabel && (
        <p className="font-accent text-sm text-content-secondary text-center mb-8">{designLabel}</p>
      )}

      {state.error && (
        <p role="alert" className="text-red-400 text-sm mb-6 font-body text-center">{state.error}</p>
      )}

      {/* Quote form or actions */}
      {!quoteSuccess ? (
        <>
          {showQuote && state.designId ? (
            <div className="w-full max-w-sm overflow-y-auto max-h-[70vh] pb-20">
              <p className="font-heading text-2xl text-content-primary mb-6 text-center">
                Solicitar cotización
              </p>
              <QuoteRequestForm
                designId={state.designId}
                onSuccess={() => setQuoteSuccess(true)}
              />
            </div>
          ) : (
            <div className="flex flex-col items-center gap-4 w-full max-w-xs">
              <Button
                variant="primary"
                onClick={() => setShowQuote(true)}
                className="w-full"
              >
                Solicitar cotización
              </Button>
              <div className="flex gap-3 w-full">
                <div className="flex flex-col items-center flex-1">
                  <Button
                    variant="outline"
                    onClick={onRegenerate}
                    disabled={state.isGenerating || state.generationsRemaining === 0}
                    className="w-full text-xs px-4"
                  >
                    {state.isGenerating ? "Generando..." : "Regenerar"}
                  </Button>
                  {state.generationsRemaining === 0 && (
                    <p className="font-body text-xs text-content-secondary/50 mt-1">
                      Sin diseños disponibles hoy
                    </p>
                  )}
                </div>
                <Button variant="ghost" onClick={onModify} className="flex-1 text-xs px-4">
                  Modificar
                </Button>
              </div>
              <button
                type="button"
                onClick={onReset}
                className="font-body text-xs tracking-widest uppercase text-content-secondary/50 hover:text-content-secondary transition-colors mt-2"
              >
                Crear nuevo diseño
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center mt-4">
          <p className="font-heading text-2xl text-content-primary mb-2">Cotización solicitada</p>
          <p className="font-accent text-content-secondary font-light mb-8">
            Un asesor Hemenesy se pondrá en contacto contigo personalmente.
          </p>
          <button
            type="button"
            onClick={onReset}
            className="font-body text-xs tracking-widest uppercase text-brand-accent hover:text-brand-accent/80 transition-colors"
          >
            Crear nuevo diseño
          </button>
        </div>
      )}
    </div>
  );
}
