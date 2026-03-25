"use client";
import { useState } from "react";
import { SafeImage } from "@/components/ui/SafeImage";
import { QuoteDetailModal } from "@/components/dashboard/QuoteDetailModal";
import { DESIGNER_OPTIONS } from "@/utils/constants";
import type { Design, QuoteRequest } from "@/types";

const JEWELRY_LABELS = Object.fromEntries(DESIGNER_OPTIONS.jewelryType.map((o) => [o.id, o.label]));
const STYLE_LABELS = Object.fromEntries(DESIGNER_OPTIONS.designStyle.map((o) => [o.id, o.label]));

const STATUS_CONFIG = {
  pending: { label: "Pendiente", cls: "text-brand-accent bg-brand-accent/10" },
  in_progress: { label: "En proceso", cls: "text-emerald-400 bg-emerald-400/10" },
  completed: { label: "Completada", cls: "text-content-secondary bg-line/20" },
};

interface Props {
  designs: Design[];
}

export function QuotesList({ designs }: Props) {
  const [selected, setSelected] = useState<{ design: Design; quote: QuoteRequest } | null>(null);

  const quotes = designs.filter((d) => d.quote_requests && d.quote_requests.length > 0);

  if (quotes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <p className="font-heading text-xl text-content-secondary/60 mb-2">No tienes solicitudes</p>
        <p className="font-accent text-sm text-content-secondary/40 font-light">
          Genera un diseño y solicita cotización para verlo aquí
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-3">
        {quotes.map((design) => {
          const quote = design.quote_requests![0];
          const statusCfg = STATUS_CONFIG[quote.status] ?? STATUS_CONFIG.pending;
          const date = new Date(quote.created_at).toLocaleDateString("es-CO", {
            year: "numeric", month: "short", day: "numeric",
          });

          return (
            <button
              key={quote.id}
              type="button"
              onClick={() => setSelected({ design, quote })}
              className="w-full flex items-center gap-4 border border-line/20 p-4 hover:border-line/40 transition-colors text-left"
            >
              {/* Thumbnail */}
              <div className="relative w-16 h-16 flex-shrink-0 bg-line/10 overflow-hidden">
                {design.image_url ? (
                  <SafeImage
                    src={design.image_url}
                    alt={JEWELRY_LABELS[design.jewelry_type] ?? design.jewelry_type}
                    fill
                    className="object-cover"
                    sizes="64px"
                    unoptimized
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="font-accent text-content-secondary/30 text-[10px]">—</span>
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="font-accent text-sm text-content-primary truncate">
                  {JEWELRY_LABELS[design.jewelry_type] ?? design.jewelry_type}
                  {design.design_style ? ` · ${STYLE_LABELS[design.design_style] ?? design.design_style}` : ""}
                </p>
                <p className="font-body text-xs text-content-secondary/60 mt-0.5">{date}</p>
              </div>

              {/* Status badge */}
              <span className={`font-body text-xs tracking-widest uppercase px-3 py-1 flex-shrink-0 ${statusCfg.cls}`}>
                {statusCfg.label}
              </span>
            </button>
          );
        })}
      </div>

      {selected && (
        <QuoteDetailModal
          design={selected.design}
          quote={selected.quote}
          onClose={() => setSelected(null)}
        />
      )}
    </>
  );
}
