import { BullSearchCriteria } from './bull-search.criteria';

export interface BullWithScore {
  id: number;
  caravana: string;
  nombre: string;
  uso: string;
  origen: string;
  pelaje: string;
  raza: string;
  edadMeses: number;
  caracteristicaDestacada: string | null;
  stats: {
    crecimiento: number;
    facilidad_parto: number;
    reproduccion: number;
    moderacion: number;
    carcasa: number;
  };
  bullScore: number;
}

export interface PaginatedBullsResult {
  data: BullWithScore[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export const BULL_REPOSITORY = Symbol('BULL_REPOSITORY');

export interface IBullRepository {
  findPaginated(criteria: BullSearchCriteria): Promise<PaginatedBullsResult>;
  existsById(id: number): Promise<boolean>;
}
