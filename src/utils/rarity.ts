export interface RarityStyle {
  text: string;
  border: string;
  glow: string;
  hex: string;
}

export const RARITY_STYLES: Record<string, RarityStyle> = {
  "Mítico": {
    text: "text-raid-red",
    border: "border-raid-red",
    glow: "shadow-red-glow",
    hex: "#ef4444",
  },
  "Legendario": {
    text: "text-raid-gold",
    border: "border-raid-gold",
    glow: "shadow-gold-glow",
    hex: "#ffb400",
  },
  "Épico": {
    text: "text-raid-purple",
    border: "border-raid-purple",
    glow: "shadow-purple-glow",
    hex: "#a033ff",
  },
  "Raro": {
    text: "text-raid-blue",
    border: "border-raid-blue",
    glow: "", // No glow for Rare by default in current design, but could add one
    hex: "#0090ff",
  },
  "Poco Común": {
    text: "text-raid-green",
    border: "border-raid-green",
    glow: "",
    hex: "#4ade80",
  },
  "Común": {
    text: "text-raid-grey",
    border: "border-raid-grey",
    glow: "",
    hex: "#9ca3af",
  },
};

// Fallback for unknown rarities
export const DEFAULT_RARITY_STYLE: RarityStyle = {
  text: "text-gray-200",
  border: "border-gray-700",
  glow: "",
  hex: "#e5e7eb",
};

export function getRarityStyle(rarity: string): RarityStyle {
  return RARITY_STYLES[rarity] || DEFAULT_RARITY_STYLE;
}
