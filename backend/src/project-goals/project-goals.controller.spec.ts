import { Test, TestingModule } from '@nestjs/testing';
import { ProjectGoalsController } from './project-goals.controller';

describe('ProjectGoalsController', () => {
  let controller: ProjectGoalsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProjectGoalsController],
    }).compile();

    controller = module.get<ProjectGoalsController>(ProjectGoalsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
