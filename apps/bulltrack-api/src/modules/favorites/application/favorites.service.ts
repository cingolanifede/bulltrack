import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import {
  FAVORITE_REPOSITORY,
  type IFavoriteRepository,
} from '../domain/ports/favorite.repository.port';
import { BullsService } from '../../bulls/application/bulls.service';

@Injectable()
export class FavoritesService {
  constructor(
    @Inject(FAVORITE_REPOSITORY)
    private readonly favoriteRepository: IFavoriteRepository,
    private readonly bullsService: BullsService,
  ) {}

  async add(userId: string, bullId: number): Promise<{ ok: boolean }> {
    const exists = await this.bullsService.existsById(bullId);
    if (!exists) {
      throw new NotFoundException(`Bull with id ${bullId} not found`);
    }
    return this.favoriteRepository.add(userId, bullId);
  }

  async remove(userId: string, bullId: number): Promise<{ ok: boolean }> {
    return this.favoriteRepository.remove(userId, bullId);
  }

  async getFavoriteBullIds(userId: string): Promise<number[]> {
    return this.favoriteRepository.getFavoriteBullIds(userId);
  }
}
