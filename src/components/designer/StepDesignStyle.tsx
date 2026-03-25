"use client";
import { SelectionCard } from "@/components/ui/SelectionCard";
import { DESIGNER_OPTIONS } from "@/utils/constants";

interface Props {
  value: string | null;
  onChange: (v: string) => void;
  onAutoAdvance: () => void;
}

export function StepDesignStyle({ value, onChange, onAutoAdvance }: Props) {
  const options = DESIGNER_OPTIONS.designStyle;

  const handleSelect = (id: string) => {
    onChange(id);
    setTimeout(() => onAutoAdvance(), 300);
  };

  return (
    <div className="min-h-full flex flex-col items-center justify-center px-6 py-16">
      <p className="font-body text-xs tracking-[0.3em] uppercase text-brand-accent mb-3 text-center">
        Paso 2 de 6
      </p>
      <h2 className="font-heading text-3xl md:text-4xl text-content-primary mb-2 text-center">
        Elige tu estilo
      </h2>
      <p className="font-accent text-content-secondary font-light mb-10 text-center">
        Define la estética de tu pieza
      </p>
      <div className="w-full max-w-4xl grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {options.map((opt) => (
          <SelectionCard
            key={opt.id}
            id={opt.id}
            label={opt.label}
            image={opt.image}
            selected={value === opt.id}
            onClick={() => handleSelect(opt.id)}
          />
        ))}
      </div>
    </div>
  );
}
