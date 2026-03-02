import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { Project } from './project.entity';
import { ProjectStatus } from '../enums/project-status.enum';

describe('ProjectsService', () => {
  let service: ProjectsService;

  const mockQueryBuilder = {
    select: jest.fn().mockReturnThis(),
    addSelect: jest.fn().mockReturnThis(),
    groupBy: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    getRawMany: jest.fn(),
  };

  const mockProjectsRepository = {
    findAndCount: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
    createQueryBuilder: jest.fn(() => mockQueryBuilder),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProjectsService,
        {
          provide: getRepositoryToken(Project),
          useValue: mockProjectsRepository,
        },
      ],
    }).compile();

    service = module.get<ProjectsService>(ProjectsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return paginated projects', async () => {
      const project = { id: '1', name: 'P1', goals: [] };
      mockProjectsRepository.findAndCount.mockResolvedValue([[project], 1]);

      const result = await service.findAll('user1', 1, 10);

      expect(mockProjectsRepository.findAndCount).toHaveBeenCalledWith({
        relations: ['goals'],
        skip: 0,
        take: 10,
        where: { owner: { id: 'user1' } },
        order: { createdAt: 'DESC' },
      });

      expect(result.data.length).toBe(1);
      expect(result.data[0].id).toBe('1');
      expect(result.meta).toEqual({ total: 1, page: 1, lastPage: 1 });
    });

    it('should compute progress correctly', async () => {
      const project = {
        id: '1',
        name: 'P1',
        goals: [
          { status: ProjectStatus.DONE },
          { status: ProjectStatus.PENDING },
        ],
      };
      mockProjectsRepository.findAndCount.mockResolvedValue([[project], 1]);

      const result = await service.findAll('user1', 1, 10);
      expect(result.data[0].goals.progress).toBe(50);
      expect(result.data[0].goals.total).toBe(2);
      expect(result.data[0].goals.completed).toBe(1);
    });
  });

  describe('create', () => {
    it('should create and save a new project', async () => {
      const dto = { name: 'P1', description: 'Desc' };
      const project = { id: '1', ...dto };
      mockProjectsRepository.create.mockReturnValue(project);
      mockProjectsRepository.save.mockResolvedValue(project);

      const result = await service.create(dto, 'user1');

      expect(mockProjectsRepository.create).toHaveBeenCalledWith({
        ...dto,
        owner: { id: 'user1' },
      });
      expect(mockProjectsRepository.save).toHaveBeenCalledWith(project);
      expect(result).toEqual(project);
    });
  });

  describe('findOne', () => {
    it('should return a project if found', async () => {
      const project = { id: '1', owner: { id: 'user1' } };
      mockProjectsRepository.findOne.mockResolvedValue(project);

      const result = await service.findOne('1', 'user1');
      expect(result).toEqual(project);
      expect(mockProjectsRepository.findOne).toHaveBeenCalledWith({
        where: { id: '1', owner: { id: 'user1' } },
      });
    });

    it('should throw NotFoundException if not found', async () => {
      mockProjectsRepository.findOne.mockResolvedValue(null);
      await expect(service.findOne('1', 'user1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a project', async () => {
      const project = { id: '1', name: 'Old' };
      const dto = { name: 'New' };
      mockProjectsRepository.findOne.mockResolvedValue(project);
      mockProjectsRepository.save.mockResolvedValue({ ...project, ...dto });

      const result = await service.update('1', dto, 'user1');

      expect(mockProjectsRepository.save).toHaveBeenCalledWith({ id: '1', name: 'New' });
      expect(result.name).toBe('New');
    });

    it('should throw NotFoundException if project not found', async () => {
      mockProjectsRepository.findOne.mockResolvedValue(null);
      await expect(service.update('1', {}, 'user1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove a project', async () => {
      const project = { id: '1' };
      mockProjectsRepository.findOne.mockResolvedValue(project);
      mockProjectsRepository.remove.mockResolvedValue(project);

      await service.remove('1', 'user1');

      expect(mockProjectsRepository.remove).toHaveBeenCalledWith(project);
    });

    it('should throw NotFoundException if project not found', async () => {
      mockProjectsRepository.findOne.mockResolvedValue(null);
      await expect(service.remove('1', 'user1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('getStats', () => {
    it('should return the correct stats', async () => {
      mockQueryBuilder.getRawMany.mockResolvedValue([
        { status: ProjectStatus.PENDING, total: '5' },
        { status: ProjectStatus.IN_PROGRESS, total: '3' },
        { status: ProjectStatus.DONE, total: '2' },
      ]);

      const result = await service.getStats('user1');

      expect(mockProjectsRepository.createQueryBuilder).toHaveBeenCalled();
      expect(result).toEqual({
        total: 10,
        pending: 5,
        inProgress: 3,
        done: 2,
      });
    });
  });
});
