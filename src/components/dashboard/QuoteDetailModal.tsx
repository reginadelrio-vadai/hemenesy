"use client";
import { useEffect, useRef } from "react";
import { SafeImage } from "@/components/ui/SafeImage";
import { DESIGNER_OPTIONS } from "@/utils/constants";
import type { Design, QuoteRequest } from "@/types";

const LABELS: Record<string, Record<string, string>> = {
  jewelry_type: Object.fromEntries(DESIGNER_OPTIONS.jewelryType.map((o) => [o.id, o.label])),
  design_style: Object.fromEntries(DESIGNER_OPTIONS.designStyle.map((o) => [o.id, o.label])),
  metal: Object.fromEntries(DESIGNER_OPTIONS.metal.map((o) => [o.id, o.label])),
  emerald_type: Object.fromEntries(DESIGNER_OPTIONS.emeraldType.map((o) => [o.id, o.label])),
  complementary_stones: Object.fromEntries(DESIGNER_OPTIONS.complementaryStones.map((o) => [o.id, o.label])),
};

const STATUS_CONFIG = {
  pending: { label: "Pendiente", cls: "text-brand-accent border-brand-accent" },
  in_progress: { label: "En proceso", cls: "text-emerald-400 border-emerald-400" },
  completed: { label: "Completada", cls: "text-content-secondary border-content-secondary" },
};

const CONTACT_LABELS: Record<string, string> = {
  whatsapp: "WhatsApp",
  llamada: "Llamada",
  email: "Email",
};

interface Props {
  design: Design;
  quote: QuoteRequest;
  onClose: () => void;
}

export function QuoteDetailModal({ design, quote, onClose }: Props) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    closeRef.current?.focus();
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { onClose(); return; }
      if (e.key === "Tab" && dialogRef.current) {
        const els = Array.from(dialogRef.current.querySelectorAll<HTMLElement>(
          "button:not([disabled]),[tabindex]:not([tabindex='-1'])"
        ));
        if (!els.length) return;
        if (e.shiftKey) { if (document.activeElement === els[0]) { e.preventDefault(); els[els.length - 1].focus(); } }
        else { if (document.activeElement === els[els.length - 1]) { e.preventDefault(); els[0].focus(); } }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  }, [onClose]);

  const statusCfg = STATUS_CONFIG[quote.status] ?? STATUS_CONFIG.pending;
  const quoteDate = new Date(quote.created_at).toLocaleDateString("es-CO", {
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
                alt={LABELS.jewelry_type[design.jewelry_type] ?? design.jewelry_type}
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
            {/* Status badge */}
            <div className="mb-6">
              <span className={`inline-block font-body text-xs tracking-widest uppercase border px-4 py-1.5 ${statusCfg.cls}`}>
                {statusCfg.label}
              </span>
            </div>

            {/* Design specs */}
            <div className="divide-y divide-line/40 mb-6">
              {specs.map(({ k, v }) => (
                <div key={k} className="flex justify-between items-start py-2.5">
                  <span className="font-body text-xs tracking-widest uppercase text-content-secondary">{k}</span>
                  <span className="font-accent text-sm text-content-primary text-right max-w-[60%]">{v ?? "—"}</span>
                </div>
              ))}
            </div>

            {/* Quote details */}
            <div className="divide-y divide-line/40 mt-auto">
              <div className="flex justify-between items-start py-2.5">
                <span className="font-body text-xs tracking-widest uppercase text-content-secondary">Fecha</span>
                <span className="font-accent text-sm text-content-primary">{quoteDate}</span>
              </div>
              {quote.contact_preference && (
                <div className="flex justify-between items-start py-2.5">
                  <span className="font-body text-xs tracking-widest uppercase text-content-secondary">Contacto</span>
                  <span className="font-accent text-sm text-content-primary">
                    {CONTACT_LABELS[quote.contact_preference] ?? quote.contact_preference}
                  </span>
                </div>
              )}
              {quote.advisor_notes && (
                <div className="flex justify-between items-start py-2.5">
                  <span className="font-body text-xs tracking-widest uppercase text-content-secondary">Nota</span>
                  <span className="font-accent text-sm text-content-primary text-right max-w-[60%]">{quote.advisor_notes}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
