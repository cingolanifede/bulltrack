import { Injectable, Inject } from '@nestjs/common';
import {
  BULL_REPOSITORY,
  type IBullRepository,
  type PaginatedBullsResult,
} from '../domain/ports/bull.repository.port';
import type { BullSearchCriteria } from '../domain/ports/bull-search.criteria';
import { QueryBullsDto } from '../dto/query-bulls.dto';

@Injectable()
export class BullsService {
  constructor(
    @Inject(BULL_REPOSITORY)
    private readonly bullRepository: IBullRepository,
  ) {}

  async findAll(
    query: QueryBullsDto,
    userId?: string,
  ): Promise<PaginatedBullsResult> {
    const criteria = this.toCriteria(query, userId);
    return this.bullRepository.findPaginated(criteria);
  }

  async existsById(id: number): Promise<boolean> {
    return this.bullRepository.existsById(id);
  }

  private toCriteria(
    query: QueryBullsDto,
    userId?: string,
  ): BullSearchCriteria {
    const {
      page = 1,
      limit = 10,
      search,
      origen,
      paraVaquillona,
      pelaje,
      sortByScore = 'desc',
    } = query;
    return {
      page,
      limit,
      search,
      origen,
      paraVaquillona,
      pelaje,
      sortByScore,
      userId,
    };
  }
}
