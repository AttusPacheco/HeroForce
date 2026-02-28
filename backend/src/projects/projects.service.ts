import {Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Project} from "./project.entity";
import {Repository} from "typeorm";
import {CreateProjectDto} from "./dto/create-project.dto";
import {UpdateProjectDto} from "./dto/update-project.dto";

@Injectable()
export class ProjectsService {
    constructor(
        @InjectRepository(Project)
        private readonly projectsRepository: Repository<Project>,
    ) {}

    async findAll(userId: string) {
        return this.projectsRepository.find({
            where: {
                owner: {id: userId},
            },
        });
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
}