export type BullStats = {
  crecimiento: number;
  facilidad_parto: number;
  reproduccion: number;
  moderacion: number;
  carcasa: number;
};

export type BullWithScore = {
  id: number;
  caravana: string;
  nombre: string;
  uso: string;
  origen: string;
  pelaje: string;
  raza: string;
  edadMeses: number;
  caracteristicaDestacada: string | null;
  stats: BullStats;
  bullScore: number;
};

export type PaginatedBulls = {
  data: BullWithScore[];
  total: number;
  page: number;
  limit: number;
};

export type OrigenFilter = "propio" | "catalogo" | "favoritos";
export type PelajeFilter = "negro" | "colorado";
export type SortByScore = "asc" | "desc";

export type BullsQueryParams = {
  page?: number;
  limit?: number;
  search?: string;
  origen?: OrigenFilter;
  paraVaquillona?: boolean;
  pelaje?: PelajeFilter;
  sortByScore?: SortByScore;
};
