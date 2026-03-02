import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';

jest.mock('bcrypt');

describe('AuthService', () => {
  let service: AuthService;

  const mockUsersService = {
    findForAuth: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('login', () => {
    it('should return a user and access token', async () => {
      const user = { id: '1', name: 'Test', email: 'test@test.com', password: 'hashedPassword' };
      mockUsersService.findForAuth.mockResolvedValue(user);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      mockJwtService.sign.mockReturnValue('jwt_token');

      const result = await service.login('test@test.com', 'password');

      expect(mockUsersService.findForAuth).toHaveBeenCalledWith('test@test.com');
      expect(bcrypt.compare).toHaveBeenCalledWith('password', 'hashedPassword');
      expect(mockJwtService.sign).toHaveBeenCalledWith({
        sub: user.id,
        name: user.name,
        email: user.email,
        role: 'USER',
      });
      expect(result).toEqual({
        access_token: 'jwt_token',
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
      });
    });

    it('should throw UnauthorizedException if user not found', async () => {
      mockUsersService.findForAuth.mockResolvedValue(null);
      await expect(service.login('test@test.com', 'password')).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException if password does not match', async () => {
      const user = { id: '1', name: 'Test', email: 'test@test.com', password: 'wrongPassword' };
      mockUsersService.findForAuth.mockResolvedValue(user);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(service.login('test@test.com', 'password')).rejects.toThrow(UnauthorizedException);
    });
  });
});
