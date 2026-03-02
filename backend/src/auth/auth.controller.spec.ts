import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

  const mockAuthService = {
    login: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('login', () => {
    it('should return token on successful login', async () => {
      const dto = { email: 't@t.com', password: '123' };
      const loginResult = { access_token: 'token', user: { id: '1', name: 't', email: 't@t.com' } };

      mockAuthService.login.mockResolvedValue(loginResult);

      expect(await controller.login(dto)).toEqual(loginResult);
      expect(mockAuthService.login).toHaveBeenCalledWith(dto.email, dto.password);
    });
  });

  describe('me', () => {
    it('should return user from req', () => {
      const req = { user: { id: '1', email: 't@t.com' } };
      expect(controller.me(req)).toEqual(req.user);
    });
  });
});
