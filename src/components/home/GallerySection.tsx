"use client";
import { useState } from "react";
import { SafeImage } from "@/components/ui/SafeImage";
import { Lightbox } from "@/components/ui/Lightbox";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { FADE_UP } from "@/utils/animations";

const GALLERY = [
  { id: "anillo-1", src: "/images/anillo-1.jpg", alt: "Anillo de Oro Amarillo con Piedras Verdes", title: "Anillo de Oro Amarillo con Piedras Verdes", desc: "" },
  { id: "anillo-2", src: "/images/anillo-2.jpg", alt: "Anillo de Plata con Piedra Verde y Diamantes", title: "Anillo de Plata con Piedra Verde y Diamantes", desc: "" },
  { id: "anillo-3", src: "/images/anillo-3.jpg", alt: "Anillo de Oro Amarillo con Piedra Verde y Halo de Diamantes", title: "Anillo de Oro Amarillo con Piedra Verde y Halo de Diamantes", desc: "" },
  { id: "anillo-4", src: "/images/anillo-4.jpg", alt: "Anillo de Oro Amarillo con Piedras Verdes Variadas", title: "Anillo de Oro Amarillo con Piedras Verdes Variadas", desc: "" },
  { id: "aretes-1", src: "/images/aretes-1.jpg", alt: "Aretes de Oro Amarillo con Piedras Verdes y Diamantes", title: "Aretes de Oro Amarillo con Piedras Verdes y Diamantes", desc: "" },
  { id: "aretes-2", src: "/images/aretes-2.jpg", alt: "Aretes de Oro Amarillo con Piedras Verdes en Forma de Corazón", title: "Aretes de Oro Amarillo con Piedras Verdes en Forma de Corazón", desc: "" },
  { id: "collar-1", src: "/images/collar-1.jpg", alt: "Cruz de Esmeralda Natural en Oro Amarillo", title: "Cruz de Esmeralda Natural en Oro Amarillo", desc: "" },
  { id: "collar-2", src: "/images/collar-2.jpg", alt: "Cruz de Esmeraldas Naturales en Oro Amarillo", title: "Cruz de Esmeraldas Naturales en Oro Amarillo", desc: "" },
  { id: "piedra-1", src: "/images/piedra-1.jpg", alt: "Cristal Natural de Tourmalina Verde", title: "Cristal Natural de Tourmalina Verde", desc: "" },
  { id: "piedra-2", src: "/images/piedra-2.jpg", alt: "Esmeralda Natural de 0.92 ct", title: "Esmeralda Natural de 0.92 ct", desc: "" },
  { id: "piedra-3", src: "/images/piedra-3.jpg", alt: "Esmeralda Natural de 0.99 ct", title: "Esmeralda Natural de 0.99 ct", desc: "" },
  { id: "piedra-4", src: "/images/piedra-4.jpg", alt: "Esmeralda Natural de 1.04 ct", title: "Esmeralda Natural de 1.04 ct", desc: "" },
];

export function GallerySection() {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const titleRef = useScrollAnimation(FADE_UP);

  return (
    <section
      id="galeria"
      className="bg-surface-dark py-24 lg:py-32"
      aria-label="Galería Hemenesy & Co."
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
              key={item.id}
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
      </div>
    </div>
  );
}
