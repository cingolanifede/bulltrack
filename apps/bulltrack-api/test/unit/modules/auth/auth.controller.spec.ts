import { UnauthorizedException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import type { Response } from 'express';
import { AuthService } from '../../../../src/modules/auth/auth.service';
import { AuthController } from '../../../../src/modules/auth/auth.controller';
import { LoginDto } from '../../../../src/modules/auth/dto/login.dto';
import { User } from '../../../../src/modules/users/entities/user.entity';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: jest.Mocked<AuthService>;
  let mockResponse: Partial<Response>;

  const mockUser = {
    id: 'user-uuid-1',
    email: 'test@example.com',
  };

  beforeEach(async () => {
    mockResponse = {
      cookie: jest.fn().mockReturnThis(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            login: jest.fn(),
            refresh: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get(AuthService) as jest.Mocked<AuthService>;
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('login', () => {
    it('should set cookies and return user on successful login', async () => {
      const dto: LoginDto = {
        email: 'test@example.com',
        password: 'password123',
      };
      authService.login.mockResolvedValue({
        access_token: 'access',
        refresh_token: 'refresh',
        user: mockUser,
      });

      const result = await controller.login(dto, mockResponse as Response);

      expect(authService.login).toHaveBeenCalledWith(dto);
      expect(mockResponse.cookie).toHaveBeenCalledWith(
        'bulltrack_token',
        'access',
        expect.objectContaining({
          httpOnly: true,
          path: '/',
          maxAge: expect.any(Number),
        }),
      );
      expect(mockResponse.cookie).toHaveBeenCalledWith(
        'bulltrack_refresh_token',
        'refresh',
        expect.objectContaining({
          httpOnly: true,
          path: '/',
          maxAge: expect.any(Number),
        }),
      );
      expect(result).toEqual({ user: mockUser });
    });
  });

  describe('refresh', () => {
    it('should refresh using cookie and set new cookies', async () => {
      const req = {
        cookies: { bulltrack_refresh_token: 'refresh-from-cookie' },
        body: {},
      } as any;
      authService.refresh.mockResolvedValue({
        access_token: 'new-access',
        refresh_token: 'new-refresh',
        user: mockUser,
      });

      const result = await controller.refresh(req, mockResponse as Response);

      expect(authService.refresh).toHaveBeenCalledWith('refresh-from-cookie');
      expect(mockResponse.cookie).toHaveBeenCalledWith(
        'bulltrack_token',
        'new-access',
        expect.any(Object),
      );
      expect(result).toEqual({ user: mockUser });
    });

    it('should fallback to body refresh_token when cookie missing', async () => {
      const req = {
        cookies: {},
        body: { refresh_token: 'refresh-from-body' },
      } as any;
      authService.refresh.mockResolvedValue({
        access_token: 'new-access',
        refresh_token: 'new-refresh',
        user: mockUser,
      });

      await controller.refresh(req, mockResponse as Response);

      expect(authService.refresh).toHaveBeenCalledWith('refresh-from-body');
    });

    it('should throw when no refresh token provided', async () => {
      const req = { cookies: {}, body: {} } as any;

      await expect(
        controller.refresh(req, mockResponse as Response),
      ).rejects.toThrow(UnauthorizedException);
      await expect(
        controller.refresh(req, mockResponse as Response),
      ).rejects.toThrow('Refresh token required');
      expect(authService.refresh).not.toHaveBeenCalled();
    });
  });

  describe('me', () => {
    it('should return current user', () => {
      const user = {
        id: 'user-uuid-1',
        email: 'test@example.com',
        passwordHash: 'hash',
        createdAt: new Date(),
        favorites: [],
      } as User;

      const result = controller.me(user);

      expect(result).toEqual({ user: { id: user.id, email: user.email } });
    });
  });

  describe('logout', () => {
    it('should clear cookies and return success', () => {
      const result = controller.logout(mockResponse as Response);

      expect(mockResponse.cookie).toHaveBeenCalledWith(
        'bulltrack_token',
        '',
        expect.objectContaining({ maxAge: 0 }),
      );
      expect(mockResponse.cookie).toHaveBeenCalledWith(
        'bulltrack_refresh_token',
        '',
        expect.objectContaining({ maxAge: 0 }),
      );
      expect(result).toEqual({ success: true });
    });
  });
});
