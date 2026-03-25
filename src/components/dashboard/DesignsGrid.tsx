"use client";
import { useState } from "react";
import Link from "next/link";
import { SafeImage } from "@/components/ui/SafeImage";
import { DesignDetailModal } from "@/components/dashboard/DesignDetailModal";
import { DESIGNER_OPTIONS } from "@/utils/constants";
import type { Design } from "@/types";

const JEWELRY_LABELS = Object.fromEntries(DESIGNER_OPTIONS.jewelryType.map((o) => [o.id, o.label]));

function SkeletonCard() {
  return <div className="aspect-square bg-line/20 animate-pulse" />;
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <svg viewBox="0 0 24 24" className="w-14 h-14 text-content-secondary/20 mb-6" fill="currentColor">
        <path d="M6 2L2 8l10 14L22 8l-4-6H6zm1.5 2h9l2.5 4H5L6.5 4zM5.2 10h13.6L12 20 5.2 10z" />
      </svg>
      <p className="font-heading text-xl text-content-secondary/60 mb-2">Aún no has creado ningún diseño</p>
      <p className="font-accent text-sm text-content-secondary/40 font-light mb-8">
        Diseña tu joya exclusiva con esmeraldas colombianas
      </p>
      <Link
        href="/designer"
        className="font-body text-sm tracking-widest uppercase border border-brand-accent text-brand-accent px-6 py-3 hover:bg-brand-accent hover:text-surface-dark transition-all duration-300"
      >
        Comenzar diseño
      </Link>
    </div>
  );
}

interface Props {
  designs: Design[];
  loading: boolean;
  onDesignUpdated: (designId: string, update: Partial<Design>) => void;
}

export function DesignsGrid({ designs, loading, onDesignUpdated }: Props) {
  const [selected, setSelected] = useState<Design | null>(null);

  const handleQuoteSubmitted = (designId: string) => {
    onDesignUpdated(designId, { status: "quote_requested" });
    // Update local selected design too
    if (selected?.id === designId) {
      setSelected((prev) => prev ? { ...prev, status: "quote_requested" } : prev);
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
      </div>
    );
  }

  if (designs.length === 0) return <EmptyState />;

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {designs.map((design) => (
          <button
            key={design.id}
            type="button"
            onClick={() => setSelected(design)}
            className="relative group aspect-square bg-line/10 overflow-hidden focus:outline-none focus:ring-1 focus:ring-brand-accent"
          >
            {design.image_url ? (
              <SafeImage
                src={design.image_url}
                alt={JEWELRY_LABELS[design.jewelry_type] ?? design.jewelry_type}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 768px) 50vw, 33vw"
                unoptimized
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="font-accent text-content-secondary/30 text-xs">Sin imagen</span>
              </div>
            )}

            {/* Status overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <p className="absolute bottom-2 left-2 font-body text-xs tracking-widest uppercase text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              {JEWELRY_LABELS[design.jewelry_type] ?? design.jewelry_type}
            </p>

            {/* image_persisted=false banner */}
            {!design.image_persisted && (
              <div className="absolute bottom-0 inset-x-0 bg-black/80 px-2 py-1.5 flex items-center justify-between gap-2">
                <p className="font-body text-[10px] text-content-secondary/70 leading-tight">
                  Imagen temporal
                </p>
                <Link
                  href="/designer"
                  onClick={(e) => e.stopPropagation()}
                  className="font-body text-[10px] tracking-widest uppercase text-brand-accent hover:text-brand-accent/80 transition-colors flex-shrink-0"
                >
                  Regenerar
                </Link>
              </div>
            )}
          </button>
        ))}
      </div>

      {selected && (
        <DesignDetailModal
          design={selected}
          onClose={() => setSelected(null)}
          onQuoteSubmitted={handleQuoteSubmitted}
        />
      )}
    </>
  );
}
