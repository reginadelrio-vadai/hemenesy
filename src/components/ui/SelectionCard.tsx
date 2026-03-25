"use client";
import { SafeImage } from "@/components/ui/SafeImage";

interface SelectionCardProps {
  id: string;
  label: string;
  image?: string;
  selected: boolean;
  disabled?: boolean;
  onClick: () => void;
}

export function SelectionCard({ label, image, selected, disabled, onClick }: SelectionCardProps) {
  if (image) {
    return (
      <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        aria-pressed={selected}
        className={`
          relative aspect-[3/4] overflow-hidden rounded-lg cursor-pointer transition-all duration-300
          ${selected ? "border-2 border-brand-accent opacity-100" : "border border-line opacity-70 hover:opacity-85"}
          ${disabled ? "cursor-not-allowed" : ""}
        `.trim()}
      >
        <SafeImage
          src={image}
          alt={label}
          fill
          className={`object-cover transition-all duration-300 ${
            selected ? "brightness-100" : "brightness-[0.7] hover:brightness-[0.85]"
          }`}
          sizes="(max-width: 768px) 45vw, (max-width: 1024px) 30vw, 20vw"
        />
        {/* Gradient overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent py-3 px-4">
          <p className="font-accent text-sm tracking-wider uppercase text-white">{label}</p>
        </div>
        {/* Checkmark */}
        {selected && (
          <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-surface-dark/80 border border-brand-accent flex items-center justify-center animate-[scale-in_0.2s_ease]">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
              <polyline points="2,6 5,9 10,3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-brand-accent" />
            </svg>
          </div>
        )}
      </button>
    );
  }

  // No image variant
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-pressed={selected}
      className={`
        relative aspect-[2/1] flex items-center justify-center rounded-lg cursor-pointer transition-all duration-300
        ${selected ? "border-2 border-brand-accent opacity-100 bg-brand-accent/5" : "border border-line opacity-70 hover:opacity-85 hover:border-brand-accent/50"}
        ${disabled ? "cursor-not-allowed" : ""}
      `.trim()}
    >
      <p className="font-accent text-sm tracking-wider uppercase text-content-primary">{label}</p>
      {selected && (
        <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-surface-dark/80 border border-brand-accent flex items-center justify-center">
          <svg width="10" height="10" viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <polyline points="2,6 5,9 10,3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-brand-accent" />
          </svg>
        </div>
      )}
    </button>
  );
}
