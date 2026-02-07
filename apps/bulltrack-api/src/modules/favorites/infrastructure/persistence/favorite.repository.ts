import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Favorite } from '../../entities/favorite.entity';
import type { IFavoriteRepository } from '../../domain/ports/favorite.repository.port';

@Injectable()
export class FavoriteRepository implements IFavoriteRepository {
  constructor(
    @InjectRepository(Favorite)
    private readonly repo: Repository<Favorite>,
  ) {}

  async add(userId: string, bullId: number): Promise<{ ok: boolean }> {
    await this.repo.upsert({ userId, bullId }, ['userId', 'bullId']);
    return { ok: true };
  }

  async remove(userId: string, bullId: number): Promise<{ ok: boolean }> {
    await this.repo.delete({ userId, bullId });
    return { ok: true };
  }

  async getFavoriteBullIds(userId: string): Promise<number[]> {
    const rows = await this.repo.find({
      where: { userId },
      select: { bullId: true },
    });
    return rows.map((r) => r.bullId);
  }
}
