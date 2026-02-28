import {Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {ProjectGoal} from "./project-goal.entity";
import {Project} from "../projects/project.entity";
import {Repository} from "typeorm";
import {CreateProjectGoalDto} from "./dto/create-project-goal.dto";

@Injectable()
export class ProjectGoalsService {
    constructor(
        @InjectRepository(ProjectGoal)
        private readonly projectGoalsRepository: Repository<ProjectGoal>,

        @InjectRepository(Project)
        private readonly projectsRepository: Repository<Project>,
    ) {}

    async create(projectId: string, dto: CreateProjectGoalDto, userId: string) {
        const project = await this.projectsRepository.findOne({
            where: {
                id: projectId,
                owner: { id: userId },
            },
        });

        if (!project) {
            throw new NotFoundException('Projeto não encontrado');
        }

        const goal = this.projectGoalsRepository.create({
            ...dto,
            project,
        });

        return this.projectGoalsRepository.save(goal);
    }

    async findAll(projectId: string, userId: string) {
        return this.projectGoalsRepository.find({
            where: {
                project: {
                    id: projectId,
                    owner: { id: userId },
                },
            },
        });
    }
}