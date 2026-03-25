"use client";
import { useAuth } from "@/components/layout/AuthProvider";
import { Button } from "@/components/ui/Button";

interface Props {
  onStart: () => void;
}

function getGenerationsRemaining(profile: { generation_count_today: number; last_generation_date: string } | null): number {
  if (!profile) return 3;
  const today = new Date().toISOString().split("T")[0];
  if (profile.last_generation_date !== today) return 3;
  return Math.max(0, 3 - profile.generation_count_today);
}

export function DesignerWelcome({ onStart }: Props) {
  const { profile } = useAuth();
  const remaining = getGenerationsRemaining(profile);
  const exhausted = remaining === 0;

  return (
    <div className="min-h-full flex flex-col items-center justify-center px-6 py-20 text-center">
      <p className="font-body text-xs tracking-[0.3em] uppercase text-brand-accent mb-6">
        Diseñador AI
      </p>
      <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl text-content-primary mb-6 max-w-2xl">
        {profile ? `${profile.full_name.split(" ")[0]}, diseña tu pieza única` : "Diseña tu pieza única"}
      </h1>
      <p className="font-accent text-lg text-content-secondary font-light max-w-lg mb-10 leading-relaxed">
        En 6 pasos, nuestra IA creará una visualización exclusiva de tu joya con esmeraldas colombianas.
      </p>

      <div className="flex gap-12 mb-14 text-center">
        <div>
          <p className="font-heading text-2xl text-brand-accent">6</p>
          <p className="font-body text-xs tracking-widest uppercase text-content-secondary mt-1">pasos</p>
        </div>
        <div>
          <p className="font-heading text-2xl text-brand-accent">~90s</p>
          <p className="font-body text-xs tracking-widest uppercase text-content-secondary mt-1">generación</p>
        </div>
        <div>
          <p className={`font-heading text-2xl ${exhausted ? "text-red-400" : "text-brand-accent"}`}>
            {remaining}
          </p>
          <p className="font-body text-xs tracking-widest uppercase text-content-secondary mt-1">
            {exhausted ? "disponibles hoy" : "diseños disponibles hoy"}
          </p>
        </div>
      </div>

      {exhausted ? (
        <div className="text-center">
          <p className="font-accent text-content-secondary font-light max-w-sm">
            Has alcanzado el límite de 3 diseños por hoy. Vuelve mañana para crear más.
          </p>
        </div>
      ) : (
        <Button variant="primary" onClick={onStart} className="px-16">
          Comenzar
        </Button>
      )}
    </div>
  );
}
