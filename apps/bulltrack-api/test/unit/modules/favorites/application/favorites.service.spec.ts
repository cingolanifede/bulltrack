import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { FAVORITE_REPOSITORY } from '../../../../../src/modules/favorites/domain/ports/favorite.repository.port';
import { BullsService } from '../../../../../src/modules/bulls/application/bulls.service';
import { FavoritesService } from '../../../../../src/modules/favorites/application/favorites.service';

describe('FavoritesService', () => {
  let service: FavoritesService;
  let mockFavoriteRepository: {
    add: jest.Mock;
    remove: jest.Mock;
    getFavoriteBullIds: jest.Mock;
  };
  let bullsService: jest.Mocked<BullsService>;

  beforeEach(async () => {
    mockFavoriteRepository = {
      add: jest.fn().mockResolvedValue({ ok: true }),
      remove: jest.fn().mockResolvedValue({ ok: true }),
      getFavoriteBullIds: jest.fn().mockResolvedValue([]),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FavoritesService,
        {
          provide: FAVORITE_REPOSITORY,
          useValue: mockFavoriteRepository,
        },
        {
          provide: BullsService,
          useValue: {
            existsById: jest.fn().mockResolvedValue(true),
          },
        },
      ],
    }).compile();

    service = module.get<FavoritesService>(FavoritesService);
    bullsService = module.get(BullsService) as jest.Mocked<BullsService>;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('add', () => {
    it('should add favorite when bull exists', async () => {
      bullsService.existsById.mockResolvedValue(true);
      mockFavoriteRepository.add.mockResolvedValue({ ok: true });

      const result = await service.add('user-1', 42);

      expect(bullsService.existsById).toHaveBeenCalledWith(42);
      expect(mockFavoriteRepository.add).toHaveBeenCalledWith('user-1', 42);
      expect(result).toEqual({ ok: true });
    });

    it('should throw NotFoundException when bull does not exist', async () => {
      bullsService.existsById.mockResolvedValue(false);

      await expect(service.add('user-1', 999)).rejects.toThrow(
        NotFoundException,
      );
      await expect(service.add('user-1', 999)).rejects.toThrow(
        'Bull with id 999 not found',
      );
      expect(mockFavoriteRepository.add).not.toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('should call repository remove', async () => {
      const result = await service.remove('user-1', 42);

      expect(mockFavoriteRepository.remove).toHaveBeenCalledWith('user-1', 42);
      expect(result).toEqual({ ok: true });
    });
  });

  describe('getFavoriteBullIds', () => {
    it('should return favorite bull ids for user', async () => {
      mockFavoriteRepository.getFavoriteBullIds.mockResolvedValue([1, 2, 3]);

      const result = await service.getFavoriteBullIds('user-1');

      expect(mockFavoriteRepository.getFavoriteBullIds).toHaveBeenCalledWith(
        'user-1',
      );
      expect(result).toEqual([1, 2, 3]);
    });
  });
});
