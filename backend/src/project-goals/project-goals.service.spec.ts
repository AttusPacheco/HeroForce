import { Test, TestingModule } from '@nestjs/testing';
import { ProjectGoalsService } from './project-goals.service';

describe('ProjectGoalsService', () => {
  let service: ProjectGoalsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProjectGoalsService],
    }).compile();

    service = module.get<ProjectGoalsService>(ProjectGoalsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
