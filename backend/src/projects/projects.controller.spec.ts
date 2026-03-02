import { Test, TestingModule } from '@nestjs/testing';
import { ProjectsController } from './projects.controller';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

describe('ProjectsController', () => {
  let controller: ProjectsController;
  let service: ProjectsService;

  const mockProjectsService = {
    findAll: jest.fn(),
    create: jest.fn(),
    getStats: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProjectsController],
      providers: [
        {
          provide: ProjectsService,
          useValue: mockProjectsService,
        },
      ],
    }).compile();

    controller = module.get<ProjectsController>(ProjectsController);
    service = module.get<ProjectsService>(ProjectsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return projects', async () => {
      const req = { user: { id: 'user1' } };
      const result = { data: [], meta: {} };
      mockProjectsService.findAll.mockResolvedValue(result);

      expect(await controller.findAll(req)).toEqual(result);
      expect(mockProjectsService.findAll).toHaveBeenCalledWith('user1', 1, 10, null);
    });
  });

  describe('create', () => {
    it('should create a project', async () => {
      const dto = { name: 'P1', description: 'Desc' } as CreateProjectDto;
      const req = { user: { id: 'user1' } };
      const result = { id: '1', ...dto };
      mockProjectsService.create.mockResolvedValue(result);

      expect(await controller.create(dto, req)).toEqual(result);
      expect(mockProjectsService.create).toHaveBeenCalledWith(dto, 'user1');
    });
  });

  describe('getStats', () => {
    it('should return project stats', async () => {
      const req = { user: { id: 'user1' } };
      const result = { total: 0, pending: 0, inProgress: 0, done: 0 };
      mockProjectsService.getStats.mockResolvedValue(result);

      expect(await controller.getStats(req)).toEqual(result);
      expect(mockProjectsService.getStats).toHaveBeenCalledWith('user1');
    });
  });

  describe('findOne', () => {
    it('should return a single project', async () => {
      const req = { user: { id: 'user1' } };
      const result = { id: 'id1', name: 'P1' };
      mockProjectsService.findOne.mockResolvedValue(result);

      expect(await controller.findOne('id1', req)).toEqual(result);
      expect(mockProjectsService.findOne).toHaveBeenCalledWith('id1', 'user1');
    });
  });

  describe('update', () => {
    it('should update a project', async () => {
      const dto = { name: 'P2' } as UpdateProjectDto;
      const req = { user: { id: 'user1' } };
      const result = { id: 'id1', ...dto };
      mockProjectsService.update.mockResolvedValue(result);

      expect(await controller.update('id1', dto, req)).toEqual(result);
      expect(mockProjectsService.update).toHaveBeenCalledWith('id1', dto, 'user1');
    });
  });

  describe('remove', () => {
    it('should remove a project', async () => {
      const req = { user: { id: 'user1' } };
      mockProjectsService.remove.mockResolvedValue(undefined);

      expect(await controller.remove('id1', req)).toBeUndefined();
      expect(mockProjectsService.remove).toHaveBeenCalledWith('id1', 'user1');
    });
  });
});
