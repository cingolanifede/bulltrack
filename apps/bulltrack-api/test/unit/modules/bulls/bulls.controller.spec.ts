import { Test, TestingModule } from '@nestjs/testing';
import { BullsController } from '../../../../src/modules/bulls/bulls.controller';
import { BullsService } from '../../../../src/modules/bulls/application/bulls.service';
import { User } from '../../../../src/modules/users/entities/user.entity';
import { QueryBullsDto } from '../../../../src/modules/bulls/dto/query-bulls.dto';

describe('BullsController', () => {
  let controller: BullsController;
  let bullsService: jest.Mocked<BullsService>;

  const mockUser: User = {
    id: 'user-uuid-1',
    email: 'test@example.com',
    passwordHash: 'hash',
    createdAt: new Date(),
    favorites: [],
  };

  const mockPaginatedResult = {
    data: [],
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BullsController],
      providers: [
        {
          provide: BullsService,
          useValue: {
            findAll: jest.fn().mockResolvedValue(mockPaginatedResult),
          },
        },
      ],
    }).compile();

    controller = module.get<BullsController>(BullsController);
    bullsService = module.get(BullsService) as jest.Mocked<BullsService>;
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should pass query and user id to service and return result', async () => {
      const query: QueryBullsDto = { page: 1, limit: 10 };

      const result = await controller.findAll(query, mockUser);

      expect(bullsService.findAll).toHaveBeenCalledWith(query, mockUser.id);
      expect(result).toEqual(mockPaginatedResult);
    });
  });
});
