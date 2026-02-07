import type { BullWithScore, BullStats, PaginatedBulls } from "./types";
import type { BullsQueryParams } from "./types";

const BULL_SCORE_WEIGHTS = {
  crecimiento: 0.3,
  facilidad_parto: 0.25,
  reproduccion: 0.2,
  moderacion: 0.15,
  carcasa: 0.1,
} as const;

function computeBullScore(stats: BullStats): number {
  return (
    stats.crecimiento * BULL_SCORE_WEIGHTS.crecimiento +
    stats.facilidad_parto * BULL_SCORE_WEIGHTS.facilidad_parto +
    stats.reproduccion * BULL_SCORE_WEIGHTS.reproduccion +
    stats.moderacion * BULL_SCORE_WEIGHTS.moderacion +
    stats.carcasa * BULL_SCORE_WEIGHTS.carcasa
  );
}

const MOCK_BULLS_RAW = [
  {
    id: 1,
    caravana: "992",
    nombre: "Toro Black Emerald",
    uso: "vaquillona",
    origen: "propio",
    pelaje: "negro",
    raza: "Angus",
    edad_meses: 36,
    caracteristica_destacada: "Top 1% calving ease",
    stats: {
      crecimiento: 85,
      facilidad_parto: 98,
      reproduccion: 75,
      moderacion: 60,
      carcasa: 82,
    },
  },
  {
    id: 2,
    caravana: "845",
    nombre: "Red Diamond",
    uso: "vaca",
    origen: "catalogo",
    pelaje: "colorado",
    raza: "Angus",
    edad_meses: 42,
    caracteristica_destacada: "Top 5% carcass",
    stats: {
      crecimiento: 90,
      facilidad_parto: 40,
      reproduccion: 88,
      moderacion: 70,
      carcasa: 95,
    },
  },
  {
    id: 3,
    caravana: "102",
    nombre: "General 102",
    uso: "vaquillona",
    origen: "catalogo",
    pelaje: "negro",
    raza: "Brangus",
    edad_meses: 30,
    caracteristica_destacada: null,
    stats: {
      crecimiento: 70,
      facilidad_parto: 92,
      reproduccion: 65,
      moderacion: 80,
      carcasa: 60,
    },
  },
  {
    id: 4,
    caravana: "554",
    nombre: "Indomable",
    uso: "vaca",
    origen: "propio",
    pelaje: "colorado",
    raza: "Hereford",
    edad_meses: 48,
    caracteristica_destacada: null,
    stats: {
      crecimiento: 60,
      facilidad_parto: 30,
      reproduccion: 95,
      moderacion: 50,
      carcasa: 75,
    },
  },
  {
    id: 5,
    caravana: "210",
    nombre: "Midnight Express",
    uso: "vaquillona",
    origen: "propio",
    pelaje: "negro",
    raza: "Angus",
    edad_meses: 28,
    caracteristica_destacada: "Efficiency Leader",
    stats: {
      crecimiento: 78,
      facilidad_parto: 95,
      reproduccion: 82,
      moderacion: 85,
      carcasa: 68,
    },
  },
  {
    id: 6,
    caravana: "773",
    nombre: "Rustic King",
    uso: "vaca",
    origen: "catalogo",
    pelaje: "colorado",
    raza: "Braford",
    edad_meses: 54,
    caracteristica_destacada: "Heat Tolerant",
    stats: {
      crecimiento: 92,
      facilidad_parto: 35,
      reproduccion: 90,
      moderacion: 45,
      carcasa: 88,
    },
  },
  {
    id: 7,
    caravana: "304",
    nombre: "Shadow Warrior",
    uso: "vaquillona",
    origen: "propio",
    pelaje: "negro",
    raza: "Brangus",
    edad_meses: 32,
    caracteristica_destacada: "Performance Pro",
    stats: {
      crecimiento: 88,
      facilidad_parto: 85,
      reproduccion: 70,
      moderacion: 65,
      carcasa: 91,
    },
  },
];

function toBullWithScore(raw: (typeof MOCK_BULLS_RAW)[number]): BullWithScore {
  return {
    id: raw.id,
    caravana: raw.caravana,
    nombre: raw.nombre,
    uso: raw.uso,
    origen: raw.origen,
    pelaje: raw.pelaje,
    raza: raw.raza,
    edadMeses: raw.edad_meses,
    caracteristicaDestacada: raw.caracteristica_destacada,
    stats: raw.stats,
    bullScore: computeBullScore(raw.stats),
  };
}

const MOCK_BULLS: BullWithScore[] = MOCK_BULLS_RAW.map(toBullWithScore);

function filterBulls(
  bulls: BullWithScore[],
  params: BullsQueryParams
): BullWithScore[] {
  let list = [...bulls];

  if (params.search?.trim()) {
    const q = params.search.trim().toLowerCase();
    list = list.filter(
      (b) =>
        b.nombre.toLowerCase().includes(q) ||
        b.caravana.toLowerCase().includes(q) ||
        b.raza.toLowerCase().includes(q)
    );
  }
  if (params.origen && params.origen !== "favoritos") {
    list = list.filter((b) => b.origen === params.origen);
  }
  if (params.paraVaquillona === true) {
    list = list.filter((b) => b.uso === "vaquillona");
  }
  if (params.pelaje) {
    list = list.filter((b) => b.pelaje === params.pelaje);
  }

  const sortBy = params.sortByScore ?? "desc";
  list.sort((a, b) =>
    sortBy === "desc" ? b.bullScore - a.bullScore : a.bullScore - b.bullScore
  );

  if (params.origen === "favoritos") {
    const favIds = getMockFavoriteIds();
    list = list.filter((b) => favIds.has(b.id));
  }

  return list;
}

const MOCK_FAVORITES_KEY = "bulltrack-mock-favorites";

function getMockFavoriteIds(): Set<number> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = localStorage.getItem(MOCK_FAVORITES_KEY);
    if (!raw) return new Set();
    const arr = JSON.parse(raw) as number[];
    return new Set(Array.isArray(arr) ? arr : []);
  } catch {
    return new Set();
  }
}

function setMockFavoriteIds(ids: number[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(MOCK_FAVORITES_KEY, JSON.stringify(ids));
  } catch {}
}

export function getMockPaginatedBulls(
  params: BullsQueryParams
): Promise<PaginatedBulls> {
  const filtered = filterBulls(MOCK_BULLS, params);
  const page = params.page ?? 1;
  const limit = params.limit ?? 10;
  const start = (page - 1) * limit;
  const data = filtered.slice(start, start + limit);
  return Promise.resolve({
    data,
    total: filtered.length,
    page,
    limit,
  });
}

export function getMockFavoriteBullIds(): Promise<{ bullIds: number[] }> {
  const ids = Array.from(getMockFavoriteIds());
  return Promise.resolve({ bullIds: ids });
}

export function addMockFavorite(bullId: number): Promise<void> {
  const ids = getMockFavoriteIds();
  ids.add(bullId);
  setMockFavoriteIds(Array.from(ids));
  return Promise.resolve();
}

export function removeMockFavorite(bullId: number): Promise<void> {
  const ids = getMockFavoriteIds();
  ids.delete(bullId);
  setMockFavoriteIds(Array.from(ids));
  return Promise.resolve();
}

export function isMockDataEnabled(): boolean {
  return process.env.NEXT_PUBLIC_USE_MOCK_DATA === "true";
}
