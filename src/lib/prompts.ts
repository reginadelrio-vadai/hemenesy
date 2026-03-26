const J: Record<string, string> = {
  anillo: "ring",
  collar: "necklace",
  aretes: "pair of earrings",
  pulsera: "bracelet",
  dije: "pendant",
};
const S: Record<string, string> = {
  clasico: "classic and timeless",
  moderno: "sleek contemporary modern",
  art_deco: "Art Deco with geometric patterns",
  organico: "organic nature-inspired with flowing lines",
  minimalista: "minimalist and clean",
};
const M: Record<string, string> = {
  oro_amarillo: "18K yellow gold",
  oro_blanco: "18K white gold",
  oro_rosa: "18K rose gold",
  plata: "sterling silver",
};
const E: Record<string, string> = {
  corte_esmeralda: "emerald-cut Colombian emerald",
  ovalado: "oval-cut Colombian emerald",
  pera: "pear-cut Colombian emerald",
  cojin: "cushion-cut Colombian emerald",
  redondo: "round brilliant-cut Colombian emerald",
};
const ST: Record<string, string> = {
  diamantes: "with accent diamonds",
  rubies: "with accent rubies",
  zafiros: "with accent sapphires",
  ninguna: "without additional stones",
};

export function buildPrompt(p: {
  jewelryType: string;
  designStyle: string;
  metal: string;
  emeraldType: string;
  complementaryStones: string;
  additionalNotes?: string;
}): string {
  const notes = p.additionalNotes ? `, ${p.additionalNotes}` : "";
  return `Photorealistic luxury jewelry product photography: a stunning ${S[p.designStyle] || p.designStyle} ${J[p.jewelryType] || p.jewelryType} crafted in ${M[p.metal] || p.metal}, featuring a vivid deep green ${E[p.emeraldType] || p.emeraldType} as the center stone ${ST[p.complementaryStones] || ""}${notes}. Displayed on dark velvet with dramatic directional studio lighting creating soft reflections on the metal. Extreme macro, tack-sharp focus, soft bokeh, luxury catalog aesthetic, 8K resolution. The image contains no text, no watermarks, no visible human hands or fingers, no blurry edges, clean professional result.`;
}
