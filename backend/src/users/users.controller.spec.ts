import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  const mockUsersService = {
    findAll: jest.fn(),
    create: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all users', async () => {
      mockUsersService.findAll.mockResolvedValue([{ id: '1' }]);
      expect(await controller.findAll()).toEqual([{ id: '1' }]);
      expect(mockUsersService.findAll).toHaveBeenCalled();
    });
  });

  describe('create', () => {
    it('should create a user', async () => {
      const dto = { name: 'Test', email: 't@t.com', password: '123', character: 'Warrior' };
      mockUsersService.create.mockResolvedValue({ id: '1', ...dto });
      expect(await controller.create(dto)).toEqual({ id: '1', ...dto });
      expect(mockUsersService.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('findOne', () => {
    it('should find one user by id', async () => {
      mockUsersService.findOne.mockResolvedValue({ id: '1' });
      expect(await controller.findOne('1')).toEqual({ id: '1' });
      expect(mockUsersService.findOne).toHaveBeenCalledWith('1');
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const dto = { name: 'Updated' };
      mockUsersService.update.mockResolvedValue({ id: '1', ...dto });
      expect(await controller.update('1', dto)).toEqual({ id: '1', ...dto });
      expect(mockUsersService.update).toHaveBeenCalledWith('1', dto);
    });
  });

  describe('remove', () => {
    it('should remove a user', async () => {
      mockUsersService.remove.mockResolvedValue({ affected: 1 });
      expect(await controller.remove('1')).toEqual({ affected: 1 });
      expect(mockUsersService.remove).toHaveBeenCalledWith('1');
    });
  });
});
