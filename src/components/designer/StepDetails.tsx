"use client";
import { SelectionCard } from "@/components/ui/SelectionCard";
import { DESIGNER_OPTIONS } from "@/utils/constants";
import type { DesignerState } from "@/types";

interface Props {
  complementaryStones: DesignerState["complementaryStones"];
  additionalNotes: string;
  onChangeStones: (v: string) => void;
  onChangeNotes: (v: string) => void;
}

export function StepDetails({ complementaryStones, additionalNotes, onChangeStones, onChangeNotes }: Props) {
  return (
    <div className="min-h-full flex flex-col items-center justify-center px-6 py-16">
      <p className="font-body text-xs tracking-[0.3em] uppercase text-brand-accent mb-3 text-center">
        Paso 5 de 6
      </p>
      <h2 className="font-heading text-3xl md:text-4xl text-content-primary mb-2 text-center">
        Detalles finales
      </h2>
      <p className="font-accent text-content-secondary font-light mb-10 text-center">
        Personaliza cada aspecto de tu diseño
      </p>

      <div className="w-full max-w-2xl space-y-10">
        {/* Complementary stones */}
        <div>
          <p className="font-body text-xs tracking-[0.2em] uppercase text-content-secondary mb-4">
            Piedras complementarias
          </p>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {DESIGNER_OPTIONS.complementaryStones.map((opt) => (
              <SelectionCard
                key={opt.id}
                id={opt.id}
                label={opt.label}
                selected={complementaryStones === opt.id}
                onClick={() => onChangeStones(opt.id)}
              />
            ))}
          </div>
        </div>

        {/* Additional notes */}
        <div>
          <label className="block font-body text-xs tracking-[0.2em] uppercase text-content-secondary mb-3">
            Notas adicionales (opcional)
          </label>
          <textarea
            value={additionalNotes}
            onChange={(e) => onChangeNotes(e.target.value)}
            rows={3}
            maxLength={300}
            placeholder="Tamaño específico, dedicatoria, inspiración..."
            className="w-full border-b border-line bg-transparent text-content-primary font-accent text-sm py-3 resize-none focus:outline-none focus:border-brand-accent transition-colors placeholder-content-secondary/40"
          />
          <p className="font-body text-xs text-content-secondary/50 text-right mt-1">
            {additionalNotes.length}/300
          </p>
        </div>
      </div>
    </div>
  );
}
