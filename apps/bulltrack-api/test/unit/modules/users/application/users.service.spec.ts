import { Test, TestingModule } from '@nestjs/testing';
import { USER_REPOSITORY } from '../../../../../src/modules/users/domain/ports/user.repository.port';
import { UsersService } from '../../../../../src/modules/users/application/users.service';
import { User } from '../../../../../src/modules/users/entities/user.entity';

describe('UsersService', () => {
  let service: UsersService;
  let mockRepository: {
    findByEmail: jest.Mock;
    findById: jest.Mock;
  };

  const mockUser: User = {
    id: 'user-uuid-1',
    email: 'test@example.com',
    passwordHash: '$2b$10$hashed',
    createdAt: new Date(),
    favorites: [],
  };

  beforeEach(async () => {
    mockRepository = {
      findByEmail: jest.fn(),
      findById: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: USER_REPOSITORY,
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findByEmail', () => {
    it('should return user when found', async () => {
      mockRepository.findByEmail.mockResolvedValue(mockUser);

      const result = await service.findByEmail('test@example.com');

      expect(result).toEqual(mockUser);
      expect(mockRepository.findByEmail).toHaveBeenCalledWith(
        'test@example.com',
      );
    });

    it('should return null when user not found', async () => {
      mockRepository.findByEmail.mockResolvedValue(null);

      const result = await service.findByEmail('unknown@example.com');

      expect(result).toBeNull();
      expect(mockRepository.findByEmail).toHaveBeenCalledWith(
        'unknown@example.com',
      );
    });
  });

  describe('findById', () => {
    it('should return user when found', async () => {
      mockRepository.findById.mockResolvedValue(mockUser);

      const result = await service.findById('user-uuid-1');

      expect(result).toEqual(mockUser);
      expect(mockRepository.findById).toHaveBeenCalledWith('user-uuid-1');
    });

    it('should return null when user not found', async () => {
      mockRepository.findById.mockResolvedValue(null);

      const result = await service.findById('unknown-uuid');

      expect(result).toBeNull();
      expect(mockRepository.findById).toHaveBeenCalledWith('unknown-uuid');
    });
  });
});
