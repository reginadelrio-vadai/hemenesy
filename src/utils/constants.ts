export const SITE_NAME = "Hemenesy";
export const SITE_TAGLINE = "Esmeraldas de Lujo";
export const MAX_DAILY_GENERATIONS = 3;
export const FREEPIK_TIMEOUT_MS = 90_000;
export const FETCH_TIMEOUT_MS = 10_000;
export const FREEPIK_POLL_INTERVAL_MS = 3_000;

export const DESIGNER_OPTIONS = {
  jewelryType: [
    { id: "anillo", label: "Anillo", image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&q=80" },
    { id: "collar", label: "Collar", image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400&q=80" },
    { id: "aretes", label: "Aretes", image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400&q=80" },
    { id: "pulsera", label: "Pulsera", image: "https://images.unsplash.com/photo-1573408259889-e93cee21b1f7?w=400&q=80" },
    { id: "dije", label: "Dije", image: "https://images.unsplash.com/photo-1515562141589-67f0d569b6f5?w=400&q=80" },
  ],
  designStyle: [
    { id: "clasico", label: "Clásico", image: "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=400&q=80" },
    { id: "moderno", label: "Moderno", image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=400&q=80" },
    { id: "art_deco", label: "Art Deco", image: "https://images.unsplash.com/photo-1600003014755-ba31aa59c4b6?w=400&q=80" },
    { id: "organico", label: "Orgánico", image: "https://images.unsplash.com/photo-1506792006437-256b665541e2?w=400&q=80" },
    { id: "minimalista", label: "Minimalista", image: "https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?w=400&q=80" },
  ],
  metal: [
    { id: "oro_amarillo", label: "Oro Amarillo", image: "https://images.unsplash.com/photo-1610375461246-83df859d849d?w=400&q=80" },
    { id: "oro_blanco", label: "Oro Blanco", image: "https://images.unsplash.com/photo-1586104195538-050b9f74f58e?w=400&q=80" },
    { id: "oro_rosa", label: "Oro Rosa", image: "https://images.unsplash.com/photo-1596944924616-7b38e7cfac36?w=400&q=80" },
    { id: "platino", label: "Platino", image: "https://images.unsplash.com/photo-1609042890394-02eec75fa9c2?w=400&q=80" },
  ],
  emeraldType: [
    { id: "corte_esmeralda", label: "Corte Esmeralda", image: "https://images.unsplash.com/photo-1583937443573-3e425e98c30d?w=400&q=80" },
    { id: "ovalado", label: "Ovalado", image: "https://images.unsplash.com/photo-1551122087-f99a40d3f9ef?w=400&q=80" },
    { id: "pera", label: "Pera", image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400&q=80" },
    { id: "cojin", label: "Cojín", image: "https://images.unsplash.com/photo-1573408259889-e93cee21b1f7?w=400&q=80" },
    { id: "redondo", label: "Redondo", image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&q=80" },
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
