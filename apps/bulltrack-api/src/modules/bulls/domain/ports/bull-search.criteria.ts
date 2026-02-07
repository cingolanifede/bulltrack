export interface BullSearchCriteria {
  page: number;
  limit: number;
  search?: string;
  origen?: 'propio' | 'catalogo' | 'favoritos';
  paraVaquillona?: boolean;
  pelaje?: 'negro' | 'colorado';
  sortByScore: 'asc' | 'desc';
  userId?: string;
}
