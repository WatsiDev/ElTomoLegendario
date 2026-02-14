export interface AffinityStyle {
    text: string;
    bg: string; // Background color (optional, for badges)
    icon?: string; // Path to icon if needed relative to assets (optional)
}

export const AFFINITY_STYLES: Record<string, AffinityStyle> = {
    "Fuerza": {
        text: "text-raid-red",
        bg: "bg-raid-red/20",
    },
    "Magia": {
        text: "text-raid-blue",
        bg: "bg-raid-blue/20",
    },
    "Espíritu": {
        text: "text-raid-green",
        bg: "bg-raid-green/20",
    },
    "Vacío": {
        text: "text-raid-purple",
        bg: "bg-raid-purple/20",
    },
};

export const DEFAULT_AFFINITY_STYLE: AffinityStyle = {
    text: "text-gray-200",
    bg: "bg-gray-700",
};

export function getAffinityStyle(affinity: string): AffinityStyle {
    return AFFINITY_STYLES[affinity] || DEFAULT_AFFINITY_STYLE;
}
