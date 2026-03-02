import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { ProjectGoalsService } from './project-goals.service';
import { ProjectGoal } from './project-goal.entity';
import { Project } from '../projects/project.entity';

describe('ProjectGoalsService', () => {
  let service: ProjectGoalsService;

  const mockProjectGoalsRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
  };

  const mockProjectsRepository = {
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProjectGoalsService,
        {
          provide: getRepositoryToken(ProjectGoal),
          useValue: mockProjectGoalsRepository,
        },
        {
          provide: getRepositoryToken(Project),
          useValue: mockProjectsRepository,
        },
      ],
    }).compile();

    service = module.get<ProjectGoalsService>(ProjectGoalsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a project goal', async () => {
      const project = { id: 'proj1', owner: { id: 'user1' } };
      const dto = { name: 'Goal 1' };
      const goal = { id: '1', ...dto, project };

      mockProjectsRepository.findOne.mockResolvedValue(project);
      mockProjectGoalsRepository.create.mockReturnValue(goal);
      mockProjectGoalsRepository.save.mockResolvedValue(goal);

      const result = await service.create('proj1', dto as any, 'user1');

      expect(mockProjectsRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'proj1', owner: { id: 'user1' } },
      });
      expect(mockProjectGoalsRepository.create).toHaveBeenCalledWith({
        ...dto,
        project,
      });
      expect(result).toEqual(goal);
    });

    it('should throw NotFoundException if project not found', async () => {
      mockProjectsRepository.findOne.mockResolvedValue(null);
      await expect(service.create('proj1', {} as any, 'user1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('findAll', () => {
    it('should return all goals for a project', async () => {
      const goals = [{ id: '1', name: 'Goal 1' }];
      mockProjectGoalsRepository.find.mockResolvedValue(goals);

      const result = await service.findAll('proj1', 'user1');

      expect(mockProjectGoalsRepository.find).toHaveBeenCalledWith({
        where: {
          project: {
            id: 'proj1',
            owner: { id: 'user1' },
          },
        },
      });
      expect(result).toEqual(goals);
    });
  });
});
