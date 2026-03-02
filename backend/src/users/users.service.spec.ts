import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UsersService } from './users.service';
import { User } from './user.entity';
import * as ensureUniqueHelper from '../common/database/helpers/ensure-unique-field.helper';
import { CreateUserDto } from './dto/create-user.dto';

jest.mock('bcrypt');
jest.mock('../common/database/helpers/ensure-unique-field.helper');

describe('UsersService', () => {
  let service: UsersService;

  const mockUsersRepository = {
    find: jest.fn(),
    findOneBy: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    merge: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUsersRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const users = [{ id: '1', name: 'Test User' }];
      mockUsersRepository.find.mockResolvedValue(users);

      const result = await service.findAll();
      expect(result).toEqual(users);
    });
  });

  describe('create', () => {
    it('should successfully create a user', async () => {
      const dto: CreateUserDto = { name: 'Test', email: 'test@test.com', password: 'password', character: 'Warrior' };
      const hashedPassword = 'hashedPassword';
      const user = { id: '1', ...dto, password: hashedPassword };

      (ensureUniqueHelper.ensureUniqueField as jest.Mock).mockResolvedValue(true);
      (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);
      mockUsersRepository.create.mockReturnValue(user);
      mockUsersRepository.save.mockResolvedValue(user);

      const result = await service.create(dto);

      expect(ensureUniqueHelper.ensureUniqueField).toHaveBeenCalled();
      expect(bcrypt.hash).toHaveBeenCalledWith('password', 10);
      expect(mockUsersRepository.create).toHaveBeenCalledWith({ ...dto, password: hashedPassword });
      expect(mockUsersRepository.save).toHaveBeenCalledWith(user);
      expect(result).toEqual(user);
    });
  });

  describe('findOne', () => {
    it('should return a user if found', async () => {
      const user = { id: '1', name: 'Test' };
      mockUsersRepository.findOneBy.mockResolvedValue(user);

      const result = await service.findOne('1');
      expect(result).toEqual(user);
    });

    it('should throw NotFoundException if user not found', async () => {
      mockUsersRepository.findOneBy.mockResolvedValue(null);

      await expect(service.findOne('1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('findForAuth', () => {
    it('should return user auth info', async () => {
      const user = { id: '1', email: 'test@test.com' };
      mockUsersRepository.findOne.mockResolvedValue(user);

      const result = await service.findForAuth('test@test.com');
      expect(result).toEqual(user);
      expect(mockUsersRepository.findOne).toHaveBeenCalledWith({
        where: { email: 'test@test.com' },
        select: ['id', 'name', 'email', 'password', 'character'],
      });
    });
  });

  describe('update', () => {
    it('should update and return a user', async () => {
      const user = { id: '1', name: 'Test', email: 'old@test.com' };
      const dto = { name: 'Updated' };
      const mergedUser = { ...user, ...dto };

      mockUsersRepository.findOne.mockResolvedValueOnce(user).mockResolvedValueOnce(mergedUser);
      (ensureUniqueHelper.ensureUniqueField as jest.Mock).mockResolvedValue(true);
      mockUsersRepository.merge.mockReturnValue(mergedUser);
      mockUsersRepository.save.mockResolvedValue(mergedUser);

      const result = await service.update('1', dto);

      expect(mockUsersRepository.merge).toHaveBeenCalledWith(user, dto);
      expect(mockUsersRepository.save).toHaveBeenCalledWith(mergedUser);
      expect(result).toEqual(mergedUser);
    });

    it('should hash new password if provided', async () => {
      const user = { id: '1', name: 'Test' };
      const dto = { password: 'newPassword' };
      const mergedUser = { ...user, password: 'hashedPassword' };

      mockUsersRepository.findOne.mockResolvedValueOnce(user).mockResolvedValueOnce(mergedUser);
      (ensureUniqueHelper.ensureUniqueField as jest.Mock).mockResolvedValue(true);
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');
      mockUsersRepository.merge.mockReturnValue(mergedUser);
      mockUsersRepository.save.mockResolvedValue(mergedUser);

      const result = await service.update('1', dto);

      expect(bcrypt.hash).toHaveBeenCalledWith('newPassword', 10);
      expect(result).toEqual(mergedUser);
    });

    it('should throw NotFoundException if user not found', async () => {
      mockUsersRepository.findOne.mockResolvedValue(null);
      await expect(service.update('1', {})).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove a user', async () => {
      const user = { id: '1' };
      mockUsersRepository.findOneBy.mockResolvedValue(user); // from findOne internal call
      mockUsersRepository.delete.mockResolvedValue({ affected: 1 });

      await service.remove('1');
      expect(mockUsersRepository.delete).toHaveBeenCalledWith('1');
    });

    it('should throw NotFoundException if user not found', async () => {
      mockUsersRepository.findOneBy.mockResolvedValue(null);
      await expect(service.remove('1')).rejects.toThrow(NotFoundException);
    });
  });
});
