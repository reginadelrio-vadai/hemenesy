"use client";

interface Props {
  currentStep: number;
  goToStep: (step: number) => void;
}

const STEP_LABELS = ["Joya", "Estilo", "Metal", "Esmeralda", "Detalles", "Resumen"];

export function StepperDots({ currentStep, goToStep }: Props) {
  return (
    <div className="flex items-center gap-3" role="navigation" aria-label="Progreso del diseño">
      {[1, 2, 3, 4, 5, 6].map((step) => {
        const isActive = step === currentStep;
        const isCompleted = step < currentStep;
        return (
          <button
            key={step}
            type="button"
            onClick={() => isCompleted && goToStep(step)}
            disabled={!isCompleted}
            aria-label={`${STEP_LABELS[step - 1]}${isCompleted ? " (completado)" : isActive ? " (actual)" : ""}`}
            className={`transition-all duration-300 rounded-full ${
              isActive
                ? "w-5 h-2 bg-brand-accent"
                : isCompleted
                ? "w-2 h-2 border border-brand-accent bg-transparent cursor-pointer hover:bg-brand-accent/20"
                : "w-2 h-2 bg-content-secondary/30 cursor-default"
            }`}
          />
        );
      })}
    </div>
  );
}
