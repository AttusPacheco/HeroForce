import {Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Project} from "./project.entity";
import {Repository} from "typeorm";
import {CreateProjectDto} from "./dto/create-project.dto";
import {UpdateProjectDto} from "./dto/update-project.dto";
import {ProjectStatus} from "../enums/project-status.enum";

@Injectable()
export class ProjectsService {
    constructor(
        @InjectRepository(Project)
        private readonly projectsRepository: Repository<Project>,
    ) {
    }

    async findAll(userId: string, page: number, limit: number) {
        const skip = (page - 1) * limit;

        const [projects, total] = await this.projectsRepository.findAndCount({
            relations: ['goals'],
            skip,
            take: limit,
            order: {createdAt: 'DESC'},
        });

        return {
            data: projects.map(project => this.mapProjectWithProgress(project)),
            meta: {
                total,
                page,
                lastPage: Math.ceil(total / limit),
            },
        };
    }


    async create(dto: CreateProjectDto, userId: string) {
        const project = this.projectsRepository.create({
            ...dto,
            owner: {id: userId},
        });

        return this.projectsRepository.save(project);
    }

    async findOne(id: string, userId: string) {
        const project = await this.projectsRepository.findOne({
            where: {
                id,
                owner: {id: userId},
            },
        });

        if (!project) {
            throw new NotFoundException('Projeto não encontrado');
        }

        return project;
    }

    async update(id: string, dto: UpdateProjectDto, userId: string) {
        const project = await this.findOne(id, userId);

        if (!project) {
            throw new NotFoundException('Projeto não encontrado');
        }

        Object.assign(project, dto);
        return this.projectsRepository.save(project);
    }

    async remove(id: string, userId: string) {
        const project = await this.findOne(id, userId);

        if (!project) {
            throw new NotFoundException('Projeto não encontrado');
        }

        await this.projectsRepository.remove(project);
    }

    async getStats() {
        const result = await this.projectsRepository
            .createQueryBuilder('project')
            .select('project.status', 'status')
            .addSelect('COUNT(project.id)', 'total')
            .groupBy('project.status')
            .getRawMany();

        const stats = {
            total: 0,
            pending: 0,
            inProgress: 0,
            done: 0,
        };

        for (const row of result) {
            stats.total += Number(row.total);

            switch (row.status) {
                case ProjectStatus.PENDING:
                    stats.pending = Number(row.total);
                    break;
                case ProjectStatus.IN_PROGRESS:
                    stats.inProgress = Number(row.total);
                    break;
                case ProjectStatus.DONE:
                    stats.done = Number(row.total);
                    break;
            }
        }

        return stats;
    }

    private mapProjectWithProgress(project: Project) {
        const totalGoals = project.goals?.length ?? 0;

        const completedGoals = project.goals?.filter(
            goal => goal.status === ProjectStatus.DONE,
        ).length ?? 0;

        const progress =
            totalGoals === 0
                ? 0
                : Math.round((completedGoals / totalGoals) * 100);

        return {
            id: project.id,
            name: project.name,
            description: project.description,
            status: project.status,
            goals: {
                total: totalGoals,
                completed: completedGoals,
                progress,
            },
            createdAt: project.createdAt,
        };
    }
}