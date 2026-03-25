"use client";
import { useEffect, useRef } from "react";
import { SafeImage } from "@/components/ui/SafeImage";
import { QuoteRequestForm } from "@/components/shared/QuoteRequestForm";
import { DESIGNER_OPTIONS } from "@/utils/constants";
import type { Design } from "@/types";

const LABELS: Record<string, Record<string, string>> = {
  jewelry_type: Object.fromEntries(DESIGNER_OPTIONS.jewelryType.map((o) => [o.id, o.label])),
  design_style: Object.fromEntries(DESIGNER_OPTIONS.designStyle.map((o) => [o.id, o.label])),
  metal: Object.fromEntries(DESIGNER_OPTIONS.metal.map((o) => [o.id, o.label])),
  emerald_type: Object.fromEntries(DESIGNER_OPTIONS.emeraldType.map((o) => [o.id, o.label])),
  complementary_stones: Object.fromEntries(DESIGNER_OPTIONS.complementaryStones.map((o) => [o.id, o.label])),
};

const QUOTE_STATUS: Record<string, { label: string; cls: string }> = {
  pending: { label: "Pendiente", cls: "text-brand-accent border-brand-accent" },
  in_progress: { label: "En proceso", cls: "text-emerald-400 border-emerald-400" },
  completed: { label: "Completada", cls: "text-content-secondary border-content-secondary" },
};

interface Props {
  design: Design;
  onClose: () => void;
  onQuoteSubmitted: (designId: string) => void;
}

export function DesignDetailModal({ design, onClose, onQuoteSubmitted }: Props) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    closeRef.current?.focus();
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { onClose(); return; }
      if (e.key === "Tab" && dialogRef.current) {
        const els = Array.from(dialogRef.current.querySelectorAll<HTMLElement>(
          "button:not([disabled]),input:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex='-1'])"
        ));
        if (!els.length) return;
        if (e.shiftKey) { if (document.activeElement === els[0]) { e.preventDefault(); els[els.length - 1].focus(); } }
        else { if (document.activeElement === els[els.length - 1]) { e.preventDefault(); els[0].focus(); } }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  }, [onClose]);

  const quoteRequest = design.quote_requests?.[0];
  const date = new Date(design.created_at).toLocaleDateString("es-CO", {
    year: "numeric", month: "long", day: "numeric",
  });

  const specs = [
    { k: "Joya", v: LABELS.jewelry_type[design.jewelry_type] },
    { k: "Estilo", v: LABELS.design_style[design.design_style] },
    { k: "Metal", v: LABELS.metal[design.metal] },
    { k: "Esmeralda", v: LABELS.emerald_type[design.emerald_type] },
    ...(design.complementary_stones && design.complementary_stones !== "ninguna"
      ? [{ k: "Piedras", v: LABELS.complementary_stones[design.complementary_stones] }]
      : []),
    ...(design.additional_notes ? [{ k: "Notas", v: design.additional_notes }] : []),
  ];

  return (
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 bg-black/95 overflow-y-auto flex items-start lg:items-center justify-center p-4 lg:p-8"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="relative w-full max-w-4xl bg-surface-dark border border-line/20 my-8 lg:my-0">
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label="Cerrar"
          className="absolute top-4 right-5 z-10 text-content-secondary hover:text-content-primary transition-colors text-3xl leading-none"
        >
          ×
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2">
          {/* Image */}
          <div className="relative aspect-square w-full bg-line/10">
            {design.image_url ? (
              <SafeImage
                src={design.image_url}
                alt={`Diseño ${LABELS.jewelry_type[design.jewelry_type] ?? design.jewelry_type}`}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                unoptimized
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="font-accent text-content-secondary/40 text-sm">Sin imagen</span>
              </div>
            )}
          </div>

          {/* Info */}
          <div className="p-8 flex flex-col min-h-[400px]">
            <p className="font-body text-xs tracking-[0.3em] uppercase text-brand-accent mb-6">{date}</p>

            <div className="divide-y divide-line/40 mb-8">
              {specs.map(({ k, v }) => (
                <div key={k} className="flex justify-between items-start py-3">
                  <span className="font-body text-xs tracking-widest uppercase text-content-secondary">{k}</span>
                  <span className="font-accent text-sm text-content-primary text-right max-w-[60%]">{v ?? "—"}</span>
                </div>
              ))}
            </div>

            <div className="mt-auto">
              {design.status === "generated" ? (
                <>
                  <p className="font-body text-xs tracking-[0.2em] uppercase text-content-secondary mb-5">
                    Solicitar cotización
                  </p>
                  <QuoteRequestForm
                    designId={design.id}
                    onSuccess={() => onQuoteSubmitted(design.id)}
                  />
                </>
              ) : quoteRequest ? (
                <div className="text-center py-4">
                  <span className={`inline-block font-body text-xs tracking-widest uppercase border px-5 py-2 ${QUOTE_STATUS[quoteRequest.status]?.cls ?? "text-content-secondary border-content-secondary"}`}>
                    {QUOTE_STATUS[quoteRequest.status]?.label ?? quoteRequest.status}
                  </span>
                  <p className="font-accent text-xs text-content-secondary/50 mt-3 font-light">
                    Un asesor Hemenesy se pondrá en contacto contigo.
                  </p>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
