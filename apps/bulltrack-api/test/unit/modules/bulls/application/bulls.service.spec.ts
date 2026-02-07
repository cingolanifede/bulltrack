import { Test, TestingModule } from '@nestjs/testing';
import {
  BULL_REPOSITORY,
  type IBullRepository,
  type PaginatedBullsResult,
} from '../../../../../src/modules/bulls/domain/ports/bull.repository.port';
import { BullsService } from '../../../../../src/modules/bulls/application/bulls.service';
import { QueryBullsDto } from '../../../../../src/modules/bulls/dto/query-bulls.dto';

describe('BullsService', () => {
  let service: BullsService;
  let mockRepository: jest.Mocked<IBullRepository>;

  const mockPaginatedResult: PaginatedBullsResult = {
    data: [],
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  };

  beforeEach(async () => {
    mockRepository = {
      findPaginated: jest.fn().mockResolvedValue(mockPaginatedResult),
      existsById: jest.fn().mockResolvedValue(true),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BullsService,
        {
          provide: BULL_REPOSITORY,
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<BullsService>(BullsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should map query to criteria and call repository', async () => {
      const query: QueryBullsDto = {
        page: 2,
        limit: 20,
        search: 'caravana',
        origen: 'catalogo',
        sortByScore: 'asc',
      };
      const userId = 'user-123';

      await service.findAll(query, userId);

      expect(mockRepository.findPaginated).toHaveBeenCalledWith({
        page: 2,
        limit: 20,
        search: 'caravana',
        origen: 'catalogo',
        sortByScore: 'asc',
        userId,
      });
    });

    it('should use defaults when query has minimal fields', async () => {
      const query = {} as QueryBullsDto;

      await service.findAll(query);

      expect(mockRepository.findPaginated).toHaveBeenCalledWith({
        page: 1,
        limit: 10,
        sortByScore: 'desc',
        userId: undefined,
      });
    });

    it('should return repository result', async () => {
      const result = await service.findAll({} as QueryBullsDto);

      expect(result).toEqual(mockPaginatedResult);
    });
  });

  describe('existsById', () => {
    it('should return true when bull exists', async () => {
      mockRepository.existsById.mockResolvedValue(true);

      const result = await service.existsById(42);

      expect(result).toBe(true);
      expect(mockRepository.existsById).toHaveBeenCalledWith(42);
    });

    it('should return false when bull does not exist', async () => {
      mockRepository.existsById.mockResolvedValue(false);

      const result = await service.existsById(999);

      expect(result).toBe(false);
    });
  });
});
