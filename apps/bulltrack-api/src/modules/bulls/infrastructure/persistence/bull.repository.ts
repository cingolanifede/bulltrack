import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Bull } from '../../entities/bull.entity';
import type { BullSearchCriteria } from '../../domain/ports/bull-search.criteria';
import {
  type IBullRepository,
  type PaginatedBullsResult,
  type BullWithScore,
} from '../../domain/ports/bull.repository.port';

@Injectable()
export class BullRepository implements IBullRepository {
  constructor(
    @InjectRepository(Bull)
    private readonly repo: Repository<Bull>,
  ) {}

  async findPaginated(
    criteria: BullSearchCriteria,
  ): Promise<PaginatedBullsResult> {
    const {
      page = 1,
      limit = 10,
      search,
      origen,
      paraVaquillona,
      pelaje,
      sortByScore = 'desc',
      userId,
    } = criteria;
    const skip = (page - 1) * limit;

    const qb = this.repo.createQueryBuilder('bull').select('bull');

    if (search?.trim()) {
      const term = `%${search.trim()}%`;
      qb.andWhere('(bull.caravana ILIKE :term OR bull.nombre ILIKE :term)', {
        term,
      });
    }
    if (origen === 'propio' || origen === 'catalogo') {
      qb.andWhere('bull.origen = :origen', { origen });
    }
    if (origen === 'favoritos' && userId) {
      qb.innerJoin(
        'favorites',
        'fav',
        'fav.bull_id = bull.id AND fav.user_id = :userId',
        { userId },
      );
    }
    if (paraVaquillona === true) {
      qb.andWhere('bull.uso = :uso', { uso: 'vaquillona' });
    }
    if (pelaje) {
      qb.andWhere('bull.pelaje = :pelaje', { pelaje });
    }

    const orderDir = sortByScore === 'asc' ? 'ASC' : 'DESC';
    qb.orderBy('bull.bull_score', orderDir);

    const countQb = qb.clone();
    const total = await countQb.getCount();

    const bulls = await qb.skip(skip).take(limit).getMany();

    const data: BullWithScore[] = bulls.map((bull) => ({
      id: bull.id,
      caravana: bull.caravana,
      nombre: bull.nombre,
      uso: bull.uso,
      origen: bull.origen,
      pelaje: bull.pelaje,
      raza: bull.raza,
      edadMeses: bull.edadMeses,
      caracteristicaDestacada: bull.caracteristicaDestacada,
      stats: bull.stats,
      bullScore: Number(bull.bullScore ?? 0),
    }));

    const totalPages = Math.ceil(total / limit) || 1;
    return { data, total, page, limit, totalPages };
  }

  async existsById(id: number): Promise<boolean> {
    const count = await this.repo.count({ where: { id } });
    return count > 0;
  }
}
