"use client";
import { DESIGNER_OPTIONS } from "@/utils/constants";
import type { DesignerState } from "@/types";

interface Props {
  state: DesignerState;
  generationsRemaining: number;
  editMode?: boolean;
  onEditSection?: (step: number) => void;
}

const LABELS: Record<string, Record<string, string>> = {
  jewelryType: Object.fromEntries(DESIGNER_OPTIONS.jewelryType.map((o) => [o.id, o.label])),
  designStyle: Object.fromEntries(DESIGNER_OPTIONS.designStyle.map((o) => [o.id, o.label])),
  metal: Object.fromEntries(DESIGNER_OPTIONS.metal.map((o) => [o.id, o.label])),
  emeraldType: Object.fromEntries(DESIGNER_OPTIONS.emeraldType.map((o) => [o.id, o.label])),
  complementaryStones: Object.fromEntries(DESIGNER_OPTIONS.complementaryStones.map((o) => [o.id, o.label])),
};

// Each row mapped to its edit step
const ROWS = (state: DesignerState) => [
  { key: "Joya", val: state.jewelryType ? LABELS.jewelryType[state.jewelryType] : null, step: 1 },
  { key: "Estilo", val: state.designStyle ? LABELS.designStyle[state.designStyle] : null, step: 2 },
  { key: "Metal", val: state.metal ? LABELS.metal[state.metal] : null, step: 3 },
  { key: "Esmeralda", val: state.emeraldType ? LABELS.emeraldType[state.emeraldType] : null, step: 4 },
  { key: "Piedras", val: state.complementaryStones ? LABELS.complementaryStones[state.complementaryStones] : "Sin piedras adicionales", step: 5 },
  ...(state.additionalNotes ? [{ key: "Notas", val: state.additionalNotes, step: 5 }] : []),
];

export function DesignSummary({ state, generationsRemaining, editMode, onEditSection }: Props) {
  const rows = ROWS(state);

  return (
    <div className="min-h-full flex flex-col items-center justify-center px-6 py-16">
      <p className="font-body text-xs tracking-[0.3em] uppercase text-brand-accent mb-3 text-center">
        {editMode ? "Editar diseño" : "Paso 6 de 6"}
      </p>
      <h2 className="font-heading text-3xl md:text-4xl text-content-primary mb-2 text-center">
        Tu diseño
      </h2>
      <p className="font-accent text-content-secondary font-light mb-10 text-center">
        {editMode
          ? "Toca cualquier detalle para modificarlo"
          : "Revisa los detalles antes de generar tu visualización"}
      </p>

      <div className="w-full max-w-sm mb-10 divide-y divide-line/40">
        {rows.map(({ key, val, step }) =>
          editMode && onEditSection ? (
            <button
              key={key}
              type="button"
              onClick={() => onEditSection(step)}
              className="w-full flex justify-between items-start py-3 group hover:opacity-80 transition-opacity text-left"
            >
              <span className="font-body text-xs tracking-widest uppercase text-content-secondary">{key}</span>
              <span className="font-accent text-sm text-content-primary text-right max-w-[60%] group-hover:text-brand-accent transition-colors">
                {val ?? "—"} <span className="text-brand-accent/60 ml-1">✎</span>
              </span>
            </button>
          ) : (
            <div key={key} className="flex justify-between items-start py-3">
              <span className="font-body text-xs tracking-widest uppercase text-content-secondary">{key}</span>
              <span className="font-accent text-sm text-content-primary text-right max-w-[60%]">{val ?? "—"}</span>
            </div>
          )
        )}
      </div>

      <div className="text-center">
        <p className="font-body text-xs tracking-widest uppercase text-content-secondary/60">
          Diseños disponibles hoy
        </p>
        <p className="font-heading text-3xl text-brand-accent mt-1">{generationsRemaining}</p>
        <p className="font-accent text-xs text-content-secondary/50 mt-2 font-light">
          Generará 1 diseño con inteligencia artificial
        </p>
      </div>
    </div>
  );
}
