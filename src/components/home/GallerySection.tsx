"use client";
import { useState } from "react";
import { SafeImage } from "@/components/ui/SafeImage";
import { Lightbox } from "@/components/ui/Lightbox";
import { PLACEHOLDERS } from "@/utils/placeholders";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { FADE_UP } from "@/utils/animations";

const GALLERY = [
  {
    src: PLACEHOLDERS.emerald1,
    alt: "Anillo esmeralda colombiana",
    title: "Anillo Bogotá",
    desc: "Esmeralda muzo 5.2ct · Oro 18k",
  },
  {
    src: PLACEHOLDERS.jewelry1,
    alt: "Collar de esmeralda en oro",
    title: "Collar Cinturón",
    desc: "3 esmeraldas · Pavé de diamantes",
  },
  {
    src: PLACEHOLDERS.emerald2,
    alt: "Esmeralda talla cojín",
    title: "Solitario Cojín",
    desc: "8.1ct · Corte cushion · Cert. GIA",
  },
  {
    src: PLACEHOLDERS.jewelry2,
    alt: "Aretes de esmeralda y diamantes",
    title: "Aretes Dúo",
    desc: "Esmeralda y diamante · Platino",
  },
  {
    src: PLACEHOLDERS.emerald3,
    alt: "Esmeralda piedra natural",
    title: "Gema Origen",
    desc: "En bruto · Sin tratamiento",
  },
  {
    src: PLACEHOLDERS.vintage1,
    alt: "Diseño vintage con esmeralda",
    title: "Vintage Heritage",
    desc: "Diseño art-déco · Colección 1975",
  },
];

export function GallerySection() {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const titleRef = useScrollAnimation(FADE_UP);

  return (
    <section
      id="galeria"
      className="bg-surface-dark py-24 lg:py-32"
      aria-label="Galería Hemenesy"
    >
      <div className="max-w-content mx-auto px-6 lg:px-12">
        <div ref={titleRef} className="text-center mb-16">
          <p className="font-body text-xs tracking-[0.3em] uppercase text-brand-accent mb-4">
            Colección
          </p>
          <h2 className="font-heading text-4xl md:text-5xl text-content-primary">
            Belleza sin igual
          </h2>
        </div>

        <div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4"
          role="list"
          aria-label="Galería de joyas"
        >
          {GALLERY.map((item, i) => (
            <GalleryItem
              key={i}
              item={item}
              onClick={() => setLightboxIndex(i)}
            />
          ))}
        </div>
      </div>

      {lightboxIndex !== null && (
        <Lightbox
          items={GALLERY}
          initialIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
        />
      )}
    </section>
  );
}

function GalleryItem({
  item,
  onClick,
}: {
  item: (typeof GALLERY)[0];
  onClick: () => void;
}) {
  const ref = useScrollAnimation(FADE_UP);
  return (
    <div
      ref={ref}
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => e.key === "Enter" && onClick()}
      aria-label={`Ver ${item.title}`}
      className="relative aspect-[3/4] overflow-hidden group cursor-pointer"
    >
      <SafeImage
        src={item.src}
        alt={item.alt}
        fill
        className="object-cover transition-transform duration-700 group-hover:scale-105"
        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
      />

      {/* Hover overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-brand-accent/80 via-brand-accent/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400 flex flex-col justify-end p-6">
        <p className="font-heading text-lg text-content-primary translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
          {item.title}
        </p>
        <p className="font-accent text-sm text-content-secondary font-light mt-1 translate-y-2 group-hover:translate-y-0 transition-transform duration-300 delay-75">
          {item.desc}
        </p>
      </div>
    </div>
  );
}
