export const SITE_NAME = "Hemenesy";
export const SITE_TAGLINE = "Esmeraldas de Lujo";
export const MAX_DAILY_GENERATIONS = 3;
export const FREEPIK_TIMEOUT_MS = 90_000;
export const FETCH_TIMEOUT_MS = 10_000;
export const FREEPIK_POLL_INTERVAL_MS = 3_000;

export const DESIGNER_OPTIONS = {
  jewelryType: [
    { id: "anillo", label: "Anillo", image: "/images/tipo-anillo.png" },
    { id: "collar", label: "Collar", image: "/images/tipo-collar.png" },
    { id: "aretes", label: "Aretes", image: "/images/tipo-aretes.png" },
    { id: "pulsera", label: "Pulsera", image: "/images/tipo-pulsera.png" },
    { id: "dije", label: "Dije", image: "/images/tipo-dije.png" },
  ],
  designStyle: [
    { id: "clasico", label: "Clásico", image: "/images/estilo-clasico.png" },
    { id: "moderno", label: "Moderno", image: "/images/estilo-moderno.png" },
    { id: "art_deco", label: "Art Deco", image: "/images/estilo-artdeco.png" },
    { id: "organico", label: "Orgánico", image: "/images/estilo-organico.png" },
    { id: "minimalista", label: "Minimalista", image: "/images/estilo-minimalista.png" },
  ],
  metal: [
    { id: "oro_amarillo", label: "Oro Amarillo", image: "/images/material-oroamarillo.png" },
    { id: "oro_blanco", label: "Oro Blanco", image: "/images/material-oroblanco.png" },
    { id: "oro_rosa", label: "Oro Rosa", image: "/images/material-ororosa.png" },
    { id: "plata", label: "Plata", image: "/images/material-plata.png" },
  ],
  emeraldType: [
    { id: "corte_esmeralda", label: "Esmeralda", image: "/images/corte-esmeralda.png" },
    { id: "ovalado", label: "Ovalado", image: "/images/corte-ovalado.png" },
    { id: "pera", label: "Pera", image: "/images/corte-pera.png" },
    { id: "cojin", label: "Cojín", image: "/images/corte-cojin.png" },
    { id: "redondo", label: "Redondo", image: "/images/corte-redondo.png" },
  ],
  complementaryStones: [
    { id: "diamantes", label: "Diamantes" },
    { id: "rubies", label: "Rubíes" },
    { id: "zafiros", label: "Zafiros" },
    { id: "ninguna", label: "Sin piedras adicionales" },
  ],
} as const;

export const VALID_OPTIONS = {
  jewelryType: DESIGNER_OPTIONS.jewelryType.map((o) => o.id),
  designStyle: DESIGNER_OPTIONS.designStyle.map((o) => o.id),
  metal: DESIGNER_OPTIONS.metal.map((o) => o.id),
  emeraldType: DESIGNER_OPTIONS.emeraldType.map((o) => o.id),
  complementaryStones: DESIGNER_OPTIONS.complementaryStones.map((o) => o.id),
};
