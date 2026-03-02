import { Test, TestingModule } from '@nestjs/testing';
import { ProjectGoalsController } from './project-goals.controller';
import { ProjectGoalsService } from './project-goals.service';
import { CreateProjectGoalDto } from './dto/create-project-goal.dto';

describe('ProjectGoalsController', () => {
  let controller: ProjectGoalsController;
  let service: ProjectGoalsService;

  const mockGoalsService = {
    findAll: jest.fn(),
    create: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProjectGoalsController],
      providers: [
        {
          provide: ProjectGoalsService,
          useValue: mockGoalsService,
        },
      ],
    }).compile();

    controller = module.get<ProjectGoalsController>(ProjectGoalsController);
    service = module.get<ProjectGoalsService>(ProjectGoalsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all goals for a project', async () => {
      const req = { user: { id: 'user1' } };
      const goals = [{ id: '1', name: 'Goal 1' }];
      mockGoalsService.findAll.mockResolvedValue(goals);

      expect(await controller.findAll('proj1', req)).toEqual(goals);
      expect(mockGoalsService.findAll).toHaveBeenCalledWith('proj1', 'user1');
    });
  });

  describe('create', () => {
    it('should create a new goal', async () => {
      const req = { user: { id: 'user1' } };
      const dto = { name: 'Goal 1' } as CreateProjectGoalDto;
      const goal = { id: '1', ...dto };
      mockGoalsService.create.mockResolvedValue(goal);

      expect(await controller.create('proj1', dto, req)).toEqual(goal);
      expect(mockGoalsService.create).toHaveBeenCalledWith('proj1', dto, 'user1');
    });
  });
});
