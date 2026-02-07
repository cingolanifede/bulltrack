import { Test, TestingModule } from '@nestjs/testing';
import { FavoritesController } from '../../../../src/modules/favorites/favorites.controller';
import { FavoritesService } from '../../../../src/modules/favorites/application/favorites.service';
import { User } from '../../../../src/modules/users/entities/user.entity';

describe('FavoritesController', () => {
  let controller: FavoritesController;
  let favoritesService: jest.Mocked<FavoritesService>;

  const mockUser: User = {
    id: 'user-uuid-1',
    email: 'test@example.com',
    passwordHash: 'hash',
    createdAt: new Date(),
    favorites: [],
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FavoritesController],
      providers: [
        {
          provide: FavoritesService,
          useValue: {
            add: jest.fn().mockResolvedValue({ ok: true }),
            remove: jest.fn().mockResolvedValue({ ok: true }),
            getFavoriteBullIds: jest.fn().mockResolvedValue([1, 2]),
          },
        },
      ],
    }).compile();

    controller = module.get<FavoritesController>(FavoritesController);
    favoritesService = module.get(
      FavoritesService,
    ) as jest.Mocked<FavoritesService>;
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('add', () => {
    it('should add favorite for current user and bullId', async () => {
      const result = await controller.add(42, mockUser);

      expect(favoritesService.add).toHaveBeenCalledWith(mockUser.id, 42);
      expect(result).toEqual({ ok: true });
    });
  });

  describe('remove', () => {
    it('should remove favorite for current user and bullId', async () => {
      const result = await controller.remove(42, mockUser);

      expect(favoritesService.remove).toHaveBeenCalledWith(mockUser.id, 42);
      expect(result).toEqual({ ok: true });
    });
  });

  describe('list', () => {
    it('should return favorite bull ids for current user', async () => {
      const result = await controller.list(mockUser);

      expect(favoritesService.getFavoriteBullIds).toHaveBeenCalledWith(
        mockUser.id,
      );
      expect(result).toEqual({ bullIds: [1, 2] });
    });
  });
});
