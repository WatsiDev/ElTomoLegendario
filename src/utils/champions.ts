export interface ChampionBasic {
  slug: string;
  name: string;
  rarity: string;
  faction: string;
  type: string;
  affinity: string;
  image: string;
  [key: string]: any;
}

export interface ChampionSearchItem {
  slug: string;
  name: string;
  image: string;
}

// Cargar todos los archivos de datos de campeones dinámicamente de forma centralizada
const championFiles = import.meta.glob<{ default: ChampionBasic }>(
  "/src/data/champions-info/champions/*.json",
  { eager: true },
);

let cachedChampions: ChampionBasic[] | null = null;

/**
 * Obtiene todos los campeones registrados en el proyecto.
 */
export function getAllChampions(): ChampionBasic[] {
  if (!cachedChampions) {
    cachedChampions = Object.values(championFiles).map(
      (file) => file.default || file,
    );
  }
  return cachedChampions;
}

/**
 * Obtiene datos esenciales de campeones para el buscador global y en tiempo real.
 */
export function getChampionsSearchData(): ChampionSearchItem[] {
  return getAllChampions().map((data) => ({
    slug: data.slug,
    name: data.name,
    image: data.image,
  }));
}

/**
 * Obtiene un campeón específico por su slug.
 */
export function getChampionBySlug(slug: string): ChampionBasic | undefined {
  const path = `/src/data/champions-info/champions/${slug}.json`;
  const file = championFiles[path];
  return file ? (file.default || file) : undefined;
}

/**
 * Obtiene una lista de campeones destacados filtrados por slug.
 */
export function getFeaturedChampions(slugs: string[]): ChampionBasic[] {
  return getAllChampions().filter((champ) => slugs.includes(champ.slug));
}
