export const FAVORITE_REPOSITORY = Symbol('FAVORITE_REPOSITORY');

export interface IFavoriteRepository {
  add(userId: string, bullId: number): Promise<{ ok: boolean }>;
  remove(userId: string, bullId: number): Promise<{ ok: boolean }>;
  getFavoriteBullIds(userId: string): Promise<number[]>;
}
